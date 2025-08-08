import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUser() {
  console.log("🔐 Creating test user...");

  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });

  if (existingUser) {
    console.log("✅ Test user already exists:", existingUser.email);
    console.log("📊 User stats:");
    console.log(`  - Level: ${existingUser.level}`);
    console.log(`  - Experience: ${existingUser.experience}`);
    console.log(`  - Diamonds: ${existingUser.currentDiamonds}`);
    return existingUser;
  }

  // Create password hash
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      email: "test@example.com",
      username: "testuser",
      passwordHash: hashedPassword,
      firstName: "Test",
      lastName: "User",
      level: 1,
      experience: 0,
      totalDiamonds: 100,
      currentDiamonds: 100,
      isPremium: false,
      isActive: true,
      emailVerified: true,
    },
  });

  // Create initial user streak
  await prisma.userStreak.create({
    data: {
      userId: testUser.id,
      currentStreak: 0,
      longestStreak: 0,
      loginStreak: 0,
      codeArenaStreak: 0,
      quizStreak: 0,
    },
  });

  // Create daily login tracking
  await prisma.userDailyLogin.create({
    data: {
      userId: testUser.id,
      consecutiveDays: 0,
      totalDiamondsEarned: 0,
      totalXPEarned: 0,
      packsEarned: 0,
    },
  });

  console.log("✅ Test user created successfully!");
  console.log("📧 Email: test@example.com");
  console.log("🔑 Password: password123");
  console.log("🆔 User ID:", testUser.id);

  return testUser;
}

createTestUser()
  .catch((e) => {
    console.error("❌ Failed to create test user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
