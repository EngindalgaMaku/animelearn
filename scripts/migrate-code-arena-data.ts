import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateCodeArenaData() {
  try {
    console.log("🔄 Starting CodeArena to LearningActivity data migration...");

    // Get all CodeArena data
    const codeArenas = await prisma.codeArena.findMany({
      include: {
        progress: true,
        quizzes: true,
      },
    });

    console.log(`📊 Found ${codeArenas.length} CodeArena entries to migrate`);

    // Migrate each CodeArena to LearningActivity
    for (const arena of codeArenas) {
      // Check if already migrated (by title match)
      const existing = await prisma.learningActivity.findFirst({
        where: { title: arena.title },
      });

      if (existing) {
        console.log(
          `⏭️  Skipping "${arena.title}" - already exists in LearningActivity`
        );
        continue;
      }

      // Create LearningActivity from CodeArena
      const learningActivity = await prisma.learningActivity.create({
        data: {
          title: arena.title,
          description: arena.description,
          activityType: arena.activityType || "interactive_coding",
          category: mapCategory(arena.category),
          difficulty: arena.difficulty,
          diamondReward: arena.diamondReward,
          experienceReward: arena.experienceReward,
          content: JSON.stringify({
            instructions: arena.description,
            starterCode: arena.starterCode,
            solutionCode: arena.solutionCode,
            testCases: arena.testCases ? JSON.parse(arena.testCases) : [],
            hints: arena.hints ? JSON.parse(arena.hints) : [],
            examples: arena.examples ? JSON.parse(arena.examples) : [],
            sections: arena.sections ? JSON.parse(arena.sections) : [],
            learningObjectives: arena.learningObjectives
              ? JSON.parse(arena.learningObjectives)
              : [],
            resources: arena.resources ? JSON.parse(arena.resources) : [],
          }),
          settings: JSON.stringify({
            duration: arena.duration,
            hasCodeExercise: arena.hasCodeExercise,
            prerequisites: arena.prerequisites
              ? JSON.parse(arena.prerequisites)
              : [],
          }),
          isActive: arena.isPublished,
          estimatedMinutes: arena.duration,
          tags: arena.tags,
          sortOrder: arena.order,
          isLocked: false, // CodeArena activities weren't locked
          createdAt: arena.createdAt,
          updatedAt: arena.updatedAt,
        },
      });

      // Migrate progress data
      for (const progress of arena.progress) {
        // Check if user still exists
        const userExists = await prisma.user.findUnique({
          where: { id: progress.userId },
        });

        if (!userExists) {
          console.log(
            `⚠️  Skipping progress for deleted user: ${progress.userId}`
          );
          continue;
        }

        // Check if progress already exists
        const existingAttempt = await prisma.activityAttempt.findUnique({
          where: {
            userId_activityId: {
              userId: progress.userId,
              activityId: learningActivity.id,
            },
          },
        });

        if (!existingAttempt) {
          await prisma.activityAttempt.create({
            data: {
              userId: progress.userId,
              activityId: learningActivity.id,
              answers: JSON.stringify({
                lastCode: progress.lastCode,
                bestCode: progress.bestCode,
                isCodeCorrect: progress.isCodeCorrect,
              }),
              score: progress.score || 0,
              completed: progress.isCompleted,
              timeSpent: progress.timeSpent,
              startedAt: progress.startedAt || progress.lastVisit,
              completedAt: progress.completedAt,
            },
          });
        }
      }

      console.log(
        `✅ Migrated "${arena.title}" with ${arena.progress.length} progress entries`
      );
    }

    console.log("🎉 Data migration completed successfully!");
    console.log("📋 Summary:");
    console.log(`   - ${codeArenas.length} CodeArena entries processed`);

    const totalActivities = await prisma.learningActivity.count();
    console.log(
      `   - ${totalActivities} total LearningActivity entries now exist`
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function mapCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    basic: "Python Fundamentals",
    intermediate: "Data Structures",
    advanced: "Algorithms",
    functions: "Functions & OOP",
    web: "Web Development",
    ml: "Machine Learning",
  };

  return categoryMap[category] || "Python Fundamentals";
}

// Run the migration
migrateCodeArenaData()
  .then(() => {
    console.log("🏁 Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration script failed:", error);
    process.exit(1);
  });
