const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function seedRarities() {
  console.log('🎯 Seeding rarities...');
  
  const rarities = [
    {
      name: 'Common',
      slug: 'common',
      description: 'Standard rarity cards that are easy to find',
      color: '#6B7280',
      bgColor: '#F9FAFB',
      borderColor: '#D1D5DB',
      textColor: '#374151',
      level: 1,
      dropRate: 50.0,
      minDiamondPrice: 10,
      maxDiamondPrice: 50,
      sortOrder: 1,
    },
    {
      name: 'Uncommon',
      slug: 'uncommon',
      description: 'Slightly rare cards with better artwork',
      color: '#059669',
      bgColor: '#F0FDF4',
      borderColor: '#22C55E',
      textColor: '#166534',
      level: 2,
      dropRate: 25.0,
      minDiamondPrice: 30,
      maxDiamondPrice: 80,
      sortOrder: 2,
    },
    {
      name: 'Rare',
      slug: 'rare',
      description: 'Rare cards with enhanced details and effects',
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#3B82F6',
      textColor: '#1E40AF',
      gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
      level: 3,
      dropRate: 15.0,
      minDiamondPrice: 100,
      maxDiamondPrice: 300,
      sortOrder: 3,
    },
    {
      name: 'Super Rare',
      slug: 'super-rare',
      description: 'Very rare cards with special abilities',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#8B5CF6',
      textColor: '#5B21B6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      animation: 'pulse',
      level: 4,
      dropRate: 7.0,
      minDiamondPrice: 300,
      maxDiamondPrice: 600,
      sortOrder: 4,
    },
    {
      name: 'Epic',
      slug: 'epic',
      description: 'Epic cards with powerful abilities and stunning art',
      color: '#9333EA',
      bgColor: '#FAF5FF',
      borderColor: '#A855F7',
      textColor: '#6B21A8',
      gradient: 'linear-gradient(135deg, #A855F7, #9333EA)',
      animation: 'pulse-slow',
      level: 5,
      dropRate: 4.0,
      minDiamondPrice: 400,
      maxDiamondPrice: 800,
      sortOrder: 5,
    },
    {
      name: 'Ultra Rare',
      slug: 'ultra-rare',
      description: 'Ultra rare cards with magnificent artwork',
      color: '#EA580C',
      bgColor: '#FFF7ED',
      borderColor: '#FB923C',
      textColor: '#C2410C',
      gradient: 'linear-gradient(135deg, #FB923C, #EA580C)',
      animation: 'glow',
      level: 6,
      dropRate: 2.0,
      minDiamondPrice: 600,
      maxDiamondPrice: 1200,
      sortOrder: 6,
    },
    {
      name: 'Secret Rare',
      slug: 'secret-rare',
      description: 'Secret rare cards with hidden abilities',
      color: '#DC2626',
      bgColor: '#FEF2F2',
      borderColor: '#EF4444',
      textColor: '#991B1B',
      gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
      animation: 'shimmer',
      level: 7,
      dropRate: 1.0,
      minDiamondPrice: 1200,
      maxDiamondPrice: 2500,
      sortOrder: 7,
    },
    {
      name: 'Legendary',
      slug: 'legendary',
      description: 'Legendary cards of ultimate power and beauty',
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FBBF24',
      textColor: '#92400E',
      gradient: 'linear-gradient(135deg, #FBBF24, #F59E0B, #D97706)',
      animation: 'legendary-glow',
      level: 8,
      dropRate: 0.5,
      minDiamondPrice: 2500,
      maxDiamondPrice: 5000,
      sortOrder: 8,
    },
  ];

  for (const rarity of rarities) {
    await prisma.rarity.upsert({
      where: { slug: rarity.slug },
      update: rarity,
      create: rarity,
    });
    console.log(`✅ Created/Updated rarity: ${rarity.name}`);
  }
}

