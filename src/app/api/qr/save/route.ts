import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

/**
 * POST /api/qr/save
 * Save a generated QR code to the database
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to save QR codes.' },
        { status: 401 }
      );
    }

    // Get user's profile to check plan limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    // Check QR code count limit
    const { count } = await supabase
      .from('qrcodes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .neq('status', 'deleted');

    const qrCount = count || 0;

    // Free plan limit: 10 QR codes
    if (profile?.plan === 'free' && qrCount >= 10) {
      return NextResponse.json(
        {
          error: 'QR code limit reached. Upgrade to Pro for unlimited QR codes.',
          limit: 10,
          current: qrCount,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      dataUrl,
      title,
      description,
      format = 'png',
      foregroundColor = '#000000',
      backgroundColor = '#FFFFFF',
      logoUrl = null,
      isDynamic = false,
      redirectUrl = null,
    } = body;

    // Validate required fields
    if (!dataUrl) {
      return NextResponse.json(
        { error: 'Data URL is required' },
        { status: 400 }
      );
    }

    // Generate unique short code
    const shortCode = nanoid(10);

    // Create QR code record
    const { data: qrcode, error: insertError } = await supabase
      .from('qrcodes')
      .insert({
        user_id: user.id,
        data_url: dataUrl,
        short_code: shortCode,
        title: title || 'Untitled QR Code',
        description: description || null,
        format,
        foreground_color: foregroundColor,
        background_color: backgroundColor,
        logo_url: logoUrl,
        is_dynamic: isDynamic,
        redirect_url: redirectUrl || dataUrl,
        status: 'active',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving QR code:', insertError);
      return NextResponse.json(
        { error: 'Failed to save QR code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'QR code saved successfully',
      qrcode,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/r/${shortCode}`,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
