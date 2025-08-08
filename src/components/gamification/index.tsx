// Core Gamification Components
export {
  DiamondCounter,
  CompactDiamondCounter,
  DetailedDiamondCounter,
  useDiamondAnimation,
} from "./diamond-counter";

export {
  LevelIndicator,
  CompactLevelIndicator,
  DetailedLevelIndicator,
  LevelUpAnimation,
  useLevelCalculation,
} from "./level-indicator";

export {
  BadgeComponent,
  BadgeGrid,
  BadgeShowcase,
  BadgeUnlockAnimation,
  badgeTemplates,
} from "./badge-system";
export {
  AchievementCelebration,
  AchievementQueue,
  useAchievements,
  achievementTemplates,
} from "./achievement-celebration";

// Export types
export type { Badge, BadgeRarity, BadgeCategory } from "./badge-system";
