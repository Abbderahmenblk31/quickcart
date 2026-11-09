import { NextRequest, NextResponse } from 'next/server';
import {
  validateCredentials,
  MASTER_ADMIN,
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECRET,
} from '@/lib/auth/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Username and Password are required.' },
        { status: 400 }
      );
    }

    const isValid = validateCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'ACCESS_DENIED: Invalid security credentials or unauthorized terminal key.',
        },
        { status: 401 }
      );
    }

    // Set secure HTTP-Only Session Cookie
    const response = NextResponse.json({
      success: true,
      message: 'AUTHENTICATED: Security clearance granted.',
      user: MASTER_ADMIN,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: ADMIN_SESSION_SECRET,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
