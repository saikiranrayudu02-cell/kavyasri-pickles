'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, ShieldCheck, CheckCircle2, Clock, Truck, MapPin, CreditCard } from 'lucide-react';
import { Order } from '@/lib/types';

interface TaxInvoiceProps {
  order: Order;
  showAdminActions?: boolean;
  onStatusUpdate?: (status: any) => void;
}

export default function TaxInvoice({ order, showAdminActions, onStatusUpdate }: TaxInvoiceProps) {
  // Business Defaults
  const storeInfo = {
    name: 'Kavyasri Pickles',
    tagline: 'TRADITIONAL TASTE • HOMEMADE LOVE',
    address: 'Plot 42, Heritage Kitchens, Near RTC Colony, Kothapet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500035',
    phone: '+91 91234 56789',
    email: 'support@kavyasripickles.com',
    fssai: '13624014000189',
    gstin: '36AAECK1294F1Z3',
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Date Formatting
  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Calculate Taxable Amount
  const subtotal = Number(order.subtotal || 0);
  const discount = Number(order.discount || 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const shippingFee = Number(order.shipping_fee || 0);
  const taxAmount = Number(order.tax || 0);
  const totalAmount = Number(order.total_amount || 0);

  // GST rate calculation
  const gstRate = order.gst_percentage ?? (taxableAmount > 0 && taxAmount > 0 ? Math.round((taxAmount / taxableAmount) * 100) : 5);
  const halfGstRate = (gstRate / 2).toFixed(1).replace(/\.0$/, '');
  const halfTaxAmount = (taxAmount / 2).toFixed(2);

  // Address Cleaning to prevent awkward formatting
  const formatAddress = (addr: any) => {
    if (!addr) return '';
    const parts = [
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.state ? `${addr.state} — ${addr.pincode || ''}` : addr.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Payment Status Styling
  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'PAID') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (s === 'PENDING') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (s === 'FAILED') {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    return 'bg-stone-100 text-stone-800 border-stone-200';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar (no-print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Official Tax Invoice Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Tax Invoice Container */}
      <div
        id="printable-invoice"
        className="bg-white text-stone-900 border border-stone-200/80 rounded-3xl p-6 xs:p-8 sm:p-12 shadow-sm font-sans tracking-tight space-y-8"
      >
        {/* HEADER SECTION: 2-Column Split */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-stone-200/80 pb-6 sm:pb-8 gap-6">
          {/* LEFT: BRAND & BUSINESS INFO */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-200 bg-amber-50 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Kavyasri Pickles Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-black text-stone-900 tracking-tight leading-tight">
                  Kavyasri <span className="text-[#9e1b1e]">Pickles</span>
                </h1>
                <p className="text-[9px] font-bold text-amber-900/80 uppercase tracking-wider">
                  {storeInfo.tagline}
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-0.5 pt-1 leading-relaxed">
              <p className="font-medium">{storeInfo.address}</p>
              <p className="font-medium">
                {storeInfo.city}, {storeInfo.state} — <strong>{storeInfo.pincode}</strong>
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-stone-500 pt-1 font-mono">
                <span>FSSAI: <strong className="text-stone-700">{storeInfo.fssai}</strong></span>
                <span>•</span>
                <span>GSTIN: <strong className="text-stone-700">{storeInfo.gstin}</strong></span>
              </div>
              <p className="text-[11px] text-stone-500 pt-0.5">
                Email: {storeInfo.email} | Phone: {storeInfo.phone}
              </p>
            </div>
          </div>

          {/* RIGHT: TAX INVOICE METADATA */}
          <div className="sm:text-right space-y-2.5 w-full sm:w-auto shrink-0">
            <div className="inline-block px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg text-stone-800 text-xs font-black uppercase tracking-widest">
              Tax Invoice
            </div>

            <div className="space-y-1">
              <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Invoice / Order ID</p>
              <p className="font-mono font-extrabold text-base text-stone-900">{order.id}</p>
            </div>

            <div className="space-y-0.5 text-xs">
              <p className="text-stone-500">Invoice Date: <strong className="text-stone-800 font-semibold">{formattedDate}</strong></p>
              <div className="pt-1.5 flex sm:justify-end">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadge(order.payment_status)}`}>
                  ● {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER & PAYMENT/DELIVERY INFORMATION (2-Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700 pt-2">
          {/* BILLED & SHIPPED TO */}
          <div className="bg-[#fcfaf7] border border-stone-200/70 rounded-2xl p-5 space-y-2">
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block border-b border-stone-200/60 pb-1.5">
              Billed & Shipped To
            </span>
            <p className="font-bold text-stone-900 text-sm">{order.shipping_address?.fullName || order.customer_name}</p>
            <p className="text-stone-600 leading-relaxed font-medium">
              {formatAddress(order.shipping_address)}
            </p>
            <div className="pt-1 font-mono text-[11px] text-stone-500 space-y-0.5">
              <p>Phone: <strong className="text-stone-800">{order.shipping_address?.phone || order.customer_phone}</strong></p>
              {order.customer_email && <p>Email: <span className="text-stone-800">{order.customer_email}</span></p>}
            </div>
          </div>

          {/* PAYMENT & DELIVERY DETAILS */}
          <div className="bg-[#fcfaf7] border border-stone-200/70 rounded-2xl p-5 space-y-2">
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block border-b border-stone-200/60 pb-1.5">
              Payment & Delivery Details
            </span>

            <div className="space-y-1.5 pt-0.5">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Payment Method:</span>
                <strong className="text-stone-900 font-semibold">{order.payment_method || 'Online Payment'}</strong>
              </div>

              {(order.razorpay_payment_id || order.razorpay_order_id) && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Transaction ID:</span>
                  <strong className="font-mono text-[11px] text-stone-800">{order.razorpay_payment_id || order.razorpay_order_id}</strong>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Delivery Partner:</span>
                <strong className="text-stone-900 font-semibold">Express Courier Service</strong>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Dispatch Facility:</span>
                <strong className="text-stone-900 font-semibold">Kavyasri Kitchens, Hyderabad</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS TABLE */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
            Order Items Summary
          </span>

          <div className="overflow-x-auto rounded-2xl border border-stone-200/80 bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/70 border-b border-stone-200/80 text-stone-700 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Variant / Weight</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {item.product_name}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                        {item.variant_weight || '1 KG'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-stone-700">
                        ₹{item.price}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-stone-900">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">
                        ₹{item.total || item.price * item.quantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-stone-500 italic">
                      No order items recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIAL SUMMARY / TOTALS PANEL */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-stone-200/80">
          {/* LEFT: TAX BREAKDOWN SUMMARY */}
          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-4 text-xs text-stone-600 space-y-1.5 w-full sm:w-72">
            <span className="font-extrabold text-stone-700 uppercase text-[10px] tracking-widest block border-b border-stone-200/60 pb-1">
              Tax Computation Breakdown
            </span>
            <div className="flex justify-between">
              <span>Taxable Subtotal:</span>
              <strong className="font-mono text-stone-800">₹{taxableAmount}</strong>
            </div>

            {taxAmount > 0 ? (
              <>
                <div className="flex justify-between">
                  <span>CGST ({halfGstRate}%):</span>
                  <span className="font-mono text-stone-700">₹{halfTaxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST ({halfGstRate}%):</span>
                  <span className="font-mono text-stone-700">₹{halfTaxAmount}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200/60 font-semibold text-stone-900">
                  <span>Total Tax ({gstRate}% GST):</span>
                  <span className="font-mono">₹{taxAmount}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-stone-500 italic pt-1">
                <span>GST Status:</span>
                <span>Tax Exempt / Exempted</span>
              </div>
            )}
          </div>

          {/* RIGHT: GRAND TOTAL PANEL */}
          <div className="w-full sm:w-72 space-y-2 text-xs text-stone-700 font-medium">
            <div className="flex justify-between py-1">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-mono font-bold text-stone-900">₹{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                <span className="font-mono font-bold">-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span className="text-stone-600">Delivery / Shipping</span>
              <span className="font-mono font-semibold text-stone-900">
                {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-600">GST ({gstRate}%)</span>
              <span className="font-mono font-semibold text-stone-900">₹{taxAmount}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 text-base font-black text-stone-900">
              <span className="uppercase text-xs tracking-wider">Grand Total</span>
              <span className="font-mono text-lg text-[#9e1b1e]">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* INVOICE FOOTER */}
        <div className="pt-6 border-t border-stone-200/80 text-center space-y-2">
          <p className="text-[11px] font-semibold text-stone-500">
            This is a computer-generated tax invoice and does not require a physical signature.
          </p>
          <p className="text-xs font-serif font-bold text-stone-800">
            Thank you for choosing Kavyasri Pickles — Traditional Taste • Homemade Love.
          </p>
        </div>
      </div>
    </div>
  );
}
