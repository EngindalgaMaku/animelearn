// Example interface for code arena examples
export interface CodeArenaExample {
  id: string
  title: string
  description: string
  code: string
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isInteractive: boolean
  expectedOutput?: string
}

// Section interface for modular code arena content
export interface CodeArenaSection {
  id: string
  type: 'intro' | 'theory' | 'example' | 'practice' | 'quiz' | 'media' | 'exercise' | 'summary'
  title: string
  content: string
  order: number
  isRequired: boolean
  estimatedTime?: number
  metadata?: {
    videoUrl?: string
    imageUrl?: string
    codeExample?: string
    quiz?: any
  }
}

// Enhanced code arena interface
export interface AdminCodeArena {
  id: string
  title: string
  slug: string
  description: string
  content: string
  difficulty: number
  order: number
  duration: number
  category: string
  hasCodeExercise: boolean
  starterCode: string | null
  solutionCode: string | null
  testCases: string | null
  hints: string | null
  prerequisites: string | null
  diamondReward: number
  experienceReward: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  examples: CodeArenaExample[]
  sections: CodeArenaSection[]
  tags: string[]
  learningObjectives: string[]
  resources: string[]
  _count?: {
    progress: number
  }
}

// Form interface for code arena creation/editing
export interface CodeArenaFormData {
  title: string
  slug: string
  description: string
  content: string
  difficulty: number
  order: number
  duration: number
  category: string
  hasCodeExercise: boolean
  starterCode: string
  solutionCode: string
  testCases: string
  hints: string
  prerequisites: string
  diamondReward: number
  experienceReward: number
  isPublished: boolean
  examples: CodeArenaExample[]
  sections: CodeArenaSection[]
  tags: string[]
  learningObjectives: string[]
  resources: string[]
}

// API response interface
export interface CodeArenasResponse {
  codeArenas: AdminCodeArena[]
}

// Stats interface
export interface CodeArenaStats {
  totalCodeArenas: number
  publishedCodeArenas: number
  draftCodeArenas: number
  totalStudents: number
  averageCompletion: number
  categoryCounts: Record<string, number>
  difficultyDistribution: Record<number, number>
}

// Legacy aliases for backwards compatibility
export type LessonExample = CodeArenaExample
export type LessonSection = CodeArenaSection
export type AdminLesson = AdminCodeArena
export type LessonFormData = CodeArenaFormData
export type LessonsResponse = CodeArenasResponse
export type LessonStats = CodeArenaStats
