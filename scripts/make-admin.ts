import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    console.log("🔧 Making user admin...");

    const user = await prisma.user.update({
      where: { email: "test@example.com" },
      data: { role: "admin" },
    });

    console.log("✅ User is now admin!");
    console.log(`📧 Email: ${user.email}`);
    console.log(`👑 Role: ${user.role}`);
    console.log(`🆔 User ID: ${user.id}`);
  } catch (error) {
    console.error("❌ Failed to make user admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
