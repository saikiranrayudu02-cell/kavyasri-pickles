import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { DataStore } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { Order } from '@/lib/types';
import { normalizePhoneNumber } from '@/lib/utils/phone';
import { toValidUuid } from '@/lib/utils/uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      order_details,
    } = body;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isProductionSecret = keySecret && !keySecret.includes('yourKey');

    // 1. Cryptographic HMAC Signature Verification (Timing-Safe)
    if (isProductionSecret) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { success: false, message: 'Missing required Razorpay payment response tokens.' },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const expectedBuffer = Buffer.from(generatedSignature, 'utf-8');
      const receivedBuffer = Buffer.from(razorpay_signature, 'utf-8');

      let isValid = false;
      try {
        isValid =
          expectedBuffer.length === receivedBuffer.length &&
          crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
      } catch {
        isValid = false;
      }

      if (!isValid) {
        console.error(`Razorpay Signature Verification Failed! Order: ${razorpay_order_id}`);
        return NextResponse.json(
          { success: false, message: 'Cryptographic payment signature verification failed.' },
          { status: 400 }
        );
      }
    }

    // 1b. Optional Audit: Fetch Razorpay Payment details to verify contact number
    let rzpPaymentContact: string | null = null;
    if (isProductionSecret && razorpay_payment_id) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const pRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: authHeader },
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData && pData.contact) {
            rzpPaymentContact = pData.contact;
          }
        }
      } catch (err) {
        console.warn('Razorpay payment detail fetch exception for audit:', err);
      }
    }

    const formattedNow = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // 2. Query Supabase Database for existing pending order
    let targetOrder: Order | undefined = undefined;
    const supabaseAdmin = getSupabaseAdmin();

    if (supabaseAdmin) {
      const searchOr = [];
      if (order_id) searchOr.push(`id.eq.${order_id}`);
      if (razorpay_order_id) searchOr.push(`razorpay_order_id.eq.${razorpay_order_id}`);
      if (razorpay_payment_id) searchOr.push(`razorpay_payment_id.eq.${razorpay_payment_id}`);

      if (searchOr.length > 0) {
        const { data: dbOrders } = await supabaseAdmin
          .from('orders')
          .select('*')
          .or(searchOr.join(','))
          .limit(1);

        if (dbOrders && dbOrders.length > 0) {
          const dbOrder = dbOrders[0];
          const { data: dbItems } = await supabaseAdmin
            .from('order_items')
            .select('*')
            .eq('order_id', dbOrder.id);

          targetOrder = {
            ...dbOrder,
            items: (dbItems || []).map((it) => ({
              id: it.id,
              product_id: it.product_id || '',
              product_name: it.product_name,
              image: it.image || '/images/pickles/hero.jpg',
              variant_weight: it.variant_weight,
              price: Number(it.price),
              quantity: it.quantity,
              total: Number(it.total),
            })),
          };
        }
      }
    }

    if (!targetOrder) {
      targetOrder =
        (order_id ? DataStore.getOrderById(order_id) : undefined) ||
        (razorpay_order_id ? DataStore.getOrderByRazorpayId(razorpay_order_id) : undefined) ||
        (razorpay_payment_id ? DataStore.getOrderByRazorpayId(razorpay_payment_id) : undefined);
    }

    // 3. Update existing order to Paid / Confirmed if found
    if (targetOrder) {
      if (targetOrder.customer_phone && rzpPaymentContact) {
        const normApp = normalizePhoneNumber(targetOrder.customer_phone);
        const normRzp = normalizePhoneNumber(rzpPaymentContact);
        if (normApp && normRzp && normApp !== normRzp) {
          console.warn(
            `[PHONE_MISMATCH] Order ${targetOrder.id}: Application phone (${normApp}) differs from Razorpay contact (${normRzp}). Retaining application order phone snapshot.`
          );
        }
      }

      const updatedTimeline = [
        ...(targetOrder.timeline || []),
        {
          status: 'Confirmed' as const,
          timestamp: formattedNow,
          note: `Payment verified via Razorpay (Payment ID: ${razorpay_payment_id || 'verified'})`,
        },
      ];

      const updatedOrder: Order = {
        ...targetOrder,
        payment_status: 'Paid',
        order_status: 'Confirmed',
        razorpay_payment_id: razorpay_payment_id || targetOrder.razorpay_payment_id,
        timeline: updatedTimeline,
      };

      DataStore.saveOrder(updatedOrder);

      if (supabaseAdmin) {
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'Paid',
            order_status: 'Confirmed',
            razorpay_payment_id: razorpay_payment_id || targetOrder.razorpay_payment_id,
            timeline: updatedTimeline,
          })
          .eq('id', targetOrder.id);
      }

      return NextResponse.json({
        success: true,
        orderId: targetOrder.id,
        order: updatedOrder,
        message: 'Payment verified and order status updated to Paid.',
      });
    }

    // 4. Fallback: Create new order if order_details provided and order didn't exist
    if (order_details) {
      const appOrderId = order_id || `KP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowIso = new Date().toISOString();
      const normalizedPhone = normalizePhoneNumber(order_details.customer_phone);

      if (normalizedPhone && rzpPaymentContact) {
        const normRzp = normalizePhoneNumber(rzpPaymentContact);
        if (normalizedPhone !== normRzp) {
          console.warn(
            `[PHONE_MISMATCH] Fallback Order ${appOrderId}: Application phone (${normalizedPhone}) differs from Razorpay contact (${normRzp}). Retaining application order phone snapshot.`
          );
        }
      }

      const newOrder: Order = {
        id: appOrderId,
        user_id: order_details.user_id || 'usr-guest',
        customer_name: order_details.customer_name || 'Customer',
        customer_email: order_details.customer_email || '',
        customer_phone: normalizedPhone || '',
        shipping_address: order_details.shipping_address,
        items: order_details.items,
        subtotal: order_details.subtotal,
        discount: order_details.discount || 0,
        coupon_code: order_details.coupon_code,
        shipping_fee: order_details.shipping_fee,
        tax: order_details.tax,
        gst_percentage: order_details.gst_percentage || 0,
        total_amount: order_details.total_amount,
        payment_status: 'Paid',
        payment_method: 'Razorpay Online Payment',
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        order_status: 'Confirmed',
        timeline: [
          {
            status: 'Pending',
            timestamp: formattedNow,
            note: 'Order created',
          },
          {
            status: 'Confirmed',
            timestamp: formattedNow,
            note: `Payment verified via Razorpay (ID: ${razorpay_payment_id})`,
          },
        ],
        created_at: nowIso,
      };

      DataStore.saveOrder(newOrder);

      if (supabaseAdmin) {
        const validUserId = toValidUuid(order_details.user_id);
        const { error: insertErr } = await supabaseAdmin.from('orders').upsert(
          {
            id: newOrder.id,
            user_id: validUserId,
            customer_name: newOrder.customer_name,
            customer_email: newOrder.customer_email,
            customer_phone: newOrder.customer_phone,
            shipping_address: newOrder.shipping_address,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            coupon_code: newOrder.coupon_code || null,
            shipping_fee: newOrder.shipping_fee,
            tax: newOrder.tax,
            total_amount: newOrder.total_amount,
            payment_status: 'Paid',
            payment_method: 'Razorpay Online Payment',
            razorpay_order_id: razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id,
            order_status: 'Confirmed',
            timeline: newOrder.timeline,
            created_at: nowIso,
          },
          { onConflict: 'id' }
        );

        if (!insertErr) {
          const itemsToInsert = newOrder.items.map((it) => ({
            order_id: newOrder.id,
            product_id: toValidUuid(it.product_id),
            product_name: it.product_name,
            image: it.image,
            variant_weight: it.variant_weight,
            price: it.price,
            quantity: it.quantity,
            total: it.total,
          }));
          await supabaseAdmin.from('order_items').insert(itemsToInsert);
        }
      }

      return NextResponse.json({
        success: true,
        orderId: newOrder.id,
        order: newOrder,
        message: 'Payment verified and order created successfully.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment signature verified successfully.',
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server payment verification exception.' },
      { status: 500 }
    );
  }
}
