import { MetadataRoute } from 'next';
import { services } from '@/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://langgananyuk.web.id';

  // Static routes
  const staticRoutes = ['', '/layanan', '/faq', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic service checkout routes (e.g. /checkout/netflix, /checkout/youtube)
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/checkout/${service.id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
