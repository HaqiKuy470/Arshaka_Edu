import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/onboarding/',
        '/api/'
      ],
    },
    sitemap: 'https://edu.heyhaqi.my.id/sitemap.xml',
  };
}
