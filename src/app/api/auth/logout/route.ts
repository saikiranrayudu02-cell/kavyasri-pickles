import { NextResponse } from 'next/server';
import { getAuthSession, removeSessionCookie } from '@/lib/auth/session';
import { logUserActivity } from '@/lib/supabase/activity';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (session) {
      logUserActivity({
        action: 'LOGOUT',
        user_id: session.id,
        user_email: session.email,
      });
    }

    await removeSessionCookie();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Server logout error:', err);
    await removeSessionCookie();
    return NextResponse.json({ success: true });
  }
}
