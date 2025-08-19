import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Temporary any-cast as used elsewhere to avoid Prisma type staleness during dev
const p: any = prisma;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function parseTags(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((t) => typeof t === "string");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((t) => typeof t === "string");
      }
    } catch {
      // fallback: split by comma
      return raw
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

type UrlItem = {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: string;
};

export async function GET() {
  const baseUrl = "https://zumenzu.com";

  try {
    // Collect topics from LearningActivity tags
    const activities = (await p.learningActivity.findMany({
      where: { isActive: true },
      select: { tags: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })) as Array<{ tags: string | null; updatedAt: Date | string }>;

    // Collect topics also from QuizCategory.name
    const quizCategories = (await p.quizCategory.findMany({
      where: { isActive: true },
      select: { name: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })) as Array<{ name: string; updatedAt: Date | string }>;

    // Aggregate into topic map: slug -> lastModified (max)
    const topicMap = new Map<string, Date>();

    for (const a of activities) {
      const tags = parseTags(a.tags);
      const lastMod =
        a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
      for (const tag of tags) {
        const slug = slugify(tag);
        if (!slug) continue;
        const prev = topicMap.get(slug);
        if (!prev || lastMod > prev) topicMap.set(slug, lastMod);
      }
    }

    for (const qc of quizCategories) {
      const slug = slugify(qc.name);
      if (!slug) continue;
      const lastMod =
        qc.updatedAt instanceof Date ? qc.updatedAt : new Date(qc.updatedAt);
      const prev = topicMap.get(slug);
      if (!prev || lastMod > prev) topicMap.set(slug, lastMod);
    }

    // Build URL entries
    const urls: UrlItem[] = Array.from(topicMap.entries()).map(
      ([slug, lastDate]) => ({
        url: `/topics/${encodeURIComponent(slug)}`,
        lastModified: lastDate.toISOString(),
        changeFrequency: "weekly",
        priority: "0.8",
      })
    );

    // XML output
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
    console.error("Error generating topics sitemap:", error);

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
