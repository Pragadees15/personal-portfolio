import { ImageResponse } from 'next/og';
import { profile } from '@/data/resume';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
  const githubUsername = profile.github?.split('/').pop() || 'Pragadees15';
  // Use the standard GitHub avatar URL format
  const avatarUrl = `https://github.com/${githubUsername}.png?size=128`;
  
  // Fetch the avatar image and convert to base64 data URL
  // This ensures the image is accessible during server-side rendering
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
    // Fallback: try avatars.githubusercontent.com format
    const fallbackUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=128&v=4`;
    console.warn('Failed to fetch avatar from github.com, trying fallback:', error);
    avatarDataUrl = fallbackUrl;
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
          borderRadius: '6px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
          padding: '2px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
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
            width={32}
            height={32}
            style={{
              objectFit: 'cover',
              borderRadius: '4px',
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

