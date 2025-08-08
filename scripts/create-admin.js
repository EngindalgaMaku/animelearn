const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await prisma.user.findFirst({
      where: { username: "admin" },
    });

    if (existingAdmin) {
      console.log("❌ Admin kullanıcısı zaten mevcut!");
      console.log("👤 Username: admin");
      console.log("🔑 Password: admin123");
      return;
    }

    // Admin şifresini hash'le
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Admin kullanıcısı oluştur
    const admin = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@codeadena.com",
        passwordHash: hashedPassword,
        role: "admin",
        currentDiamonds: 1000,
        totalDiamonds: 1000,
        level: 10,
        experience: 5000,
        isActive: true,
        codeArenasCompleted: 0,
        quizzesCompleted: 0,
        isPremium: true,
        loginStreak: 1,
        maxLoginStreak: 1,
        lastLoginDate: new Date(),
      },
    });

    // Hoşgeldin diamond transaction oluştur
    await prisma.diamondTransaction.create({
      data: {
        userId: admin.id,
        amount: 1000,
        type: "EARNED",
        description: "Admin hesabı oluşturma bonusu",
        createdAt: new Date(),
      },
    });

    console.log("✅ Admin kullanıcısı başarıyla oluşturuldu!");
    console.log("👤 Username: admin");
    console.log("📧 Email: admin@codeadena.com");
    console.log("🔑 Password: admin123");
    console.log("💎 Diamonds: 1000");
    console.log("🏆 Level: 10");
    console.log("⚡ Role: admin");
  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
