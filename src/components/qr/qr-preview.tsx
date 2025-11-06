'use client';

import { useRef, useEffect } from 'react';
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    if (!options || !canvasRef.current) return;

    const generateQR = async () => {
      try {
        const generator = new QRCodeGenerator(options);
        const blob = await generator.generate();
        qrBlobRef.current = blob;

        // Display the QR code
        const url = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = url;
        img.className = 'w-full h-full object-contain';

        // Clear previous content
        if (canvasRef.current) {
          canvasRef.current.innerHTML = '';
          canvasRef.current.appendChild(img);
        }

        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
        // Show error to user
        if (canvasRef.current) {
          canvasRef.current.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <p class="text-sm text-red-500">Failed to generate QR code</p>
              <p class="text-xs text-muted-foreground">${error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          `;
        }
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
        <div
          ref={canvasRef}
          className="relative flex items-center justify-center w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
        >
          {isGenerating && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generating QR code...
              </p>
            </div>
          )}
          {!isGenerating && !options && (
            <div className="text-center p-6">
              <p className="text-sm text-muted-foreground">
                Enter a URL and customize your QR code to see the preview
              </p>
            </div>
          )}
        </div>

        {options && !isGenerating && (
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
