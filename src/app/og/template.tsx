import { ImageResponse } from 'next/og';
import { profile } from '@/data/resume';
import { fetchAvatarDataUrl } from '@/lib/avatarDataUrl';

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
    subtitle = profile.role || 'AI/ML Engineer',
    avatarUrl: avatarOverride,
  } = opts;

  // Calculate responsive sizes based on dimensions
  const aspectRatio = width / height;
  const isWide = aspectRatio > 1.5; // Wider than 1.5:1
  const isSquare = aspectRatio > 0.9 && aspectRatio < 1.1; // Square-ish
  const isTall = aspectRatio < 0.8; // Taller format

  // Scale factors based on base size (1200x630)
  const scale = Math.min(width / 1200, height / 630);
  const baseScale = Math.min(scale, 1.2); // Cap scaling for very large images

  // Responsive sizing
  const avatarSize = Math.round(180 * baseScale);
  const titleFontSize = Math.round(68 * baseScale);
  const subtitleFontSize = Math.round(32 * baseScale);
  const detailFontSize = Math.round(24 * baseScale);
  const padding = Math.round(60 * baseScale);
  const horizontalPadding = Math.round(80 * baseScale);
  const gap = Math.round(40 * baseScale);
  const contentGap = Math.round(14 * baseScale);

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
  } catch {
    // Font loading failed, will try next fallback
  }

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
    } catch {
      // Font loading failed, will try next fallback
    }
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
    } catch {
      // Font loading failed, will throw error below if all fallbacks fail
    }
  }

  if (!fontData) {
    throw new Error('Failed to load font for social image');
  }

  const githubUsername = profile.github?.split('/').pop() || 'Pragadees15';
  const fallbackAvatar = `https://avatars.githubusercontent.com/${githubUsername}?size=400&v=4`;
  const srcUrl = avatarOverride || fallbackAvatar;

  // Fetch avatar and convert to data URL for ImageResponse
  let avatarDataUrl: string = srcUrl;
  try {
    const fetched = await fetchAvatarDataUrl(srcUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    });
    if (fetched && fetched.startsWith('data:')) {
      avatarDataUrl = fetched;
    } else {
      const response = await fetch(srcUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 3600 },
      });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        let base64: string;
        if (typeof Buffer !== 'undefined') {
          base64 = Buffer.from(arrayBuffer).toString('base64');
        } else {
          const bytes = new Uint8Array(arrayBuffer);
          let binary = '';
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          base64 = btoa(binary);
        }
        const contentType = response.headers.get('content-type') || 'image/png';
        avatarDataUrl = `data:${contentType};base64,${base64}`;
      }
    }
  } catch (error) {
    console.warn('Failed to convert avatar to data URL, using direct URL:', error);
  }

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
          background: '#000000',
          position: 'relative',
          padding: `${Math.round(padding * 1.2)}px ${horizontalPadding}px`,
          overflow: 'hidden',
        }}
        aria-label={alt}
      >
        {/* Subtle ambient light - Apple style */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-20%',
            width: `${Math.round(800 * baseScale)}px`,
            height: `${Math.round(800 * baseScale)}px`,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 30%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-25%',
            left: '-15%',
            width: `${Math.round(700 * baseScale)}px`,
            height: `${Math.round(700 * baseScale)}px`,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />

        {/* Avatar - Clean Apple style */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: Math.round(avatarSize * 1.1),
            height: Math.round(avatarSize * 1.1),
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            marginBottom: `${Math.round(gap * 1.2)}px`,
            border: `${Math.round(2 * baseScale)}px solid rgba(255, 255, 255, 0.1)`,
            boxShadow: `0 ${Math.round(20 * baseScale)}px ${Math.round(60 * baseScale)}px rgba(0, 0, 0, 0.5), 0 0 ${Math.round(1 * baseScale)}px rgba(255, 255, 255, 0.1)`,
          }}
        >
          <img
            src={avatarDataUrl}
            alt={profile.name}
            width={Math.round(avatarSize * 1.1)}
            height={Math.round(avatarSize * 1.1)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Content - Apple typography style */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: `${Math.round(contentGap * 1.3)}px`,
            position: 'relative',
            textAlign: 'center',
            maxWidth: `${Math.round(1000 * baseScale)}px`,
            padding: `0 ${Math.round(40 * baseScale)}px`,
          }}
        >
          {/* Name - Clean white, Apple style */}
          <div
            style={{
              fontSize: Math.round(titleFontSize * 1.05),
              fontWeight: 700,
              letterSpacing: `${-1.5 * baseScale}px`,
              color: '#ffffff',
              fontFamily: fontName,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          {/* Role - Subtle gray, Apple style */}
          <div
            style={{
              fontSize: Math.round(subtitleFontSize * 0.9),
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: fontName,
              letterSpacing: `${-0.3 * baseScale}px`,
            }}
          >
            {subtitle}
          </div>

          {/* Achievement - Glassmorphic card, Apple style */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: `${Math.round(16 * baseScale)}px`,
              padding: `${Math.round(14 * baseScale)}px ${Math.round(28 * baseScale)}px`,
              borderRadius: `${Math.round(12 * baseScale)}px`,
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              boxShadow: `0 ${Math.round(8 * baseScale)}px ${Math.round(32 * baseScale)}px rgba(0, 0, 0, 0.3)`,
            }}
          >
            <div
              style={{
                fontSize: Math.round(detailFontSize * 0.95),
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: fontName,
                letterSpacing: `${-0.2 * baseScale}px`,
              }}
            >
              B.Tech AI • CGPA 9.31/10
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        { name: fontName, data: fontData, style: 'normal', weight: 400 },
        { name: fontName, data: fontData, style: 'normal', weight: 600 },
        { name: fontName, data: fontData, style: 'normal', weight: 800 },
      ],
    }
  );
}

export const defaultAlt = 'Pragadeeswaran K - AI/ML Engineer';
export const defaultSize = { width: 1200, height: 630 };
export const defaultContentType = 'image/png';


