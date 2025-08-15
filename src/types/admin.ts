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

// Dedicated Lessons types (legacy CodeArena UI expects these shapes)
export interface AdminLesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: number;
  order: number;
  duration: number;
  category: string;
  hasCodeExercise: boolean;
  starterCode?: string | null;
  solutionCode?: string | null;
  testCases?: string | null;
  hints?: string | null;
  prerequisites?: string | null;
  diamondReward: number;
  experienceReward: number;
  isPublished: boolean;
  tags: string[];
  examples: LearningActivityExample[];
  sections: LearningActivitySection[];
  learningObjectives?: string[];
  resources?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  _count?: {
    progress: number;
  };
}

export interface LessonFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: number;
  order: number;
  duration: number;
  category: string;
  hasCodeExercise: boolean;
  starterCode: string;
  solutionCode: string;
  testCases: string;
  hints: string;
  prerequisites: string;
  diamondReward: number;
  experienceReward: number;
  isPublished: boolean;
  examples: LearningActivityExample[];
  sections: LearningActivitySection[];
  tags: string[];
  learningObjectives: string[];
  resources: string[];
}

export interface LessonsResponse {
  lessons: AdminLesson[];
}

export interface LessonStats {
  totalCodeArenas: number;
  publishedCodeArenas: number;
  draftCodeArenas: number;
  totalStudents: number;
  averageCompletion: number;
  categoryCounts: Record<string, number>;
  difficultyDistribution: Record<number, number>;
}
