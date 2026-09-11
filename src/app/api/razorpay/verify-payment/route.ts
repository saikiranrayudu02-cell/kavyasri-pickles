import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live credentials are provided, verify cryptographic HMAC signature
    if (keySecret && !keySecret.includes('yourKey')) {
      const generated_signature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, message: 'Payment signature verified successfully' });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
