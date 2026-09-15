import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user: session }, { status: 200 });
  } catch (err) {
    console.error('Error fetching session:', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
