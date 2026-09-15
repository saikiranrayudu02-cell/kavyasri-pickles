import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { Order } from '@/lib/types';
import { DataStore } from '@/lib/data/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabaseClient = getSupabaseAdmin() || supabase;

    if (isSupabaseConfigured && supabaseClient) {
      const { data: dbOrders, error: orderErr } = await supabaseClient
        .from('orders')
        .select('*')
        .or(`user_id.eq.${session.id},customer_email.ilike.${session.email}`)
        .order('created_at', { ascending: false });

      if (!orderErr && dbOrders) {
        if (dbOrders.length === 0) {
          return NextResponse.json({ orders: [] });
        }

        const orderIds = dbOrders.map((o) => o.id);
        const { data: dbItems } = await supabaseClient
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
      }
    }

    // Fallback to DataStore filtered strictly by session identity
    const localOrders = DataStore.getUserOrders(session.id, session.email);
    return NextResponse.json({ orders: localOrders });
  } catch (err) {
    console.error('Error in customer orders API:', err);
    return NextResponse.json({ error: 'Failed to fetch customer orders' }, { status: 500 });
  }
}
