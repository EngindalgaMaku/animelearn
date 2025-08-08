const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeUserAdmin(username) {
  try {
    const user = await prisma.user.update({
      where: { username: username },
      data: { 
        role: 'ADMIN',
        diamonds: 10000,
        level: 100,
        experience: 999999
      }
    });
    
    console.log('✅ Kullanıcı admin yapıldı:');
    console.log('👤 Username:', user.username);
    console.log('📧 Email:', user.email);
    console.log('🔑 Role:', user.role);
    console.log('💎 Diamonds:', user.diamonds);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Admin yapma hatası:', error);
    await prisma.$disconnect();
  }
}

makeUserAdmin('dizaynschool');