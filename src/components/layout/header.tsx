'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { QrCode } from 'lucide-react';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileNav />

        <Link href="/" className="flex items-center gap-2 mr-6 md:mr-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <QrCode className="h-5 w-5 text-background" />
          </div>
          <span className="text-lg font-semibold tracking-tight hidden md:inline-block">{t('appName')}</span>
          <span className="text-lg font-semibold tracking-tight md:hidden">QRLoom</span>
        </Link>

        <MainNav />

        <div className="flex flex-1 items-center justify-end gap-2">
          <ModeToggle />
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            </div>
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  {tNav('dashboard')}
                </Button>
              </Link>
              <Link href="/qr-codes">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  {tNav('myQRCodes')}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                {t('signOut')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  {t('signIn')}
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  {t('signUp')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
