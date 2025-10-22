import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Admin } from './types';
import { hasAccess } from './lib';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const userCookie = request.cookies.get('auth-admin')?.value;
  const pathname = request.nextUrl.pathname;

  const user: Admin | null = userCookie ? JSON.parse(userCookie) : null;


  if (pathname === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/workspace/dashboard', request.url));
  }

  if (pathname.startsWith('/workspace')) {
    if (!token || !user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (!hasAccess(pathname, user.id_rol)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*', '/auth/login'],
};
