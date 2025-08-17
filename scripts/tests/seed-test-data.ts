import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function ensureTestUser(): Promise<{
  id: string;
  email: string;
  username: string;
  password: string;
}> {
  const email = "testuser@example.com";
  const baseUsername = "testuser";
  const password = "TestPass123!";

  // Find existing by email
  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Ensure passwordHash exists and user is active
    if (!user.passwordHash) {
      const hash = await bcrypt.hash(password, 10);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hash, isActive: true },
      });
    } else if (!user.isActive) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isActive: true },
      });
    }
    return { id: user.id, email, username: user.username, password };
  }

  // Ensure unique username
  let finalUsername = baseUsername;
  let counter = 1;
  while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
    finalUsername = `${baseUsername}_${counter++}`;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  user = await prisma.user.create({
    data: {
      email,
      username: finalUsername,
      passwordHash,
      isActive: true,
      role: "user",
      currentDiamonds: 100,
      totalDiamonds: 100,
      level: 1,
      experience: 0,
    },
  });

  return { id: user.id, email, username: finalUsername, password };
}

async function ensureLesson(): Promise<{ id: string; slug: string }> {
  const slug = "python-basics-first-program";
  const exists = await prisma.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (exists) {
    return { id: exists.id, slug };
  }

  const settings = JSON.stringify({ slug, hasCodeExercise: true });
  const content = JSON.stringify({
    introduction: "Seeded test lesson for E2E code-complete.",
    syntax: "",
    examples: "",
  });

  const lesson = await prisma.learningActivity.create({
    data: {
      title: "Python Basics & Your First Program",
      description: "Seeded lesson for E2E tests",
      activityType: "lesson",
      category: "Python Fundamentals",
      difficulty: 1,
      diamondReward: 25,
      experienceReward: 50,
      content,
      settings,
      isActive: true,
      estimatedMinutes: 10,
      sortOrder: 1,
    },
  });

  return { id: lesson.id, slug };
}

async function main() {
  const user = await ensureTestUser();
  const lesson = await ensureLesson();
  console.log(JSON.stringify({ success: true, user, lesson }, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
