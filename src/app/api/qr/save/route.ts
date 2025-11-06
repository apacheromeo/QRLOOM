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

    // Get user's subscription to check plan limits
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .single();

    const tier = subscription?.tier || 'free';
    const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

    // If subscription is not active and not free, downgrade to free
    const effectiveTier = isActive ? tier : 'free';

    // Get current period usage
    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const { data: usage } = await supabase
      .from('usage_records')
      .select('qr_codes_created')
      .eq('user_id', user.id)
      .gte('period_start', periodStart.toISOString())
      .single();

    const currentUsage = usage?.qr_codes_created || 0;

    // Define limits based on tier
    const limits: Record<string, number> = {
      free: 10,
      pro: 1000,
      enterprise: -1, // unlimited
    };

    const limit = limits[effectiveTier];

    // Check if user has reached limit (-1 means unlimited)
    if (limit !== -1 && currentUsage >= limit) {
      return NextResponse.json(
        {
          error: `QR code limit reached. You've created ${currentUsage} of ${limit} QR codes this month. ${
            effectiveTier === 'free' ? 'Upgrade to Pro for 1,000 QR codes per month.' : 'Upgrade your plan for more QR codes.'
          }`,
          limit,
          current: currentUsage,
          tier: effectiveTier,
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

    // Increment usage counter
    const { error: usageError } = await supabase.rpc('increment_usage', {
      p_user_id: user.id,
      p_usage_type: 'qr_codes_created',
    });

    if (usageError) {
      console.error('Error updating usage:', usageError);
      // Don't fail the request if usage update fails
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
