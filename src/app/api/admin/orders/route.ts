import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { Order } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
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

    const orderIds = dbOrders.map((o) => o.id);
    const { data: dbItems } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    const mappedOrders: Order[] = dbOrders.map((o) => ({
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
