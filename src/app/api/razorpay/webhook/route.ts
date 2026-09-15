import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { DataStore } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { OrderTimelineItem } from '@/lib/types';

// Set runtime configuration to Node.js for crypto & raw body support
export const runtime = 'nodejs';

// In-memory LRU cache to prevent processing duplicate webhook deliveries
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  try {
    // 1. Extract raw request body string for HMAC signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.warn('Razorpay Webhook Warning: Missing x-razorpay-signature header.');
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Razorpay Webhook Error: RAZORPAY_WEBHOOK_SECRET environment variable is missing.');
      return NextResponse.json({ error: 'RAZORPAY_WEBHOOK_SECRET unconfigured' }, { status: 500 });
    }

    // 2. Cryptographic HMAC Signature Verification
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const receivedBuf = Buffer.from(signature, 'utf-8');

    let isSignatureValid = false;
    try {
      isSignatureValid =
        expectedBuf.length === receivedBuf.length &&
        crypto.timingSafeEqual(expectedBuf, receivedBuf);
    } catch {
      isSignatureValid = false;
    }

    if (!isSignatureValid) {
      console.error('Razorpay Webhook Error: Invalid webhook signature!');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    // 3. Parse JSON Event Payload safely
    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || `${payload.event}_${payload.created_at}`;
    const eventType = payload.event;

    // Idempotency check: Skip if event was already processed
    if (processedEvents.has(eventId)) {
      return NextResponse.json({ status: 'ok', note: 'Event already processed' });
    }
    processedEvents.add(eventId);

    // Limit set size to prevent memory leaks
    if (processedEvents.size > 5000) {
      const firstItem = processedEvents.values().next().value;
      if (firstItem) processedEvents.delete(firstItem);
    }

    // 4. Process Webhook Event Types
    const formattedNow = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const supabaseAdmin = getSupabaseAdmin();

    switch (eventType) {
      case 'payment.captured':
      case 'payment.authorized': {
        const payment = payload.payload?.payment?.entity;
        if (payment) {
          const rzpOrderId = payment.order_id;
          const rzpPaymentId = payment.id;
          const customerEmail = payment.email || '';
          const customerPhone = payment.contact || '';
          const amountInRupees = Number(payment.amount || 0) / 100;
          const notes = payment.notes || {};

          let orderIdToUpdate: string | null = null;
          let existingOrderTimeline: OrderTimelineItem[] = [];

          // Query Supabase DB for matching order
          if (supabaseAdmin) {
            const { data: dbOrders } = await supabaseAdmin
              .from('orders')
              .select('*')
              .or(`razorpay_order_id.eq.${rzpOrderId},razorpay_payment_id.eq.${rzpPaymentId}`)
              .limit(1);

            if (dbOrders && dbOrders.length > 0) {
              const dbOrder = dbOrders[0];
              orderIdToUpdate = dbOrder.id;
              existingOrderTimeline = dbOrder.timeline || [];

              if (dbOrder.payment_status !== 'Paid') {
                const updatedTimeline = [
                  ...existingOrderTimeline,
                  {
                    status: 'Confirmed' as const,
                    timestamp: formattedNow,
                    note: `Payment captured via Razorpay Webhook (ID: ${rzpPaymentId})`,
                  },
                ];

                await supabaseAdmin
                  .from('orders')
                  .update({
                    payment_status: 'Paid',
                    order_status: 'Confirmed',
                    razorpay_payment_id: rzpPaymentId,
                    timeline: updatedTimeline,
                  })
                  .eq('id', dbOrder.id);
              }
            }
          }

          // Fallback: If not found in Supabase DB, check local DataStore
          const localOrder = DataStore.getOrderByRazorpayId(rzpOrderId) || DataStore.getOrderByRazorpayId(rzpPaymentId);
          if (localOrder) {
            DataStore.updateOrderPaymentStatus(localOrder.id, 'Paid', rzpPaymentId);
            orderIdToUpdate = localOrder.id;
          }

          // RECONCILIATION SAFETY NET: If no order exists for this captured payment, create one!
          if (!orderIdToUpdate && supabaseAdmin) {
            const recoveredOrderId = notes.app_order_id || `KP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

            // Lookup profile by email or phone if possible
            let matchingUserId: string | null = null;
            if (customerEmail) {
              const { data: profs } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', customerEmail)
                .limit(1);
              if (profs && profs.length > 0) matchingUserId = profs[0].id;
            }

            const rawAddress = notes.shipping_address || 'Customer Delivery Address';
            const shippingAddressObj = {
              fullName: notes.customer_name || 'Customer',
              phone: customerPhone,
              addressLine1: rawAddress,
              city: 'City',
              state: 'State',
              pincode: '000000',
            };

            const timeline = [
              {
                status: 'Pending' as const,
                timestamp: formattedNow,
                note: 'Order auto-recovered via Webhook',
              },
              {
                status: 'Confirmed' as const,
                timestamp: formattedNow,
                note: `Payment captured via Webhook (ID: ${rzpPaymentId})`,
              },
            ];

            const { error: recErr } = await supabaseAdmin.from('orders').upsert(
              {
                id: recoveredOrderId,
                user_id: matchingUserId,
                customer_name: notes.customer_name || 'Valued Customer',
                customer_email: customerEmail,
                customer_phone: customerPhone,
                shipping_address: shippingAddressObj,
                subtotal: amountInRupees,
                discount: 0,
                coupon_code: null,
                shipping_fee: Number(notes.shipping_fee || 0),
                tax: Number(notes.tax_amount || 0),
                total_amount: amountInRupees,
                payment_status: 'Paid',
                payment_method: 'Razorpay Online Payment',
                razorpay_order_id: rzpOrderId,
                razorpay_payment_id: rzpPaymentId,
                order_status: 'Confirmed',
                timeline,
                created_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            );

            if (!recErr) {
              await supabaseAdmin.from('order_items').insert({
                order_id: recoveredOrderId,
                product_name: 'Homemade Pickles & Spices',
                image: '/images/pickles/hero.jpg',
                variant_weight: 'Standard',
                price: amountInRupees,
                quantity: 1,
                total: amountInRupees,
              });
              console.log(`Razorpay Webhook: Successfully auto-reconciled missing order ${recoveredOrderId} for payment ${rzpPaymentId}`);
            }
          }
        }
        break;
      }

      case 'order.paid': {
        const orderEntity = payload.payload?.order?.entity;
        if (orderEntity && supabaseAdmin) {
          const rzpOrderId = orderEntity.id;
          await supabaseAdmin
            .from('orders')
            .update({ payment_status: 'Paid', order_status: 'Confirmed' })
            .eq('razorpay_order_id', rzpOrderId);

          const localOrder = DataStore.getOrderByRazorpayId(rzpOrderId);
          if (localOrder) DataStore.updateOrderPaymentStatus(localOrder.id, 'Paid');
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload?.payment?.entity;
        if (payment && supabaseAdmin) {
          const rzpOrderId = payment.order_id;
          const rzpPaymentId = payment.id;
          await supabaseAdmin
            .from('orders')
            .update({ payment_status: 'Failed', razorpay_payment_id: rzpPaymentId })
            .eq('razorpay_order_id', rzpOrderId)
            .neq('payment_status', 'Paid');
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ status: 'ok', event: eventType });
  } catch (error) {
    console.error('Razorpay Webhook Processing Error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
