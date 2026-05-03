/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 50000,
  autoLastmod: true,
  exclude: [
    '/api/*',
    '/avatar',
    '/icon',
    '/icon.svg',
    '/apple-icon',
    '/opengraph-image',
    '/twitter-image',
    '/_not-found',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-*.xml',
  ],
  transform: async (config, path) => {
    if (
      path === '/avatar' ||
      path.startsWith('/api') ||
      path === '/icon' ||
      path === '/icon.svg' ||
      path === '/apple-icon' ||
      path === '/opengraph-image' ||
      path === '/twitter-image' ||
      path.endsWith('/opengraph-image') ||
      path.endsWith('/twitter-image') ||
      path === '/_not-found' ||
      path === '/robots.txt' ||
      path === '/sitemap.xml'
    ) {
      return undefined;
    }

    const lastmod = new Date().toISOString();

    if (path === '/') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod,
      };
    }

    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod,
    };
  },
};
