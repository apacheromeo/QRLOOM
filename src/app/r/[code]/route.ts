import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    // MOCK DATA LOOKUP
    // In a real app, this would query Supabase for the short_code
    const mockDatabase: Record<string, string> = {
        'abc': 'https://example.com',
        'def': 'https://google.com',
        'ghi': 'https://github.com',
        'qrloom': 'https://qrloom.com',
    };

    const destinationUrl = mockDatabase[code];

    if (destinationUrl) {
        // In a real app, we would also increment the scan count here asynchronously
        // await supabase.rpc('increment_scan_count', { qr_id: ... });

        return NextResponse.redirect(destinationUrl);
    }

    // If code not found, redirect to 404 or home
    return NextResponse.redirect(new URL('/', request.url));
}