async function seedElements() {
  console.log('⚡ Seeding elements...');
  
  const elements = [
    {
      name: 'Fire',
      slug: 'fire',
      description: 'Burning power that increases attack damage',
      color: '#DC2626',
      icon: '🔥',
      effectDescription: '+10% Attack Power, Burn effect on enemies',
      priceModifier: 1.2,
      sortOrder: 1,
    },
    {
      name: 'Water',
      slug: 'water',
      description: 'Fluid defense that absorbs damage',
      color: '#2563EB',
      icon: '💧',
      effectDescription: '+15% Defense, Healing over time',
      priceModifier: 1.1,
      sortOrder: 2,
    },
    {
      name: 'Earth',
      slug: 'earth',
      description: 'Solid foundation with high endurance',
      color: '#059669',
      icon: '🌍',
      effectDescription: '+20% Defense, Immunity to poison',
      priceModifier: 1.15,
      sortOrder: 3,
    },
    {
      name: 'Air',
      slug: 'air',
      description: 'Swift movement with incredible speed',
      color: '#7C3AED',
      icon: '💨',
      effectDescription: '+25% Speed, Dodge chance increased',
      priceModifier: 1.3,
      sortOrder: 4,
    },
    {
      name: 'Lightning',
      slug: 'lightning',
      description: 'Electric power with stunning effects',
      color: '#FBBF24',
      icon: '⚡',
      effectDescription: '+30% Attack, Stun enemies',
      priceModifier: 1.4,
      sortOrder: 5,
    },
    {
      name: 'Ice',
      slug: 'ice',
      description: 'Freezing cold that slows enemies',
      color: '#06B6D4',
      icon: '❄️',
      effectDescription: '+10% Defense, Freeze enemies',
      priceModifier: 1.25,
      sortOrder: 6,
    },
    {
      name: 'Light',
      slug: 'light',
      description: 'Holy power that heals and protects',
      color: '#F59E0B',
      icon: '✨',
      effectDescription: '+20% All stats, Healing abilities',
      priceModifier: 1.5,
      sortOrder: 7,
    },
    {
      name: 'Dark',
      slug: 'dark',
      description: 'Shadow power with mysterious abilities',
      color: '#6B21A8',
      icon: '🌙',
      effectDescription: '+25% Attack, Life steal abilities',
      priceModifier: 1.6,
      sortOrder: 8,
    },
    {
      name: 'Neutral',
      slug: 'neutral',
      description: 'Balanced element without specific weaknesses',
      color: '#6B7280',
      icon: '⚪',
      effectDescription: 'No elemental bonuses, balanced stats',
      priceModifier: 1.0,
      sortOrder: 9,
    },
  ];

  for (const element of elements) {
    await prisma.element.upsert({
      where: { slug: element.slug },
      update: element,
      create: element,
    });
    console.log(`✅ Created/Updated element: ${element.name}`);
  }
}

