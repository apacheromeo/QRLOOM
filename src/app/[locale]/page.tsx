import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { FadeIn } from '@/components/animations/fade-in';
import { Metadata } from 'next';
import { QRGeneratorLazy } from '@/components/qr/qr-generator-lazy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'QRLoom - Professional AI QR Code Generator',
  description: 'Create beautiful, trackable, and customizable QR codes in seconds. The best free QR code generator for professionals and businesses.',
  keywords: ['qr code generator', 'qr code maker', 'free qr code', 'custom qr code', 'ai qr code', 'qr code analytics'],
  openGraph: {
    title: 'QRLoom - Professional AI QR Code Generator',
    description: 'Create beautiful, trackable, and customizable QR codes in seconds.',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Professional%20AI%20QR%20Code%20Generator',
        width: 1200,
        height: 630,
        alt: 'QRLoom Preview',
      },
    ],
  },
};

export default async function HomePage() {
  const t = await getTranslations('hero');

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QRLoom',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Professional QR code generator with analytics and customization.',
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <HeroSection title={t('title')} subtitle={t('subtitle')} />

        <div className="container pb-20">
          <FadeIn delay={0.2}>
            <div className="mx-auto max-w-6xl -mt-10 relative z-10">
              <div className="rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl p-1">
                <QRGeneratorLazy />
              </div>
            </div>
          </FadeIn>
        </div>

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}

