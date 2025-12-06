import { defaultAlt, defaultContentType, renderSocialImage } from '@/app/og/template';

// Route segment config - cache for 1 hour (3600 seconds)
export const revalidate = 3600;

export const alt = defaultAlt;
export const size = { width: 1200, height: 1200 }; // Square format for Twitter
export const contentType = defaultContentType;

export default async function Image() {
  return renderSocialImage({
    width: 1200,
    height: 1200,
    title: 'Pragadeeswaran K',
    subtitle: 'AI/ML Engineer',
  });
}
