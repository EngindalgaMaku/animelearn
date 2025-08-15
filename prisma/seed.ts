import { PrismaClient } from "@prisma/client";
import { seedLearningActivities } from "./seeds/learning-activities";
import { seedCards } from "./seeds/cards";
import { seedPythonFundamentals } from "./seeds/python-fundamentals";
import { seedAlgorithmVisualizationCoreAlgorithmsActivities } from "./seeds/activities/algorithm-visualization-core-algorithms";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed Categories with Naming Rules
  console.log("📂 Seeding categories with naming rules...");
  const categories = [
    {
      name: "Anime Collection",
      slug: "anime-collection",
      description:
        "Traditional anime cards featuring beloved characters from popular series",
      color: "#FF6B6B",
      icon: "🎌",
      sortOrder: 1,
      namingPrefixes: JSON.stringify([
        "Guardian",
        "Master",
        "Champion",
        "Hero",
        "Warrior",
        "Knight",
        "Mage",
        "Hunter",
        "Prince",
        "Princess",
        "King",
        "Queen",
        "Emperor",
        "Lord",
        "Lady",
        "Spirit",
        "Dragon",
        "Phoenix",
        "Tiger",
        "Wolf",
        "Lion",
        "Eagle",
        "Shadow",
        "Light",
        "Fire",
        "Ice",
        "Thunder",
        "Storm",
        "Wind",
        "Earth",
        "Water",
        "Crystal",
      ]),
      namingSuffixes: JSON.stringify([
        "Guardian",
        "Master",
        "Champion",
        "Hero",
        "Warrior",
        "Knight",
        "Mage",
        "Hunter",
        "Spirit",
        "Soul",
        "Heart",
        "Eye",
        "Breath",
        "Power",
        "Sword",
        "Shield",
      ]),
      namingNames: JSON.stringify([
        "Akira",
        "Yuuki",
        "Sakura",
        "Hiro",
        "Rei",
        "Sora",
        "Kyo",
        "Rin",
        "Ryu",
        "Yoko",
        "Natsu",
        "Lucy",
        "Erza",
        "Gray",
        "Wendy",
        "Gajeel",
        "Levy",
        "Juvia",
        "Laxus",
        "Ichigo",
        "Rukia",
        "Orihime",
        "Uryu",
        "Chad",
        "Renji",
        "Byakuya",
        "Toshiro",
        "Naruto",
        "Sasuke",
        "Sakura",
        "Kakashi",
        "Itachi",
        "Gaara",
        "Hinata",
        "Shikamaru",
        "Luffy",
        "Zoro",
        "Nami",
        "Sanji",
        "Chopper",
        "Robin",
        "Franky",
        "Brook",
        "Goku",
        "Vegeta",
        "Gohan",
        "Piccolo",
        "Krillin",
        "Yamcha",
        "Tien",
        "Chiaotzu",
        "Edward",
        "Alphonse",
        "Winry",
        "Roy",
        "Riza",
        "Hughes",
        "Armstrong",
        "Izumi",
        "Tanjiro",
        "Nezuko",
        "Zenitsu",
        "Inosuke",
        "Giyu",
        "Shinobu",
        "Rengoku",
        "Tengen",
        "Izuku",
        "Bakugo",
        "Todoroki",
        "Ochaco",
        "Iida",
        "Momo",
        "Kirishima",
        "Denki",
      ]),
      namingFormats: JSON.stringify([
        "{prefix} {name}",
        "{name} the {suffix}",
        "{name} {suffix}",
        "{prefix} of {name}",
      ]),
    },
    {
      name: "Star Collection",
      slug: "star-collection",
      description:
        "Celebrity and famous personality cards from various entertainment industries",
      color: "#4ECDC4",
      icon: "⭐",
      sortOrder: 2,
      namingPrefixes: JSON.stringify([
        "Legend",
        "Icon",
        "Superstar",
        "Celebrity",
        "Famous",
        "Renowned",
        "Acclaimed",
        "Award-Winning",
        "Golden",
        "Platinum",
        "Diamond",
        "Elite",
        "Premier",
        "Supreme",
      ]),
      namingSuffixes: JSON.stringify([
        "Legend",
        "Icon",
        "Superstar",
        "Celebrity",
        "Star",
        "Fame",
        "Glory",
        "Success",
      ]),
      namingNames: JSON.stringify([
        "Leonardo DiCaprio",
        "Brad Pitt",
        "Tom Cruise",
        "Will Smith",
        "Denzel Washington",
        "Robert Downey Jr.",
        "Chris Evans",
        "Ryan Reynolds",
        "Johnny Depp",
        "Morgan Freeman",
        "Scarlett Johansson",
        "Jennifer Lawrence",
        "Emma Stone",
        "Angelina Jolie",
        "Meryl Streep",
        "Natalie Portman",
        "Anne Hathaway",
        "Emma Watson",
        "Charlize Theron",
        "Sandra Bullock",
        "Beyoncé",
        "Taylor Swift",
        "Ariana Grande",
        "Lady Gaga",
        "Rihanna",
        "Justin Bieber",
        "Ed Sheeran",
        "The Weeknd",
        "Drake",
        "Bruno Mars",
        "Cristiano Ronaldo",
        "Lionel Messi",
        "LeBron James",
        "Serena Williams",
        "Tiger Woods",
        "Elon Musk",
        "Bill Gates",
        "Steve Jobs",
        "Mark Zuckerberg",
        "Jeff Bezos",
      ]),
      namingFormats: JSON.stringify([
        "{prefix} {name}",
        "{name} {suffix}",
        "{name} the {suffix}",
        "{prefix} Star {name}",
      ]),
    },
    {
      name: "Car Collection",
      slug: "car-collection",
      description:
        "Luxury and sports car cards featuring the most iconic vehicles",
      color: "#45B7D1",
      icon: "🚗",
      sortOrder: 3,
      namingPrefixes: JSON.stringify([
        "Ferrari",
        "Lamborghini",
        "Porsche",
        "McLaren",
        "Bugatti",
        "Koenigsegg",
        "BMW",
        "Mercedes",
        "Audi",
        "Aston Martin",
        "Bentley",
        "Rolls Royce",
        "Ford",
        "Chevrolet",
        "Dodge",
        "Toyota",
        "Honda",
        "Nissan",
        "Mazda",
        "Subaru",
        "Mitsubishi",
        "Hyundai",
        "Kia",
        "Volkswagen",
      ]),
      namingSuffixes: JSON.stringify([
        "GT",
        "RS",
        "R",
        "S",
        "M",
        "AMG",
        "Type R",
        "STI",
        "Evo",
        "Turbo",
        "V8",
        "V12",
        "Hybrid",
        "Electric",
        "Sport",
        "Racing",
        "Track",
        "Street",
        "Limited",
        "Special",
        "Edition",
        "Performance",
        "Ultimate",
        "Extreme",
      ]),
      namingNames: JSON.stringify([
        "GT",
        "RS",
        "R",
        "S",
        "M",
        "AMG",
        "Type R",
        "STI",
        "Evo",
        "Turbo",
        "V8",
        "V12",
        "Hybrid",
        "Electric",
        "Sport",
        "Racing",
        "Track",
        "Street",
        "Limited",
        "Special",
        "Edition",
        "Performance",
        "Ultimate",
        "Extreme",
      ]),
      namingFormats: JSON.stringify([
        "{prefix} {name}",
        "{name} {prefix}",
        "{prefix} {name} Edition",
        "{prefix} {name} Special",
      ]),
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Seed Rarities
  console.log("💎 Seeding rarities...");
  const rarities = [
    {
      name: "Common",
      slug: "common",
      description: "Most frequently found cards",
      color: "#6B7280",
      bgColor: "#F3F4F6",
      borderColor: "#D1D5DB",
      textColor: "#1F2937",
      icon: "⚪",
      level: 1,
      dropRate: 45.0, // Fixed: Total now equals 99.5%
      minDiamondPrice: 10,
      maxDiamondPrice: 50,
      sortOrder: 1,
    },
    {
      name: "Uncommon",
      slug: "uncommon",
      description: "Slightly harder to find cards",
      color: "#22C55E",
      bgColor: "#DCFCE7",
      borderColor: "#86EFAC",
      textColor: "#15803D",
      icon: "🟢",
      level: 2,
      dropRate: 25.0,
      minDiamondPrice: 30,
      maxDiamondPrice: 80,
      sortOrder: 2,
    },
    {
      name: "Rare",
      slug: "rare",
      description: "Valuable and hard to find cards",
      color: "#3B82F6",
      bgColor: "#DBEAFE",
      borderColor: "#93C5FD",
      textColor: "#1D4ED8",
      icon: "🔵",
      level: 3,
      dropRate: 15.0, // Fixed: Increased from 10% to 15%
      minDiamondPrice: 100,
      maxDiamondPrice: 300,
      sortOrder: 3,
    },
    {
      name: "Super Rare",
      slug: "super-rare",
      description: "Super rare and valuable cards",
      color: "#8B5CF6",
      bgColor: "#EDE9FE",
      borderColor: "#C4B5FD",
      textColor: "#7C3AED",
      icon: "🟣",
      level: 4,
      dropRate: 7.0,
      minDiamondPrice: 300,
      maxDiamondPrice: 600,
      sortOrder: 4,
    },
    {
      name: "Epic",
      slug: "epic",
      description: "Very rare and powerful cards",
      color: "#8B5CF6",
      bgColor: "#EDE9FE",
      borderColor: "#C4B5FD",
      textColor: "#7C3AED",
      icon: "🟣",
      level: 5,
      dropRate: 4.0,
      minDiamondPrice: 400,
      maxDiamondPrice: 800,
      sortOrder: 5,
    },
    {
      name: "Ultra Rare",
      slug: "ultra-rare",
      description: "Ultra rare and extremely valuable cards",
      color: "#EF4444",
      bgColor: "#FEE2E2",
      borderColor: "#FCA5A5",
      textColor: "#DC2626",
      icon: "🟠",
      level: 6,
      dropRate: 2.0,
      minDiamondPrice: 600,
      maxDiamondPrice: 1200,
      sortOrder: 6,
    },
    {
      name: "Secret Rare",
      slug: "secret-rare",
      description: "Secret and extremely rare cards",
      color: "#EF4444",
      bgColor: "#FEE2E2",
      borderColor: "#FCA5A5",
      textColor: "#DC2626",
      icon: "🔴",
      level: 7,
      dropRate: 1.0,
      minDiamondPrice: 1200,
      maxDiamondPrice: 2500,
      sortOrder: 7,
    },
    {
      name: "Legendary",
      slug: "legendary",
      description: "Extremely rare and sought-after cards",
      color: "#F59E0B",
      bgColor: "#FEF3C7",
      borderColor: "#FCD34D",
      textColor: "#D97706",
      gradient: "from-yellow-400 to-orange-500",
      icon: "👑",
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
      update: {},
      create: rarity,
    });
  }

  // Seed Elements
  console.log("🔥 Seeding elements...");
  const elements = [
    {
      name: "Fire",
      slug: "fire",
      description: "Cards with fire-based powers and abilities",
      color: "#EF4444",
      icon: "🔥",
      effectDescription: "Increases attack power by 10%",
      priceModifier: 1.1,
      sortOrder: 1,
    },
    {
      name: "Water",
      slug: "water",
      description: "Cards with water-based powers and abilities",
      color: "#3B82F6",
      icon: "💧",
      effectDescription: "Increases defense by 15%",
      priceModifier: 1.0,
      sortOrder: 2,
    },
    {
      name: "Earth",
      slug: "earth",
      description: "Cards with earth-based powers and abilities",
      color: "#22C55E",
      icon: "🌍",
      effectDescription: "Increases HP by 20%",
      priceModifier: 0.9,
      sortOrder: 3,
    },
    {
      name: "Air",
      slug: "air",
      description: "Cards with air-based powers and abilities",
      color: "#06B6D4",
      icon: "💨",
      effectDescription: "Increases speed by 25%",
      priceModifier: 1.0,
      sortOrder: 4,
    },
    {
      name: "Lightning",
      slug: "lightning",
      description: "Cards with electric-based powers and abilities",
      color: "#FBBF24",
      icon: "⚡",
      effectDescription: "Critical hit chance increased by 20%",
      priceModifier: 1.2,
      sortOrder: 5,
    },
    {
      name: "Ice",
      slug: "ice",
      description: "Cards with ice-based powers and abilities",
      color: "#67E8F9",
      icon: "❄️",
      effectDescription: "Slows enemy attacks by 15%",
      priceModifier: 1.05,
      sortOrder: 6,
    },
    {
      name: "Dark",
      slug: "dark",
      description: "Cards with dark magic and shadow abilities",
      color: "#6B7280",
      icon: "🌑",
      effectDescription: "Ignores 10% of enemy defense",
      priceModifier: 1.3,
      sortOrder: 7,
    },
    {
      name: "Light",
      slug: "light",
      description: "Cards with holy and healing abilities",
      color: "#FDE047",
      icon: "✨",
      effectDescription: "Heals 5% HP each turn",
      priceModifier: 1.25,
      sortOrder: 8,
    },
  ];

  for (const element of elements) {
    await prisma.element.upsert({
      where: { slug: element.slug },
      update: {},
      create: element,
    });
  }

  // Seed Card Styles
  console.log("🎨 Seeding card styles...");
  const cardStyles = [
    {
      name: "Common Card Style",
      targetType: "rarity",
      targetValue: "common",
      containerClass: "border-gray-200 bg-gray-50",
      borderClass: "border-2 border-gray-300",
      isActive: true,
      priority: 1,
    },
    {
      name: "Rare Card Style",
      targetType: "rarity",
      targetValue: "rare",
      containerClass: "border-blue-400 bg-blue-50",
      borderClass: "border-2 border-blue-400",
      glowEffect: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
      isActive: true,
      priority: 1,
    },
    {
      name: "Epic Card Style",
      targetType: "rarity",
      targetValue: "epic",
      containerClass: "border-purple-400 bg-purple-50",
      borderClass: "border-2 border-purple-400",
      glowEffect: "drop-shadow(0 0 12px rgba(139, 92, 246, 0.6))",
      animationClass: "animate-pulse",
      isActive: true,
      priority: 1,
    },
    {
      name: "Legendary Card Style",
      targetType: "rarity",
      targetValue: "legendary",
      containerClass:
        "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50",
      borderClass: "border-4 border-yellow-400",
      glowEffect: "drop-shadow(0 0 16px rgba(245, 158, 11, 0.8))",
      animationClass: "animate-pulse",
      hoverEffect: "hover:scale-105 transition-transform duration-300",
      isActive: true,
      priority: 1,
    },
    {
      name: "Fire Element Style",
      targetType: "element",
      targetValue: "fire",
      containerClass: "border-red-300",
      glowEffect: "drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))",
      isActive: true,
      priority: 2,
    },
    {
      name: "Lightning Element Style",
      targetType: "element",
      targetValue: "lightning",
      containerClass: "border-yellow-300",
      glowEffect: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))",
      animationClass: "animate-pulse",
      isActive: true,
      priority: 2,
    },
  ];

  for (const style of cardStyles) {
    await prisma.cardStyle.upsert({
      where: { name: style.name },
      update: {},
      create: style,
    });
  }

  // Seed Card Analysis Settings
  console.log("🔍 Seeding card analysis settings...");
  const analysisSettings = [
    {
      name: "Default Analysis",
      description:
        "Standard card analysis configuration with balanced settings",

      // AI Analysis Settings
      aiModel: "gpt-4o-mini",
      confidenceThreshold: 0.7,
      enableOCR: true,
      enableImageAnalysis: true,
      enablePriceEstimation: true,

      // Price Calculation Settings
      basePriceMin: 50,
      basePriceMax: 500,
      rarityWeight: 1.5,
      elementWeight: 1.2,
      categoryWeight: 1.1,
      conditionWeight: 1.3,
      popularityWeight: 1.4,

      // Market Analysis Settings
      enableMarketAnalysis: true,
      marketTrendWeight: 1.0,
      demandFactor: 1.2,
      supplyFactor: 0.8,

      // Auto-Update Settings
      autoUpdatePrices: false,
      priceUpdateInterval: 24,
      maxPriceChange: 0.3,

      // Analysis Criteria
      analyzeStats: true,
      analyzeCharacter: true,
      analyzeSeries: true,
      analyzeRarity: true,
      analyzeCondition: true,
      analyzeElements: true,

      // Quality Thresholds
      minImageQuality: 0.5,
      maxBlurThreshold: 0.3,
      minResolution: 200,

      isActive: true,
      isDefault: true,
      priority: 100,
    },
    {
      name: "Premium Analysis",
      description: "High-accuracy analysis with advanced AI features",

      // AI Analysis Settings
      aiModel: "gpt-4o",
      confidenceThreshold: 0.8,
      enableOCR: true,
      enableImageAnalysis: true,
      enablePriceEstimation: true,

      // Price Calculation Settings
      basePriceMin: 75,
      basePriceMax: 750,
      rarityWeight: 1.8,
      elementWeight: 1.4,
      categoryWeight: 1.3,
      conditionWeight: 1.5,
      popularityWeight: 1.6,

      // Market Analysis Settings
      enableMarketAnalysis: true,
      marketTrendWeight: 1.2,
      demandFactor: 1.4,
      supplyFactor: 0.7,

      // Auto-Update Settings
      autoUpdatePrices: true,
      priceUpdateInterval: 12,
      maxPriceChange: 0.2,

      // Analysis Criteria
      analyzeStats: true,
      analyzeCharacter: true,
      analyzeSeries: true,
      analyzeRarity: true,
      analyzeCondition: true,
      analyzeElements: true,

      // Quality Thresholds
      minImageQuality: 0.7,
      maxBlurThreshold: 0.2,
      minResolution: 300,

      isActive: true,
      isDefault: false,
      priority: 90,
    },
    {
      name: "Basic Analysis",
      description: "Fast and simple analysis for bulk processing",

      // AI Analysis Settings
      aiModel: "claude-3-haiku",
      confidenceThreshold: 0.6,
      enableOCR: true,
      enableImageAnalysis: false,
      enablePriceEstimation: true,

      // Price Calculation Settings
      basePriceMin: 25,
      basePriceMax: 300,
      rarityWeight: 1.3,
      elementWeight: 1.0,
      categoryWeight: 1.0,
      conditionWeight: 1.1,
      popularityWeight: 1.2,

      // Market Analysis Settings
      enableMarketAnalysis: false,
      marketTrendWeight: 1.0,
      demandFactor: 1.0,
      supplyFactor: 1.0,

      // Auto-Update Settings
      autoUpdatePrices: false,
      priceUpdateInterval: 48,
      maxPriceChange: 0.5,

      // Analysis Criteria
      analyzeStats: false,
      analyzeCharacter: true,
      analyzeSeries: true,
      analyzeRarity: true,
      analyzeCondition: false,
      analyzeElements: false,

      // Quality Thresholds
      minImageQuality: 0.3,
      maxBlurThreshold: 0.5,
      minResolution: 150,

      isActive: true,
      isDefault: false,
      priority: 70,
    },
  ];

  for (const settings of analysisSettings) {
    await prisma.cardAnalysisSettings.upsert({
      where: { name: settings.name },
      update: {},
      create: settings,
    });
  }

  // Seed backup data from current database (2025-08-07T15:02:48.699Z)
  console.log("💾 Seeding backup users...");
  const backupUsers = [
    {
      id: "cme002sve0000wc6oufy9qnag",
      email: "mackaengin@gmail.com",
      username: "dizaynschool",
      passwordHash:
        "$2b$12$OVMdLcsBcv2ocAGtfsTFt.5niCY2wcvX7QjevSxlbednA9aTQRJTW",
      firstName: null,
      lastName: null,
      avatar: null,
      role: "user",
      level: 1,
      experience: 0,
      currentDiamonds: 100,
      totalDiamonds: 0,
      isActive: true,
      isPremium: false,
      premiumExpiresAt: null,
      emailVerified: false,
      lastLoginDate: new Date("2025-08-06T13:33:36.239Z"),
      loginStreak: 1,
      createdAt: new Date("2025-08-06T13:24:53.547Z"),
      updatedAt: new Date("2025-08-06T13:33:36.240Z"),
    },
    {
      id: "cme00uuch0000wc8kklw142m1",
      email: "admin@zumenzu.com",
      username: "admin",
      passwordHash:
        "$2b$10$fJetu5W7kKoK1jUGKilnn.Fcu/z012/7gzdggnDkaLKwsb8MuN5Jy",
      firstName: "Engin",
      lastName: "Dalga",
      avatar: null,
      role: "admin",
      level: 100,
      experience: 999999,
      currentDiamonds: 9897,
      totalDiamonds: 0,
      isActive: true,
      isPremium: false,
      premiumExpiresAt: null,
      emailVerified: false,
      lastLoginDate: new Date("2025-08-07T14:02:34.081Z"),
      loginStreak: 1,
      createdAt: new Date("2025-08-06T13:46:41.825Z"),
      updatedAt: new Date("2025-08-07T14:59:21.958Z"),
    },
  ];

  for (const userData of backupUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData,
    });
  }

  // Seed comprehensive learning activities
  console.log("🎮 Seeding comprehensive learning activities...");
  await seedLearningActivities();

  // Seed core Algorithm Visualization activities (30 most-used algorithms)
  console.log("🧠 Seeding core algorithm visualizations (30)...");
  await seedAlgorithmVisualizationCoreAlgorithmsActivities();

  // Seed Python fundamentals challenges (Code Arena)
  console.log("🐍 Seeding Python fundamentals challenges for Code Arena...");
  await seedPythonFundamentals();

  // Seed cards and their categories
  console.log("🎴 Seeding cards and card categories...");
  await seedCards();

  // Seed default site settings
  console.log("⚙️ Seeding default site settings...");
  const defaultSettings = [
    // General
    {
      key: "site_name",
      value: "Zumenzu",
      type: "string",
      description: "Main site title displayed in header and meta tags",
    },
    {
      key: "site_description",
      value:
        "Learn Python programming with interactive card games and coding challenges",
      type: "text",
      description: "Meta description for SEO",
    },
    {
      key: "site_keywords",
      value: "Python, programming, learning, cards, games, education",
      type: "text",
      description: "Comma-separated keywords for SEO",
    },
    {
      key: "site_language",
      value: "en",
      type: "select",
      description: "Default site language",
    },
    {
      key: "timezone",
      value: "Europe/Istanbul",
      type: "string",
      description: "Server timezone for date calculations",
    },

    // Homepage
    {
      key: "hero_title",
      value: "Master Python Programming with Interactive Card Games",
      type: "string",
      description: "Main headline on homepage",
    },
    {
      key: "hero_subtitle",
      value:
        "Join thousands of developers learning Python through our unique card-based learning system",
      type: "text",
      description: "Supporting text under main headline",
    },
    {
      key: "hero_cta_text",
      value: "Start Learning Now",
      type: "string",
      description: "Text on the main call-to-action button",
    },
    {
      key: "features_enabled",
      value: "true",
      type: "boolean",
      description: "Display features section on homepage",
    },
    {
      key: "testimonials_enabled",
      value: "true",
      type: "boolean",
      description: "Display testimonials section",
    },
    {
      key: "stats_enabled",
      value: "true",
      type: "boolean",
      description: "Display statistics counters",
    },

    // Branding
    {
      key: "primary_color",
      value: "#EF4444",
      type: "color",
      description: "Main brand color used throughout the site",
    },
    {
      key: "secondary_color",
      value: "#F97316",
      type: "color",
      description: "Secondary brand color for accents",
    },
    {
      key: "logo_url",
      value: "/logo.png",
      type: "string",
      description: "Path to site logo image",
    },
    {
      key: "favicon_url",
      value: "/favicon.ico",
      type: "string",
      description: "Path to favicon",
    },
    {
      key: "brand_font",
      value: "Inter",
      type: "string",
      description: "Primary font family",
    },

    // User System
    {
      key: "registration_enabled",
      value: "true",
      type: "boolean",
      description: "Enable new user registration",
    },
    {
      key: "email_verification_required",
      value: "false",
      type: "boolean",
      description: "Require email verification for new accounts",
    },
    {
      key: "default_diamonds",
      value: "100",
      type: "number",
      description: "Diamonds given to new users",
    },
    {
      key: "daily_diamond_bonus",
      value: "25",
      type: "number",
      description: "Diamonds for daily login",
    },
    {
      key: "level_up_diamonds",
      value: "50",
      type: "number",
      description: "Diamonds for leveling up",
    },
    {
      key: "max_login_streak",
      value: "30",
      type: "number",
      description: "Maximum login streak days",
    },

    // Arena
    {
      key: "arena_enabled",
      value: "true",
      type: "boolean",
      description: "Enable Code Arena learning system",
    },
    {
      key: "arena_daily_limit",
      value: "10",
      type: "number",
      description: "Maximum activities per day per user",
    },
    {
      key: "arena_base_reward",
      value: "10",
      type: "number",
      description: "Base diamonds for completing activities",
    },
    {
      key: "arena_xp_multiplier",
      value: "1.5",
      type: "number",
      description: "Experience multiplier for arena activities",
    },
    {
      key: "arena_unlock_system",
      value: "true",
      type: "boolean",
      description: "Require completing previous activities",
    },

    // Economy
    {
      key: "diamond_pack_enabled",
      value: "true",
      type: "boolean",
      description: "Enable diamond purchases",
    },
    {
      key: "card_price_min",
      value: "10",
      type: "number",
      description: "Minimum diamond price for cards",
    },
    {
      key: "card_price_max",
      value: "5000",
      type: "number",
      description: "Maximum diamond price for cards",
    },
    {
      key: "shop_daily_refresh",
      value: "true",
      type: "boolean",
      description: "Refresh shop items daily",
    },
    {
      key: "currency_symbol",
      value: "💎",
      type: "string",
      description: "Symbol displayed for diamonds",
    },

    // Social
    {
      key: "contact_email",
      value: "admin@zumenzu.com",
      type: "email",
      description: "Primary contact email address",
    },
    {
      key: "support_email",
      value: "support@zumenzu.com",
      type: "email",
      description: "Support contact email",
    },
    {
      key: "twitter_url",
      value: "",
      type: "url",
      description: "Twitter profile link",
    },
    {
      key: "discord_url",
      value: "",
      type: "url",
      description: "Discord server invite link",
    },
    {
      key: "github_url",
      value: "",
      type: "url",
      description: "GitHub organization/profile link",
    },

    // Security
    {
      key: "rate_limit_enabled",
      value: "true",
      type: "boolean",
      description: "Enable API rate limiting",
    },
    {
      key: "max_api_requests_per_minute",
      value: "60",
      type: "number",
      description: "Maximum API requests per user per minute",
    },
    {
      key: "session_timeout",
      value: "24",
      type: "number",
      description: "User session timeout in hours",
    },
    {
      key: "password_min_length",
      value: "8",
      type: "number",
      description: "Minimum required password length",
    },

    // Performance
    {
      key: "cache_enabled",
      value: "true",
      type: "boolean",
      description: "Enable response caching",
    },
    {
      key: "cache_duration",
      value: "300",
      type: "number",
      description: "Default cache duration",
    },
    {
      key: "max_file_size",
      value: "10",
      type: "number",
      description: "Maximum file upload size",
    },
    {
      key: "pagination_limit",
      value: "20",
      type: "number",
      description: "Default items per page",
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Database seeding completed successfully!");
  console.log(`📊 Seeded:
  - ${categories.length} categories with naming rules
  - ${rarities.length} rarities
  - ${elements.length} elements
  - ${cardStyles.length} card styles
  - ${analysisSettings.length} analysis settings
  - ${backupUsers.length} backup users
  - 20+ comprehensive learning activities
  - 15 Python fundamentals challenges for Code Arena
  - Sample card collection with various rarities
  - ${defaultSettings.length} site settings`);

  console.log(
    "🎯 Card collection system is now ready with sample data across all categories and rarities!"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
