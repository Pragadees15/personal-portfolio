import { NextResponse } from 'next/server';
import { profile } from '@/data/resume';

// Route segment config
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
    const githubUsername = (() => {
        const gh = profile.github;
        if (typeof gh === 'string' && gh.length > 0) {
            try {
                const u = new URL(gh);
                const m = (u.pathname || '').match(/\/([^\/]+)\/?$/);
                if (m && m[1]) return m[1];
            } catch {
                const m = gh.match(/\/([^\/]+)\/?$/);
                if (m && m[1]) return m[1];
            }
        }
        return 'Pragadees15';
    })();

    const avatarUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=400&v=4`;

    try {
        const response = await fetch(avatarUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 });
    }
}

