/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://pragadeesportfolio.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 50000,
  // Exclude metadata routes and API routes from sitemap
  exclude: [
    '/api/*',
    '/icon',
    '/icon.svg',
    '/apple-icon',
    '/opengraph-image',
    '/twitter-image',
    '/_not-found',
  ],
  // Configure priorities and change frequencies for routes
  transform: async (config, path) => {
    // List of routes to exclude from sitemap
    const excludedRoutes = [
      '/api',
      '/icon',
      '/icon.svg',
      '/apple-icon',
      '/opengraph-image',
      '/twitter-image',
      '/_not-found',
    ];
    
    // Skip excluded routes - return undefined to exclude from sitemap
    if (excludedRoutes.some(route => path === route || path.startsWith(route + '/'))) {
      return undefined;
    }
    
    // Home page gets highest priority
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    }
    
    // Default values for other pages
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};


