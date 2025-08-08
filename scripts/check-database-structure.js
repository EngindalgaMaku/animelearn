const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    console.log('🗄️ Veritabanı yapısını ve admin bilgilerinin kaynağını kontrol ediyor...');
    
    // Admin kullanıcı bilgilerini users tablosundan al
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'admin'
      }
    });

    console.log('\n📊 VERİTABANI TABLO BİLGİLERİ:');
    console.log('================================');
    
    console.log('\n🏷️  TABLO ADI: "users" (schema.prisma\'da "User" modeli olarak tanımlı)');
    console.log('📍 Mapping: @@map("users") - Veritabanında "users" tablosu olarak saklanıyor');
    
    if (adminUser) {
      console.log('\n👑 ADMIN KULLANICI VERİLERİ:');
      console.log('Source Table: users');
      console.log('Model: User (Prisma schema)');
      console.log('=====================================');
      
      // Tüm user alanlarını göster
      Object.keys(adminUser).forEach(key => {
        let value = adminUser[key];
        if (key === 'passwordHash') {
          value = value.substring(0, 20) + '...'; // Şifreyi kısalt
        }
        if (value instanceof Date) {
          value = value.toLocaleString('tr-TR');
        }
        console.log(`${key.padEnd(20)}: ${value}`);
      });
    }

    // Users tablosunun schema yapısını göster
    console.log('\n📋 USERS TABLOSU SCHEMA ALANLARI:');
    console.log('==================================');
    console.log('id                  : String (Primary Key)');
    console.log('email               : String (Unique)');
    console.log('username            : String (Unique)');
    console.log('passwordHash        : String');
    console.log('firstName           : String?');
    console.log('lastName            : String?');
    console.log('role                : String (default: "user")'); 
    console.log('level               : Int (default: 1)');
    console.log('experience          : Int (default: 0)');
    console.log('currentDiamonds     : Int (default: 100)');
    console.log('totalDiamonds       : Int (default: 0)');
    console.log('isActive            : Boolean (default: true)');
    console.log('isPremium           : Boolean (default: false)');
    console.log('emailVerified       : Boolean (default: false)');
    console.log('createdAt           : DateTime');
    console.log('updatedAt           : DateTime');
    console.log('... ve diğer alanlar');

    // Tablo istatistikleri
    const totalUsers = await prisma.user.count();
    const adminCount = await prisma.user.count({ where: { role: 'admin' } });
    const userCount = await prisma.user.count({ where: { role: 'user' } });

    console.log('\n📈 TABLO İSTATİSTİKLERİ:');
    console.log('========================');
    console.log(`Toplam kullanıcı sayısı: ${totalUsers}`);
    console.log(`Admin kullanıcı sayısı: ${adminCount}`);
    console.log(`Normal kullanıcı sayısı: ${userCount}`);

    console.log('\n🔍 SORGU BİLGİSİ:');
    console.log('================');
    console.log('SELECT * FROM users WHERE role = \'admin\';');
    console.log('Prisma Query: prisma.user.findFirst({ where: { role: "admin" } })');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStructure();