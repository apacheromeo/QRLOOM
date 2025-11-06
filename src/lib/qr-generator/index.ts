import QRCodeStyling from 'qr-code-styling';
import { jsPDF } from 'jspdf';
import type { QRCodeOptions, QRFormat } from '@/types';

export class QRCodeGenerator {
  private options: QRCodeOptions;

  constructor(options: QRCodeOptions) {
    this.options = {
      width: options.width || 512,
      height: options.height || 512,
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      ...options,
    };
  }

  async generate(): Promise<Blob> {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('QR code generation must run in browser environment');
    }

    const qrCode = new QRCodeStyling({
      width: this.options.width,
      height: this.options.height,
      data: this.options.data,
      dotsOptions: {
        color: this.options.foregroundColor || '#000000',
        type: 'rounded',
      },
      backgroundOptions: {
        color: this.options.backgroundColor || '#FFFFFF',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
      },
      qrOptions: {
        errorCorrectionLevel: this.options.errorCorrectionLevel,
      },
    });

    // Add logo if provided
    if (this.options.logo) {
      const logoUrl =
        typeof this.options.logo === 'string'
          ? this.options.logo
          : await this.fileToDataUrl(this.options.logo);

      qrCode.update({
        image: logoUrl,
      });
    }

    // Generate based on format
    switch (this.options.format) {
      case 'svg': {
        const data = await qrCode.getRawData('svg');
        if (!data) throw new Error('Failed to generate SVG QR code');
        return this.ensureBlob(data, 'image/svg+xml');
      }
      case 'pdf':
        return await this.generatePDF(qrCode);
      case 'png':
      default: {
        const data = await qrCode.getRawData('png');
        if (!data) throw new Error('Failed to generate PNG QR code');
        return this.ensureBlob(data, 'image/png');
      }
    }
  }

  private ensureBlob(data: Blob | Buffer, type: string): Blob {
    if (data instanceof Blob) {
      return data;
    }
    // Convert Buffer to Blob
    const arrayBuffer = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;
    return new Blob([arrayBuffer], { type });
  }

  private async generatePDF(qrCode: QRCodeStyling): Promise<Blob> {
    // Get PNG data first
    const pngData = await qrCode.getRawData('png');
    if (!pngData) throw new Error('Failed to generate PNG for PDF');
    const pngBlob = this.ensureBlob(pngData, 'image/png');
    const pngDataUrl = await this.blobToDataUrl(pngBlob);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 150;
    const imgHeight = 150;
    const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
    const y = 30;

    pdf.addImage(pngDataUrl, 'PNG', x, y, imgWidth, imgHeight);

    // Add metadata if available
    if (this.options.data) {
      pdf.setFontSize(10);
      pdf.text(this.options.data, x, y + imgHeight + 15, {
        maxWidth: imgWidth,
      });
    }

    return pdf.output('blob');
  }

  private async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static getFileExtension(format: QRFormat): string {
    return format === 'pdf' ? 'pdf' : format === 'svg' ? 'svg' : 'png';
  }

  static getMimeType(format: QRFormat): string {
    switch (format) {
      case 'svg':
        return 'image/svg+xml';
      case 'pdf':
        return 'application/pdf';
      case 'png':
      default:
        return 'image/png';
    }
  }
}

// Helper to generate short code for QR
export function generateShortCode(length: number = 8): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper to validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
