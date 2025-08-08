const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function seedProgressiveLearning() {
  console.log('🌱 Progressive learning activities seeding başlıyor...');

  try {
    // Önce mevcut activities'leri temizle
    await prisma.activityAttempt.deleteMany();
    await prisma.learningActivity.deleteMany();

    // Topic-based progressive activities
    const activities = [
      // JavaScript Temelleri - Topic 1
      {
        title: "Değişken Tanımlama Oyunu",
        description: "JavaScript'te değişken tanımlama kurallarını öğren",
        activityType: "memory_game",
        difficulty: 1,
        category: "JavaScript Temelleri",
        topicOrder: 1,
        diamondReward: 5,
        experienceReward: 10,
        content: {
          pairs: [
            { id: 1, content: "let", match: "Değişken değer" },
            { id: 2, content: "const", match: "Sabit değer" },
            { id: 3, content: "var", match: "Eski syntax" },
            { id: 4, content: "string", match: "Metin tipi" },
            { id: 5, content: "number", match: "Sayı tipi" },
            { id: 6, content: "boolean", match: "true/false" }
          ]
        },
        isLocked: false,
        prerequisiteIds: []
      },
      {
        title: "Veri Tipleri Eşleştirme",
        description: "JavaScript veri tiplerini doğru örnekleriyle eşleştir",
        activityType: "memory_game",
        difficulty: 1,
        category: "JavaScript Temelleri",
        topicOrder: 2,
        diamondReward: 8,
        experienceReward: 15,
        content: {
          pairs: [
            { id: 1, content: "'Hello'", match: "String" },
            { id: 2, content: "42", match: "Number" },
            { id: 3, content: "true", match: "Boolean" },
            { id: 4, content: "null", match: "Null" },
            { id: 5, content: "undefined", match: "Undefined" },
            { id: 6, content: "[]", match: "Array" }
          ]
        },
        isLocked: true,
        prerequisiteIds: []
      },

      // Fonksiyonlar - Topic 2  
      {
        title: "Fonksiyon Söz Dizimi",
        description: "Farklı fonksiyon tanımlama yöntemlerini öğren",
        activityType: "memory_game",
        difficulty: 2,
        category: "Fonksiyonlar",
        topicOrder: 1,
        diamondReward: 10,
        experienceReward: 20,
        content: {
          pairs: [
            { id: 1, content: "function name()", match: "Function Declaration" },
            { id: 2, content: "const f = () =>", match: "Arrow Function" },
            { id: 3, content: "const f = function()", match: "Function Expression" },
            { id: 4, content: "return", match: "Değer döndür" },
            { id: 5, content: "parameters", match: "Girdi değerleri" },
            { id: 6, content: "()", match: "Fonksiyon çağır" }
          ]
        },
        isLocked: true,
        prerequisiteIds: []
      },
      {
        title: "Scope ve Hoisting",
        description: "JavaScript'te scope kuralları ve hoisting kavramı",
        activityType: "memory_game",
        difficulty: 2,
        category: "Fonksiyonlar",
        topicOrder: 2,
        diamondReward: 12,
        experienceReward: 25,
        content: {
          pairs: [
            { id: 1, content: "Global Scope", match: "Her yerden erişim" },
            { id: 2, content: "Function Scope", match: "Fonksiyon içi" },
            { id: 3, content: "Block Scope", match: "Blok içi" },
            { id: 4, content: "Hoisting", match: "Yukarı taşıma" },
            { id: 5, content: "let/const", match: "Block scoped" },
            { id: 6, content: "var", match: "Function scoped" }
          ]
        },
        isLocked: true,
        prerequisiteIds: []
      },

      // Nesneler ve Diziler - Topic 3
      {
        title: "Nesne Özellikleri",
        description: "JavaScript nesnelerinin temel özelliklerini öğren",
        activityType: "memory_game",
        difficulty: 3,
        category: "Nesneler ve Diziler",
        topicOrder: 1,
        diamondReward: 15,
        experienceReward: 30,
        content: {
          pairs: [
            { id: 1, content: "object.property", match: "Dot notation" },
            { id: 2, content: "object['key']", match: "Bracket notation" },
            { id: 3, content: "Object.keys()", match: "Anahtar listesi" },
            { id: 4, content: "Object.values()", match: "Değer listesi" },
            { id: 5, content: "this", match: "Mevcut nesne" },
            { id: 6, content: "constructor", match: "Yapıcı fonksiyon" }
          ]
        },
        isLocked: true,
        prerequisiteIds: []
      },
      {
        title: "Dizi Metodları",
        description: "JavaScript dizi metodlarını ve kullanımlarını öğren",
        activityType: "memory_game",
        difficulty: 4,
        category: "Nesneler ve Diziler",
        topicOrder: 2,
        diamondReward: 20,
        experienceReward: 40,
        content: {
          pairs: [
            { id: 1, content: "push()", match: "Sona ekle" },
            { id: 2, content: "pop()", match: "Sondan çıkar" },
            { id: 3, content: "map()", match: "Dönüştür" },
            { id: 4, content: "filter()", match: "Filtrele" },
            { id: 5, content: "reduce()", match: "Birleştir" },
            { id: 6, content: "forEach()", match: "Her biri için" }
          ]
        },
        isLocked: true,
        prerequisiteIds: []
      },

      // Asenkron Programlama - Topic 4
      {
        title: "Promise Temelleri",
        description: "JavaScript Promise yapısını ve kullanımını öğren",
        activityType: "memory_game",
        difficulty: 5,
        category: "Asenkron Programlama",
        topicOrder: 1,
        diamondReward: 25,
        experienceReward: 50,
        content: {
          pairs: [
            { id: 1, content: "Promise", match: "Gelecek değer" },
            { id: 2, content: "resolve", match: "Başarılı sonuç" },
            { id: 3, content: "reject", match: "Hata durumu" },
            { id: 4, content: ".then()", match: "Başarı callback" },
            { id: 5, content: ".catch()", match: "Hata callback" },
            { id: 6, content: "async/await", match: "Modern syntax" }
          ]
        },
        isLocked: true,
        prerequisiteIds: []
      }
    ];

    console.log('📝 Activities oluşturuluyor...');

    // Activities'leri sırayla oluştur ve prerequisite ilişkilerini kur
    const createdActivities = [];
    
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      
      // Prerequisite ID'lerini belirle (sadece tek prerequisite)
      let prerequisiteId = null;
      if (i > 0) {
        // Her topic'in ikinci aktivitesi, aynı topic'in birinci aktivitesini gerektirir
        if (activity.topicOrder === 2) {
          const prevActivityInTopic = createdActivities.find(a =>
            a.category === activity.category && a.topicOrder === 1
          );
          if (prevActivityInTopic) {
            prerequisiteId = prevActivityInTopic.id;
          }
        }
        // Yeni topic'in ilk aktivitesi, önceki topic'in son aktivitesini gerektirir
        else if (activity.topicOrder === 1 && i > 1) {
          const topics = ["JavaScript Temelleri", "Fonksiyonlar", "Nesneler ve Diziler", "Asenkron Programlama"];
          const currentTopicIndex = topics.indexOf(activity.category);
          if (currentTopicIndex > 0) {
            const prevTopic = topics[currentTopicIndex - 1];
            const prevTopicActivities = createdActivities.filter(a => a.category === prevTopic);
            const lastActivityInPrevTopic = prevTopicActivities[prevTopicActivities.length - 1];
            if (lastActivityInPrevTopic) {
              prerequisiteId = lastActivityInPrevTopic.id;
            }
          }
        }
      }

      const created = await prisma.learningActivity.create({
        data: {
          title: activity.title,
          description: activity.description,
          activityType: activity.activityType,
          difficulty: activity.difficulty,
          category: activity.category,
          topicOrder: activity.topicOrder,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          content: JSON.stringify(activity.content),
          isLocked: activity.isLocked,
          isActive: true,
          prerequisiteId: prerequisiteId,
          estimatedMinutes: 5
        }
      });

      createdActivities.push(created);
      console.log(`✅ ${created.title} oluşturuldu`);
    }


    console.log('🎉 Progressive learning activities başarıyla oluşturuldu!');
    console.log(`📊 Toplam ${createdActivities.length} aktivite oluşturuldu`);
    
    // Category'leri ve aktivite sayılarını göster
    const categories = [...new Set(createdActivities.map(a => a.category))];
    categories.forEach(category => {
      const categoryActivities = createdActivities.filter(a => a.category === category);
      console.log(`📚 ${category}: ${categoryActivities.length} aktivite`);
    });

  } catch (error) {
    console.error('❌ Seed işlemi sırasında hata:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProgressiveLearning()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });