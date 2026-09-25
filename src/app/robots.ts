import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/_next/', '/d7f3k9x2'],
      },
    ],
    sitemap: 'https://industrialcompanymatheo.com/sitemap.xml',
  }
}