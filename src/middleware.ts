import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (request.nextUrl.pathname.startsWith('/workspace/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (request.nextUrl.pathname === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/workspace/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/dashboard/:path*', '/auth/login'],
};