import { Metadata, MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://open-knm.vercel.app/sitemap.xml', // Replace with your actual domain later
  };
}


