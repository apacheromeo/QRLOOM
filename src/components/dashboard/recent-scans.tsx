'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Smartphone } from 'lucide-react';

interface Scan {
  id: string;
  qrcode_id: string;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  scanned_at: string;
  qrcode?: {
    title: string;
  };
}

interface RecentScansProps {
  scans: Scan[];
}

export function RecentScans({ scans }: RecentScansProps) {
  if (scans.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Scans</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No scans yet</p>
          <p className="text-sm mt-2">Share your QR codes to start tracking scans</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Scans</h3>
        <Link href="/qr-codes">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex-1 min-w-0">
              {scan.qrcode && (
                <Link
                  href={`/qr-codes/${scan.qrcode_id}`}
                  className="font-medium hover:underline truncate block"
                >
                  {scan.qrcode.title}
                </Link>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                {(scan.city || scan.country) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {[scan.city, scan.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                {(scan.device_type || scan.browser) && (
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    <span>
                      {[scan.device_type, scan.browser].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(scan.scanned_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
