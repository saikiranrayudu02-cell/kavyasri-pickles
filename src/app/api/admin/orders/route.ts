import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { Order } from '@/lib/types';
import { getAuthSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin authorization required.' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client unconfigured' }, { status: 500 });
    }

    const { data: dbOrders, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderErr) {
      console.error('Admin API orders fetch error:', orderErr.message);
      return NextResponse.json({ error: orderErr.message }, { status: 500 });
    }

    if (!dbOrders || dbOrders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Filter out abandoned/uncompleted online payment attempts:
    // Only return orders that are Paid, COD, or have progressed beyond 'Pending' order status
    const validDbOrders = dbOrders.filter((o) => {
      const isPaid = o.payment_status === 'Paid';
      const isCod =
        o.payment_method === 'COD' ||
        o.payment_method === 'cod' ||
        (o.payment_method && o.payment_method.toLowerCase().includes('cod'));
      const isProcessed = o.order_status && o.order_status !== 'Pending';
      return isPaid || isCod || isProcessed;
    });

    if (validDbOrders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const orderIds = validDbOrders.map((o) => o.id);
    const { data: dbItems } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    const mappedOrders: Order[] = validDbOrders.map((o) => ({
      ...o,
      items: (dbItems || [])
        .filter((item) => item.order_id === o.id)
        .map((it) => ({
          id: it.id,
          product_id: it.product_id || '',
          product_name: it.product_name,
          image: it.image || '/images/pickles/hero.jpg',
          variant_weight: it.variant_weight,
          price: Number(it.price),
          quantity: it.quantity,
          total: Number(it.total),
        })),
    }));

    return NextResponse.json({ orders: mappedOrders });
  } catch (error) {
    console.error('Admin API Orders Exception:', error);
    return NextResponse.json({ error: 'Failed to fetch admin orders' }, { status: 500 });
  }
}
