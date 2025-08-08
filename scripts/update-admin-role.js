const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAdminRole() {
  try {
    // Admin kullanıcısını bul ve role'ünü güncelle
    const updatedUser = await prisma.user.update({
      where: { username: 'admin' },
      data: { role: 'admin' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      }
    });

    console.log('✅ Admin kullanıcısı güncellendi!');
    console.log('👤 Username:', updatedUser.username);
    console.log('📧 Email:', updatedUser.email);
    console.log('⚡ Role:', updatedUser.role);
    console.log('');
    console.log('🔑 Giriş Bilgileri:');
    console.log('Username: admin');
    console.log('Password: admin123');

  } catch (error) {
    if (error.code === 'P2025') {
      console.log('❌ Admin kullanıcısı bulunamadı!');
      console.log('Önce admin kullanıcısı oluşturun.');
    } else {
      console.error('❌ Hata:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole();