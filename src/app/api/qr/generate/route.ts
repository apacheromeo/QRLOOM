import { NextRequest, NextResponse } from 'next/server';
import { QRCodeGenerator, isValidUrl } from '@/lib/qr-generator';
import { rateLimit } from '@/lib/redis';
import type { QRFormat } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const { success } = await rateLimit(ip, 20, 60); // 20 requests per minute

    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      dataUrl,
      format = 'png',
      foregroundColor = '#000000',
      backgroundColor = '#FFFFFF',
      logo = null,
    } = body;

    // Validate required fields
    if (!dataUrl) {
      return NextResponse.json(
        { error: 'Data URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!isValidUrl(dataUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats: QRFormat[] = ['png', 'svg', 'pdf'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be png, svg, or pdf' },
        { status: 400 }
      );
    }

    // Generate QR code
    const generator = new QRCodeGenerator({
      data: dataUrl,
      format,
      foregroundColor,
      backgroundColor,
      logo,
      width: 512,
      height: 512,
    });

    const blob = await generator.generate();

    // Convert blob to buffer for response
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Set appropriate content type
    const mimeType = QRCodeGenerator.getMimeType(format);

    // Return the generated QR code
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="qrcode.${QRCodeGenerator.getFileExtension(format)}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
