import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/settings', '/qr-codes'];
  const pathname = request.nextUrl.pathname;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.includes(path)
  );

  if (isProtectedPath) {
    try {
      // Check if environment variables are available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase environment variables not available in middleware');
        // Allow request to continue - auth will be checked at page level
        return intlResponse || NextResponse.next();
      }

      // Create response for cookie handling
      const response = intlResponse || NextResponse.next();

      // Create Supabase client for middleware
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll().map(c => ({ name: c.name, value: c.value }));
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to sign in with return URL
        const locale = pathname.split('/')[1] || defaultLocale;
        const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
      }

      return response;
    } catch (error) {
      console.error('Middleware auth check error:', error);
      // On error, allow request through - auth will be checked at page level
      return intlResponse || NextResponse.next();
    }
  }

  return intlResponse || NextResponse.next();
}

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
