import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

const locales = ['en', 'th'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

import { ThemeProvider } from "@/components/theme-provider"
import NextTopLoader from 'nextjs-toploader';
import { WebVitals } from '@/components/web-vitals';
import { GoogleAdSense } from '@/components/ads/google-adsense';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>


      <body className={inter.className}>
        <NextTopLoader color="#2563eb" showSpinner={false} />
        <WebVitals />
        <GoogleAdSense pId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || ''} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
