const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrateCodeArenaToLearningActivities() {
  try {
    console.log("🚀 Starting migration from CodeArena to LearningActivity...");

    // Get all CodeArena activities
    const codeArenaActivities = await prisma.codeArena.findMany({
      include: {
        progress: true, // Include progress to migrate completion data
      },
    });

    console.log(
      `📊 Found ${codeArenaActivities.length} CodeArena activities to migrate`
    );

    let migratedCount = 0;
    let errorCount = 0;

    for (const activity of codeArenaActivities) {
      try {
        console.log(`📝 Migrating: ${activity.title}`);

        // Prepare content structure for LearningActivity
        let content = {};

        try {
          // Try to parse existing content
          content = JSON.parse(activity.content);
        } catch (e) {
          // If content is not JSON, create structure based on activity type
          content = {
            instructions: activity.description,
            starterCode: activity.starterCode,
            solutionCode: activity.solutionCode,
            testCases: activity.testCases ? JSON.parse(activity.testCases) : [],
            hasCodeExercise: activity.hasCodeExercise,
            hints: activity.hints ? JSON.parse(activity.hints) : [],
            examples: activity.examples ? JSON.parse(activity.examples) : [],
            learningObjectives: activity.learningObjectives
              ? JSON.parse(activity.learningObjectives)
              : [],
          };
        }

        // Create corresponding LearningActivity
        const learningActivity = await prisma.learningActivity.create({
          data: {
            title: activity.title,
            description: activity.description,
            activityType: activity.activityType || "interactive_coding",
            category: activity.category,
            difficulty: activity.difficulty,
            diamondReward: activity.diamondReward,
            experienceReward: activity.experienceReward,
            content: JSON.stringify(content),
            settings: JSON.stringify({
              duration: activity.duration,
              hasCodeExercise: activity.hasCodeExercise,
              starterCode: activity.starterCode,
              solutionCode: activity.solutionCode,
              testCases: activity.testCases,
              hints: activity.hints,
              prerequisites: activity.prerequisites,
            }),
            isActive: activity.isPublished,
            estimatedMinutes: activity.duration,
            tags: activity.tags,
            sortOrder: activity.order,
            isLocked: false, // Code arena activities are not locked
          },
        });

        // Migrate progress data from CodeArenaProgress to ActivityAttempt
        for (const progress of activity.progress) {
          try {
            await prisma.activityAttempt.create({
              data: {
                userId: progress.userId,
                activityId: learningActivity.id,
                score: progress.score || (progress.isCompleted ? 100 : 0),
                maxScore: 100,
                completed: progress.isCompleted,
                timeSpent: progress.timeSpent,
                startedAt: progress.startedAt || progress.lastVisit,
                completedAt: progress.completedAt,
              },
            });
          } catch (progressError) {
            console.warn(
              `⚠️  Could not migrate progress for user ${progress.userId}: ${progressError.message}`
            );
          }
        }

        migratedCount++;
        console.log(`✅ Successfully migrated: ${activity.title}`);
      } catch (activityError) {
        console.error(
          `❌ Error migrating ${activity.title}:`,
          activityError.message
        );
        errorCount++;
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`✅ Successfully migrated: ${migratedCount} activities`);
    console.log(`❌ Errors: ${errorCount} activities`);

    if (migratedCount > 0) {
      console.log("\n📋 Next steps:");
      console.log("1. Update APIs to use LearningActivity table");
      console.log("2. Remove CodeArena table references");
      console.log("3. Test the application");
    }
  } catch (error) {
    console.error("💥 Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCodeArenaToLearningActivities();
