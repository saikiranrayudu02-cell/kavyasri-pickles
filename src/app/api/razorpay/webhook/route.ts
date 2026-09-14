import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { DataStore } from '@/lib/data/store';

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

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!webhookSecret) {
      console.error('Razorpay Webhook Error: RAZORPAY_WEBHOOK_SECRET is not configured on server.');
      return NextResponse.json({ error: 'Webhook secret unconfigured' }, { status: 500 });
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
    switch (eventType) {
      case 'payment.captured':
      case 'payment.authorized': {
        const payment = payload.payload?.payment?.entity;
        if (payment) {
          const rzpOrderId = payment.order_id;
          const rzpPaymentId = payment.id;

          const existingOrder = DataStore.getOrderByRazorpayId(rzpOrderId) || DataStore.getOrderByRazorpayId(rzpPaymentId);

          if (existingOrder) {
            DataStore.updateOrderPaymentStatus(existingOrder.id, 'Paid', rzpPaymentId);
          }
        }
        break;
      }

      case 'order.paid': {
        const orderEntity = payload.payload?.order?.entity;
        if (orderEntity) {
          const rzpOrderId = orderEntity.id;
          const existingOrder = DataStore.getOrderByRazorpayId(rzpOrderId);

          if (existingOrder) {
            DataStore.updateOrderPaymentStatus(existingOrder.id, 'Paid');
          }
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload?.payment?.entity;
        if (payment) {
          const rzpOrderId = payment.order_id;
          const rzpPaymentId = payment.id;
          const existingOrder = DataStore.getOrderByRazorpayId(rzpOrderId) || DataStore.getOrderByRazorpayId(rzpPaymentId);

          if (existingOrder && existingOrder.payment_status !== 'Paid') {
            DataStore.updateOrderPaymentStatus(existingOrder.id, 'Failed', rzpPaymentId);
          }
        }
        break;
      }

      default: {
        // Unhandled or informational events
        break;
      }
    }

    return NextResponse.json({ status: 'ok', event: eventType });
  } catch (error) {
    console.error('Razorpay Webhook Processing Error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
