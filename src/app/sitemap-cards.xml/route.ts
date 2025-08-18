import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const baseUrl = "https://zumenzu.com";

  try {
    // Fetch cards from database
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        updatedAt: true,
        category: true,
        rarity: true,
      },
      where: {
        isPublic: true, // Only include public cards
        isPurchasable: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // No individual card detail pages exist; include only canonical listing URL
    const cardUrls = [
      {
        url: `/shop`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: "0.9",
      },
    ];

    // De-duplicate in case future additions add more URLs
    const allUrls = [...cardUrls];

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
    console.error("Error generating cards sitemap:", error);

    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/shop</loc>
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
