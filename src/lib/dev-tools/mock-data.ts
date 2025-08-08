/**
 * Mock data utilities for development and testing
 */

// Simple random data generators without external dependencies
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min;
const randomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];
const randomBoolean = (probability: number = 0.5): boolean =>
  Math.random() < probability;
const generateId = (): string => Math.random().toString(36).substr(2, 9);
const randomDate = (daysAgo: number): Date =>
  new Date(Date.now() - randomInt(0, daysAgo) * 24 * 60 * 60 * 1000);

// Types for mock data
export interface MockUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  currentDiamonds: number;
  totalDiamonds: number;
  streak: number;
  role: "user" | "admin";
  createdAt: Date;
  lastLogin: Date;
}

export interface MockCard {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  price: number;
  anime: string;
  character: string;
  description: string;
  owned: boolean;
  ownedCount: number;
  series: string;
  releaseDate: Date;
}

export interface MockProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  attempts: number;
  lastAttempt: Date;
  completedAt?: Date;
}

export interface MockAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "learning" | "collection" | "social" | "streak" | "special";
  rarity: "bronze" | "silver" | "gold" | "platinum";
  requirements: Record<string, any>;
  reward: {
    diamonds: number;
    xp: number;
    cards?: string[];
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

// Mock data generators
export const createMockUser = (overrides?: Partial<MockUser>): MockUser => {
  const level = randomInt(1, 50);
  const baseXP = level * 100;
  const experience = baseXP + randomInt(0, 99);

  const usernames = [
    "AnimeNinja",
    "PythonMaster",
    "CodeSamurai",
    "CardCollector",
    "LearningSenpai",
    "DevOtaku",
  ];
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

  return {
    id: generateId(),
    username: `${randomElement(usernames)}${randomInt(100, 999)}`,
    email: `user${randomInt(1, 1000)}@${randomElement(domains)}`,
    avatar: `https://avatars.dicebear.com/api/adventurer/${generateId()}.svg`,
    level,
    experience,
    currentDiamonds: randomInt(0, 5000),
    totalDiamonds: randomInt(experience, experience * 2),
    streak: randomInt(0, 365),
    role: randomElement(["user", "admin"] as const),
    createdAt: randomDate(730), // 2 years ago
    lastLogin: randomDate(7),
    ...overrides,
  };
};

export const createMockCard = (overrides?: Partial<MockCard>): MockCard => {
  const animes = [
    "Naruto",
    "One Piece",
    "Attack on Titan",
    "Demon Slayer",
    "My Hero Academia",
    "Dragon Ball Z",
    "Pokemon",
    "Hunter x Hunter",
    "Fullmetal Alchemist",
    "Death Note",
    "One Punch Man",
    "Bleach",
  ];

  const characters = [
    "Naruto Uzumaki",
    "Sasuke Uchiha",
    "Sakura Haruno",
    "Luffy",
    "Eren Yeager",
    "Mikasa Ackerman",
    "Tanjiro Kamado",
    "Nezuko Kamado",
    "Izuku Midoriya",
    "Katsuki Bakugo",
    "Goku",
    "Vegeta",
    "Pikachu",
    "Ash Ketchum",
    "Edward Elric",
    "Alphonse Elric",
    "Light Yagami",
    "Saitama",
    "Ichigo Kurosaki",
    "Rukia Kuchiki",
  ];

  const anime = randomElement(animes);
  const character = randomElement(characters);

  // Weighted random selection for rarity
  const rarities: Array<MockCard["rarity"]> = [
    "common",
    "rare",
    "epic",
    "legendary",
  ];
  const rarityWeights = [50, 30, 15, 5];
  const totalWeight = rarityWeights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  let weightSum = 0;
  let rarity: MockCard["rarity"] = "common";

  for (let i = 0; i < rarities.length; i++) {
    weightSum += rarityWeights[i];
    if (random <= weightSum) {
      rarity = rarities[i];
      break;
    }
  }

  const rarityPriceMultiplier: Record<MockCard["rarity"], number> = {
    common: 1,
    rare: 3,
    epic: 7,
    legendary: 15,
  };

  const cardTypes = ["Battle", "Portrait", "Special", "Holiday", "Ultimate"];

  return {
    id: generateId(),
    name: `${character} - ${randomElement(cardTypes)}`,
    image: `https://picsum.photos/300/400?random=${generateId()}`,
    rarity,
    price: randomInt(10, 100) * rarityPriceMultiplier[rarity],
    anime,
    character,
    description: `A beautiful ${rarity} card featuring ${character} from ${anime}. This collectible showcases amazing artwork and is perfect for any anime fan.`,
    owned: randomBoolean(0.3),
    ownedCount: randomInt(0, 5),
    series: `${anime} Series ${randomInt(1, 5)}`,
    releaseDate: randomDate(1825), // 5 years ago
    ...overrides,
  };
};

export const createMockProgress = (
  overrides?: Partial<MockProgress>
): MockProgress => {
  const completed = randomBoolean(0.7);
  const attempts = randomInt(1, 5);
  const timeSpent = randomInt(60, 3600); // 1 min to 1 hour in seconds

  return {
    id: generateId(),
    userId: generateId(),
    lessonId: generateId(),
    completed,
    score: completed ? randomInt(60, 100) : undefined,
    timeSpent,
    attempts,
    lastAttempt: randomDate(30),
    completedAt: completed ? randomDate(30) : undefined,
    ...overrides,
  };
};

export const createMockAchievement = (
  overrides?: Partial<MockAchievement>
): MockAchievement => {
  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first Python lesson",
      type: "learning" as const,
      requirements: { lessonsCompleted: 1 },
    },
    {
      name: "Card Collector",
      description: "Collect 10 different anime cards",
      type: "collection" as const,
      requirements: { uniqueCards: 10 },
    },
    {
      name: "Social Butterfly",
      description: "Join 3 study groups",
      type: "social" as const,
      requirements: { studyGroups: 3 },
    },
    {
      name: "Streak Master",
      description: "Maintain a 30-day learning streak",
      type: "streak" as const,
      requirements: { streakDays: 30 },
    },
    {
      name: "Python Ninja",
      description: "Master all beginner Python concepts",
      type: "learning" as const,
      requirements: { beginnerLessons: 25 },
    },
  ];

  const template = randomElement(achievements);

  // Weighted random selection for rarity
  const rarityTypes: Array<MockAchievement["rarity"]> = [
    "bronze",
    "silver",
    "gold",
    "platinum",
  ];
  const rarityWeights = [40, 30, 20, 10];
  const totalWeight = rarityWeights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  let weightSum = 0;
  let rarity: MockAchievement["rarity"] = "bronze";

  for (let i = 0; i < rarityTypes.length; i++) {
    weightSum += rarityWeights[i];
    if (random <= weightSum) {
      rarity = rarityTypes[i];
      break;
    }
  }

  const rarityMultiplier: Record<MockAchievement["rarity"], number> = {
    bronze: 1,
    silver: 2,
    gold: 4,
    platinum: 8,
  };

  const baseDiamonds = randomInt(10, 50);
  const baseXP = randomInt(50, 200);

  const unlocked = randomBoolean(0.4);
  const maxProgress = randomInt(1, 100);
  const progress = unlocked ? maxProgress : randomInt(0, maxProgress);

  return {
    id: generateId(),
    name: template.name,
    description: template.description,
    icon: randomElement(["🏆", "⭐", "🎯", "💎", "🔥", "🎓", "👑", "🎖️"]),
    type: template.type,
    rarity,
    requirements: template.requirements,
    reward: {
      diamonds: baseDiamonds * rarityMultiplier[rarity],
      xp: baseXP * rarityMultiplier[rarity],
      cards: randomBoolean(0.3) ? [generateId()] : undefined,
    },
    unlocked,
    unlockedAt: unlocked ? randomDate(90) : undefined,
    progress,
    maxProgress,
    ...overrides,
  };
};

