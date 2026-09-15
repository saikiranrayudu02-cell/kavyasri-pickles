import { NextResponse } from 'next/server';
import { setSessionCookie, SessionUser } from '@/lib/auth/session';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { logUserActivity } from '@/lib/supabase/activity';

const PRIMARY_ADMIN_EMAIL = 'kavya123@gmail.com';
const PRIMARY_ADMIN_PASSWORD = 'kavya1234';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseAdmin() || supabase;

    // 1. Primary Admin Authentication
    if (cleanEmail === PRIMARY_ADMIN_EMAIL) {
      if (cleanPassword !== PRIMARY_ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: 'Invalid administrator credentials.' },
          { status: 401 }
        );
      }

      const adminUser: SessionUser = {
        id: 'a0000000-0000-0000-0000-000000000001',
        name: 'Kavyasri Admin',
        email: PRIMARY_ADMIN_EMAIL,
        phone: '9876543210',
        role: 'admin',
      };

      await setSessionCookie(adminUser);

      if (isSupabaseConfigured && supabaseClient) {
        await supabaseClient
          .from('profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('email', PRIMARY_ADMIN_EMAIL);

        logUserActivity({
          action: 'LOGIN',
          user_id: adminUser.id,
          user_email: PRIMARY_ADMIN_EMAIL,
          details: { role: 'admin' },
        });
      }

      return NextResponse.json({ success: true, user: adminUser });
    }

    // 2. Customer Authentication against Supabase profiles table
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database service unavailable.' },
        { status: 500 }
      );
    }

    const { data: dbProfiles, error: dbErr } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('email', cleanEmail)
      .limit(1);

    if (dbErr || !dbProfiles || dbProfiles.length === 0) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please register first.' },
        { status: 404 }
      );
    }

    const matchedProfile = dbProfiles[0];

    // Password Check
    if (matchedProfile.password && matchedProfile.password !== cleanPassword) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const customerUser: SessionUser = {
      id: matchedProfile.id,
      name: matchedProfile.full_name || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: matchedProfile.phone || '',
      role: 'customer',
    };

    await setSessionCookie(customerUser);

    await supabaseClient
      .from('profiles')
      .update({ last_login_at: new Date().toISOString(), password: cleanPassword })
      .eq('id', customerUser.id);

    logUserActivity({
      action: 'LOGIN',
      user_id: customerUser.id,
      user_email: cleanEmail,
      details: { role: 'customer' },
    });

    return NextResponse.json({ success: true, user: customerUser });
  } catch (err) {
    console.error('Server login error:', err);
    return NextResponse.json(
      { error: 'Authentication failed due to a server error.' },
      { status: 500 }
    );
  }
}
