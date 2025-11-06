import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto">
        <div className="flex justify-center py-6">
          <Link href="/" className="text-2xl font-bold">
            QRLoom
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