// Bulk data generation
export const generateMockData = (counts: {
  users?: number;
  cards?: number;
  progress?: number;
  achievements?: number;
}) => {
  return {
    users: Array.from({ length: counts.users || 10 }, () => createMockUser()),
    cards: Array.from({ length: counts.cards || 50 }, () => createMockCard()),
    progress: Array.from({ length: counts.progress || 25 }, () =>
      createMockProgress()
    ),
    achievements: Array.from({ length: counts.achievements || 15 }, () =>
      createMockAchievement()
    ),
  };
};

// API response mocking
export const mockApiResponse = <T>(
  data: T,
  options: {
    delay?: number;
    success?: boolean;
    error?: string;
    metadata?: Record<string, any>;
  } = {}
): Promise<{
  data: T;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}> => {
  const { delay = 500, success = true, error, metadata } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({
          data,
          success: true,
          metadata,
        });
      } else {
        reject({
          data: null,
          success: false,
          error: error || "Mock API error",
          metadata,
        });
      }
    }, delay);
  });
};

// Predefined mock datasets
export const MOCK_DATASETS = {
  smallDataset: () =>
    generateMockData({
      users: 5,
      cards: 20,
      progress: 10,
      achievements: 8,
    }),

  mediumDataset: () =>
    generateMockData({
      users: 25,
      cards: 100,
      progress: 75,
      achievements: 20,
    }),

  largeDataset: () =>
    generateMockData({
      users: 100,
      cards: 500,
      progress: 300,
      achievements: 50,
    }),
} as const;

export type MockDatasetSize = keyof typeof MOCK_DATASETS;
