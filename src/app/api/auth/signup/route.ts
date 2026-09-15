import { NextResponse } from 'next/server';
import { setSessionCookie, SessionUser } from '@/lib/auth/session';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { logUserActivity } from '@/lib/supabase/activity';

const PRIMARY_ADMIN_EMAIL = 'kavya123@gmail.com';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
      return NextResponse.json(
        { error: 'All registration fields are required.' },
        { status: 400 }
      );
    }

    if (cleanEmail === PRIMARY_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'This email is reserved for system administration.' },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseAdmin() || supabase;
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database service unavailable.' },
        { status: 500 }
      );
    }

    // Check existing account
    const { data: existingProfiles } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('email', cleanEmail)
      .limit(1);

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const userUuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `90000000-0000-4000-8000-${Date.now().toString().slice(-12)}`;

    const newUser: SessionUser = {
      id: userUuid,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'customer',
    };

    // Insert new profile record into Supabase DB profiles table
    const { error: insertErr } = await supabaseClient.from('profiles').insert({
      id: userUuid,
      email: cleanEmail,
      full_name: cleanName,
      phone: cleanPhone,
      role: 'customer',
      password: cleanPassword,
      last_login_at: new Date().toISOString(),
    });

    if (insertErr) {
      console.error('Database profile insertion error:', insertErr.message);
      return NextResponse.json(
        { error: `Registration database insert failed: ${insertErr.message}` },
        { status: 500 }
      );
    }

    await setSessionCookie(newUser);

    logUserActivity({
      action: 'SIGNUP',
      user_id: userUuid,
      user_email: cleanEmail,
      details: { name: cleanName, phone: cleanPhone },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (err) {
    console.error('Server signup error:', err);
    return NextResponse.json(
      { error: 'Registration failed due to a server error.' },
      { status: 500 }
    );
  }
}
