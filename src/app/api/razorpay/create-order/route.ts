import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { Order } from '@/lib/types';
import { normalizePhoneNumber } from '@/lib/utils/phone';
import { toValidUuid } from '@/lib/utils/uuid';

import { getAuthSession } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    // 0. SERVER SESSION VALIDATION - Never trust client user_id
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Please sign in to complete your purchase' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      items,
      coupon_code,
      customer_name,
      customer_email,
      customer_phone: rawPhone,
      shipping_address,
    } = body;

    const customer_phone = normalizePhoneNumber(rawPhone);

    // Validate request items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required for creating an order' },
        { status: 400 }
      );
    }

    const settings = await DataStore.syncSettingsFromSupabase();
    const FREE_SHIPPING_THRESHOLD = Number(settings.free_shipping_threshold ?? 0);
    const STANDARD_SHIPPING_FEE = Number(settings.standard_shipping_fee ?? 0);
    const GST_ENABLED = Boolean(settings.gst_enabled ?? true);
    const GST_PERCENTAGE = Number(settings.gst_percentage ?? 0);

    // 1. Calculate item subtotal from authoritative product database
    const allProducts = await DataStore.syncProductsFromSupabase();
    let subtotal = 0;
    const itemsVerified: Array<{
      product_id: string;
      product_name: string;
      image?: string;
      weight: string;
      price: number;
      quantity: number;
    }> = [];

    for (const item of items) {
      // 1. Strict Quantity Validation: must be integer between 1 and 100
      const qty = Number(item.quantity);
      if (isNaN(qty) || !Number.isInteger(qty) || qty <= 0 || qty > 100) {
        return NextResponse.json(
          { error: `Invalid quantity (${item.quantity}) for item.` },
          { status: 400 }
        );
      }

      // 2. Strict Product Database Lookup using DB as authoritative source
      const prod = allProducts.find(
        (p) =>
          p.id === item.product_id ||
          (item.product_name && p.name.toLowerCase() === item.product_name.toLowerCase()) ||
          (item.slug && p.slug === item.slug)
      );

      if (!prod) {
        return NextResponse.json(
          { error: `Product "${item.product_name || item.product_id}" not found in store catalog.` },
          { status: 400 }
        );
      }

      if (!prod.is_active) {
        return NextResponse.json(
          { error: `Product "${prod.name}" is currently unavailable.` },
          { status: 400 }
        );
      }

      // Stock Check
      if (prod.stock_quantity > 0 && prod.stock_quantity < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${prod.name}. Available: ${prod.stock_quantity}` },
          { status: 400 }
        );
      }

      // 3. Authoritative Unit Price Determination from DB ONLY (client price strictly ignored)
      let unitPrice = prod.price;
      const weight = item.weight || item.variant_weight;

      if (weight && prod.variants && prod.variants.length > 0) {
        const variant = prod.variants.find((v) => v.weight === weight);
        if (variant) {
          unitPrice = variant.price;
        } else {
          return NextResponse.json(
            { error: `Invalid variant weight "${weight}" for product "${prod.name}".` },
            { status: 400 }
          );
        }
      }

      const itemTotal = unitPrice * qty;
      subtotal += itemTotal;

      itemsVerified.push({
        product_id: prod.id,
        product_name: prod.name,
        image: prod.images[0] || item.image || '/images/pickles/hero.jpg',
        weight: weight || prod.weight || '250g',
        price: unitPrice,
        quantity: qty,
      });
    }

    // 2. Server-side coupon discount calculation
    let discount = 0;
    if (coupon_code) {
      const couponResult = DataStore.validateCoupon(coupon_code, subtotal);
      if (couponResult.valid) {
        discount = couponResult.discount;
      }
    }

    // 3. Authoritative Shipping Fee calculation from DB settings
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

    // 4. Authoritative GST Tax calculation from DB settings
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = GST_ENABLED ? Math.round(taxableAmount * (GST_PERCENTAGE / 100)) : 0;

    // 5. Authoritative Final Total calculation
    const totalAmount = Math.max(0, subtotal - discount + shipping + tax);
    const amountInPaise = Math.round(totalAmount * 100);

    // 6. Application Order ID generation
    const appOrderId = `KP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const formattedNow = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error('Supabase Admin client not configured');
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 500 }
      );
    }

    // 7. CRITICAL DB PERSISTENCE FIRST: Save Pending Order & items in Supabase BEFORE Razorpay call
    const validUserId = toValidUuid(session.id);
    console.log(`[PAYMENT_INITIATED] Initiating order placement: appOrderId=${appOrderId}, user=${validUserId}, total=₹${totalAmount}`);
    const { error: orderErr } = await supabaseAdmin.from('orders').upsert(
      {
        id: appOrderId,
        user_id: validUserId,
        customer_name: customer_name || 'Valued Customer',
        customer_email: customer_email || 'customer@example.com',
        customer_phone: customer_phone || '',
        shipping_address: shipping_address || {
          fullName: customer_name || 'Customer',
          phone: customer_phone || '',
          addressLine1: 'Address',
          city: 'City',
          state: 'State',
          pincode: '000000',
        },
        subtotal,
        discount,
        coupon_code: coupon_code || null,
        shipping_fee: shipping,
        tax,
        total_amount: totalAmount,
        payment_status: 'Pending',
        payment_method: 'Razorpay Online Payment',
        razorpay_order_id: null,
        razorpay_payment_id: null,
        order_status: 'Pending',
        timeline: [
          {
            status: 'Pending',
            timestamp: formattedNow,
            note: 'Order initiated via Checkout',
          },
        ],
        created_at: nowIso,
      },
      { onConflict: 'id' }
    );

    if (orderErr) {
      console.error('Supabase pre-payment order insert error:', orderErr.message);
      return NextResponse.json(
        { error: `Database order save failed: ${orderErr.message}` },
        { status: 500 }
      );
    }

    const itemsToInsert = itemsVerified.map((it) => ({
      order_id: appOrderId,
      product_id: toValidUuid(it.product_id),
      product_name: it.product_name,
      image: it.image || '/images/pickles/hero.jpg',
      variant_weight: it.weight,
      price: it.price,
      quantity: it.quantity,
      total: it.price * it.quantity,
    }));

    const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(itemsToInsert);
    if (itemsErr) {
      console.error('Supabase pre-payment order_items insert error:', itemsErr.message);
      return NextResponse.json(
        { error: `Database order items save failed: ${itemsErr.message}` },
        { status: 500 }
      );
    }

    // 8. ONLY AFTER DB PERSISTENCE SUCCEEDS: Create Razorpay Order
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const hasLiveCredentials = keyId && keySecret && !keyId.includes('yourKey') && !keySecret.includes('yourKey');

    let rzpOrderId = `order_sbx_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    if (hasLiveCredentials) {
      const addressSummary = shipping_address
        ? `${shipping_address.addressLine1 || ''}, ${shipping_address.city || ''}, ${shipping_address.state || ''} - ${shipping_address.pincode || ''}`
        : '';

      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          notes: {
            app_order_id: appOrderId,
            customer_name: customer_name || 'Customer',
            customer_email: customer_email || '',
            customer_phone: customer_phone || '',
            shipping_address: addressSummary,
            item_count: itemsVerified.length.toString(),
            shipping_fee: shipping.toString(),
            tax_amount: tax.toString(),
            gst_percentage: GST_PERCENTAGE.toString(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Razorpay API Order Creation Error:', errorData);
        return NextResponse.json(
          { error: errorData.error?.description || 'Razorpay order creation failed' },
          { status: response.status }
        );
      }

      const rzpOrder = await response.json();
      rzpOrderId = rzpOrder.id;
    }

    // 9. LINK RAZORPAY ORDER ID TO INTERNAL ORDER
    const { error: linkErr } = await supabaseAdmin
      .from('orders')
      .update({ razorpay_order_id: rzpOrderId })
      .eq('id', appOrderId);

    if (linkErr) {
      console.error('Failed to link Razorpay order ID to DB order:', linkErr.message);
      return NextResponse.json(
        { error: 'Failed to link payment details to internal order' },
        { status: 500 }
      );
    }

    // Save to memory store for in-memory sync
    const newOrder: Order = {
      id: appOrderId,
      user_id: session.id,
      customer_name: customer_name || 'Valued Customer',
      customer_email: customer_email || 'customer@example.com',
      customer_phone: customer_phone || '',
      shipping_address: shipping_address || {
        fullName: customer_name || 'Customer',
        phone: customer_phone || '',
        addressLine1: 'Address',
        city: 'City',
        state: 'State',
        pincode: '000000',
      },
      items: itemsVerified.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        product_id: it.product_id,
        product_name: it.product_name,
        image: it.image || '/images/pickles/hero.jpg',
        variant_weight: it.weight,
        price: it.price,
        quantity: it.quantity,
        total: it.price * it.quantity,
      })),
      subtotal,
      discount,
      coupon_code: coupon_code || undefined,
      shipping_fee: shipping,
      tax,
      gst_percentage: GST_PERCENTAGE,
      gst_enabled: GST_ENABLED,
      total_amount: totalAmount,
      payment_status: 'Pending',
      payment_method: 'Razorpay Online Payment',
      razorpay_order_id: rzpOrderId,
      razorpay_payment_id: undefined,
      order_status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          timestamp: formattedNow,
          note: 'Order initiated via Checkout',
        },
      ],
      created_at: nowIso,
    };
    DataStore.saveOrder(newOrder);

    return NextResponse.json({
      id: rzpOrderId,
      order_id: appOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key: keyId || 'rzp_test_fallback',
      totals: {
        subtotal,
        discount,
        shipping,
        tax,
        totalAmount,
        gstPercentage: GST_PERCENTAGE,
        gstEnabled: GST_ENABLED,
      },
    });
  } catch (error) {
    console.error('Server Create Razorpay Order Exception:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while initializing Razorpay order.' },
      { status: 500 }
    );
  }
}
