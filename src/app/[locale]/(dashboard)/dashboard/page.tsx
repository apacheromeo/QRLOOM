import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentQR } from '@/components/dashboard/recent-qr';
import { RecentScans } from '@/components/dashboard/recent-scans';
import { Button } from '@/components/ui/button';
import { QrCode, TrendingUp, Eye, Activity, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // MOCK DATA FOR DEV
  const user = { id: 'mock-user-id', email: 'test@example.com' };
  const profile = { full_name: 'Test User', plan: 'free', email: 'test@example.com' };
  const totalQRCodes = 12;
  const totalScans = 1250;
  const scansThisMonth = 350;
  const recentQRCodes = [
    { id: '1', title: 'My Website', created_at: new Date().toISOString(), data_url: 'https://example.com', short_code: 'abc', scan_count: 120, status: 'active' },
    { id: '2', title: 'WiFi', created_at: new Date(Date.now() - 86400000).toISOString(), data_url: 'WIFI:S:MyNetwork;T:WPA;P:password;;', short_code: 'def', scan_count: 50, status: 'active' },
  ];
  const recentScans = [
    { id: '1', qrcode_id: '1', scanned_at: new Date().toISOString(), country: 'US', city: 'New York', device_type: 'Mobile', browser: 'Chrome', qrcode: { title: 'My Website' } },
    { id: '2', qrcode_id: '2', scanned_at: new Date(Date.now() - 3600000).toISOString(), country: 'UK', city: 'London', device_type: 'Desktop', browser: 'Safari', qrcode: { title: 'WiFi' } },
  ];

  const planLimits = { maxQRCodes: 10, maxScansPerMonth: 1000 };
  const qrCodeUsage = `${totalQRCodes} / ${planLimits.maxQRCodes}`;
  const scanUsage = `${scansThisMonth} / ${planLimits.maxScansPerMonth}`;

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || profile?.email || 'User'}!
          </p>
        </div>
        <Link href="/">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create QR Code
          </Button>
        </Link>
      </div>

      {/* Plan Badge */}
      {profile?.plan && (
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${profile.plan === 'pro'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-200 text-gray-800'
              }`}
          >
            {profile.plan === 'pro' ? '⭐ Pro Plan' : 'Free Plan'}
          </span>
          {profile.plan === 'free' && (
            <Link href="/pricing">
              <Button variant="outline" size="sm">
                Upgrade to Pro
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total QR Codes"
          value={qrCodeUsage}
          description={
            profile?.plan === 'free'
              ? 'Upgrade to Pro for unlimited'
              : 'Unlimited QR codes'
          }
          icon={QrCode}
        />
        <StatsCard
          title="Total Scans"
          value={totalScans || 0}
          description="All time scans"
          icon={Eye}
        />
        <StatsCard
          title="Scans This Month"
          value={scanUsage}
          description={
            profile?.plan === 'free'
              ? `${planLimits.maxScansPerMonth - scansThisMonth} remaining`
              : 'Unlimited scans'
          }
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Codes"
          value={totalQRCodes || 0}
          description="Currently active"
          icon={Activity}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentQR qrcodes={recentQRCodes || []} />
        <RecentScans scans={recentScans || []} />
      </div>

      {/* Quick Actions */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              Create QR Code
            </Button>
          </Link>
          <Link href="/qr-codes">
            <Button variant="outline" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View All QR Codes
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" className="w-full">
              <Activity className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
