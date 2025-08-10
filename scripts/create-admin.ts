import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "crypto";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const username = "admin";
    const email = "admin@zumenzu.com";
    const password = "admin123";

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }, { role: "admin" }],
      },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists:", {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role,
      });
      return;
    }

    // Create password hash
    const salt = randomBytes(16).toString("hex");
    const hashedPassword =
      pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex") +
      ":" +
      salt;

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        role: "admin",
        level: 99,
        experience: 999999,
        currentDiamonds: 10000,
        totalDiamonds: 10000,
        dailyDiamonds: 0,
        codeArenasCompleted: 0,
        quizzesCompleted: 0,
        loginStreak: 1,
        maxLoginStreak: 1,
        isPremium: true,
        isActive: true,
        lastLoginDate: new Date(),
      },
    });

    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("👤 Username:", username);
    console.log("🆔 User ID:", admin.id);
    console.log("");
    console.log("You can now login at: http://localhost:3000/login");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
