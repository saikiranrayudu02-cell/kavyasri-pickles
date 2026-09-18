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

    console.log(`[PAYMENT_VERIFICATION_STARTED] Verifying payment for order_id: ${order_id || 'N/A'}, rzp_order: ${razorpay_order_id}, rzp_payment: ${razorpay_payment_id}`);

    // 1. Cryptographic HMAC Signature Verification (Timing-Safe)
    if (isProductionSecret) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error(`[PAYMENT_VERIFICATION_FAILED] Missing required tokens for order: ${order_id}`);
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
        console.error(`[PAYMENT_VERIFICATION_FAILED] Razorpay Signature Verification Failed! Order: ${razorpay_order_id}`);
        return NextResponse.json(
          { success: false, message: 'Cryptographic payment signature verification failed.' },
          { status: 400 }
        );
      }
    }

    // 1b. Fetch Razorpay Payment details to verify contact number & exact captured amount
    let rzpPaymentContact: string | null = null;
    let rzpPaymentAmountInPaise: number | null = null;
    if (isProductionSecret && razorpay_payment_id) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const pRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: authHeader },
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData) {
            if (pData.contact) rzpPaymentContact = pData.contact;
            if (typeof pData.amount === 'number') rzpPaymentAmountInPaise = pData.amount;
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
      // Exact Paise Amount Verification
      if (rzpPaymentAmountInPaise !== null) {
        const expectedAmountInPaise = Math.round(Number(targetOrder.total_amount || 0) * 100);
        if (expectedAmountInPaise !== rzpPaymentAmountInPaise) {
          console.error(
            `[VERIFY_PAYMENT_AMOUNT_MISMATCH] Order ${targetOrder.id}: Expected ${expectedAmountInPaise} paise, but Razorpay API returned ${rzpPaymentAmountInPaise} paise.`
          );
          return NextResponse.json(
            { success: false, message: 'Payment amount mismatch detected. Order cannot be verified as Paid.' },
            { status: 400 }
          );
        }
      }
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
        razorpay_order_id: razorpay_order_id || targetOrder.razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id || targetOrder.razorpay_payment_id,
        timeline: updatedTimeline,
      };

      DataStore.saveOrder(updatedOrder);

      if (supabaseAdmin) {
        const { error: dbUpdateErr } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'Paid',
            order_status: 'Confirmed',
            razorpay_order_id: razorpay_order_id || targetOrder.razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id || targetOrder.razorpay_payment_id,
            timeline: updatedTimeline,
          })
          .eq('id', targetOrder.id);

        if (dbUpdateErr) {
          console.error(`[PAYMENT_DATABASE_UPDATE_FAILED] Failed to update DB order ${targetOrder.id}:`, dbUpdateErr.message);
          return NextResponse.json(
            { success: false, message: `Database update failed: ${dbUpdateErr.message}` },
            { status: 500 }
          );
        }
        console.log(`[PAYMENT_DATABASE_UPDATE_SUCCESS] Supabase order ${targetOrder.id} marked as Paid & Confirmed`);
      }

      console.log(`[PAYMENT_VERIFICATION_SUCCESS] Payment verified successfully for order ${targetOrder.id}`);

      return NextResponse.json({
        success: true,
        orderId: targetOrder.id,
        order: updatedOrder,
        message: 'Payment verified and order status updated to Paid.',
      });
    }

    // 4. Reject if no valid pre-created server order is found
    if (!targetOrder) {
      console.error(`Verify Payment Error: No server-persisted order found for order_id: ${order_id}, rzp_order: ${razorpay_order_id}`);
      return NextResponse.json(
        { success: false, message: 'Order reference not found. Payment verification failed.' },
        { status: 404 }
      );
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
