import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://industrialcompanymatheo.com/sitemap.xml',
  }
}