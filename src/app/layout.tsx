import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'QRLoom - Generate Beautiful QR Codes',
  description:
    'Create, customize, and track professional QR codes in seconds. Perfect for marketing, events, and business.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
