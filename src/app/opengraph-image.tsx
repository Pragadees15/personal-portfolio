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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // Match website theme: indigo-fuchsia-cyan gradient with dark background
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f23 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient blobs matching site theme */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-20%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Glassmorphism content card matching site style */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '56px',
            padding: '64px 80px',
            width: 'calc(100% - 80px)',
            height: 'calc(100% - 64px)',
            position: 'relative',
            zIndex: 1,
            // Glassmorphism effect matching site cards
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Avatar with gradient border matching site theme */}
          <div
            style={{
              position: 'relative',
              width: '260px',
              height: '260px',
            }}
          >
            {/* Gradient border matching site profile image style */}
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '28px',
                padding: '4px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
              />
            </div>
            <div
              style={{
                position: 'relative',
                width: '260px',
                height: '260px',
                borderRadius: '24px',
                border: '3px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <img
                src={avatarUrl}
                alt={profile.name}
                width={260}
                height={260}
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          {/* Text content with site-consistent styling */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1,
              minWidth: 0,
              maxWidth: '680px',
            }}
          >
            {/* Name with gradient text matching site */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: '800',
                margin: 0,
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #fce7f3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {profile.name}
            </h1>
            
            {/* Role badge matching site style */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '9999px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                width: 'fit-content',
                marginTop: '4px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
                }}
              />
              <div
                style={{
                  fontSize: '32px',
                  color: '#c7d2fe',
                  fontWeight: '600',
                }}
              >
                {profile.role}
              </div>
            </div>
            
            {/* Skills with site color scheme */}
            <div
              style={{
                fontSize: '22px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '20px',
                lineHeight: '1.6',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <span style={{ color: '#a78bfa' }}>Computer Vision</span>
              <span style={{ color: '#ffffff', opacity: 0.5 }}>•</span>
              <span style={{ color: '#ec4899' }}>Deep Learning</span>
              <span style={{ color: '#ffffff', opacity: 0.5 }}>•</span>
              <span style={{ color: '#06b6d4' }}>AI/ML Systems</span>
            </div>
            
            {/* CGPA badge matching site info tags */}
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontSize: '18px',
                  color: '#c7d2fe',
                }}
              >
                CGPA 9.31/10.0
              </div>
              <div
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  background: 'rgba(217, 70, 239, 0.15)',
                  border: '1px solid rgba(217, 70, 239, 0.3)',
                  fontSize: '18px',
                  color: '#f5d0fe',
                }}
              >
                B.Tech AI
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient accent matching site footer style */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
