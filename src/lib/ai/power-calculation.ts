import { assignRarityByDropRate } from "./drop-rate-system";

interface PowerRange {
  attackPower: { min: number; max: number };
  defense: { min: number; max: number };
  speed: { min: number; max: number };
}

interface RarityPowerConfig {
  [raritySlug: string]: PowerRange;
}

// Rarity bazlı güç değeri aralıkları (rebalance script ile aynı)
// Makul güç değer aralıkları (0-100 arası)
const rarityPowerConfig: RarityPowerConfig = {
  "common": {
    attackPower: { min: 20, max: 40 },
    defense: { min: 15, max: 35 },
    speed: { min: 10, max: 30 }
  },
  "uncommon": {
    attackPower: { min: 35, max: 55 },
    defense: { min: 30, max: 50 },
    speed: { min: 25, max: 45 }
  },
  "rare": {
    attackPower: { min: 50, max: 70 },
    defense: { min: 45, max: 65 },
    speed: { min: 40, max: 60 }
  },
  "super rare": {
    attackPower: { min: 65, max: 85 },
    defense: { min: 60, max: 80 },
    speed: { min: 55, max: 75 }
  },
  "ultra rare": {
    attackPower: { min: 75, max: 90 },
    defense: { min: 70, max: 85 },
    speed: { min: 65, max: 80 }
  },
  "epic": {
    attackPower: { min: 85, max: 100 },
    defense: { min: 80, max: 95 },
    speed: { min: 75, max: 90 }
  },
  "legendary": {
    attackPower: { min: 95, max: 100 },
    defense: { min: 90, max: 100 },
    speed: { min: 85, max: 100 }
  },
  "secret rare": {
    attackPower: { min: 90, max: 100 },
    defense: { min: 85, max: 100 },
    speed: { min: 80, max: 95 }
  }
};

/**
 * Rarity'e göre güç değerlerini hesaplar
 */
export function calculatePowerByRarity(
  rarity: string, 
  cardId: string, 
  fileName: string
): {
  attackPower: number;
  defense: number;
  speed: number;
} {
  // Normalize rarity names
  const normalizedRarity = rarity.toLowerCase().replace(/[-_]/g, ' ');
  const powerConfig = rarityPowerConfig[normalizedRarity] || rarityPowerConfig['common'];
  
  // Tutarlı güç değerleri üret (aynı kart her zaman aynı değerleri alacak)
  return generateConsistentPowers(cardId, fileName, powerConfig);
}

/**
 * Kart ID ve filename'den tutarlı güç değerleri üretir
 */
function generateConsistentPowers(cardId: string, fileName: string, config: PowerRange) {
  // Kart ID ve filename'den deterministik seed oluştur
  const seed = generateSeed(cardId + fileName);
  
  // Seeded random number generator
  const random1 = seededRandom(seed);
  const random2 = seededRandom(seed + 1);
  const random3 = seededRandom(seed + 2);

  // Biraz varyasyon ekle (±10%)
  const variation1 = 0.9 + (random1 * 0.2); // 0.9 - 1.1
  const variation2 = 0.9 + (random2 * 0.2);
  const variation3 = 0.9 + (random3 * 0.2);

  const attackPower = Math.round(
    (config.attackPower.min + (random1 * (config.attackPower.max - config.attackPower.min))) * variation1
  );
  
  const defense = Math.round(
    (config.defense.min + (random2 * (config.defense.max - config.defense.min))) * variation2
  );
  
  const speed = Math.round(
    (config.speed.min + (random3 * (config.speed.max - config.speed.min))) * variation3
  );

  return { attackPower, defense, speed };
}

/**
 * String'den deterministic seed üretir
 */
function generateSeed(str: string): number {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed += str.charCodeAt(i) * (i + 1);
  }
  return seed % 2147483647; // 32-bit int max
}

/**
 * Seeded random number generator (0-1 arası)
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Rarity'nin power level'ını al (karşılaştırma için)
 */
export function getRarityPowerLevel(rarity: string): number {
  const config = rarityPowerConfig[rarity] || rarityPowerConfig['common'];
  return (config.attackPower.min + config.attackPower.max) / 2;
}

