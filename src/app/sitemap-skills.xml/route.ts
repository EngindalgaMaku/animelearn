import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Use any-cast to avoid Prisma type staleness during dev; mirrors pattern used elsewhere
const p: any = prisma;

type UrlItem = {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: string;
};

export async function GET() {
  const baseUrl = "https://zumenzu.com";

  try {
    const skills = (await p.skill.findMany({
      select: {
        key: true,
        updatedAt: true,
        isActive: true,
      },
      orderBy: { updatedAt: "desc" },
    })) as Array<{
      key: string;
      updatedAt: Date | string;
      isActive?: boolean | null;
    }>;

    const activeSkills = skills.filter(
      (s) => s && s.key && s.isActive !== false
    );

    const urls: UrlItem[] = activeSkills.map((s) => {
      const lastMod =
        s.updatedAt instanceof Date
          ? s.updatedAt.toISOString()
          : new Date(s.updatedAt).toISOString();
      return {
        url: `/skills/${encodeURIComponent(s.key)}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: "0.8",
      };
    });

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
    console.error("Error generating skills sitemap:", error);

    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(fallback, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }
}
