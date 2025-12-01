import QRCodeStyling from 'qr-code-styling';
import jsPDF from 'jspdf';
import type { QRCodeOptions, QRFormat } from '@/types';

export class QRCodeGenerator {
  private options: QRCodeOptions;
  private qrCode: QRCodeStyling;

  constructor(options: QRCodeOptions) {
    this.options = options;
    this.qrCode = new QRCodeStyling({
      width: options.width || 1024,
      height: options.height || 1024,
      data: options.data,
      image: options.logo instanceof File ? URL.createObjectURL(options.logo) : (options.logo as string),
      dotsOptions: {
        color: options.foregroundColor || '#000000',
        type: 'rounded'
      },
      backgroundOptions: {
        color: options.backgroundColor || '#ffffff',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
      }
    });
  }

  async generate(): Promise<Blob> {
    if (this.options.format === 'pdf') {
      const blob = await this.qrCode.getRawData('png');
      if (!blob) throw new Error('Failed to generate QR code');

      const pdf = new jsPDF();
      const imgUrl = URL.createObjectURL(blob as Blob);
      const imgProps = pdf.getImageProperties(imgUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      URL.revokeObjectURL(imgUrl);
      return pdf.output('blob');
    }

    // Cast format to string as QRCodeStyling expects specific strings but our type is stricter
    const blob = await this.qrCode.getRawData(this.options.format as 'png' | 'jpeg' | 'webp' | 'svg');
    if (!blob) throw new Error('Failed to generate QR code');
    return blob as Blob;
  }

  async generatePreview(): Promise<Blob> {
    // Always return PNG for preview
    const blob = await this.qrCode.getRawData('png');
    if (!blob) throw new Error('Failed to generate preview');
    return blob as Blob;
  }

  static getFileExtension(format: QRFormat): string {
    return format;
  }

  static getMimeType(format: QRFormat | string): string {
    switch (format) {
      case 'png': return 'image/png';
      case 'jpeg': return 'image/jpeg';
      case 'webp': return 'image/webp';
      case 'svg': return 'image/svg+xml';
      case 'pdf': return 'application/pdf';
      default: return 'image/png';
    }
  }
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
