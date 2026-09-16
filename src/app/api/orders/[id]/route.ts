import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getAuthSession } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required to access order details' }, { status: 401 });
    }

    const supabaseClient = getSupabaseAdmin() || supabase;

    // 1. Check Supabase DB first if configured
    if (isSupabaseConfigured && supabaseClient) {
      const { data: dbOrder, error } = await supabaseClient
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .maybeSingle();

      if (dbOrder && !error) {
        // Enforce ownership / admin check for authenticated session
        if (session.role !== 'admin') {
          const isOwnerUser = dbOrder.user_id && dbOrder.user_id === session.id;
          const isOwnerEmail = dbOrder.customer_email && dbOrder.customer_email.toLowerCase() === session.email.toLowerCase();
          if (!isOwnerUser && !isOwnerEmail) {
            return NextResponse.json({ error: 'Unauthorized access to order' }, { status: 403 });
          }
        }
        const formatted = {
          id: dbOrder.id,
          user_id: dbOrder.user_id || 'usr-guest',
          customer_name: dbOrder.customer_name,
          customer_email: dbOrder.customer_email,
          customer_phone: dbOrder.customer_phone,
          shipping_address: dbOrder.shipping_address,
          items: (dbOrder.order_items || []).map((it: any) => ({
            id: it.id,
            product_id: it.product_id,
            product_name: it.product_name,
            image: it.image,
            variant_weight: it.variant_weight,
            price: Number(it.price),
            quantity: it.quantity,
            total: Number(it.total),
          })),
          subtotal: Number(dbOrder.subtotal),
          discount: Number(dbOrder.discount || 0),
          coupon_code: dbOrder.coupon_code,
          shipping_fee: Number(dbOrder.shipping_fee || 0),
          tax: Number(dbOrder.tax || 0),
          total_amount: Number(dbOrder.total_amount),
          payment_status: dbOrder.payment_status,
          payment_method: dbOrder.payment_method,
          razorpay_order_id: dbOrder.razorpay_order_id,
          razorpay_payment_id: dbOrder.razorpay_payment_id,
          order_status: dbOrder.order_status,
          timeline: dbOrder.timeline || [],
          created_at: dbOrder.created_at,
        };
        return NextResponse.json({ order: formatted });
      }
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Fetch Order Error:', error);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}
