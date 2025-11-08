import { ImageResponse } from 'next/og';
import { profile } from '@/data/resume';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default async function AppleIcon() {
  const githubUsername = (() => {
    const gh = (profile as any)?.github;
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
  // Use the standard GitHub avatar URL format (avatars.githubusercontent.com)
  const avatarUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=400&v=4`;
  
  // Fetch the avatar image and convert to base64 data URL
  let avatarDataUrl = avatarUrl;
  try {
    const avatarResponse = await fetch(avatarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 3600 },
    });
    if (avatarResponse.ok) {
      const arrayBuffer = await avatarResponse.arrayBuffer();
      // Convert ArrayBuffer to base64
      const bytes = new Uint8Array(arrayBuffer);
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      const base64 = btoa(binary);
      const contentType = avatarResponse.headers.get('content-type') || 'image/png';
      avatarDataUrl = `data:${contentType};base64,${base64}`;
    }
  } catch (error) {
    // Silently fallback to original URL - Next.js will handle the image
    // Only log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to fetch avatar for Apple icon:', error);
    }
    avatarDataUrl = avatarUrl;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
          padding: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '32px',
            overflow: 'hidden',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={avatarDataUrl}
            alt={profile.name}
            width={180}
            height={180}
            style={{
              objectFit: 'cover',
              borderRadius: '32px',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

