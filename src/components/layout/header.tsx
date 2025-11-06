'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          {t('appName')}
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {tNav('dashboard')}
              </Link>
              <Link
                href="/qr-codes"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {tNav('myQRCodes')}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                {t('signOut')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  {t('signIn')}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  {t('signUp')}
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
