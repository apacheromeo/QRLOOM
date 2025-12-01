import createMiddleware from 'next-intl/middleware';

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
  console.log('Middleware executing for:', request.nextUrl.pathname);

  // Update Supabase session
  const supabaseResponse = await updateSession(request);

  // Apply i18n middleware
  const intlResponse = intlMiddleware(request);

  // If i18n middleware returns a response (redirect or rewrite), use it
  // Otherwise use the Supabase response
  const response = intlResponse || supabaseResponse;

  // If we have a Supabase response with cookies, we need to copy them to the final response
  if (supabaseResponse.cookies.getAll().length > 0) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
  }

  // If intlResponse is null, we need to ensure we return the supabaseResponse
  // But if intlResponse exists, we've already used it as base and added cookies


  // Protected routes - require authentication
  /*
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
  */

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Content Security Policy (CSP)
  // allowing 'unsafe-inline' and 'unsafe-eval' for now to prevent breaking dev tools and some libraries
  // in production, this should be tightened
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://js.stripe.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://placehold.co https://*.googleusercontent.com https://*.shopee.co.th https://*.lazada.co.th https://pagead2.googlesyndication.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://js.stripe.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
    connect-src 'self' https://api.stripe.com https://pagead2.googlesyndication.com;
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

  response.headers.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  );

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
     * - api (API routes)
     * - r (Redirect routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|r/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
