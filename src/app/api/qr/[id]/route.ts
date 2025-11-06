import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/qr/[id]
 * Get a single QR code by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Fetch QR code
    const { data: qrcode, error } = await supabase
      .from('qrcodes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !qrcode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ qrcode });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/qr/[id]
 * Update a QR code
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Allowed fields to update
    const allowedFields = [
      'title',
      'description',
      'status',
      'foreground_color',
      'background_color',
      'logo_url',
      'redirect_url',
      'is_dynamic',
    ];

    // Filter only allowed fields
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update QR code
    const { data: qrcode, error } = await supabase
      .from('qrcodes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !qrcode) {
      return NextResponse.json(
        { error: 'Failed to update QR code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ qrcode });
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/qr/[id]
 * Delete or archive a QR code
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      // Permanently delete
      const { error } = await supabase
        .from('qrcodes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to delete QR code' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'QR code deleted permanently' });
    } else {
      // Soft delete (archive)
      const { data: qrcode, error } = await supabase
        .from('qrcodes')
        .update({ status: 'deleted' })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error || !qrcode) {
        return NextResponse.json(
          { error: 'Failed to archive QR code' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'QR code archived',
        qrcode
      });
    }
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
