export interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  sortOrder: number;
  isLocked: boolean;
  prerequisiteId?: string;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  isActive: boolean;
  content: any;
  settings?: any;
  tags: string[];
  totalAttempts: number;
  userProgress?: {
    score: number;
    maxScore: number;
    completed: boolean;
    timeSpent: number;
    hintsUsed: number;
    mistakes: number;
    startedAt: string;
    completedAt?: string;
    percentage: number;
  };
}

export interface ArenaConfig {
  difficultyConfigs: {
    [key: number]: {
      label: string;
      color: string;
      icon: string;
      bgColor: string;
      textColor: string;
      borderColor: string;
    };
  };
  categoryConfigs: {
    [key: string]: {
      title: string;
      description: string;
      icon: string;
      gradient: string;
      bgGradient: string;
      iconBg: string;
    };
  };
  activityTypeConfigs: {
    [key: string]: {
      name: string;
      icon: string;
      color: string;
    };
  };
  uiConfig: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headerGradient: string;
    showStats: boolean;
    showFilters: boolean;
    enableAnimations: boolean;
  };
}

export interface ActivitiesResponse {
  success: boolean;
  activities: LearningActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
