import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live credentials are provided, call Razorpay API
    if (keyId && keySecret && !keyId.includes('yourKey')) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency,
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const order = await response.json();
      return NextResponse.json(order);
    }

    // Fallback sandbox order ID
    return NextResponse.json({
      id: `order_sbx_${Date.now()}`,
      amount: Math.round(amount),
      currency,
      status: 'created',
    });
  } catch (error) {
    console.error('Create Razorpay Order Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
