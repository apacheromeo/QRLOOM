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
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Eye,
  Calendar,
  Link as LinkIcon,
  Copy,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';

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
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  // Fetch QR code details
  const fetchQRCode = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/qr/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: 'Not found',
            description: 'QR code not found',
            variant: 'destructive',
          });
          router.push('/qr-codes');
          return;
        }
        throw new Error('Failed to fetch QR code');
      }

      const data = await response.json();
      setQrcode(data.qrcode);
      setEditForm({
        title: data.qrcode.title,
        description: data.qrcode.description || '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load QR code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && params.id) {
      fetchQRCode();
    }
  }, [user, params.id]);

  const handleSave = async () => {
    if (!qrcode) return;

    try {
      const response = await fetch(`/api/qr/${qrcode.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setQrcode(data.qrcode);
      setIsEditing(false);
      toast({
        title: 'Saved!',
        description: 'QR code updated successfully',
      });
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
              <Button onClick={handleCopyLink} size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this short URL to track scans
            </p>
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
      </div>

      {/* Analytics Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>Detailed analytics coming in Phase 4</p>
          <p className="text-sm mt-2">
            Track scans by location, device, and time
          </p>
        </div>
      </Card>
    </div>
  );
}
