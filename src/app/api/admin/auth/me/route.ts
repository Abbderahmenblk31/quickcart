import { NextRequest, NextResponse } from 'next/server';
import {
  MASTER_ADMIN,
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECRET,
} from '@/lib/auth/admin-auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (token === ADMIN_SESSION_SECRET) {
    return NextResponse.json({
      authenticated: true,
      user: MASTER_ADMIN,
    });
  }

  return NextResponse.json({
    authenticated: false,
    user: null,
  });
}
