import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://zumenzu.com";

  // Static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: "",
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: "1.0",
    },
    {
      url: "/login",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: "0.8",
    },
    {
      url: "/register",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: "0.7",
    },
    {
      url: "/shop",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.9",
    },
    {
      url: "/code-arena",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.9",
    },
    {
      url: "/quiz-arena",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.8",
    },
    {
      url: "/blog",
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: "0.8",
    },
    {
      url: "/achievements",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.6",
    },
    {
      url: "/badges",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.6",
    },
    {
      url: "/card-packs",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.7",
    },
    {
      url: "/cards",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.7",
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
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
}
