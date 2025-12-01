'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, QrCode } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface QRCardProps {
  qrcode: {
    id: string;
    title: string;
    data_url: string;
    short_code: string;
    scan_count: number;
    created_at: string;
    status: string;
    foreground_color: string;
    background_color: string;
  };
  onAction?: (action: 'edit' | 'delete' | 'archive', id: string) => void;
}

export function QRCard({ qrcode }: QRCardProps) {
  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/r/${qrcode.short_code}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* QR Preview */}
        <Link href={`/qr-codes/${qrcode.id}`}>
          <div
            className="aspect-square rounded-lg flex items-center justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: qrcode.background_color }}
          >
            <QrCode
              className="w-24 h-24"
              style={{ color: qrcode.foreground_color }}
            />
          </div>
        </Link>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/qr-codes/${qrcode.id}`}
              className="font-semibold hover:underline truncate flex-1"
            >
              {qrcode.title}
            </Link>
            {qrcode.status === 'archived' && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 shrink-0">
                Archived
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground truncate">
            {qrcode.data_url}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="font-semibold">{qrcode.scan_count}</span>
                <span className="text-muted-foreground ml-1">scans</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(qrcode.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link href={`/qr-codes/${qrcode.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            <Link href={shortUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
