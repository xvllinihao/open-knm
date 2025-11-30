import { MetadataRoute } from 'next';
import { articles } from '@/lib/articles';
import { locales } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static routes for each locale
  const staticRoutes = ['', '/knm', '/society', '/resources', '/life', '/about'];

  const now = new Date();

  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: absoluteUrl(`/${locale}${route}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  // 2. Article routes for each locale
  for (const article of articles) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: absoluteUrl(`/${locale}/articles/${article.slug}`),
        lastModified: now, // Ideally this comes from article data
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return sitemapEntries;
}

