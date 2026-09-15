import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

const COOKIE_NAME = 'kp_session';
const SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'kavya-pickles-secret-session-key-2026';

function signToken(payloadStr: string): string {
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payloadStr);
  return hmac.digest('hex');
}

export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    iat: Date.now(),
  });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = signToken(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expectedSignature = signToken(encoded);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payloadStr = Buffer.from(encoded, 'base64url').toString('utf-8');
    const parsed = JSON.parse(payloadStr);
    if (!parsed || !parsed.id || !parsed.email) return null;
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      role: parsed.role || 'customer',
    };
  } catch {
    return null;
  }
}

/**
  Retrieves the verified user session from request HTTP-only cookies or header,
  and cross-verifies against Supabase profiles table.
 */
export async function getAuthSession(req?: Request): Promise<SessionUser | null> {
  let token: string | undefined;

  if (req) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|; )\\s*${COOKIE_NAME}=([^;]*)`));
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // ignore
    }
  }

  if (!token) return null;

  const sessionUser = verifySessionToken(token);
  if (!sessionUser) return null;

  // Cross-verify user profile in live database
  const supabaseAdmin = getSupabaseAdmin() || supabase;
  if (supabaseAdmin) {
    try {
      const { data: dbProf } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (dbProf) {
        return {
          id: dbProf.id,
          name: dbProf.full_name || sessionUser.name,
          email: dbProf.email || sessionUser.email,
          phone: dbProf.phone || sessionUser.phone,
          role: (dbProf.role as 'customer' | 'admin') || sessionUser.role,
        };
      }
    } catch (err) {
      console.error('Error cross-verifying profile session:', err);
    }
  }

  return sessionUser;
}

export async function setSessionCookie(user: SessionUser): Promise<string> {
  const token = createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  return token;
}

export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
