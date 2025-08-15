import { PrismaClient } from "@prisma/client";
import { seedPythonFundamentals } from "../prisma/seeds/python-fundamentals";

const prisma = new PrismaClient();

async function main() {
  console.log("🐍 Starting Python Fundamentals seeding...");

  try {
    await seedPythonFundamentals();
    console.log("✅ Python Fundamentals seeding completed successfully!");
  } catch (error) {
    console.error("❌ Python Fundamentals seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
