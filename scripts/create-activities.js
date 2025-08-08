const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createActivities() {
  console.log('🚀 Python Code Arena aktivitelerini oluşturuyor...');
  
  try {
    // Python content dosyasını oku
    const contentPath = path.join(__dirname, 'python-beginner-content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const activity of contentData.activities) {
      try {
        console.log(`📝 Oluşturuluyor: ${activity.title}`);
        
        // Activity content'i JSON string'e çevir
        const contentJson = JSON.stringify(activity.content);
        
        const createdActivity = await prisma.codeArena.create({
          data: {
            title: activity.title,
            description: activity.description,
            content: contentJson,
            activityType: activity.activityType,
            category: activity.category,
            difficulty: activity.difficulty,
            diamondReward: activity.diamondReward,
            experienceReward: activity.experienceReward,
            estimatedMinutes: activity.estimatedMinutes,
            tags: activity.tags.join(','), // Array'i string'e çevir
            isActive: activity.isActive,
            sortOrder: activity.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ Başarılı: ${createdActivity.title} (ID: ${createdActivity.id})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Hata (${activity.title}):`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n🎯 ÖZET:');
    console.log(`✅ Başarılı: ${successCount} aktivite`);
    console.log(`❌ Hatalı: ${errorCount} aktivite`);
    console.log(`💎 Toplam Ödül: ${contentData.activities.reduce((sum, a) => sum + a.diamondReward, 0)} Diamond`);
    console.log(`⭐ Toplam XP: ${contentData.activities.reduce((sum, a) => sum + a.experienceReward, 0)} Experience`);
    
    if (successCount > 0) {
      console.log('\n🚀 Admin paneline git: http://localhost:3000/admin/learning-activities');
      console.log('🎮 Code Arena\'ya git: http://localhost:3000/code-arena');
    }
    
  } catch (error) {
    console.error('💥 Genel hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
createActivities()
  .then(() => {
    console.log('\n🏁 Script tamamlandı!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script hatası:', error);
    process.exit(1);
  });