async function seedCardStyles() {
  console.log('🎨 Seeding card styles...');
  
  const cardStyles = [
    // Rarity-based styles
    {
      name: 'Common Card Style',
      targetType: 'rarity',
      targetValue: 'common',
      containerClass: 'bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-lg border border-gray-200',
      imageClass: 'bg-gray-100 rounded-md overflow-hidden',
      borderClass: 'border-gray-200',
      backgroundClass: 'bg-white',
      animationClass: 'transition-all duration-300',
      priority: 1,
    },
    {
      name: 'Rare Card Style',
      targetType: 'rarity',
      targetValue: 'rare',
      containerClass: 'bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-xl border-2 border-blue-300',
      imageClass: 'bg-gradient-to-br from-blue-50 to-blue-100 rounded-md overflow-hidden ring-2 ring-blue-300',
      borderClass: 'border-blue-300',
      backgroundClass: 'bg-gradient-to-br from-blue-50 to-blue-100',
      animationClass: 'animate-pulse-slow hover:scale-105 transition-all duration-300',
      glowEffect: 'hover:shadow-blue-200/50',
      priority: 3,
    },
    {
      name: 'Epic Card Style',
      targetType: 'rarity',
      targetValue: 'epic',
      containerClass: 'bg-white/80 backdrop-blur-sm rounded-lg shadow hover:shadow-2xl border-2 border-purple-400',
      imageClass: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-md overflow-hidden ring-2 ring-purple-400',
      borderClass: 'border-purple-400',
      backgroundClass: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200',
      animationClass: 'animate-pulse-slow hover:scale-105 transition-all duration-300',
      glowEffect: 'hover:shadow-purple-300/50',
      priority: 5,
    },
    {
      name: 'Legendary Card Style',
      targetType: 'rarity',
      targetValue: 'legendary',
      containerClass: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-yellow-400 legendary-glow',
      imageClass: 'bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-200 rounded-md overflow-hidden ring-4 ring-yellow-400 shadow-xl legendary-shimmer',
      borderClass: 'border-yellow-400',
      backgroundClass: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50',
      animationClass: 'animate-pulse animate-float hover:scale-110 transition-all duration-500',
      glowEffect: 'legendary-glow shadow-yellow-400/50',
      hoverEffect: 'hover:scale-110 hover:rotate-1',
      priority: 8,
    },
    {
      name: 'Ultra Rare Card Style',
      targetType: 'rarity',
      targetValue: 'ultra-rare',
      containerClass: 'bg-white/80 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl border-2 border-orange-400 ultra-rare-glow',
      imageClass: 'bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 rounded-md overflow-hidden ring-2 ring-orange-400 shadow-inner',
      borderClass: 'border-orange-400',
      backgroundClass: 'bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200',
      animationClass: 'animate-pulse-slow hover:scale-105 transition-all duration-300',
      glowEffect: 'ultra-rare-glow shadow-orange-300/50',
      priority: 6,
    },
    {
      name: 'Secret Rare Card Style',
      targetType: 'rarity',
      targetValue: 'secret-rare',
      containerClass: 'bg-gradient-to-br from-red-50 to-red-100 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl border-2 border-red-500 secret-rare-glow',
      imageClass: 'bg-gradient-to-br from-red-100 via-red-200 to-red-300 rounded-md overflow-hidden ring-2 ring-red-500 shadow-lg',
      borderClass: 'border-red-500',
      backgroundClass: 'bg-gradient-to-br from-red-50 to-red-100',
      animationClass: 'animate-pulse hover:scale-105 transition-all duration-300',
      glowEffect: 'secret-rare-glow shadow-red-400/50',
      priority: 7,
    },
    // Element-based styles
    {
      name: 'Fire Element Style',
      targetType: 'element',
      targetValue: 'fire',
      containerClass: 'border-red-300 bg-red-50/50',
      imageClass: 'ring-1 ring-red-300',
      borderClass: 'border-red-300',
      glowEffect: 'shadow-red-200/30',
      priority: 10,
    },
    {
      name: 'Water Element Style',
      targetType: 'element',
      targetValue: 'water',
      containerClass: 'border-blue-300 bg-blue-50/50',
      imageClass: 'ring-1 ring-blue-300',
      borderClass: 'border-blue-300',
      glowEffect: 'shadow-blue-200/30',
      priority: 10,
    },
    {
      name: 'Lightning Element Style',
      targetType: 'element',
      targetValue: 'lightning',
      containerClass: 'border-yellow-300 bg-yellow-50/50',
      imageClass: 'ring-1 ring-yellow-300',
      borderClass: 'border-yellow-300',
      glowEffect: 'shadow-yellow-200/30',
      animationClass: 'animate-pulse',
      priority: 10,
    },
  ];

  for (const style of cardStyles) {
    await prisma.cardStyle.upsert({
      where: { name: style.name },
      update: style,
      create: style,
    });
    console.log(`✅ Created/Updated card style: ${style.name}`);
  }
}

async function seedDiamondPackages() {
  console.log('💎 Seeding diamond packages...');
  
  const packages = [
    {
      name: 'Starter Pack',
      packageType: 'starter',
      diamonds: 100,
      price: 9.99,
      bonus: 0,
      popular: false,
      bestValue: false,
      level: 1,
      badge: 'NEW',
      color: '#10B981',
      glow: '#10B981',
      icon: '🌟',
      features: JSON.stringify(['100 Diamonds', 'Perfect for beginners', 'Instant delivery']),
      sortOrder: 1,
    },
    {
      name: 'Popular Pack',
      packageType: 'popular',
      diamonds: 500,
      price: 39.99,
      originalPrice: 49.99,
      bonus: 50,
      popular: true,
      bestValue: false,
      level: 2,
      badge: 'POPULAR',
      color: '#3B82F6',
      glow: '#3B82F6',
      icon: '🔥',
      features: JSON.stringify(['500 Diamonds', '+50 Bonus', 'Most chosen pack', 'Great value']),
      sortOrder: 2,
    },
    {
      name: 'Premium Pack',
      packageType: 'premium',
      diamonds: 1200,
      price: 79.99,
      originalPrice: 99.99,
      bonus: 200,
      popular: false,
      bestValue: true,
      level: 3,
      badge: 'BEST VALUE',
      color: '#8B5CF6',
      glow: '#8B5CF6',
      icon: '💜',
      features: JSON.stringify(['1200 Diamonds', '+200 Bonus', 'Best value for money', 'Premium support']),
      sortOrder: 3,
    },
    {
      name: 'Ultimate Pack',
      packageType: 'ultimate',
      diamonds: 2500,
      price: 149.99,
      originalPrice: 199.99,
      bonus: 500,
      popular: false,
      bestValue: false,
      level: 4,
      badge: 'ULTIMATE',
      color: '#F59E0B',
      glow: '#F59E0B',
      icon: '👑',
      features: JSON.stringify(['2500 Diamonds', '+500 Bonus', 'Ultimate power', 'VIP treatment', 'Priority support']),
      sortOrder: 4,
    },
    {
      name: 'Mega Pack',
      packageType: 'mega',
      diamonds: 5000,
      price: 249.99,
      originalPrice: 349.99,
      bonus: 1000,
      popular: false,
      bestValue: false,
      level: 5,
      badge: 'MEGA',
      color: '#EF4444',
      glow: '#EF4444',
      icon: '🚀',
      features: JSON.stringify(['5000 Diamonds', '+1000 Bonus', 'Mega value', 'Exclusive content', 'Dedicated support', 'Special rewards']),
      sortOrder: 5,
    },
  ];

  for (const pkg of packages) {
    await prisma.diamondPackage.upsert({
      where: { packageType: pkg.packageType },
      update: pkg,
      create: pkg,
    });
    console.log(`✅ Created/Updated diamond package: ${pkg.name}`);
  }
}

async function seedCategories() {
  console.log('📂 Seeding categories...');
  
  const categories = [
    {
      name: 'Anime Collection',
      slug: 'anime-collection',
      description: 'Traditional anime cards featuring beloved characters from popular series',
      color: '#FF6B6B',
      icon: '🎌',
      sortOrder: 1,
      namingPrefixes: JSON.stringify([
        'Guardian', 'Master', 'Champion', 'Hero', 'Warrior', 'Knight', 'Mage', 'Hunter',
        'Prince', 'Princess', 'King', 'Queen', 'Emperor', 'Lord', 'Lady', 'Spirit',
        'Dragon', 'Phoenix', 'Tiger', 'Wolf', 'Lion', 'Eagle', 'Shadow', 'Light',
        'Fire', 'Ice', 'Thunder', 'Storm', 'Wind', 'Earth', 'Water', 'Crystal'
      ]),
      namingSuffixes: JSON.stringify([
        'Guardian', 'Master', 'Champion', 'Hero', 'Warrior', 'Knight', 'Mage', 'Hunter',
        'Spirit', 'Soul', 'Heart', 'Eye', 'Breath', 'Power', 'Sword', 'Shield'
      ]),
      namingNames: JSON.stringify([
        'Akira', 'Yuki', 'Sakura', 'Hiro', 'Rei', 'Sora', 'Kyo', 'Rin', 'Ryu', 'Yoko',
        'Natsu', 'Lucy', 'Erza', 'Gray', 'Wendy', 'Gajeel', 'Levy', 'Juvia', 'Laxus',
        'Ichigo', 'Rukia', 'Orihime', 'Uryu', 'Chad', 'Renji', 'Byakuya', 'Toshiro',
        'Naruto', 'Sasuke', 'Sakura', 'Kakashi', 'Itachi', 'Gaara', 'Hinata', 'Shikamaru',
        'Luffy', 'Zoro', 'Nami', 'Sanji', 'Chopper', 'Robin', 'Franky', 'Brook',
        'Goku', 'Vegeta', 'Gohan', 'Piccolo', 'Krillin', 'Yamcha', 'Tien', 'Chiaotzu',
        'Edward', 'Alphonse', 'Winry', 'Roy', 'Riza', 'Hughes', 'Armstrong', 'Izumi',
        'Tanjiro', 'Nezuko', 'Zenitsu', 'Inosuke', 'Giyu', 'Shinobu', 'Rengoku', 'Tengen',
        'Izuku', 'Bakugo', 'Todoroki', 'Ochaco', 'Iida', 'Momo', 'Kirishima', 'Denki'
      ]),
      namingFormats: JSON.stringify([
        '{prefix} {name}',
        '{name} the {suffix}',
        '{name} {suffix}',
        '{prefix} of {name}'
      ])
    },
    {
      name: 'Star Collection',
      slug: 'star-collection',
      description: 'Celebrity and famous personality cards from various entertainment industries',
      color: '#4ECDC4',
      icon: '⭐',
      sortOrder: 2,
      namingPrefixes: JSON.stringify([
        'Legend', 'Icon', 'Superstar', 'Celebrity', 'Famous', 'Renowned', 'Acclaimed',
        'Award-Winning', 'Golden', 'Platinum', 'Diamond', 'Elite', 'Premier', 'Supreme'
      ]),
      namingSuffixes: JSON.stringify([
        'Legend', 'Icon', 'Superstar', 'Celebrity', 'Star', 'Fame', 'Glory', 'Success'
      ]),
      namingNames: JSON.stringify([
        'Leonardo DiCaprio', 'Brad Pitt', 'Tom Cruise', 'Will Smith', 'Denzel Washington',
        'Robert Downey Jr.', 'Chris Evans', 'Ryan Reynolds', 'Johnny Depp', 'Morgan Freeman',
        'Scarlett Johansson', 'Jennifer Lawrence', 'Emma Stone', 'Angelina Jolie', 'Meryl Streep',
        'Natalie Portman', 'Anne Hathaway', 'Emma Watson', 'Charlize Theron', 'Sandra Bullock',
        'Beyoncé', 'Taylor Swift', 'Ariana Grande', 'Lady Gaga', 'Rihanna',
        'Justin Bieber', 'Ed Sheeran', 'The Weeknd', 'Drake', 'Bruno Mars',
        'Cristiano Ronaldo', 'Lionel Messi', 'LeBron James', 'Serena Williams', 'Tiger Woods',
        'Elon Musk', 'Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Jeff Bezos'
      ]),
      namingFormats: JSON.stringify([
        '{prefix} {name}',
        '{name} {suffix}',
        '{name} the {suffix}',
        '{prefix} Star {name}'
      ])
    },
    {
      name: 'Car Collection',
      slug: 'car-collection',
      description: 'Luxury and sports car cards featuring the most iconic vehicles',
      color: '#45B7D1',
      icon: '🚗',
      sortOrder: 3,
      namingPrefixes: JSON.stringify([
        'Ferrari', 'Lamborghini', 'Porsche', 'McLaren', 'Bugatti', 'Koenigsegg',
        'BMW', 'Mercedes', 'Audi', 'Aston Martin', 'Bentley', 'Rolls Royce',
        'Ford', 'Chevrolet', 'Dodge', 'Toyota', 'Honda', 'Nissan',
        'Mazda', 'Subaru', 'Mitsubishi', 'Hyundai', 'Kia', 'Volkswagen'
      ]),
      namingSuffixes: JSON.stringify([
        'GT', 'RS', 'R', 'S', 'M', 'AMG', 'Type R', 'STI', 'Evo', 'Turbo',
        'V8', 'V12', 'Hybrid', 'Electric', 'Sport', 'Racing', 'Track', 'Street',
        'Limited', 'Special', 'Edition', 'Performance', 'Ultimate', 'Extreme'
      ]),
      namingNames: JSON.stringify([
        'GT', 'RS', 'R', 'S', 'M', 'AMG', 'Type R', 'STI', 'Evo', 'Turbo',
        'V8', 'V12', 'Hybrid', 'Electric', 'Sport', 'Racing', 'Track', 'Street',
        'Limited', 'Special', 'Edition', 'Performance', 'Ultimate', 'Extreme'
      ]),
      namingFormats: JSON.stringify([
        '{prefix} {name}',
        '{name} {prefix}',
        '{prefix} {name} Edition',
        '{prefix} {name} Special'
      ])
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✅ Created/Updated category: ${category.name}`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting admin data seeding...\n');
    
    await seedRarities();
    console.log('');
    
    await seedElements();
    console.log('');
    
    await seedCardStyles();
    console.log('');
    
    await seedDiamondPackages();
    console.log('');
    
    await seedCategories();
    console.log('');
    
    console.log('✅ All admin data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding admin data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });