import { defaultContentType, defaultSize, renderSocialImage } from '@/app/og/template';

// Route segment config - cache for 1 hour (3600 seconds)
export const revalidate = 3600;

export const alt = 'Selected Work — Pragadeeswaran K, AI/ML Engineer';
export const size = defaultSize;
export const contentType = defaultContentType;

export default async function Image() {
  return renderSocialImage({
    title: 'Selected Work',
    subtitle: 'AI/ML & full-stack projects',
    sectionLabel: 'SELECTED WORK',
    italicWord: 'Work',
  });
}
