const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdminPassword() {
  try {
    console.log('🔍 Admin kullanıcı şifre bilgilerini kontrol ediyor...');
    
    // Admin kullanıcıyı bul
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true
      }
    });

    if (adminUser) {
      console.log('\n👑 Admin Kullanıcı Bulundu:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Kullanıcı Adı: ${adminUser.username}`);
      console.log(`   Ad Soyad: ${adminUser.firstName} ${adminUser.lastName}`);
      console.log(`   Aktif: ${adminUser.isActive ? 'Evet' : 'Hayır'}`);
      console.log(`   Şifre Hash: ${adminUser.passwordHash.substring(0, 20)}...`);
      
      // Yaygın şifreleri test et
      const commonPasswords = [
        'password123',
        'admin123',
        'admin',
        '123456',
        'password',
        'test123',
        'admin123456',
        'testuser123'
      ];

      console.log('\n🔐 Yaygın şifreleri test ediyor...');
      
      for (const password of commonPasswords) {
        try {
          const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
          if (isMatch) {
            console.log(`✅ ŞİFRE BULUNDU: "${password}"`);
            console.log('\n📋 GİRİŞ BİLGİLERİ:');
            console.log(`   Email/Kullanıcı Adı: ${adminUser.email} VEYA ${adminUser.username}`);
            console.log(`   Şifre: ${password}`);
            return;
          }
        } catch (error) {
          // bcrypt hatası durumunda crypto formatını dene
          if (adminUser.passwordHash.includes(':')) {
            const { pbkdf2Sync } = require('crypto');
            const [hash, salt] = adminUser.passwordHash.split(':');
            const computedHash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
            if (computedHash === hash) {
              console.log(`✅ ŞİFRE BULUNDU (crypto): "${password}"`);
              console.log('\n📋 GİRİŞ BİLGİLERİ:');
              console.log(`   Email/Kullanıcı Adı: ${adminUser.email} VEYA ${adminUser.username}`);
              console.log(`   Şifre: ${password}`);
              return;
            }
          }
        }
      }
      
      console.log('❌ Yaygın şifreler eşleşmedi. Hash formatı:', adminUser.passwordHash.substring(0, 10));
      
    } else {
      console.log('❌ Admin kullanıcısı bulunamadı!');
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminPassword();