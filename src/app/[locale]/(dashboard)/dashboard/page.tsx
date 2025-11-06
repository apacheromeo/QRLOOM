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
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/auth/signin');
  }

  // First, fetch user's QR code IDs
  const { data: userQRCodes } = await supabase
    .from('qrcodes')
    .select('id')
    .eq('user_id', user.id);

  const qrCodeIds = userQRCodes?.map((qr) => qr.id) || [];

  // Fetch user's statistics
  const [
    { count: totalQRCodes },
    { count: totalScans },
    { data: recentQRCodes },
    { data: recentScans },
    { data: profile },
  ] = await Promise.all([
    // Total active QR codes
    supabase
      .from('qrcodes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active'),

    // Total scans across all QR codes
    qrCodeIds.length > 0
      ? supabase
          .from('scans')
          .select('*', { count: 'exact', head: true })
          .in('qrcode_id', qrCodeIds)
      : Promise.resolve({ count: 0 }),

    // Recent QR codes (last 5)
    supabase
      .from('qrcodes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),

    // Recent scans (last 10) with QR code info
    supabase
      .from('scans')
      .select(`
        *,
        qrcode:qrcodes!inner(
          id,
          title,
          user_id
        )
      `)
      .eq('qrcode.user_id', user.id)
      .order('scanned_at', { ascending: false })
      .limit(10),

    // User profile
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
  ]);

  // Calculate scans this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const scansThisMonthResult = qrCodeIds.length > 0
    ? await supabase
        .from('scans')
        .select('*', { count: 'exact', head: true })
        .in('qrcode_id', qrCodeIds)
        .gte('scanned_at', startOfMonth.toISOString())
    : { count: 0 };

  const scansThisMonth = scansThisMonthResult.count || 0;

  // Calculate plan limits
  const planLimits =
    profile?.plan === 'free'
      ? { maxQRCodes: 10, maxScansPerMonth: 1000 }
      : { maxQRCodes: -1, maxScansPerMonth: -1 }; // Unlimited for Pro

  const qrCodeUsage =
    planLimits.maxQRCodes > 0
      ? `${totalQRCodes || 0} / ${planLimits.maxQRCodes}`
      : `${totalQRCodes || 0}`;

  const scanUsage =
    planLimits.maxScansPerMonth > 0
      ? `${scansThisMonth} / ${planLimits.maxScansPerMonth}`
      : `${scansThisMonth}`;

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
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              profile.plan === 'pro'
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
