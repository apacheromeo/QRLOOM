import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
  // Apply i18n middleware
  const intlResponse = intlMiddleware(request);

  // For Phase 1, skip Supabase session and auth checks
  // These will be enabled in Phase 2

  return intlResponse || NextResponse.next();
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
