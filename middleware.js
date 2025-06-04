import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // List of public paths that don't require redirection
  const publicPaths = ['/', '/contact', '/about'];

  // If it's a public path, allow access
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // For dashboard and other protected routes, allow access (since we're using free trial model)
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 