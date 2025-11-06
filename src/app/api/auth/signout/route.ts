import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Sign out
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Signed out successfully',
    });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'An error occurred during sign out' },
      { status: 500 }
    );
  }
}
