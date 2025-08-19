import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { SchemaMarkup, FAQSchema } from "@/components/seo/SchemaMarkup";
import { generateMetadata as buildMeta } from "@/lib/seo/metadata";

// Temporary any-cast to avoid Prisma type staleness during dev (consistent pattern)
const p: any = prisma;

type PageProps = {
  params: Promise<{ key: string }>;
};

function difficultyLabel(d?: number | null) {
  const n = d ?? 1;
  if (n <= 1) return "Beginner";
  if (n === 2) return "Intermediate";
  return "Advanced";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { key } = await params;

  try {
    const skill = await p.skill.findUnique({
      where: { key },
      select: { name: true, description: true, category: true },
    });

    if (!skill) {
      return {
        title: "Skill not found | Zumenzu",
        robots: { index: false, follow: false },
      };
    }

    const title = `${skill.name} | Python Skill - Zumenzu`;
    const description =
      skill.description ||
      `Learn ${skill.name} with interactive exercises, quizzes and mastery tracking on Zumenzu.`;

    return buildMeta({
      title,
      description,
      keywords: [
        "python",
        "python skill",
        "interactive coding",
        "learning path",
        skill.name.toLowerCase(),
        (skill.category || "python fundamentals").toLowerCase(),
      ],
      canonical: `/skills/${encodeURIComponent(key)}`,
      openGraph: {
        title,
        description,
        type: "website",
        image: "/og-image.jpg",
      },
    });
  } catch {
    return {
      title: "Skill | Zumenzu",
      robots: { index: false, follow: true },
    };
  }
}

export default async function SkillPage({ params }: PageProps) {
  const { key } = await params;

  // Load skill with activity mappings
  const skill = await p.skill.findUnique({
    where: { key },
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
      category: true,
      difficulty: true,
      updatedAt: true,
    },
  });

  if (!skill) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">Skill not found</h1>
        <p className="mt-2 text-slate-600">
          The requested skill could not be found. Go back to{" "}
          <Link
            className="text-indigo-600 underline"
            href="/learning-activities"
          >
            Learning Activities
          </Link>
          .
        </p>
      </div>
    );
  }

  // Fetch activities mapped to this skill via ActivitySkill relation
  const mappings = (await p.activitySkill.findMany({
    where: { skill: { key } },
    select: {
      weight: true,
      difficulty: true,
      activity: {
        select: {
          id: true,
          title: true,
          category: true,
          difficulty: true,
          estimatedMinutes: true,
          updatedAt: true,
          sortOrder: true,
        },
      },
    },
    orderBy: { activity: { sortOrder: "asc" } },
  })) as Array<{
    weight: number;
    difficulty: number;
    activity: {
      id: string;
      title: string;
      category: string | null;
      difficulty: number | null;
      estimatedMinutes: number | null;
      updatedAt: Date | string;
      sortOrder: number | null;
    };
  }>;

  const activities = mappings
    .map((m) => m.activity)
    .filter(Boolean)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Build JSON-LD Course schema
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: skill.name,
    description:
      skill.description ||
      `Master ${skill.name} with interactive activities, quizzes and practice on Zumenzu.`,
    provider: {
      "@type": "EducationalOrganization",
      name: "Zumenzu",
      url: "https://zumenzu.com",
    },
    courseCode: skill.key,
    inLanguage: "tr-TR",
    educationalLevel: difficultyLabel(skill.difficulty),
    educationalUse: "Interactive Learning",
    interactivityType: "Active",
    url: `https://zumenzu.com/skills/${encodeURIComponent(skill.key)}`,
    hasCourseInstance: activities.length
      ? activities.map((a) => ({
          "@type": "CourseInstance",
          courseMode: "Online",
          name: a.title,
          url: `https://zumenzu.com/skills/${encodeURIComponent(skill.key)}#act-${a.id}`,
          inLanguage: "tr-TR",
          // Use ISO 8601 duration format when available
          timeRequired: a.estimatedMinutes
            ? `PT${a.estimatedMinutes}M`
            : undefined,
        }))
      : undefined,
  };

  // Build JSON-LD ItemList for the activities
  const itemListSchema =
    activities.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${skill.name} - Activities`,
          itemListOrder: "http://schema.org/ItemListOrderAscending",
          numberOfItems: activities.length,
          itemListElement: activities.map((a, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: a.title,
            item: `https://zumenzu.com/skills/${encodeURIComponent(skill.key)}#act-${a.id}`,
          })),
        }
      : null;

  // Basic FAQ content; can be extended via admin later
  const faqs = [
    {
      question: `What will I learn in ${skill.name}?`,
      answer:
        skill.description ||
        `You will learn core concepts of ${skill.name} with hands-on activities and quizzes.`,
    },
    {
      question: `How long does ${skill.name} typically take?`,
      answer:
        activities.length > 0
          ? `This skill has ${activities.length} mapped activities. Many learners complete the basics in under 1 hour.`
          : `This skill is under construction. New activities are being added.`,
    },
    {
      question: "Is this skill beginner friendly?",
      answer:
        skill.difficulty && skill.difficulty > 1
          ? "This skill targets intermediate or advanced learners, but you can still explore the activities."
          : "Yes, this skill is suitable for beginners and includes short interactive activities.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* JSON-LD */}
      <SchemaMarkup schema={courseSchema} />
      {itemListSchema ? <SchemaMarkup schema={itemListSchema} /> : null}
      <FAQSchema faqs={faqs} />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-slate-500">
            {skill.category || "Python Fundamentals"}
          </div>
          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            {skill.name}
          </h1>
          <div className="mb-4 flex items-center gap-3 text-sm">
            <span className="inline-flex rounded-full border border-slate-200 px-2 py-0.5 text-slate-700">
              Difficulty: {difficultyLabel(skill.difficulty)}
            </span>
            <span className="inline-flex rounded-full border border-slate-200 px-2 py-0.5 text-slate-700">
              Activities: {activities.length}
            </span>
            <span className="inline-flex rounded-full border border-slate-200 px-2 py-0.5 text-slate-700">
              Updated:{" "}
              {new Date(skill.updatedAt as any).toLocaleDateString("tr-TR")}
            </span>
          </div>
          <p className="text-slate-700">
            {skill.description || "Learn and practice with interactive coding."}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Mapped Activities
          </h2>
          {activities.length === 0 ? (
            <div className="text-slate-600">
              No activities mapped yet. Please check back soon.
            </div>
          ) : (
            <div className="divide-y">
              {activities.map((a) => (
                <div
                  key={a.id}
                  id={`act-${a.id}`}
                  className="grid grid-cols-12 gap-3 py-4"
                >
                  <div className="col-span-8">
                    <div className="font-medium text-slate-900">{a.title}</div>
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

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div
                key={f.question}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="font-medium text-slate-900">{f.question}</div>
                <div className="mt-1 text-slate-700">{f.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
