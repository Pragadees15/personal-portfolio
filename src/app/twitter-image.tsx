import { ImageResponse } from 'next/og';
import { profile } from '@/data/resume';

export const alt = 'Pragadeeswaran K - AI/ML Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const githubUsername = profile.github?.split('/').pop() || 'Pragadees15';
  const avatarUrl = `https://github.com/${githubUsername}.png?size=400`;

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.3) 0%, transparent 50%)',
          }}
        />
        
        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
            padding: '80px',
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Avatar - Using direct URL */}
          <div
            style={{
              display: 'flex',
              width: '280px',
              height: '280px',
              borderRadius: '24px',
              border: '8px solid rgba(255, 255, 255, 0.9)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <img
              src={avatarUrl}
              alt={profile.name}
              width={280}
              height={280}
              style={{
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Text content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              minWidth: 0,
              maxWidth: '700px',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                lineHeight: '1.1',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {profile.name}
            </h1>
            <div
              style={{
                fontSize: '36px',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: '600',
                marginTop: '8px',
              }}
            >
              {profile.role}
            </div>
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.85)',
                marginTop: '16px',
                lineHeight: '1.5',
              }}
            >
              Computer Vision • Deep Learning • AI/ML Systems
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
