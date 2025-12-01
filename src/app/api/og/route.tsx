import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?title=<title>
        const hasTitle = searchParams.has('title');
        const title = hasTitle
            ? searchParams.get('title')?.slice(0, 100)
            : 'QRLoom - Professional QR Generator';

        // ?description=<description>
        const hasDescription = searchParams.has('description');
        const description = hasDescription
            ? searchParams.get('description')?.slice(0, 200)
            : 'Create beautiful, trackable, and customizable QR codes in seconds.';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#030712', // dark background
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                            }}
                        >
                            {/* Logo Icon Mock */}
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: '#3b82f6' }} // blue-500
                            >
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M7 7h.01" />
                                <path d="M7 17h.01" />
                                <path d="M17 7h.01" />
                                <path d="M17 17h.01" />
                            </svg>
                            <span
                                style={{
                                    marginLeft: '16px',
                                    fontSize: 48,
                                    fontWeight: 800,
                                    background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                QRLoom
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: 60,
                                fontWeight: 900,
                                textAlign: 'center',
                                marginBottom: '20px',
                                lineHeight: 1.1,
                                backgroundImage: 'linear-gradient(90deg, #fff, #ccc)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                maxWidth: '800px',
                            }}
                        >
                            {title}
                        </div>
                        <div
                            style={{
                                fontSize: 30,
                                color: '#9ca3af', // gray-400
                                textAlign: 'center',
                                maxWidth: '800px',
                                lineHeight: 1.4,
                            }}
                        >
                            {description}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: unknown) {
        console.log(`${e}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
