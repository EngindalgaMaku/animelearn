import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zumenzu.com'
  
  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/learn',
    '/features',
    '/dashboard',
    '/register',
    '/login',
    '/contact',
    '/privacy',
    '/terms',
    '/badges',
    '/quests',
    '/my-cards',
    '/profile',
    '/code-arena',
    '/learning-journey',
    '/battle', // ✅ Yeni eklenen battle sistemi
  ]

  const staticUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
    priority: path === '' ? 1 : 
             path.includes('shop') || path.includes('learn') ? 0.9 : 
             path.includes('battle') ? 0.85 : 0.8, // Battle sistemi yüksek öncelik
  }))

  return staticUrls
}
