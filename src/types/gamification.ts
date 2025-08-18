// Gamification types and rule definitions

export type BadgeRuleType =
  | "count"
  | "streak"
  | "milestone"
  | "time_based"
  | "combo"
  | "skill_mastery";

export type BadgeMetric =
  | "activities_completed"
  | "quizzes_completed"
  | "quiz_correct"
  | "login_streak"
  | "diamonds_earned"
  | "code_submissions"
  | "skill_mastery";

export interface BadgeRuleDefinition {
  // Generic filters
  category?: string;
  activityType?: string;
  difficultyGte?: number;
  difficultyLte?: number;
  tags?: string[];
  // Time window in days for considering progress
  timeWindowDays?: number;

  // Quiz-specific
  minScore?: number;
  consecutive?: number;

  // Skill-specific
  skillKey?: string;
  masteryThreshold?: number;

  // Additional filters/extensions
  [key: string]: any;
}

export interface RuleEvaluationResult {
  current: number;
  target?: number;
  normalized: number; // 0..1
  details?: Record<string, any>;
}

export interface AchievementAggregationResult {
  normalized: number; // 0..1
  ruleResults: RuleEvaluationResult[];
  weightSum: number;
}
