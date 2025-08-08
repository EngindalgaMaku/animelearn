const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function checkAdminUsers() {
  try {
    console.log('🔍 Veritabanında admin kullanıcıları arıyor...');
    
    // Admin rolüne sahip kullanıcıları bul
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true
      }
    });

    console.log(`\n📊 Bulunan admin kullanıcı sayısı: ${adminUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log('\n👑 Admin Kullanıcıları:');
      adminUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. Admin Kullanıcı:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Kullanıcı Adı: ${user.username}`);
        console.log(`   Ad Soyad: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
        console.log(`   Rol: ${user.role}`);
        console.log(`   Aktif: ${user.isActive ? 'Evet' : 'Hayır'}`);
        console.log(`   Oluşturulma: ${user.createdAt.toLocaleDateString('tr-TR')}`);
      });
    } else {
      console.log('\n❌ Veritabanında admin kullanıcısı bulunamadı!');
    }

    // Tüm kullanıcıları da listele
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📋 Toplam kullanıcı sayısı: ${allUsers.length}`);
    console.log('\n👥 Tüm Kullanıcılar:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - Rol: ${user.role} - Aktif: ${user.isActive ? 'Evet' : 'Hayır'}`);
    });

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers();