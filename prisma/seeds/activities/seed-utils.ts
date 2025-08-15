import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SeedActivity {
  title: string;
  description: string;
  activityType: string;
  category: string;
  difficulty: number;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  content: any;
  settings?: any;
  tags: string[];
  isActive: boolean;
  sortOrder: number;
}

/**
 * Validate that seed content matches expected schema.
 * - Classification schema (items + categories):
 *    • Each item.type must exist in categories[].id
 *    • Normalize item.value (fallback to content), normalize ids/types to string/number
 * - Order schema (blocks + correctOrder):
 *    • Every id in correctOrder must exist in blocks[].id
 *    • Warn if arrays are empty
 * This logs warnings (non-blocking) to surface issues while keeping seeding resilient.
 */
function validateAndNormalizeSeedActivity(activity: SeedActivity): void {
  try {
    const c = activity?.content;

    if (!c || typeof c !== "object") {
      console.warn(
        `⚠️ [Seed Validation] "${activity.title}": content is missing or invalid`
      );
      return;
    }

    // Classification schema checks
    if (Array.isArray(c.items) && Array.isArray(c.categories)) {
      const catIds = new Set(
        c.categories
          .filter((cat: any) => cat && cat.id !== undefined && cat.id !== null)
          .map((cat: any) => String(cat.id))
      );

      const missingTypeItems = (c.items as any[]).filter(
        (it: any) => !catIds.has(String(it?.type))
      );

      if (missingTypeItems.length > 0) {
        const preview = missingTypeItems
          .slice(0, 5)
          .map((it: any) => `${it?.value ?? it?.content} -> ${it?.type}`);
        console.warn(
          `⚠️ [Seed Validation] "${activity.title}": ${missingTypeItems.length} item(s) have type not in categories ids. Examples: ${preview.join(
            ", "
          )}`
        );
      }

      // Normalize items/categories for safer client parsing
      c.items = c.items.map((it: any) => ({
        ...it,
        value:
          typeof it.value === "string"
            ? it.value
            : typeof it.content === "string"
              ? it.content
              : String(it.value ?? it.content ?? ""),
        type: String(it.type),
        id: Number(it.id),
      }));

      c.categories = c.categories.map((cat: any) => ({
        ...cat,
        id: String(cat.id),
      }));
    }

    // Order schema checks
    if (Array.isArray(c.blocks) && Array.isArray(c.correctOrder)) {
      const blockIds = new Set((c.blocks as any[]).map((b: any) => b?.id));
      const unknownIds = (c.correctOrder as any[]).filter(
        (id: any) => !blockIds.has(id)
      );

      if (unknownIds.length > 0) {
        console.warn(
          `⚠️ [Seed Validation] "${activity.title}": correctOrder has ${unknownIds.length} id(s) not present in blocks. Unknown ids: ${unknownIds.join(", ")}`
        );
      }

      if (
        (c.blocks as any[]).length === 0 ||
        (c.correctOrder as any[]).length === 0
      ) {
        console.warn(
          `⚠️ [Seed Validation] "${activity.title}": blocks or correctOrder is empty`
        );
      }
    }
  } catch (e) {
    console.warn(
      `⚠️ [Seed Validation] "${activity.title}": validation error`,
      e
    );
  }
}

export async function seedActivitiesWithDuplicateCheck(
  activities: SeedActivity[],
  activityTypeName: string
): Promise<void> {
  console.log(`🌱 Seeding ${activityTypeName} activities...`);

  if (activities.length === 0) {
    console.log(`📝 No ${activityTypeName} activities to seed`);
    return;
  }

  let created = 0;
  let updated = 0;

  for (const activity of activities) {
    // Validate + normalize content before persisting
    validateAndNormalizeSeedActivity(activity);

    // Prevent duplicates by title+type+category
    const existingActivity = await prisma.learningActivity.findFirst({
      where: {
        title: activity.title,
        activityType: activity.activityType,
        category: activity.category,
      },
    });

    if (existingActivity) {
      await prisma.learningActivity.update({
        where: { id: existingActivity.id },
        data: {
          description: activity.description,
          difficulty: activity.difficulty,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          estimatedMinutes: activity.estimatedMinutes,
          content: JSON.stringify(activity.content),
          settings: activity.settings
            ? JSON.stringify(activity.settings)
            : undefined,
          tags: JSON.stringify(activity.tags),
          isActive: activity.isActive,
          sortOrder: activity.sortOrder,
        },
      });
      updated++;
    } else {
      await prisma.learningActivity.create({
        data: {
          title: activity.title,
          description: activity.description,
          activityType: activity.activityType,
          category: activity.category,
          difficulty: activity.difficulty,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          estimatedMinutes: activity.estimatedMinutes,
          content: JSON.stringify(activity.content),
          settings: activity.settings
            ? JSON.stringify(activity.settings)
            : undefined,
          tags: JSON.stringify(activity.tags),
          isActive: activity.isActive,
          sortOrder: activity.sortOrder,
        },
      });
      created++;
    }
  }

  console.log(
    `✅ ${activityTypeName} activities processed: ${created} created, ${updated} updated`
  );
}

export { prisma };
