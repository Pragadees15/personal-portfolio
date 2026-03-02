/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 50000,
  autoLastmod: false,
  // Exclude metadata routes and API routes from sitemap
  exclude: [
    '/api/*',
    '/avatar',
    '/icon',
    '/icon.svg',
    '/apple-icon',
    '/opengraph-image',
    '/twitter-image',
    '/_not-found',
  ],
  // Configure priorities and change frequencies for routes
  transform: async (config, path) => {
    // Skip non-page routes and metadata image endpoints.
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
      path === '/_not-found'
    ) {
      return undefined;
    }
    
    // Home page gets highest priority
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: undefined,
      };
    }
    
    // Default values for other pages
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: undefined,
    };
  },
};


