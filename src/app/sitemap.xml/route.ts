import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://zumenzu.com";
  const now = new Date().toISOString();
  const sitemaps = [
    "/sitemap-pages.xml",
    "/sitemap-blog.xml",
    "/sitemap-cards.xml",
    "/sitemap-categories.xml",
    "/sitemap-skills.xml",
    "/sitemap-topics.xml",
    "/sitemap-activities.xml",
  ];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (path) => `  <sitemap>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
