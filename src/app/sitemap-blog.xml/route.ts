import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseUrl = "https://zumenzu.com";
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    });

    const urls = posts.map((p) => {
      const lastMod = (
        p.updatedAt ??
        p.publishedAt ??
        new Date()
      ).toISOString();
      return {
        loc: `${baseUrl}/blog/${p.slug}`,
        lastMod,
        changeFreq: "monthly",
        priority: "0.7",
      };
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastMod}</lastmod>
    <changefreq>${u.changeFreq}</changefreq>
    <priority>${u.priority}</priority>
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
    console.error("Error generating blog sitemap:", error);
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
