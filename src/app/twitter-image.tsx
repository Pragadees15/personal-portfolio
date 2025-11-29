import { defaultAlt, defaultContentType, renderSocialImage } from '@/app/og/template';

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
