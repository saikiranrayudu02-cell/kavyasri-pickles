'use client';

import React from 'react';
import Image from 'next/image';
import {
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Receipt,
  Building2,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import { Order } from '@/lib/types';

interface TaxInvoiceProps {
  order: Order;
  showAdminActions?: boolean;
  onStatusUpdate?: (status: any) => void;
}

/**
 * RE-DESIGNED TAX INVOICE TEMPLATE (UI & PRINT-OPTIMIZED)
 *
 * 1. Exact Color Preservation in Print: Uses `-webkit-print-color-adjust: exact`
 * 2. 1-Page A4 Print Layout: Compact print utility spacing prevents page 2 overflow
 */

export default function TaxInvoice({ order, showAdminActions, onStatusUpdate }: TaxInvoiceProps) {
  // Business Defaults
  const storeInfo = {
    name: 'Kavyasri Pickles',
    tagline: 'TRADITIONAL TASTE • HOMEMADE LOVE',
    address: 'Kavya Sri Pickles, Near Bustand, Pedavegi, Pedavegi Mandal',
    city: 'ELURU',
    state: 'ANDHRA PRADESH',
    pincode: '534435',
    phone: '+91 97052 22744',
    email: 'kavyasripickles@gmail.com',
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

  // Financial Calculations
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

  // Address Formatting Helper
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

  // Payment Status Styling Badge with Icon
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300/80 shadow-2xs print:bg-emerald-100 print:text-emerald-900 print:border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>PAID</span>
        </span>
      );
    }
    if (s === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs print:bg-amber-100 print:text-amber-900 print:border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>PAYMENT PENDING</span>
        </span>
      );
    }
    if (s === 'FAILED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300/80 shadow-2xs print:bg-rose-100 print:text-rose-900 print:border-rose-300">
          <HelpCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
          <span>FAILED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300/80">
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Critical CSS for A4 1-Page Layout & Color Preservation */}
      <style key="print-style">{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 6mm;
          }
          html, body {
            background-color: #faf7f2 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-invoice {
            background-color: #faf7f2 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            border: 1px solid #d6d3d1 !important;
            border-radius: 16px !important;
            padding: 16px 20px !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Action Toolbar (no-print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
          <ShieldCheck className="w-4 h-4 text-[#9e1b1e]" />
          <span>Official Tax Invoice & Compliance Document</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4.5 py-2.5 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Tax Invoice Container */}
      <div
        id="printable-invoice"
        className="bg-[#faf7f2] text-[#2a2521] border border-stone-300/80 rounded-3xl p-6 sm:p-10 md:p-12 shadow-md font-sans tracking-tight space-y-7 relative overflow-hidden print:p-5 print:space-y-4 print:bg-[#faf7f2] print:border print:border-stone-300/80 print:rounded-2xl print:shadow-none"
      >
        {/* Subtle Decorative Background Crest / Watermark (no-print) */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none no-print" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#9e1b1e]/5 rounded-full blur-3xl pointer-events-none no-print" />

        {/* HEADER SECTION: Brand Identity & Invoice Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-stone-200/80 pb-5 sm:pb-6 gap-4 relative print:pb-3 print:gap-3">
          {/* LEFT: BRAND LOGO & REGISTERED ADDRESS */}
          <div className="space-y-2.5 max-w-md">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400/80 bg-amber-50 shrink-0 shadow-2xs print:w-9 print:h-9">
                <Image
                  src="/images/logo.png"
                  alt="Kavyasri Pickles Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-none print:text-xl">
                  Kavyasri <span className="text-[#9e1b1e]">Pickles</span>
                </h1>
                <p className="text-[10px] font-extrabold text-amber-900/90 uppercase tracking-widest mt-1 bg-amber-100/80 inline-block px-2 py-0.5 rounded-md border border-amber-200/60 print:text-[9px] print:mt-0.5">
                  {storeInfo.tagline}
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-0.5 pt-0.5 leading-relaxed print:text-[10.5px]">
              <p className="font-medium text-stone-800">{storeInfo.address}</p>
              <p className="font-medium text-stone-800">
                {storeInfo.city}, {storeInfo.state} — <strong className="text-stone-900">{storeInfo.pincode}</strong>
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-stone-600 pt-0.5 font-mono print:text-[10px]">
                <span className="flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3 text-amber-800 shrink-0" />
                  <span>FSSAI: <strong className="text-stone-900 font-bold">{storeInfo.fssai}</strong></span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#9e1b1e] shrink-0" />
                  <span>GSTIN: <strong className="text-stone-900 font-bold">{storeInfo.gstin}</strong></span>
                </span>
              </div>
              <p className="text-[11px] text-stone-500 pt-0.5 print:text-[9.5px]">
                Email: {storeInfo.email} | Phone: {storeInfo.phone}
              </p>
            </div>
          </div>

          {/* RIGHT: INVOICE ID & PAYMENT BADGE */}
          <div className="sm:text-right space-y-2.5 w-full sm:w-auto shrink-0 bg-white sm:bg-transparent p-3.5 sm:p-0 rounded-2xl border border-stone-200/80 sm:border-none shadow-2xs sm:shadow-none print:p-0 print:border-none">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2a2521] text-amber-300 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xs print:py-0.5 print:text-[10px]">
              <Receipt className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-extrabold print:text-[9px]">Order / Invoice ID</p>
              <p className="font-mono font-black text-lg text-stone-950 tracking-tight print:text-base">{order.id}</p>
            </div>

            <div className="space-y-0.5 text-xs print:text-[10.5px]">
              <p className="text-stone-600">
                Invoice Date: <strong className="text-stone-900 font-bold">{formattedDate}</strong>
              </p>
              <div className="pt-1 flex sm:justify-end">
                {renderStatusBadge(order.payment_status)}
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER & LOGISTICS GRID (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-stone-700 print:gap-3 print:break-inside-avoid">
          {/* BILLED & SHIPPED TO CARD */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4.5 space-y-2.5 shadow-2xs print:p-3.5 print:space-y-1.5 print:rounded-xl">
            <div className="border-l-3 border-[#9e1b1e] pl-2">
              <h2 className="font-serif font-bold text-stone-900 text-xs tracking-wider uppercase flex items-center gap-1.5 print:text-[11px]">
                <User className="w-3.5 h-3.5 text-[#9e1b1e]" />
                <span>Billed & Shipped To</span>
              </h2>
            </div>

            <div className="space-y-0.5 pt-0.5">
              <p className="font-black text-stone-950 text-sm print:text-xs">{order.shipping_address?.fullName || order.customer_name}</p>
              <p className="text-stone-700 leading-relaxed font-medium print:text-[11px]">
                {formatAddress(order.shipping_address)}
              </p>
            </div>

            <div className="pt-1.5 border-t border-stone-100 font-mono text-[11px] space-y-0.5 print:text-[10px]">
              <div className="flex items-center gap-1.5 text-stone-700">
                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                <span>Phone: <strong className="text-stone-900 font-bold">{order.shipping_address?.phone || order.customer_phone}</strong></span>
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>Email: <span className="text-stone-900">{order.customer_email}</span></span>
                </div>
              )}
            </div>
          </div>

          {/* PAYMENT & LOGISTICS DETAILS CARD */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4.5 space-y-2.5 shadow-2xs print:p-3.5 print:space-y-1.5 print:rounded-xl">
            <div className="border-l-3 border-[#9e1b1e] pl-2">
              <h2 className="font-serif font-bold text-stone-900 text-xs tracking-wider uppercase flex items-center gap-1.5 print:text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-[#9e1b1e]" />
                <span>Payment & Delivery Details</span>
              </h2>
            </div>

            <div className="space-y-1.5 pt-0.5 print:space-y-1">
              <div className="flex justify-between items-center bg-stone-50 p-1.5 rounded-xl border border-stone-200/60 print:p-1 print:text-[10.5px]">
                <span className="text-stone-500 font-medium">Payment Method:</span>
                <strong className="text-stone-950 font-bold">{order.payment_method || 'Razorpay Online Payment'}</strong>
              </div>

              {(order.razorpay_payment_id || order.razorpay_order_id) && (
                <div className="flex justify-between items-center bg-stone-50 p-1.5 rounded-xl border border-stone-200/60 print:p-1 print:text-[10.5px]">
                  <span className="text-stone-500 font-medium">Transaction ID:</span>
                  <strong className="font-mono text-[11px] text-stone-900 print:text-[10px]">{order.razorpay_payment_id || order.razorpay_order_id}</strong>
                </div>
              )}

              <div className="flex justify-between items-center bg-stone-50 p-1.5 rounded-xl border border-stone-200/60 print:p-1 print:text-[10.5px]">
                <span className="text-stone-500 font-medium flex items-center gap-1">
                  <Truck className="w-3 h-3 text-stone-400" />
                  <span>Delivery Partner:</span>
                </span>
                <strong className="text-stone-950 font-bold">Express Courier Service</strong>
              </div>

              <div className="flex justify-between items-center bg-stone-50 p-1.5 rounded-xl border border-stone-200/60 print:p-1 print:text-[10.5px]">
                <span className="text-stone-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>Dispatch Facility:</span>
                </span>
                <strong className="text-stone-950 font-semibold">Kavyasri Kitchens, Hyderabad</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS SUMMARY TABLE */}
        <div className="space-y-2.5 print:space-y-1.5 print:break-inside-avoid">
          <div className="border-l-3 border-[#9e1b1e] pl-2">
            <h2 className="font-serif font-bold text-stone-900 text-xs tracking-wider uppercase print:text-[11px]">
              Order Items Summary
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-300/80 bg-white shadow-2xs print:rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f3ede2] text-[#2a2521] border-b border-stone-300/80 text-[10px] font-extrabold uppercase tracking-widest print:text-[9.5px]">
                  <th className="py-2.5 px-3.5 print:py-1.5 print:px-2.5">S.No & Item Name</th>
                  <th className="py-2.5 px-3.5 text-center print:py-1.5 print:px-2.5">Jar Weight</th>
                  <th className="py-2.5 px-3.5 text-right print:py-1.5 print:px-2.5">Unit Price</th>
                  <th className="py-2.5 px-3.5 text-center print:py-1.5 print:px-2.5">Qty</th>
                  <th className="py-2.5 px-3.5 text-right print:py-1.5 print:px-2.5">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 text-stone-800 font-medium print:text-[11px]">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-amber-50/30 transition-colors even:bg-[#fcfaf7]">
                      <td className="py-2.5 px-3.5 font-bold text-stone-900 print:py-1.5 print:px-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-4.5 h-4.5 rounded-full bg-stone-200/80 text-stone-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 print:w-4 print:h-4 print:text-[9px]">
                            {idx + 1}
                          </span>
                          <span>{item.product_name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 text-center print:py-1.5 print:px-2.5">
                        <span className="font-mono text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 print:text-[10px] print:py-0 print:px-1.5">
                          {item.variant_weight || '250g'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-stone-700 print:py-1.5 print:px-2.5">
                        ₹{item.price}
                      </td>
                      <td className="py-2.5 px-3.5 text-center font-bold text-stone-950 print:py-1.5 print:px-2.5">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-stone-950 text-xs print:py-1.5 print:px-2.5 print:text-[11px]">
                        ₹{item.total || item.price * item.quantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-3 text-center text-stone-500 italic">
                      No order items recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIAL SUMMARY & GRAND TOTAL GRID */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-5 pt-1 print:gap-3 print:break-inside-avoid">
          {/* LEFT: TAX COMPUTATION BREAKDOWN CARD */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 text-xs text-stone-700 space-y-1.5 w-full md:w-80 shadow-2xs print:p-3 print:rounded-xl">
            <div className="border-l-3 border-[#9e1b1e] pl-2">
              <h3 className="font-serif font-bold text-stone-900 text-[11px] tracking-wider uppercase print:text-[10px]">
                Tax Computation Breakdown
              </h3>
            </div>
            <div className="space-y-1 pt-0.5 print:text-[10.5px]">
              <div className="flex justify-between">
                <span className="text-stone-600">Taxable Subtotal:</span>
                <strong className="font-mono text-stone-900">₹{taxableAmount}</strong>
              </div>

              {taxAmount > 0 ? (
                <>
                  <div className="flex justify-between text-stone-600">
                    <span>CGST ({halfGstRate}%):</span>
                    <span className="font-mono text-stone-800">₹{halfTaxAmount}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>SGST ({halfGstRate}%):</span>
                    <span className="font-mono text-stone-800">₹{halfTaxAmount}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200/60 font-bold text-stone-950">
                    <span>Total Tax ({gstRate}% GST):</span>
                    <span className="font-mono text-[#9e1b1e]">₹{taxAmount}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-stone-500 italic pt-0.5">
                  <span>GST Status:</span>
                  <span>Tax Exempt / Exempted</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: GRAND TOTAL SUMMARY CARD */}
          <div className="w-full md:w-80 space-y-2.5 print:space-y-1.5">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 text-xs text-stone-700 space-y-1.5 shadow-2xs print:p-2.5 print:rounded-xl print:text-[10.5px]">
              <div className="flex justify-between py-0.5">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-mono font-bold text-stone-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between py-0.5 text-emerald-800 font-bold">
                  <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between py-0.5">
                <span className="text-stone-600">Delivery / Shipping</span>
                <span className="font-mono font-bold text-stone-900">
                  {shippingFee === 0 ? <strong className="text-emerald-700 font-extrabold">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between py-0.5 border-b border-stone-200/80 pb-1.5">
                <span className="text-stone-600">Estimated GST ({gstRate}%)</span>
                <span className="font-mono font-bold text-stone-900">₹{taxAmount}</span>
              </div>
            </div>

            {/* GRAND TOTAL HIGHLIGHT BOX (Focal Point) */}
            <div className="bg-linear-to-br from-[#9e1b1e] to-[#7f1d1d] text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-red-950/20 flex items-center justify-between print:p-3 print:rounded-xl">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-amber-200 block print:text-[9px]">
                  Grand Total Payable
                </span>
                <span className="text-[10.5px] text-red-100 font-medium print:text-[9.5px]">Inclusive of all taxes & charges</span>
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300 tracking-tight print:text-xl">
                ₹{totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* INVOICE FOOTER: Compliance Notice & Brand Note */}
        <div className="pt-4 border-t-2 border-stone-200/80 text-center space-y-1 print:pt-2 print:space-y-0.5 print:break-inside-avoid">
          <p className="text-[10.5px] font-semibold text-stone-500 print:text-[9.5px]">
            This is a computer-generated tax invoice issued under Rule 46 of the CGST Rules, 2017 and does not require a physical signature.
          </p>
          <p className="text-xs font-serif font-bold text-stone-900 print:text-[10.5px]">
            Thank you for choosing Kavyasri Pickles — Traditional Taste • Homemade Love.
          </p>
        </div>
      </div>
    </div>
  );
}
