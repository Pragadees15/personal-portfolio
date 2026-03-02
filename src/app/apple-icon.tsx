import { ImageResponse } from 'next/og';
import { profile } from '@/data/resume';
import { fetchAvatarDataUrl } from '@/lib/avatarDataUrl';
import { getGithubUsernameFromUrl } from '@/lib/github';
/* eslint-disable @next/next/no-img-element */

// Route segment config - cache for 1 hour (3600 seconds)
export const revalidate = 3600;

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default async function AppleIcon() {
  const githubUsername = getGithubUsernameFromUrl(profile.github);
  // Use the standard GitHub avatar URL format (avatars.githubusercontent.com)
  const avatarUrl = `https://avatars.githubusercontent.com/${githubUsername}?size=400&v=4`;

  // Fetch the avatar image and convert to base64 data URL
  const avatarDataUrl = await fetchAvatarDataUrl(avatarUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    next: { revalidate: 3600 },
  });

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
            width="100%"
            height="100%"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
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

