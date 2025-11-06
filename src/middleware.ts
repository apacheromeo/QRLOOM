import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Define locales directly
const locales = ['en', 'th'];
const defaultLocale = 'en';

// Create the i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  // Apply i18n middleware first
  const intlResponse = intlMiddleware(request);

  // Update Supabase session
  const response = await updateSession(request);

  // Merge i18n headers into response
  if (intlResponse) {
    intlResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }

  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/settings', '/qr-codes'];
  const pathname = request.nextUrl.pathname;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.includes(path)
  );

  if (isProtectedPath) {
    // Check if user is authenticated
    try {
      const userResponse = await fetch(
        `${request.nextUrl.origin}/api/auth/user`,
        {
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
        }
      );

      if (!userResponse.ok) {
        // Redirect to sign in with return URL
        const locale = pathname.split('/')[1];
        const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
      }
    } catch (error) {
      // On error, redirect to sign in
      const locale = pathname.split('/')[1];
      const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
