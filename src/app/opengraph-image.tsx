import { defaultAlt, defaultContentType, defaultSize, renderSocialImage } from '@/app/og/template';

export const alt = defaultAlt;
export const size = defaultSize;
export const contentType = defaultContentType;

export default async function Image() {
  return renderSocialImage({
    title: 'Pragadeeswaran K',
    subtitle: 'AI/ML Engineer',
  });
}
