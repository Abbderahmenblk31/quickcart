import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_SECRET } from '@/lib/auth/admin-auth';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Exclude public admin routes (login & auth API)
  if (path === '/admin/login' || path.startsWith('/api/admin/auth/')) {
    return NextResponse.next();
  }

  // 2. Check Admin Session Token Cookie
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = sessionCookie === ADMIN_SESSION_SECRET;

  // 3. Protect /admin Web Pages
  if (path.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Protect /api/admin Data Endpoints
  if (path.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED: Operational authorization token missing or expired.',
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
