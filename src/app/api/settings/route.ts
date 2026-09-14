import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';

export async function GET() {
  try {
    let settings = DataStore.getStoreSettings();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        const val = data.value || data;
        settings = {
          store_name: val.store_name || data.store_name || settings.store_name,
          tagline: val.tagline || data.tagline || settings.tagline,
          store_email: val.store_email || data.store_email || settings.store_email,
          store_phone: val.store_phone || data.store_phone || settings.store_phone,
          whatsapp_number: val.whatsapp_number || data.whatsapp_number || settings.whatsapp_number,
          fssai_number: val.fssai_number || data.fssai_number || settings.fssai_number,
          gst_number: val.gst_number || data.gst_number || settings.gst_number,
          address: val.address || data.address || settings.address,
          city: val.city || data.city || settings.city,
          state: val.state || data.state || settings.state,
          pincode: val.pincode || data.pincode || settings.pincode,
          free_shipping_threshold: Number(val.free_shipping_threshold ?? data.free_shipping_threshold ?? 0),
          standard_shipping_fee: Number(val.standard_shipping_fee ?? data.standard_shipping_fee ?? 0),
          gst_percentage: Number(val.gst_percentage ?? data.gst_percentage ?? 0),
          gst_enabled: Boolean(val.gst_enabled ?? data.gst_enabled ?? true),
          razorpay_key_id: val.razorpay_key_id || data.razorpay_key_id || settings.razorpay_key_id,
          is_razorpay_live: Boolean(val.is_razorpay_live ?? data.is_razorpay_live ?? false),
          enable_cod: Boolean(val.enable_cod ?? data.enable_cod ?? true),
        };
      }
    }

    const publicSettings = {
      gst_enabled: settings.gst_enabled,
      gst_percentage: settings.gst_percentage,
      free_shipping_threshold: settings.free_shipping_threshold,
      standard_shipping_fee: settings.standard_shipping_fee,
      store_name: settings.store_name,
      tagline: settings.tagline,
      store_email: settings.store_email,
      store_phone: settings.store_phone,
      whatsapp_number: settings.whatsapp_number,
      fssai_number: settings.fssai_number,
      gst_number: settings.gst_number,
      enable_cod: settings.enable_cod,
    };

    return NextResponse.json(publicSettings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (err) {
    console.error('Error fetching public settings:', err);
    return NextResponse.json(
      { error: 'Failed to fetch store settings' },
      { status: 500 }
    );
  }
}
