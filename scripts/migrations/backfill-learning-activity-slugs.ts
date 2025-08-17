// Backfills slug values for existing LearningActivity rows.
// - Prefers settings.slug if present and valid
// - Falls back to slugified title
// - Ensures uniqueness by appending -2, -3, ... when needed
//
// Usage:
//   npx ts-node scripts/migrations/backfill-learning-activity-slugs.ts
// or add a package.json script:
//   "backfill:slugs": "ts-node scripts/migrations/backfill-learning-activity-slugs.ts"
//
// Prerequisites:
// - Run Prisma migration for slug column first:
//     npx prisma migrate dev --name add-learning-activity-slug
// - Ensure DATABASE_URL is set

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

type SettingsMaybeSlug = {
  slug?: unknown;
} | null;

function extractSlugFromSettings(
  settingsStr: string | null | undefined
): string | null {
  if (!settingsStr) return null;
  try {
    const parsed = JSON.parse(settingsStr) as SettingsMaybeSlug;
    const val = parsed?.slug;
    if (typeof val === "string" && val.trim().length > 0) {
      return slugify(val);
    }
    return null;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  console.log("🔎 Preparing existing slug set...");
  const existingWithSlugs = await prisma.learningActivity.findMany({
    where: { slug: { not: null } },
    select: { slug: true },
  });

  const used = new Set<string>();
  for (const row of existingWithSlugs) {
    if (row.slug) used.add(row.slug);
  }

  console.log("🔎 Fetching activities missing slug...");
  const toBackfill = await prisma.learningActivity.findMany({
    where: {
      OR: [{ slug: null }, { slug: "" }],
    },
    select: { id: true, title: true, settings: true },
    orderBy: { createdAt: "asc" },
  });

  if (toBackfill.length === 0) {
    console.log("✅ No activities require slug backfill.");
    return;
  }

  console.log(`🛠️ Backfilling slugs for ${toBackfill.length} activities...`);

  let updatedCount = 0;
  let skippedCount = 0;
  const conflicts: Array<{ id: string; title: string; candidate: string }> = [];

  // Helper to ensure uniqueness in current DB + in-memory session
  const ensureUniqueSlug = (base: string): string => {
    const baseClean = base || "lesson";
    let candidate = baseClean;
    let i = 2;
    while (used.has(candidate)) {
      candidate = `${baseClean}-${i}`;
      i += 1;
    }
    return candidate;
  };

  for (const a of toBackfill) {
    const fromSettings = extractSlugFromSettings(a.settings);
    const fromTitle = slugify(a.title);

    const base = fromSettings || fromTitle || "lesson";
    const finalSlug = ensureUniqueSlug(base);

    try {
      await prisma.learningActivity.update({
        where: { id: a.id },
        data: { slug: finalSlug },
      });
      used.add(finalSlug);
      updatedCount++;
      if (updatedCount % 25 === 0) {
        console.log(`  • Updated ${updatedCount}/${toBackfill.length}...`);
      }
    } catch (err: any) {
      skippedCount++;
      conflicts.push({ id: a.id, title: a.title, candidate: finalSlug });
      console.error(
        `❌ Failed to update slug for id=${a.id} (${a.title}):`,
        err?.message || err
      );
    }
  }

  console.log(`\n🎉 Backfill completed.`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  if (conflicts.length > 0) {
    console.log(`\n⚠️ Conflicts/Errors (${conflicts.length})`);
    for (const c of conflicts) {
      console.log(
        ` - id=${c.id}, title="${c.title}", attempted="${c.candidate}"`
      );
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Backfill failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
