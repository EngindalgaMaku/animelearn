import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Temporary any-cast to avoid Prisma type staleness during dev (consistent with other routes)
const p: any = prisma;

export async function GET() {
  const baseUrl = "https://zumenzu.com";

  try {
    // Use most recent LearningActivity as the lastmod timestamp for the listing page
    const latest = await p.learningActivity.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    const lastModified = (
      latest?.updatedAt instanceof Date
        ? latest.updatedAt
        : latest?.updatedAt
          ? new Date(latest.updatedAt)
          : new Date()
    ).toISOString();

    // At present, only the listing page is public. Individual activity pages
    // will be added later; keep sitemap minimal and accurate.
    const urls = [
      {
        url: `/learning-activities`,
        lastModified,
        changeFrequency: "weekly",
        priority: "0.9",
      },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
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

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating activities sitemap:", error);

    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/learning-activities</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new NextResponse(fallback, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }
}
