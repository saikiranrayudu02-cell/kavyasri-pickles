import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      coupon_code,
      client_shipping_fee,
      client_tax,
      client_total,
    } = body;

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
    const allProducts = DataStore.getProducts();
    let subtotal = 0;
    const itemsVerified: Array<{
      product_id: string;
      product_name: string;
      weight: string;
      price: number;
      quantity: number;
    }> = [];

    for (const item of items) {
      // Robust lookup by ID, Name, or Slug
      const prod = allProducts.find(
        (p) =>
          p.id === item.product_id ||
          (item.product_name && p.name.toLowerCase() === item.product_name.toLowerCase()) ||
          (item.slug && p.slug === item.slug)
      );

      let unitPrice = item.price || 0;

      if (prod) {
        // Stock Check
        if (prod.stock_quantity > 0 && prod.stock_quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${prod.name}. Available: ${prod.stock_quantity}` },
            { status: 400 }
          );
        }

        // Determine price from variant or base price
        if (item.weight && prod.variants) {
          const variant = prod.variants.find((v) => v.weight === item.weight);
          if (variant) {
            unitPrice = variant.price;
          } else {
            unitPrice = prod.price;
          }
        } else {
          unitPrice = prod.price;
        }
      } else if (!unitPrice || unitPrice <= 0) {
        return NextResponse.json(
          { error: `Product "${item.product_name || item.product_id}" details invalid.` },
          { status: 400 }
        );
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      itemsVerified.push({
        product_id: prod?.id || item.product_id || 'prod-custom',
        product_name: prod?.name || item.product_name || 'Homemade Pickle',
        weight: item.weight || prod?.weight || '250g',
        price: unitPrice,
        quantity: item.quantity,
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

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const hasLiveCredentials = keyId && keySecret && !keyId.includes('yourKey') && !keySecret.includes('yourKey');

    if (hasLiveCredentials) {
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
            item_count: itemsVerified.length.toString(),
            shipping_address_required: 'true',
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
      return NextResponse.json({
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key: keyId,
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
    }

    // Sandbox / Development fallback order
    const mockOrderId = `order_sbx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return NextResponse.json({
      id: mockOrderId,
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
