const { PrismaClient } = require('../src/generated/prisma');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    console.log('🔧 Admin şifresi güncelleniyor...');

    // Find admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      console.log('❌ Admin kullanıcısı bulunamadı!');
      return;
    }

    // Hash password using pbkdf2 (compatible with login API)
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword = `${hash}:${salt}`;

    // Update admin password
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        passwordHash: hashedPassword,
      }
    });

    console.log('🎉 Admin şifresi başarıyla güncellendi!');
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
    console.error('❌ Admin şifresi güncellenirken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();