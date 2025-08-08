const fs = require('fs');
const path = require('path');

// Web API kullanarak aktivite oluşturma
async function createActivitiesViaAPI() {
  const BASE_URL = 'http://localhost:3000';
  
  console.log('🚀 Python Code Arena aktivitelerini web API ile oluşturuyor...');
  
  try {
    // Önce admin olarak login ol
    console.log('🔐 Admin girişi yapılıyor...');
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail: 'admin',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Admin girişi başarısız:', await loginResponse.text());
      return;
    }

    const loginResult = await loginResponse.json();
    console.log('✅ Admin girişi başarılı!');

    // Cookie'yi al
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let authToken = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authToken = match[1];
      }
    }

    // Python content dosyasını oku
    const contentPath = path.join(__dirname, 'python-beginner-content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    let successCount = 0;
    let errorCount = 0;
    
    // Her aktivite için API çağrısı yap
    for (const activity of contentData.activities) {
      try {
        console.log(`📝 Oluşturuluyor: ${activity.title}`);
        
        const apiData = {
          title: activity.title,
          description: activity.description,
          content: activity.content, // Zaten JSON olarak hazırlanmış
          activityType: activity.activityType,
          category: activity.category,
          difficulty: activity.difficulty,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          estimatedMinutes: activity.estimatedMinutes,
          tags: activity.tags, // Array olarak gönder
          isActive: activity.isActive,
          sortOrder: activity.sortOrder
        };
        
        // Fetch ile API çağrısı - LearningActivity API'sini kullan
        const response = await fetch(`${BASE_URL}/api/admin/learning-activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `auth-token=${authToken}`
          },
          body: JSON.stringify(apiData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Başarılı: ${result.title} (ID: ${result.id})`);
          successCount++;
        } else {
          const error = await response.text();
          console.error(`❌ API Hatası (${activity.title}): ${response.status} - ${error}`);
          errorCount++;
        }
        
        // Rate limiting için biraz bekle
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
  }
}

// Node.js'de fetch yoksa, polyfill ekle
if (typeof fetch === 'undefined') {
  // fetch polyfill için import
  (async () => {
    const { default: fetch } = await import('node-fetch');
    global.fetch = fetch;
    await createActivitiesViaAPI();
  })();
} else {
  createActivitiesViaAPI();
}