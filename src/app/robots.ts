import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://langgananyuk.web.id';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/gexxa', // Block admin panel from crawling for security
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