/**
 * Rarity listesini güç seviyesine göre sırala
 */
export function sortRaritiesByPower(): string[] {
  return Object.keys(rarityPowerConfig).sort((a, b) => {
    return getRarityPowerLevel(a) - getRarityPowerLevel(b);
  });
}

/**
 * Mevcut generateRandomCardProperties fonksiyonunu rarity-aware yapan wrapper
 */
export async function generateRarityAwareCardProperties(
  estimatedValue: number,
  rarity: string,
  cardId: string,
  fileName: string,
  category?: string
) {
  // Rarity'e göre güç değerlerini hesapla
  const powers = calculatePowerByRarity(rarity, cardId, fileName);
  
  // Diğer random özellikler için seed'i kullan
  const seed = generateSeed(cardId + fileName + rarity);
  const random1 = seededRandom(seed + 10);
  const random2 = seededRandom(seed + 20);
  const random3 = seededRandom(seed + 30);
  const random4 = seededRandom(seed + 40);

  // Elementleri veritabanından çek
  let elements = ['fire', 'water', 'earth', 'air']; // Fallback
  try {
    const { prisma } = await import("../prisma");
    const dbElements = await prisma.element.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    if (dbElements.length > 0) {
      elements = dbElements.map(e => e.slug);
    }
  } catch (error) {
    console.error('Error fetching elements:', error);
  }
  
  // Special abilities'i rarity'e göre veritabanından çek
  let rarityAbilities = ['Basic Strike', 'Simple Defense', 'Quick Step']; // Fallback
  let rarityLevel = 1;
  
  try {
    const { prisma } = await import("../prisma");
    const rarityData = await prisma.rarity.findFirst({
      where: {
        OR: [
          { slug: rarity.toLowerCase().replace(/\s+/g, '-') },
          { name: { equals: rarity, mode: 'insensitive' } }
        ],
        isActive: true
      }
    });
    
    if (rarityData) {
      rarityLevel = rarityData.level;
      
      // Rarity level'a göre abilities üret
      const baseAbilities = [
        'Strike', 'Defense', 'Speed Boost', 'Energy Burst', 'Shield', 'Attack',
        'Power Strike', 'Magic Burst', 'Critical Hit', 'Lightning Speed',
        'Ultimate Strike', 'Divine Protection', 'Reality Bend', 'Time Warp',
        'Cosmic Power', 'Dimensional Shift', 'God Strike', 'Creation Power'
      ];
      
      const rarityPrefixes: { [key: number]: string[] } = {
        1: ['Basic', 'Simple', 'Quick'],
        2: ['Enhanced', 'Improved', 'Better'],
        3: ['Advanced', 'Superior', 'Strong'],
        4: ['Master', 'Expert', 'Powerful'],
        5: ['Epic', 'Legendary', 'Ultimate'],
        6: ['Divine', 'Supreme', 'Absolute'],
        7: ['Godlike', 'Infinite', 'Eternal'],
        8: ['Cosmic', 'Universal', 'Omnipotent']
      };
      
      const prefixes = rarityPrefixes[Math.min(rarityLevel, 8)] || rarityPrefixes[1];
      const prefix = prefixes[Math.floor(random2 * prefixes.length)];
      const ability = baseAbilities[Math.floor(random2 * baseAbilities.length)];
      
      rarityAbilities = [`${prefix} ${ability}`];
    }
  } catch (error) {
    console.error('Error fetching rarity data:', error);
  }

  // Rating hesaplama (rarity level'a göre)
  const baseRating = rarityLevel || 1;
  const rating = Math.min(10, baseRating + (random4 * 2)); // ±2 varyasyon

  // Kategoriye göre dinamik isim üret
  let cardTitle = '';
  
  try {
    // Kategorinin isimlendirme kurallarını veritabanından çek
    const { prisma } = await import("../prisma");
    const categoryData = await prisma.category.findFirst({
      where: { slug: category }
    });
    
    if (categoryData && categoryData.namingNames && categoryData.namingFormats) {
      const names = JSON.parse(categoryData.namingNames);
      const prefixes = categoryData.namingPrefixes ? JSON.parse(categoryData.namingPrefixes) : [];
      const suffixes = categoryData.namingSuffixes ? JSON.parse(categoryData.namingSuffixes) : [];
      const formats = JSON.parse(categoryData.namingFormats);
      
      const selectedName = names[Math.floor(random1 * names.length)];
      const selectedPrefix = prefixes.length > 0 ? prefixes[Math.floor(random2 * prefixes.length)] : '';
      const selectedSuffix = suffixes.length > 0 ? suffixes[Math.floor(random3 * suffixes.length)] : '';
      const selectedFormat = formats[Math.floor(random1 * formats.length)];
      
      // Format string'ini değiştir
      cardTitle = selectedFormat
        .replace('{name}', selectedName)
        .replace('{prefix}', selectedPrefix)
        .replace('{suffix}', selectedSuffix);
    } else {
      // Fallback: Default anime collection için isimler
      const animeNames = [
        'Akira', 'Yuki', 'Sakura', 'Hiro', 'Rei', 'Sora', 'Kyo', 'Rin', 'Ryu', 'Yoko',
        'Natsu', 'Lucy', 'Erza', 'Gray', 'Wendy', 'Gajeel', 'Levy', 'Juvia', 'Laxus',
        'Ichigo', 'Rukia', 'Orihime', 'Uryu', 'Chad', 'Renji', 'Byakuya', 'Toshiro',
        'Naruto', 'Sasuke', 'Sakura', 'Kakashi', 'Itachi', 'Gaara', 'Hinata', 'Shikamaru',
        'Luffy', 'Zoro', 'Nami', 'Sanji', 'Chopper', 'Robin', 'Franky', 'Brook',
        'Goku', 'Vegeta', 'Gohan', 'Piccolo', 'Krillin', 'Yamcha', 'Tien', 'Chiaotzu',
        'Edward', 'Alphonse', 'Winry', 'Roy', 'Riza', 'Hughes', 'Armstrong', 'Izumi',
        'Tanjiro', 'Nezuko', 'Zenitsu', 'Inosuke', 'Giyu', 'Shinobu', 'Rengoku', 'Tengen',
        'Izuku', 'Bakugo', 'Todoroki', 'Ochaco', 'Iida', 'Momo', 'Kirishima', 'Denki'
      ];

      const animeTitles = [
        'Guardian', 'Master', 'Champion', 'Hero', 'Warrior', 'Knight', 'Mage', 'Hunter',
        'Prince', 'Princess', 'King', 'Queen', 'Emperor', 'Lord', 'Lady', 'Spirit',
        'Dragon', 'Phoenix', 'Tiger', 'Wolf', 'Lion', 'Eagle', 'Shadow', 'Light',
        'Fire', 'Ice', 'Thunder', 'Storm', 'Wind', 'Earth', 'Water', 'Crystal'
      ];

      const selectedName = animeNames[Math.floor(random1 * animeNames.length)];
      const selectedTitle = animeTitles[Math.floor(random2 * animeTitles.length)];
      
      const animeFormats = [
        `${selectedTitle} ${selectedName}`,
        `${selectedName} the ${selectedTitle}`,
        `${selectedName} ${selectedTitle}`,
        `${selectedTitle} of ${selectedName}`
      ];
      
      cardTitle = animeFormats[Math.floor(random3 * animeFormats.length)];
    }
  } catch (error) {
    console.error('Error fetching category naming rules:', error);
    // Fallback isim üret
    cardTitle = `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Card ${Math.floor(random1 * 1000)}`;
  }

  return {
    cardTitle,
    attackPower: powers.attackPower,
    defense: powers.defense,
    speed: powers.speed,
    specialAbility: rarityAbilities[Math.floor(random2 * rarityAbilities.length)],
    element: elements[Math.floor(random3 * elements.length)],
    rarityLevel: rarityLevel,
    rating: Math.round(rating * 10) / 10, // 1 decimal place
  };
}
