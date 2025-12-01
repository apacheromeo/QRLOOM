import { Header } from '@/components/layout/header';
import { AffiliateBanner } from '@/components/ads/affiliate-banner';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <div className="container mx-auto px-4">
        <AffiliateBanner
          platform="shopee"
          link="https://shopee.co.th"
          imageSrc="https://placehold.co/728x90/orange/white?text=Shopee+Affiliate+Banner"
          alt="Shop on Shopee"
        />
      </div>
    </div>
  );
}
