import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const baseUrl = "https://zumenzu.com";

  try {
    // Fetch categories from database
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        updatedAt: true,
        cardCount: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // Category URLs
    const categoryUrls = categories.map((category) => ({
      url: `/shop?category=${category.slug}`,
      lastModified: category.updatedAt.toISOString(),
      changeFrequency: "weekly",
      priority:
        category.cardCount > 50
          ? "0.8"
          : category.cardCount > 20
            ? "0.7"
            : "0.6",
    }));

    // Learning category URLs
    const learningUrls = [
      {
        url: "/python-kursu",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.9",
      },
      {
        url: "/python-kursu/temel-seviye",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.8",
      },
      {
        url: "/python-kursu/orta-seviye",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.8",
      },
      {
        url: "/python-kursu/ileri-seviye",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.8",
      },
      {
        url: "/kart-koleksiyonu",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.8",
      },
      {
        url: "/kart-koleksiyonu/anime-collection",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.7",
      },
      {
        url: "/kart-koleksiyonu/star-collection",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.7",
      },
      {
        url: "/rozetler-basarimlar",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.7",
      },
      {
        url: "/gunluk-gorevler",
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: "0.8",
      },
    ];

    const allUrls = [...categoryUrls, ...learningUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating categories sitemap:", error);

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
    <loc>${baseUrl}/code-arena</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
