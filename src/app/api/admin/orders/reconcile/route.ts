import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { OrderTimelineItem } from '@/lib/types';
import { DataStore } from '@/lib/data/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Strict Server Admin Session Authentication
    const session = await getAuthSession(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin permissions required.' },
        { status: 401 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('yourKey') || keySecret.includes('yourKey')) {
      return NextResponse.json(
        { error: 'Razorpay API credentials not configured' },
        { status: 500 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client unconfigured' },
        { status: 500 }
      );
    }

    // 2. Query all Pending orders from Supabase DB
    const { data: pendingOrders, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('payment_status', 'Pending');

    if (fetchErr) {
      console.error('Reconciliation fetch error:', fetchErr.message);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      return NextResponse.json({
        message: 'No pending orders found to reconcile.',
        audited: 0,
        reconciled: 0,
        details: [],
      });
    }

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    let reconciledCount = 0;
    const reconciliationDetails: Array<{
      order_id: string;
      status: 'reconciled' | 'skipped' | 'failed' | 'no_rzp_id';
      reason: string;
      razorpay_payment_id?: string;
    }> = [];

    const formattedNow = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    for (const order of pendingOrders) {
      const rzpOrderId = order.razorpay_order_id;
      const rzpPaymentId = order.razorpay_payment_id;

      if (!rzpOrderId && !rzpPaymentId) {
        reconciliationDetails.push({
          order_id: order.id,
          status: 'no_rzp_id',
          reason: 'No Razorpay order or payment ID linked to order record.',
        });
        continue;
      }

      try {
        let fetchedPayments: Array<{
          id: string;
          order_id: string;
          status: string;
          amount: number;
        }> = [];

        if (rzpOrderId) {
          // Fetch payments associated with Razorpay order ID
          const res = await fetch(`https://api.razorpay.com/v1/orders/${rzpOrderId}/payments`, {
            headers: { Authorization: authHeader },
          });

          if (res.ok) {
            const data = await res.json();
            fetchedPayments = data.items || [];
          }
        }

        if (fetchedPayments.length === 0 && rzpPaymentId) {
          // Fetch payment directly by Razorpay Payment ID
          const res = await fetch(`https://api.razorpay.com/v1/payments/${rzpPaymentId}`, {
            headers: { Authorization: authHeader },
          });

          if (res.ok) {
            const pData = await res.json();
            if (pData) fetchedPayments = [pData];
          }
        }

        // Find captured payment matching exact amount
        const capturedPayment = fetchedPayments.find((p) => p.status === 'captured');

        if (!capturedPayment) {
          reconciliationDetails.push({
            order_id: order.id,
            status: 'skipped',
            reason: `No captured payment found on Razorpay for Order ${rzpOrderId || rzpPaymentId}. Statuses found: ${fetchedPayments.map((p) => p.status).join(', ') || 'none'}`,
          });
          continue;
        }

        // Exact Paise Verification
        const expectedPaise = Math.round(Number(order.total_amount || 0) * 100);
        const receivedPaise = capturedPayment.amount;

        if (expectedPaise !== receivedPaise) {
          reconciliationDetails.push({
            order_id: order.id,
            status: 'failed',
            reason: `Amount mismatch: Expected ₹${(expectedPaise / 100).toFixed(2)}, Razorpay captured ₹${(receivedPaise / 100).toFixed(2)}`,
            razorpay_payment_id: capturedPayment.id,
          });
          continue;
        }

        // Reconcile and update Supabase DB
        const updatedTimeline: OrderTimelineItem[] = [
          ...(order.timeline || []),
          {
            status: 'Confirmed' as const,
            timestamp: formattedNow,
            note: `Reconciled via Admin Recovery Tool with Razorpay (Payment ID: ${capturedPayment.id})`,
          },
        ];

        const { error: updateErr } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'Paid',
            order_status: 'Confirmed',
            razorpay_order_id: order.razorpay_order_id || capturedPayment.order_id,
            razorpay_payment_id: capturedPayment.id,
            timeline: updatedTimeline,
          })
          .eq('id', order.id);

        if (updateErr) {
          reconciliationDetails.push({
            order_id: order.id,
            status: 'failed',
            reason: `DB update failed: ${updateErr.message}`,
          });
        } else {
          reconciledCount++;
          // Also update in-memory DataStore
          DataStore.updateOrderPaymentStatus(order.id, 'Paid', capturedPayment.id);
          reconciliationDetails.push({
            order_id: order.id,
            status: 'reconciled',
            reason: 'Successfully reconciled captured payment with Razorpay.',
            razorpay_payment_id: capturedPayment.id,
          });
          console.log(`[RECONCILIATION_SUCCESS] Order ${order.id} reconciled to Paid via Razorpay Payment ${capturedPayment.id}`);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        reconciliationDetails.push({
          order_id: order.id,
          status: 'failed',
          reason: `Exception during Razorpay API check: ${errorMsg}`,
        });
      }
    }

    return NextResponse.json({
      message: `Reconciliation audit complete. Reconciled ${reconciledCount} of ${pendingOrders.length} pending orders.`,
      audited: pendingOrders.length,
      reconciled: reconciledCount,
      details: reconciliationDetails,
    });
  } catch (error) {
    console.error('Reconciliation API Exception:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during reconciliation.' },
      { status: 500 }
    );
  }
}
