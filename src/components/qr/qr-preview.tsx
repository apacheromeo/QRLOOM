'use client';

import { useRef, useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { downloadFile } from '@/lib/utils';
import { QRCodeGenerator } from '@/lib/qr-generator';
import type { QRCodeOptions } from '@/types';

interface QRPreviewProps {
  options: QRCodeOptions | null;
  isGenerating?: boolean;
  onDownload?: () => void;
}

export function QRPreview({
  options,
  isGenerating = false,
  onDownload,
}: QRPreviewProps) {
  const qrBlobRef = useRef<Blob | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    if (!options) {
      setQrImageUrl(null);
      setError(null);
      return;
    }

    const generateQR = async () => {
      try {
        setError(null);
        const generator = new QRCodeGenerator(options);
        const blob = await generator.generate();
        qrBlobRef.current = blob;

        // Create object URL for display
        const url = URL.createObjectURL(blob);
        setQrImageUrl(url);

        // Cleanup function
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
        setQrImageUrl(null);
      }
    };

    generateQR();
  }, [options]);

  const handleDownload = () => {
    if (!qrBlobRef.current || !options) return;

    const extension = QRCodeGenerator.getFileExtension(options.format);
    const filename = `qrcode-${Date.now()}.${extension}`;

    downloadFile(qrBlobRef.current, filename);
    onDownload?.();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative flex items-center justify-center w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          {isGenerating && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generating QR code...
              </p>
            </div>
          )}

          {!isGenerating && !options && !error && (
            <div className="text-center p-6">
              <p className="text-sm text-muted-foreground">
                Enter a URL and customize your QR code to see the preview
              </p>
            </div>
          )}

          {!isGenerating && error && (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-sm text-red-500">Failed to generate QR code</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          )}

          {!isGenerating && qrImageUrl && !error && (
            <img
              src={qrImageUrl}
              alt="QR Code Preview"
              className="w-full h-full object-contain p-4"
            />
          )}
        </div>

        {options && !isGenerating && qrImageUrl && (
          <Button
            onClick={handleDownload}
            className="w-full"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Download {options.format.toUpperCase()}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
