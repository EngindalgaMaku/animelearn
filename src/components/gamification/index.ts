// Gamification Components Export Index
// FAZ 1 - Complete Gamification System

// Main Hub Component
export { default as GamificationHub } from "./gamification-hub";

// Individual Dashboard Components
export { default as StreakDashboard } from "./streak-dashboard";
export { default as XPEventsDashboard } from "./xp-events-dashboard";
export { default as DailyLoginDashboard } from "./daily-login-dashboard";
export { DiamondCounter } from "./diamond-counter";
export { LevelIndicator } from "./level-indicator";

// Interactive Components
export { default as DailyMiniQuiz } from "./daily-mini-quiz";
export { default as CardPackOpening } from "./card-pack-opening";

// Type definitions for external use
export interface GamificationStats {
  level: number;
  experience: number;
  experienceToNext: number;
  diamonds: number;
  totalCards: number;
  currentStreak: number;
  totalAchievements: number;
  weeklyXP: number;
  rank: number;
}

export interface TodayQuests {
  dailyQuiz: { completed: boolean; progress: number; total: number };
  lessonComplete: { completed: boolean; progress: number; total: number };
  streakMaintain: { completed: boolean; progress: number; total: number };
  cardPackOpen: { completed: boolean; progress: number; total: number };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  loginStreak: number;
  lessonStreak: number;
  quizStreak: number;
  totalRewardsEarned: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  status: "active" | "inactive" | "broken" | "completed_today";
}

export interface XPEvent {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  participantCount: number;
  maxParticipants?: number;
  requirements?: string[];
  rewards: {
    bonusXP: number;
    specialRewards?: string[];
  };
}

export interface DailyLoginBonus {
  id: string;
  day: number;
  diamonds: number;
  experience: number;
  cardPacks: number;
  specialReward?: string;
  isClaimable: boolean;
  isClaimed: boolean;
  isCurrentDay: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export interface CardPackData {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  cost: number;
  guaranteedCards: number;
  possibleBonusCards: number;
  rarityWeights: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

export interface AnimeCard {
  id: string;
  name: string;
  series: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl: string;
  description?: string;
  stats?: {
    attack: number;
    defense: number;
    special: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GamificationApiResponse extends ApiResponse {
  stats?: GamificationStats;
  todayQuests?: TodayQuests;
}

export interface StreakApiResponse extends ApiResponse {
  streak?: StreakData;
  milestones?: {
    next: any;
    completed: any[];
  };
  todayActivities?: {
    lesson: boolean;
    quiz: boolean;
    dailyQuest: boolean;
    dailyMiniQuiz: boolean;
    login: boolean;
  };
}

export interface XPEventsApiResponse extends ApiResponse {
  events?: XPEvent[];
  userParticipations?: any[];
  stats?: {
    totalEventsParticipated: number;
    totalBonusXPEarned: number;
    currentActiveEvents: number;
    completedEvents: number;
  };
}

export interface DailyLoginApiResponse extends ApiResponse {
  bonuses?: DailyLoginBonus[];
  stats?: {
    currentStreak: number;
    longestStreak: number;
    totalDaysLoggedIn: number;
    totalRewardsClaimed: number;
    cycleStartDate: string;
    nextResetDate: string;
    canClaimToday: boolean;
    todayClaimed: boolean;
  };
}

export interface QuizApiResponse extends ApiResponse {
  quiz?: {
    id: string;
    date: string;
    questions: QuizQuestion[];
    timeLimit: number;
    maxAttempts: number;
    rewardXP: number;
    rewardDiamonds: number;
  };
  userAttempt?: {
    id: string;
    score: number;
    completed: boolean;
    attemptDate: string;
  };
}

export interface CardPackApiResponse extends ApiResponse {
  packs?: CardPackData[];
  userBalance?: {
    diamonds: number;
    coins: number;
  };
}

export interface CardOpeningApiResponse extends ApiResponse {
  cards?: AnimeCard[];
  packInfo?: CardPackData;
  rewards?: {
    experience: number;
    bonusDiamonds?: number;
  };
}

// Utility functions for gamification
export const calculateLevel = (experience: number): number => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

export const calculateExperienceToNext = (
  currentExperience: number
): number => {
  const currentLevel = calculateLevel(currentExperience);
  const nextLevelExp = Math.pow(currentLevel, 2) * 100;
  return nextLevelExp - currentExperience;
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case "common":
      return "text-gray-600 bg-gray-100";
    case "rare":
      return "text-blue-600 bg-blue-100";
    case "epic":
      return "text-purple-600 bg-purple-100";
    case "legendary":
      return "text-yellow-600 bg-yellow-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTimeRemaining = (endDate: string): string => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Süresi doldu";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}g ${hours}s`;
  } else if (hours > 0) {
    return `${hours}s ${minutes}d`;
  } else {
    return `${minutes}d`;
  }
};

// Constants
export const RARITY_WEIGHTS = {
  common: 60,
  rare: 25,
  epic: 12,
  legendary: 3,
};

export const XP_REWARDS = {
  lesson_complete: 100,
  quiz_complete: 150,
  daily_login: 50,
  streak_milestone: 300,
  card_pack_open: 75,
};

export const DIAMOND_REWARDS = {
  daily_quiz: 10,
  weekly_streak: 50,
  monthly_login: 200,
  achievement: 25,
};

// API Endpoints
export const API_ENDPOINTS = {
  gamification: {
    overview: "/api/gamification/overview",
  },
  streak: "/api/user-streak",
  xpEvents: "/api/xp-events",
  dailyLogin: "/api/daily-login",
  dailyQuiz: {
    get: "/api/daily-mini-quiz",
    submit: "/api/daily-mini-quiz/submit",
  },
  cardPacks: {
    get: "/api/card-packs",
    open: "/api/card-packs/open",
  },
};
