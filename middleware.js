import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/accounts/:path*',
    '/transactions/:path*',
    '/orders/:path*',
    '/reports/:path*',
    '/reminders/:path*',
    '/settings/:path*',
  ],
}; 