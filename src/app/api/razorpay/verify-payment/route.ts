import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { DataStore } from '@/lib/data/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_details,
    } = body;

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

    // 2. Idempotency & Order Finalization
    // Check if an order already exists for this Razorpay Order/Payment ID
    const existingOrder = DataStore.getOrderByRazorpayId(razorpay_order_id) || DataStore.getOrderByRazorpayId(razorpay_payment_id);

    if (existingOrder) {
      // If already created and paid, return idempotently
      if (existingOrder.payment_status === 'Paid') {
        return NextResponse.json({
          success: true,
          orderId: existingOrder.id,
          message: 'Payment already processed and order confirmed.',
        });
      }

      // Mark existing pending order as Paid
      const updatedOrder = DataStore.updateOrderPaymentStatus(
        existingOrder.id,
        'Paid',
        razorpay_payment_id
      );

      return NextResponse.json({
        success: true,
        orderId: updatedOrder?.id || existingOrder.id,
        message: 'Payment verified and order status updated to Paid.',
      });
    }

    // 3. Create new order if order_details provided
    if (order_details) {
      const newOrder = DataStore.createOrder({
        user_id: order_details.user_id || 'usr-guest',
        customer_name: order_details.customer_name,
        customer_email: order_details.customer_email,
        customer_phone: order_details.customer_phone,
        shipping_address: order_details.shipping_address,
        items: order_details.items,
        subtotal: order_details.subtotal,
        discount: order_details.discount || 0,
        coupon_code: order_details.coupon_code,
        shipping_fee: order_details.shipping_fee,
        tax: order_details.tax,
        total_amount: order_details.total_amount,
        payment_status: 'Paid',
        payment_method: 'Razorpay Online Payment',
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        order_status: 'Confirmed',
      });

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
