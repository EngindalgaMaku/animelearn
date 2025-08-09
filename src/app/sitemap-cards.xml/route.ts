import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const baseUrl = 'https://zumenzu.com';
  
  try {
    // Fetch cards from database
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        updatedAt: true,
        category: true,
        rarity: true
      },
      where: {
        isPublic: true, // Only include public cards
        isPurchasable: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Fetch categories for category-based URLs
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        updatedAt: true
      },
      where: {
        isActive: true
      }
    });

    const cardUrls = cards.map(card => ({
      url: `/cards/${card.id}`,
      lastModified: card.updatedAt.toISOString(),
      changeFrequency: 'weekly',
      priority: card.rarity === 'legendary' ? '0.8' :
               card.rarity === 'rare' ? '0.7' : '0.6'
    }));

    // Add category-based card listings
    const categoryUrls = categories.map(category => ({
      url: `/shop?category=${category.slug}`,
      lastModified: category.updatedAt.toISOString(),
      changeFrequency: 'weekly',
      priority: '0.7'
    }));

    // Add rarity-based listings
    const rarityUrls = [
      {
        url: '/shop?rarity=common',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: '0.6'
      },
      {
        url: '/shop?rarity=rare',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: '0.7'
      },
      {
        url: '/shop?rarity=legendary',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: '0.8'
      }
    ];

    const allUrls = [...cardUrls, ...categoryUrls, ...rarityUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('Error generating cards sitemap:', error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/shop</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/cards</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}