import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all search engines
      {
        userAgent: '*',
        allow: '/',
      },
      // Allow AI crawlers (ChatGPT, Gemini, etc.)
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'GoogleOther',
        allow: '/',
      },
      {
        userAgent: ' anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      // Common AI training bots
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        userAgent: 'perplexitybot',
        allow: '/',
      },
      // Disallow admin/api routes
      {
        userAgent: '*',
        disallow: ['/api/', '/admin/', '/_next/', '/static/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
