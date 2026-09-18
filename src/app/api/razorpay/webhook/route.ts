import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { DataStore } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { OrderTimelineItem } from '@/lib/types';
import { normalizePhoneNumber } from '@/lib/utils/phone';

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

    console.log(`[RAZORPAY_WEBHOOK_RECEIVED] Event: ${eventType}, EventID: ${eventId}`);

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
          const notes = payment.notes || {};
          const rzpOrderId = payment.order_id;
          const rzpPaymentId = payment.id;
          const appOrderIdFromNotes = notes.app_order_id || notes.order_id;
          const customerEmail = payment.email || '';
          const rawRzpPhone = payment.contact || '';
          const normRzpPhone = normalizePhoneNumber(rawRzpPhone);
          const appPhone = normalizePhoneNumber(notes.customer_phone) || normRzpPhone;
          const amountInRupees = Number(payment.amount || 0) / 100;

          if (appPhone && normRzpPhone && appPhone !== normRzpPhone) {
            console.warn(
              `[PHONE_MISMATCH] Webhook Payment ${rzpPaymentId}: Application Phone (${appPhone}) differs from Razorpay Contact (${normRzpPhone}).`
            );
          }

          let orderIdToUpdate: string | null = null;
          let existingOrderTimeline: OrderTimelineItem[] = [];

          // Query Supabase DB for matching order using razorpay_order_id, razorpay_payment_id, OR app_order_id notes
          if (supabaseAdmin) {
            const searchConditions: string[] = [];
            if (rzpOrderId) searchConditions.push(`razorpay_order_id.eq.${rzpOrderId}`);
            if (rzpPaymentId) searchConditions.push(`razorpay_payment_id.eq.${rzpPaymentId}`);
            if (appOrderIdFromNotes) searchConditions.push(`id.eq.${appOrderIdFromNotes}`);

            const { data: dbOrders } = await supabaseAdmin
              .from('orders')
              .select('*')
              .or(searchConditions.join(','))
              .limit(1);

            if (dbOrders && dbOrders.length > 0) {
              const dbOrder = dbOrders[0];
              orderIdToUpdate = dbOrder.id;
              existingOrderTimeline = dbOrder.timeline || [];

              const receivedAmountInPaise = Number(payment.amount || 0);
              const expectedAmountInPaise = Math.round(Number(dbOrder.total_amount || 0) * 100);

              // Strict Exact Paise Verification: Forbid any underpayment or amount mismatch (even ₹0.01)
              if (expectedAmountInPaise !== receivedAmountInPaise) {
                const expectedRupees = (expectedAmountInPaise / 100).toFixed(2);
                const receivedRupees = (receivedAmountInPaise / 100).toFixed(2);
                console.error(
                  `[WEBHOOK_AMOUNT_MISMATCH] Order ${dbOrder.id}: Expected ₹${expectedRupees} (${expectedAmountInPaise} paise), but received payment for ₹${receivedRupees} (${receivedAmountInPaise} paise). Rejecting Paid status update!`
                );
                await supabaseAdmin
                  .from('orders')
                  .update({
                    payment_status: 'Amount Mismatch',
                    order_status: 'On Hold',
                    razorpay_payment_id: rzpPaymentId,
                    timeline: [
                      ...existingOrderTimeline,
                      {
                        status: 'Pending' as const,
                        timestamp: formattedNow,
                        note: `ALERT: Payment amount mismatch! Expected ₹${expectedRupees}, received ₹${receivedRupees} (ID: ${rzpPaymentId})`,
                      },
                    ],
                  })
                  .eq('id', dbOrder.id);
                return NextResponse.json({ status: 'ok', warning: 'Payment amount mismatch logged' });
              }

              if (dbOrder.payment_status !== 'Paid') {
                const updatedTimeline = [
                  ...existingOrderTimeline,
                  {
                    status: 'Confirmed' as const,
                    timestamp: formattedNow,
                    note: `Payment captured via Razorpay Webhook (ID: ${rzpPaymentId})`,
                  },
                ];

                const { error: updateErr } = await supabaseAdmin
                  .from('orders')
                  .update({
                    payment_status: 'Paid',
                    order_status: 'Confirmed',
                    razorpay_order_id: dbOrder.razorpay_order_id || rzpOrderId,
                    razorpay_payment_id: rzpPaymentId,
                    timeline: updatedTimeline,
                  })
                  .eq('id', dbOrder.id);

                if (updateErr) {
                  console.error(`[PAYMENT_DATABASE_UPDATE_FAILED] Webhook update failed for order ${dbOrder.id}:`, updateErr.message);
                } else {
                  console.log(`[PAYMENT_DATABASE_UPDATE_SUCCESS] Webhook updated order ${dbOrder.id} to Paid & Confirmed`);
                }
              }
            }
          }

          // Fallback: If not found in Supabase DB, check local DataStore
          const localOrder = DataStore.getOrderByRazorpayId(rzpOrderId) || DataStore.getOrderByRazorpayId(rzpPaymentId);
          if (localOrder) {
            DataStore.updateOrderPaymentStatus(localOrder.id, 'Paid', rzpPaymentId);
            orderIdToUpdate = localOrder.id;
          }

          if (!orderIdToUpdate) {
            console.warn(`[WEBHOOK_UNMATCHED_PAYMENT] No server order found for Razorpay Order ID: ${rzpOrderId}, Payment ID: ${rzpPaymentId}`);
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
