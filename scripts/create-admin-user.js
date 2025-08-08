const { PrismaClient } = require('../src/generated/prisma');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Admin kullanıcısı oluşturuluyor...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('✅ Admin kullanıcısı zaten mevcut:');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`🔑 Şifre: admin123 (varsayılan)`);
      return;
    }

    // Hash password using pbkdf2 (compatible with login API)
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword = `${hash}:${salt}`;

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@anime-cards.com',
        username: 'admin',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        level: 100,
        experience: 999999,
        currentDiamonds: 999999,
        totalDiamonds: 999999,
        emailVerified: true,
        isActive: true,
      }
    });

    console.log('🎉 Admin kullanıcısı başarıyla oluşturuldu!');
    console.log('');
    console.log('📋 Admin Giriş Bilgileri:');
    console.log('='.repeat(40));
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Username: ${adminUser.username}`);
    console.log(`🔑 Şifre: admin123`);
    console.log('='.repeat(40));
    console.log('');
    console.log('🌐 Admin paneline erişim: http://localhost:3000/admin');
    console.log('🔐 Giriş sayfası: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Admin kullanıcısı oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();