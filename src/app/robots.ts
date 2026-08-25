import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.FRONTEND_URL || 'https://akodfood.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/profile', '/orders', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
