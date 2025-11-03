import { ImageResponse } from 'next/og';
import { profile, researchInterests } from '@/data/resume';

export type SocialImageOptions = {
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  subtitle?: string;
  avatarUrl?: string;
};

export async function renderSocialImage(opts: SocialImageOptions = {}) {
  const {
    width = 1200,
    height = 630,
    alt = 'Social image',
    title = profile.name,
    subtitle = (profile as any).role || 'AI/ML Engineer',
    avatarUrl: avatarOverride,
  } = opts;

  let fontData: ArrayBuffer | null = null;
  let fontName = 'Inter';

  try {
    const res = await fetch('https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.ttf', {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (res.ok) {
      fontData = await res.arrayBuffer();
      fontName = 'Inter';
    }
  } catch {}

  if (!fontData) {
    try {
      const res = await fetch('https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.ttf', {
        next: { revalidate: 86400 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (res.ok) {
        fontData = await res.arrayBuffer();
        fontName = 'Inter';
      }
    } catch {}
  }

  if (!fontData) {
    try {
      const res = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', {
        next: { revalidate: 86400 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (res.ok) {
        fontData = await res.arrayBuffer();
        fontName = 'Roboto';
      }
    } catch {}
  }

  if (!fontData) {
    throw new Error('Failed to load font for social image');
  }

  const githubUsername = profile.github?.split('/').pop() || 'Pragadees15';
  const fallbackAvatar = `https://github.com/${githubUsername}.png?size=400`;
  const srcUrl = avatarOverride || fallbackAvatar;
  const tags = Array.isArray(researchInterests) ? researchInterests.slice(0, 4) : [] as string[];

  let avatarDataUrl = srcUrl;
  try {
    const avatarResponse = await fetch(srcUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    });
    if (avatarResponse.ok) {
      const arrayBuffer = await avatarResponse.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      const base64 = btoa(binary);
      const contentType = avatarResponse.headers.get('content-type') || 'image/png';
      avatarDataUrl = `data:${contentType};base64,${base64}`;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          background: '#0b0b12',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              'radial-gradient(60% 60% at 50% 35%, rgba(88, 28, 135, 0.25) 0%, rgba(0,0,0,0) 60%), radial-gradient(60% 60% at 60% 70%, rgba(37, 99, 235, 0.25) 0%, rgba(0,0,0,0) 60%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px, 24px 24px',
            opacity: 0.35,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '32px 40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                position: 'relative',
                width: 84,
                height: 84,
                borderRadius: 20,
                overflow: 'hidden',
                border: '3px solid rgba(255,255,255,0.18)',
                boxShadow: '0 10px 30px rgba(99,102,241,0.35)',
              }}
            >
              <img src={avatarDataUrl} width={84} height={84} style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: 'white',
                  fontFamily: fontName,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#c7d2fe',
                  fontFamily: fontName,
                }}
              >
                {subtitle}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              fontFamily: fontName,
            }}
          >
            pragadeesportfolio.vercel.app
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              maxWidth: 980,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 74,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: -1.6,
                fontFamily: fontName,
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 45%, #f5d0fe 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {profile.name}
            </div>
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
                fontFamily: fontName,
              }}
            >
              B.Tech AI • CGPA 9.31/10 • Computer Vision • Deep Learning • AI/ML Systems
            </div>
            <div
              style={{
                display: 'flex',
                alignSelf: 'center',
                height: 4,
                width: 320,
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
                borderRadius: 9999,
                marginTop: 6,
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 4,
              }}
            >
              {tags.map((t) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    padding: '6px 14px',
                    borderRadius: 9999,
                    border: '1px solid rgba(255,255,255,0.16)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: fontName,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
          }}
        />
      </div>
    ),
    {
      width,
      height,
      fonts: [
        { name: fontName, data: fontData, style: 'normal', weight: 400 },
        { name: fontName, data: fontData, style: 'normal', weight: 600 },
        { name: fontName, data: fontData, style: 'normal', weight: 700 },
        { name: fontName, data: fontData, style: 'normal', weight: 800 },
      ],
    }
  );
}

export const defaultAlt = 'Pragadeeswaran K - AI/ML Engineer';
export const defaultSize = { width: 1200, height: 630 };
export const defaultContentType = 'image/png';


