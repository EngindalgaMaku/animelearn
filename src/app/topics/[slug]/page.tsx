import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { SchemaMarkup, FAQSchema } from "@/components/seo/SchemaMarkup";
import { generateMetadata as buildMeta } from "@/lib/seo/metadata";

// Temporary any-cast to avoid Prisma type staleness during dev (consistent pattern used elsewhere)
const p: any = prisma;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ""))
    .join(" ");
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
      // fallback: comma-separated
      return raw
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function difficultyLabel(d?: number | null) {
  const n = d ?? 1;
  if (n <= 1) return "Beginner";
  if (n === 2) return "Intermediate";
  return "Advanced";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Try to infer a "display name" from either activities' tags or quiz categories
    const [activities, quizCats] = await Promise.all([
      p.learningActivity.findMany({
        where: { isActive: true },
        select: { tags: true },
        take: 50,
      }),
      p.quizCategory.findMany({
        where: { isActive: true },
        select: { name: true },
        take: 50,
      }),
    ]);

    let displayName: string | null = null;

    for (const a of activities ?? []) {
      const tags = parseTags(a.tags);
      for (const t of tags) {
        if (slugify(t) === slug) {
          displayName = t;
          break;
        }
      }
      if (displayName) break;
    }

    if (!displayName) {
      for (const qc of quizCats ?? []) {
        if (slugify(qc.name) === slug) {
          displayName = qc.name;
          break;
        }
      }
    }

    const topicName = displayName || titleCaseFromSlug(slug);
    const title = `${topicName} | Python Topic - Zumenzu`;
    const description = `Learn ${topicName} with interactive Python activities and quizzes. Practice ${topicName} concepts on Zumenzu.`;

    return buildMeta({
      title,
      description,
      keywords: [
        "python",
        "python topic",
        "interactive coding",
        "learning activities",
        topicName.toLowerCase(),
      ],
      canonical: `/topics/${encodeURIComponent(slug)}`,
      openGraph: {
        title,
        description,
        type: "website",
        image: "/og-image.jpg",
      },
    });
  } catch {
    return {
      title: "Topic | Zumenzu",
      robots: { index: true, follow: true },
    };
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch all relevant activities and quiz categories to assemble the topic view
  const [dbActivities, quizCategories] = await Promise.all([
    p.learningActivity.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        estimatedMinutes: true,
        tags: true,
        updatedAt: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    }),
    p.quizCategory.findMany({
      where: { isActive: true },
      select: { name: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  // Strongly type the activity shape to avoid implicit any and generic issues
  type ActivityForTopic = {
    id: string;
    title: string;
    category: string | null;
    difficulty: number | null;
    estimatedMinutes: number | null;
    tags: string | null | string[];
    updatedAt: Date | string;
    sortOrder: number | null;
  };

  // Filter activities whose tags normalize to the requested slug
  const activities: ActivityForTopic[] = (dbActivities as ActivityForTopic[])
    .filter((a) => {
      const tags = parseTags(a.tags);
      return tags.some((t) => slugify(t) === slug);
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Resolve topic display name and last updated
  let topicName: string | null = null;
  for (const a of activities) {
    const tags = parseTags(a.tags);
    for (const t of tags) {
      if (slugify(t) === slug) {
        topicName = t;
        break;
      }
    }
    if (topicName) break;
  }
  if (!topicName) {
    const qc = (
      quizCategories as Array<{ name: string; updatedAt: Date | string }>
    ).find((q) => slugify(q.name) === slug);
    topicName = qc?.name ?? titleCaseFromSlug(slug);
  }

  const lastUpdatedDate: Date =
    activities.length > 0
      ? activities.reduce<Date>((acc, a) => {
          const d =
            a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
          return d > acc ? d : acc;
        }, new Date(0))
      : new Date();

  // Group by difficulty for UI
  const byDifficulty: Record<number, typeof activities> = {
    1: [],
    2: [],
    3: [],
  };
  for (const a of activities) {
    const d = Math.max(1, Math.min(3, a.difficulty ?? 1));
    byDifficulty[d].push(a);
  }

  // Build ItemList schema
  const itemListSchema =
    activities.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${topicName} - Activities`,
          itemListOrder: "http://schema.org/ItemListOrderAscending",
          numberOfItems: activities.length,
          itemListElement: activities.map((a: any, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: a.title,
            // Anchor to activity section of the topic page
            item: `https://zumenzu.com/topics/${encodeURIComponent(slug)}#act-${a.id}`,
          })),
        }
      : null;

  // Minimal FAQ for a topic; can be extended with admin-sourced content
  const faqs = [
    {
      question: `What is ${topicName}?`,
      answer: `Learn core concepts of ${topicName} with hands-on Python activities and quizzes.`,
    },
    {
      question: `How do I practice ${topicName}?`,
      answer:
        activities.length > 0
          ? `Start with the beginner activities and progress to intermediate and advanced. There are ${activities.length} activities for this topic.`
          : `We are preparing activities for ${topicName}. Please check back soon.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* JSON-LD */}
      {itemListSchema ? <SchemaMarkup schema={itemListSchema} /> : null}
      <FAQSchema faqs={faqs} />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-slate-500">Python Topic</div>
          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            {topicName}
          </h1>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex rounded-full border border-slate-200 px-2 py-0.5 text-slate-700">
              Activities: {activities.length}
            </span>
            <span className="inline-flex rounded-full border border-slate-200 px-2 py-0.5 text-slate-700">
              Updated: {lastUpdatedDate.toLocaleDateString("tr-TR")}
            </span>
          </div>
          <p className="text-slate-700">
            Practice {topicName} with interactive coding activities and short
            quizzes. Build muscle memory and master concepts step by step.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Activities by Difficulty
          </h2>

          {/* Beginner */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Beginner
            </h3>
            {byDifficulty[1].length === 0 ? (
              <div className="text-sm text-slate-600">
                No beginner activities yet.
              </div>
            ) : (
              <div className="divide-y">
                {byDifficulty[1].map((a: any) => (
                  <div
                    key={a.id}
                    id={`act-${a.id}`}
                    className="grid grid-cols-12 gap-3 py-3"
                  >
                    <div className="col-span-8">
                      <div className="font-medium text-slate-900">
                        {a.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {a.category || "General"} •{" "}
                        {difficultyLabel(a.difficulty)}
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-sm text-slate-600">
                      {a.estimatedMinutes ? `${a.estimatedMinutes} min` : "-"}
                    </div>
                    <div className="col-span-2 text-right">
                      <Link
                        href="/learning-activities"
                        className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-800 hover:bg-slate-50"
                      >
                        Practice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Intermediate */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Intermediate
            </h3>
            {byDifficulty[2].length === 0 ? (
              <div className="text-sm text-slate-600">
                No intermediate activities yet.
              </div>
            ) : (
              <div className="divide-y">
                {byDifficulty[2].map((a: any) => (
                  <div
                    key={a.id}
                    id={`act-${a.id}`}
                    className="grid grid-cols-12 gap-3 py-3"
                  >
                    <div className="col-span-8">
                      <div className="font-medium text-slate-900">
                        {a.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {a.category || "General"} •{" "}
                        {difficultyLabel(a.difficulty)}
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-sm text-slate-600">
                      {a.estimatedMinutes ? `${a.estimatedMinutes} min` : "-"}
                    </div>
                    <div className="col-span-2 text-right">
                      <Link
                        href="/learning-activities"
                        className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-800 hover:bg-slate-50"
                      >
                        Practice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advanced */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Advanced
            </h3>
            {byDifficulty[3].length === 0 ? (
              <div className="text-sm text-slate-600">
                No advanced activities yet.
              </div>
            ) : (
              <div className="divide-y">
                {byDifficulty[3].map((a: any) => (
                  <div
                    key={a.id}
                    id={`act-${a.id}`}
                    className="grid grid-cols-12 gap-3 py-3"
                  >
                    <div className="col-span-8">
                      <div className="font-medium text-slate-900">
                        {a.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {a.category || "General"} •{" "}
                        {difficultyLabel(a.difficulty)}
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-sm text-slate-600">
                      {a.estimatedMinutes ? `${a.estimatedMinutes} min` : "-"}
                    </div>
                    <div className="col-span-2 text-right">
                      <Link
                        href="/learning-activities"
                        className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-800 hover:bg-slate-50"
                      >
                        Practice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 text-center">
          <h3 className="mb-3 text-2xl font-bold text-slate-900">
            Ready to practice more?
          </h3>
          <p className="mb-4 text-slate-700">
            Visit the Learning Activities hub and continue your Python journey.
          </p>
          <Link
            href="/learning-activities"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white shadow hover:from-blue-600 hover:to-purple-600"
          >
            Open Learning Activities
          </Link>
        </div>
      </div>
    </div>
  );
}
