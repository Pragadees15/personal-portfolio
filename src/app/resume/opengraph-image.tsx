import { defaultAlt, defaultContentType, defaultSize, renderSocialImage } from '@/app/og/template';

// Route segment config - cache for 1 hour (3600 seconds)
export const revalidate = 3600;

export const alt = defaultAlt;
export const size = defaultSize;
export const contentType = defaultContentType;

export default async function Image() {
  return renderSocialImage({
    title: 'Resume — Pragadeeswaran K',
    subtitle: 'AI/ML Engineer',
  });
}


