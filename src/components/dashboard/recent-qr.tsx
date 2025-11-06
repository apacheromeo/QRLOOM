'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface QRCode {
  id: string;
  title: string;
  data_url: string;
  short_code: string;
  scan_count: number;
  created_at: string;
  status: string;
}

interface RecentQRProps {
  qrcodes: QRCode[];
}

export function RecentQR({ qrcodes }: RecentQRProps) {
  if (qrcodes.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent QR Codes</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No QR codes yet</p>
          <Link href="/">
            <Button className="mt-4">Create Your First QR Code</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent QR Codes</h3>
        <Link href="/qr-codes">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {qrcodes.map((qr) => (
          <div
            key={qr.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/qr-codes/${qr.id}`}
                  className="font-medium hover:underline truncate"
                >
                  {qr.title}
                </Link>
                {qr.status === 'archived' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Archived
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span className="truncate">{qr.data_url}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(qr.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="text-right">
                <p className="text-sm font-medium">{qr.scan_count}</p>
                <p className="text-xs text-muted-foreground">scans</p>
              </div>
              <Link href={qr.data_url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
