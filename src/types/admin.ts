// Example interface for learning activity examples
export interface LearningActivityExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  isInteractive: boolean;
  expectedOutput?: string;
}

// Section interface for modular learning activity content
export interface LearningActivitySection {
  id: string;
  type:
    | "intro"
    | "theory"
    | "example"
    | "practice"
    | "quiz"
    | "media"
    | "exercise"
    | "summary";
  title: string;
  content: string;
  order: number;
  isRequired: boolean;
  estimatedTime?: number;
  metadata?: {
    videoUrl?: string;
    imageUrl?: string;
    codeExample?: string;
    quiz?: any;
  };
}

// Enhanced learning activity interface
export interface AdminLearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  category: string;
  difficulty: number;
  diamondReward: number;
  experienceReward: number;
  content: string;
  settings: string | null;
  isActive: boolean;
  estimatedMinutes: number;
  tags: string | null;
  sortOrder: number;
  prerequisiteId: string | null;
  topicOrder: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  examples: LearningActivityExample[];
  sections: LearningActivitySection[];
  _count?: {
    attempts: number;
  };
}

// Form interface for learning activity creation/editing
export interface LearningActivityFormData {
  title: string;
  description: string;
  activityType: string;
  category: string;
  difficulty: number;
  diamondReward: number;
  experienceReward: number;
  content: string;
  settings: string;
  isActive: boolean;
  estimatedMinutes: number;
  tags: string[];
  sortOrder: number;
  prerequisiteId: string | null;
  isLocked: boolean;
  examples: LearningActivityExample[];
  sections: LearningActivitySection[];
}

// API response interface
export interface LearningActivitiesResponse {
  learningActivities: AdminLearningActivity[];
}

// Stats interface
export interface LearningActivityStats {
  totalActivities: number;
  activeActivities: number;
  inactiveActivities: number;
  totalStudents: number;
  averageCompletion: number;
  categoryCounts: Record<string, number>;
  difficultyDistribution: Record<number, number>;
}

// Legacy aliases for backwards compatibility (deprecated)
export type CodeArenaExample = LearningActivityExample;
export type CodeArenaSection = LearningActivitySection;
export type AdminCodeArena = AdminLearningActivity;
export type CodeArenaFormData = LearningActivityFormData;
export type CodeArenasResponse = LearningActivitiesResponse;
export type CodeArenaStats = LearningActivityStats;
export type LessonExample = LearningActivityExample;
export type LessonSection = LearningActivitySection;
export type AdminLesson = AdminLearningActivity;
export type LessonFormData = LearningActivityFormData;
export type LessonsResponse = LearningActivitiesResponse;
export type LessonStats = LearningActivityStats;
