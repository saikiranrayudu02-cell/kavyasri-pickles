import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { StoreSettings } from '@/lib/types';

import { getAuthSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin authorization required.' }, { status: 401 });
    }

    const settings = await DataStore.syncSettingsFromSupabase();
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (err) {
    console.error('Error fetching admin settings:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin authorization required.' }, { status: 401 });
    }

    const body = await req.json();

    const free_shipping_threshold = Number(body.free_shipping_threshold);
    const standard_shipping_fee = Number(body.standard_shipping_fee);
    const gst_percentage = Number(body.gst_percentage);
    const gst_enabled = Boolean(body.gst_enabled);

    if (isNaN(free_shipping_threshold) || free_shipping_threshold < 0) {
      return NextResponse.json(
        { error: 'Free Shipping Threshold must be a valid non-negative number.' },
        { status: 400 }
      );
    }

    if (isNaN(standard_shipping_fee) || standard_shipping_fee < 0) {
      return NextResponse.json(
        { error: 'Standard Shipping Charge must be a valid non-negative number.' },
        { status: 400 }
      );
    }

    if (isNaN(gst_percentage) || gst_percentage < 0 || gst_percentage > 100) {
      return NextResponse.json(
        { error: 'GST Rate Percentage must be between 0% and 100%.' },
        { status: 400 }
      );
    }

    const updatedSettings: StoreSettings = {
      store_name: body.store_name || 'Kavya Sri Pickles',
      tagline: body.tagline || '',
      store_email: body.store_email || '',
      store_phone: body.store_phone || '',
      whatsapp_number: body.whatsapp_number || '',
      fssai_number: body.fssai_number || '',
      gst_number: body.gst_number || '',
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      pincode: body.pincode || '',
      free_shipping_threshold,
      standard_shipping_fee,
      gst_percentage,
      gst_enabled,
      razorpay_key_id: body.razorpay_key_id || '',
      is_razorpay_live: Boolean(body.is_razorpay_live),
      enable_cod: Boolean(body.enable_cod),
    };

    // Update in-memory and local cache
    DataStore.updateStoreSettings(updatedSettings);

    // Update in live Supabase Database
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('store_settings').upsert(
        {
          key: 'general',
          value: updatedSettings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) {
        console.error('Supabase admin settings update error:', error.message);
        return NextResponse.json(
          { error: `Database update failed: ${error.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Settings updated successfully across database and server',
        settings: updatedSettings,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error('Error saving admin settings:', err);
    return NextResponse.json({ error: 'Failed to update store settings' }, { status: 500 });
  }
}
