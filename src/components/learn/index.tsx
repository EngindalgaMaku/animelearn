// Learning Interface Components - Main Export

// Core Learning Components
export { default as CodeEditor } from "./code-editor";
export { default as QuizComponent } from "./quiz";
export { default as ExerciseSubmission } from "./exercise-submission";

// New Learning Components
export {
  ProgressTracker,
  useProgressCalculations,
  sampleMilestones,
  type LearningProgress,
  type Milestone,
} from "./progress-tracker";

export {
  LessonCard,
  LessonGrid,
  sampleLessons,
  type Lesson,
} from "./lesson-card";

export { LearningDashboard, sampleDashboardData } from "./learning-dashboard";

// Re-export types for convenience
