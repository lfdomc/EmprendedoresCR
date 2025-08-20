import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/protected/',
          '/auth/',
          '/api/',
          '/_next/',
          '/admin/',
          '/login',
          '/register',
          '/profile',
          '*.json',
          '/search?*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/protected/',
          '/auth/',
          '/api/',
          '/_next/',
          '/admin/',
          '/login',
          '/register',
          '/profile',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/protected/',
          '/auth/',
          '/api/',
          '/_next/',
          '/admin/',
          '/login',
          '/register',
          '/profile',
        ],
        crawlDelay: 1,
      }
    ],
    sitemap: `${defaultUrl}/sitemap.xml`,
    host: defaultUrl,
  }
}