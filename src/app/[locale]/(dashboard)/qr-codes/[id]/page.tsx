'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRActions } from '@/components/qr/qr-actions';
import { QRPreview } from '@/components/qr/qr-preview';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Eye,
  Calendar,
  Link as LinkIcon,
  Copy,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import { updateQRCode } from '@/actions/qr-actions';
import { AffiliateBanner } from '@/components/ads/affiliate-banner';

interface QRCode {
  id: string;
  title: string;
  description: string | null;
  data_url: string;
  short_code: string;
  scan_count: number;
  created_at: string;
  status: string;
  foreground_color: string;
  background_color: string;
  logo_url: string | null;
  format: string;
  is_dynamic: boolean;
  redirect_url: string | null;
}

export default function QRDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [qrcode, setQrcode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
  });

  const shortUrl = qrcode
    ? `${process.env.NEXT_PUBLIC_APP_URL || ''}/r/${qrcode.short_code}`
    : '';

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  // Fetch QR code details (MOCK)
  const fetchQRCode = async () => {
    if (!user) return;

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const id = params.id as string;
      const mockData = {
        id,
        title: id === '1' ? 'My Website' : 'WiFi Network',
        description: 'Main website link',
        data_url: id === '1' ? 'https://example.com' : 'WIFI:S:MyNetwork;T:WPA;P:password;;',
        short_code: id === '1' ? 'abc' : 'def',
        scan_count: id === '1' ? 120 : 50,
        created_at: new Date().toISOString(),
        status: 'active',
        foreground_color: '#000000',
        background_color: '#ffffff',
        logo_url: null,
        format: 'png',
        is_dynamic: true,
        redirect_url: null
      };

      setQrcode(mockData);
      setEditForm({
        title: mockData.title,
        description: mockData.description || '',
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (user && params.id) {
      fetchQRCode();
    }
  }, [user, params.id]);



  const handleSave = async () => {
    if (!qrcode) return;

    const formData = new FormData();
    formData.append('id', qrcode.id);
    formData.append('title', editForm.title);
    formData.append('description', editForm.description || '');

    try {
      const result = await updateQRCode({}, formData);

      if (result.message) {
        toast({
          title: result.message.includes('Success') ? 'Saved!' : 'Error',
          description: result.message,
          variant: result.message.includes('Success') ? 'default' : 'destructive',
        });
      }

      if (!result.errors) {
        setQrcode({ ...qrcode, ...editForm });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update QR code',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: 'Copied!',
        description: 'Short URL copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: qrcode?.title || 'QR Code',
          text: `Check out this QR code: ${qrcode?.title}`,
          url: shortUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  // Mock Analytics Data
  const mockAnalytics = {
    dailyScans: [
      { date: 'Mon', count: 12 },
      { date: 'Tue', count: 18 },
      { date: 'Wed', count: 15 },
      { date: 'Thu', count: 25 },
      { date: 'Fri', count: 32 },
      { date: 'Sat', count: 45 },
      { date: 'Sun', count: 20 },
    ],
    deviceType: [
      { name: 'Mobile', value: 85 },
      { name: 'Desktop', value: 10 },
      { name: 'Tablet', value: 5 },
    ],
    locations: [
      { name: 'USA', value: 45 },
      { name: 'UK', value: 20 },
      { name: 'Germany', value: 15 },
      { name: 'France', value: 10 },
      { name: 'Other', value: 10 },
    ],
  };

  if (authLoading || loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user || !qrcode) {
    return null;
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/qr-codes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{qrcode.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Created {formatDistanceToNow(new Date(qrcode.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <QRActions
          qrcodeId={qrcode.id}
          shortCode={qrcode.short_code}
          status={qrcode.status}
          onUpdate={fetchQRCode}
        />
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard title="Total Scans" value={qrcode.scan_count} icon={Eye} />
        <StatsCard
          title="Created"
          value={format(new Date(qrcode.created_at), 'MMM d, yyyy')}
          icon={Calendar}
        />
        <StatsCard
          title="Status"
          value={qrcode.status.charAt(0).toUpperCase() + qrcode.status.slice(1)}
          icon={LinkIcon}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Preview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">QR Code Preview</h3>
          <QRPreview
            options={{
              data: qrcode.data_url,
              format: qrcode.format as 'png' | 'svg' | 'pdf',
              foregroundColor: qrcode.foreground_color,
              backgroundColor: qrcode.background_color,
              logo: qrcode.logo_url || undefined,
              width: 512,
              height: 512,
            }}
          />
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Input value={shortUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} size="icon" variant="outline" title="Copy Link">
                <Copy className="h-4 w-4" />
              </Button>

              <Button onClick={handleShare} size="icon" title="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this short URL to track scans
            </p>
          </div>
          <div className="mt-6 pt-6 border-t">
            <AffiliateBanner
              platform="lazada"
              link="https://lazada.co.th"
              imageSrc="https://placehold.co/400x100/blue/white?text=Lazada+Deals"
              alt="Shop on Lazada"
              width={400}
              height={100}
            />
          </div>
        </Card>

        {/* Details */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Details</h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      title: qrcode.title,
                      description: qrcode.description || '',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              {isEditing ? (
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm">{qrcode.title}</p>
              )}
            </div>

            <div>
              <Label>Description</Label>
              {isEditing ? (
                <Input
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {qrcode.description || 'No description'}
                </p>
              )}
            </div>

            <div>
              <Label>Destination URL</Label>
              <p className="mt-1 text-sm break-all">{qrcode.data_url}</p>
            </div>

            <div>
              <Label>Short Code</Label>
              <p className="mt-1 text-sm font-mono">{qrcode.short_code}</p>
            </div>

            <div>
              <Label>Format</Label>
              <p className="mt-1 text-sm uppercase">{qrcode.format}</p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Foreground</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: qrcode.foreground_color }}
                  />
                  <span className="text-sm font-mono">
                    {qrcode.foreground_color}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <Label>Background</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: qrcode.background_color }}
                  />
                  <span className="text-sm font-mono">
                    {qrcode.background_color}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div >

      {/* Analytics Charts */}
      < div className="space-y-4" >
        <h2 className="text-2xl font-bold">Analytics</h2>
        <AnalyticsCharts data={mockAnalytics} />
      </div >
    </div >
  );
}
