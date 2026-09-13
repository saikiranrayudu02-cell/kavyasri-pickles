'use client';

import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Customer } from '@/lib/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadRealCustomers() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          const { data: orders } = await supabase.from('orders').select('*');

          if (isMounted && (profiles || orders)) {
            const customerMap: Record<string, Customer> = {};

            // 1. Add profiles
            (profiles || []).forEach((p) => {
              const emailKey = p.email.toLowerCase();
              const userOrders = (orders || []).filter(
                (o) => o.user_id === p.id || (o.customer_email && o.customer_email.toLowerCase() === emailKey)
              );

              const totalSpent = userOrders
                .filter((o) => o.order_status !== 'Cancelled')
                .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

              const lastOrder = [...userOrders].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0];

              customerMap[emailKey] = {
                id: p.id,
                name: p.full_name || p.email.split('@')[0],
                email: p.email,
                phone: p.phone || (lastOrder?.shipping_address?.phone) || 'N/A',
                created_at: new Date(p.created_at || Date.now()).toLocaleDateString('en-IN'),
                orders_count: userOrders.length,
                total_spent: totalSpent,
                last_order_date: lastOrder
                  ? new Date(lastOrder.created_at).toLocaleDateString('en-IN')
                  : 'No orders',
                status: 'Active',
              };
            });

            // 2. Add customers from orders who may not have a profile entry
            (orders || []).forEach((o) => {
              if (!o.customer_email) return;
              const emailKey = o.customer_email.toLowerCase();
              if (!customerMap[emailKey]) {
                const userOrders = (orders || []).filter(
                  (ord) => ord.customer_email && ord.customer_email.toLowerCase() === emailKey
                );

                const totalSpent = userOrders
                  .filter((ord) => ord.order_status !== 'Cancelled')
                  .reduce((sum, ord) => sum + Number(ord.total_amount || 0), 0);

                const lastOrder = [...userOrders].sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )[0];

                customerMap[emailKey] = {
                  id: `cust-${emailKey}`,
                  name: o.customer_name || emailKey.split('@')[0],
                  email: o.customer_email,
                  phone: o.customer_phone || o.shipping_address?.phone || 'N/A',
                  created_at: new Date(o.created_at).toLocaleDateString('en-IN'),
                  orders_count: userOrders.length,
                  total_spent: totalSpent,
                  last_order_date: lastOrder
                    ? new Date(lastOrder.created_at).toLocaleDateString('en-IN')
                    : 'No orders',
                  status: 'Active',
                };
              }
            });

            setCustomers(Object.values(customerMap));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error loading customers from Supabase:', err);
        }
      }

      if (isMounted) {
        setCustomers(DataStore.getCustomers());
        setLoading(false);
      }
    }

    loadRealCustomers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-2xl border border-white/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              CRM & Profiles
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            View customer order histories, contact information, and total lifetime spend.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl border border-stone-200/80 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all shadow-2xs text-stone-800"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500 font-medium animate-pulse">
            Fetching customer directory & lifetime analytics...
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 text-stone-500 font-semibold border-b border-stone-200/60">
                  <tr>
                    <th className="py-3.5 px-5">Customer Name</th>
                    <th className="py-3.5 px-5">Contact Details</th>
                    <th className="py-3.5 px-5">Total Orders</th>
                    <th className="py-3.5 px-5">Lifetime Spend</th>
                    <th className="py-3.5 px-5">Last Activity</th>
                    <th className="py-3.5 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((cust) => (
                    <tr key={cust.id} className="hover:bg-white/90 transition-colors duration-150 group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-200 border border-emerald-300/60 flex items-center justify-center font-bold text-[#166534] shadow-xs text-sm shrink-0 group-hover:scale-105 transition-transform">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 text-sm tracking-tight">{cust.name}</p>
                            <p className="text-[10px] text-stone-400 font-medium">Member since {cust.created_at}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 space-y-1">
                        <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cust.phone}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-bold text-stone-900 text-sm">{cust.orders_count}</span>{' '}
                        <span className="text-stone-400 font-medium">orders</span>
                      </td>

                      <td className="py-4 px-5 font-extrabold text-stone-900 text-sm">
                        ₹{cust.total_spent.toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-5 text-stone-500 font-medium">{cust.last_order_date}</td>

                      <td className="py-4 px-5">
                        <span className="bg-emerald-50 text-emerald-800 font-semibold px-3 py-1 rounded-full text-[10px] border border-emerald-200/80 shadow-2xs">
                          {cust.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-stone-100 p-4">
              {filtered.map((cust) => (
                <div key={cust.id} className="py-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-200 border border-emerald-300/60 flex items-center justify-center font-bold text-xs text-[#166534] shrink-0">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-xs tracking-tight">{cust.name}</p>
                        <p className="text-[10px] text-stone-400">Since {cust.created_at}</p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-200">
                      {cust.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-stone-600 pl-1 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{cust.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 text-xs">
                    <span className="text-stone-500 font-medium">
                      <strong className="text-stone-900">{cust.orders_count}</strong> orders • {cust.last_order_date}
                    </span>
                    <span className="font-extrabold text-stone-900">
                      ₹{cust.total_spent.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
