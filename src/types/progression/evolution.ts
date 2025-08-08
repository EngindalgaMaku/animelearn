// Card Evolution and Progression System
// Version: 1.0.0 - Advanced TCG Progression Mechanics

import { ElementType, RarityTier, BattleCard } from '../battle/core';

export enum EvolutionStage {
  BASE = 'base',
  EVOLVED = 'evolved',
  MEGA = 'mega',
  LEGENDARY = 'legendary',
  AWAKENED = 'awakened'
}

export enum ProgressionType {
  BATTLE_EXPERIENCE = 'battle_experience',
  CARD_USAGE = 'card_usage',
  VICTORY_COUNT = 'victory_count',
  SPECIAL_CONDITION = 'special_condition',
  MATERIAL_FUSION = 'material_fusion'
}

export interface EvolutionRequirement {
  type: ProgressionType;
  value: number;
  description: string;
  materials?: {
    cardId: string;
    quantity: number;
    consumed: boolean; // Whether material is consumed in evolution
  }[];
  conditions?: {
    minLevel: number;
    specificOpponents?: string[];
    winStreak?: number;
    elementSynergy?: ElementType[];
    timeOfDay?: 'day' | 'night' | 'any';
    location?: string;
  };
}

export interface EvolutionPath {
  fromStage: EvolutionStage;
  toStage: EvolutionStage;
  requirements: EvolutionRequirement[];
  unlocks: {
    newAbilities: string[];
    statBoosts: {
      attackPower: number;
      health: number;
      defense: number;
      speed: number;
    };
    visualChanges: {
      newImageUrl: string;
      newAnimationUrl?: string;
      newSoundEffects?: Record<string, string>;
      particleEffects?: string[];
    };
    rarityUpgrade?: RarityTier;
  };
  evolutionCost: {
    diamonds: number;
    materials: string[];
    time: number; // milliseconds
  };
}

export interface CardProgression {
  cardId: string;
  baseCardId: string; // Original card this evolved from
  currentStage: EvolutionStage;
  level: number;
  experience: number;
  experienceToNext: number;
  
  // Usage Statistics
  battlesParticipated: number;
  victoriesAchieved: number;
  damageDealt: number;
  healingProvided: number;
  abilitiesUsed: number;
  currentWinStreak: number;
  bestWinStreak: number;
  
  // Evolution Progress
  availableEvolutions: EvolutionStage[];
  evolutionProgress: Record<EvolutionStage, {
    requirements: EvolutionRequirement[];
    completedRequirements: number;
    canEvolve: boolean;
  }>;
  
  // Unlocked Features
  unlockedAbilities: string[];
  statBonuses: {
    attackPower: number;
    health: number;
    defense: number;
    speed: number;
  };
  
  // Timeline
  createdAt: number;
  lastUsed: number;
  evolutionHistory: Array<{
    fromStage: EvolutionStage;
    toStage: EvolutionStage;
    timestamp: number;
    cost: Record<string, number>;
  }>;
}

export interface FusionRecipe {
  id: string;
  name: string;
  description: string;
  
  // Requirements
  primaryCard: {
    cardId: string;
    minLevel: number;
    consumed: boolean;
  };
  materialCards: Array<{
    cardId: string;
    quantity: number;
    minLevel?: number;
    consumed: boolean;
  }>;
  catalysts?: Array<{
    itemId: string;
    quantity: number;
  }>;
  
  // Result
  resultCard: {
    cardId: string;
    guaranteedLevel: number;
    inheritedStats: number; // Percentage of primary card stats inherited
  };
  
  // Costs
  fusionCost: {
    diamonds: number;
    time: number;
    successRate: number; // 0-1, can be improved with catalysts
  };
  
  // Conditions
  unlockConditions: {
    playerLevel: number;
    fusionMasteryLevel: number;
    completedQuests?: string[];
  };
}

export interface AwakeningRitual {
  cardId: string;
  awakeningType: 'elemental' | 'cosmic' | 'divine' | 'shadow';
  
  requirements: {
    baseLevel: number;
    evolutionStage: EvolutionStage;
    elementalHarmony: {
      element: ElementType;
      cardsRequired: number;
      minLevel: number;
    }[];
    sacredMaterials: Array<{
      materialId: string;
      quantity: number;
    }>;
    ritualConditions: {
      moonPhase?: 'new' | 'waxing' | 'full' | 'waning';
      timeWindow?: {
        start: number;
        end: number;
      };
      location?: string;
    };
  };
  
  rewards: {
    newAbilities: string[];
    ultimateAttack: string;
    statMultipliers: {
      attackPower: number;
      health: number;
      defense: number;
      speed: number;
    };
    specialEffects: {
      aura: string;
      transformationSequence: string;
      battleEntryEffect: string;
    };
    title: string;
  };
}

export interface EnchantmentSlot {
  id: string;
  type: 'attack' | 'defense' | 'utility' | 'elemental';
  level: number;
  maxLevel: number;
  
  currentEnchantment?: {
    id: string;
    name: string;
    description: string;
    effect: {
      statBoosts?: Record<string, number>;
      abilityModifiers?: Record<string, any>;
      passiveEffects?: string[];
    };
    duration: number; // -1 for permanent, or milliseconds
    appliedAt: number;
  };
}

export interface CardCustomization {
  cardId: string;
  
  // Visual Customizations
  skinId?: string;
  frameId?: string;
  backgroundId?: string;
  particleEffectId?: string;
  
  // Enchantment Slots
  enchantmentSlots: EnchantmentSlot[];
  
  // Prestige System
  prestigeLevel: number;
  prestigeBonuses: {
    experienceMultiplier: number;
    statBonusPerLevel: number;
    specialTitle?: string;
  };
  
  // Certification
  certifications: Array<{
    type: 'tournament_winner' | 'achievement_master' | 'collection_complete';
    title: string;
    certifiedAt: number;
    validUntil?: number;
  }>;
}

export interface ProgressionMilestone {
  id: string;
  name: string;
  description: string;
  category: 'card_mastery' | 'collection' | 'battle_prowess' | 'evolution_master';
  
  requirements: {
    cardsAtMaxLevel: number;
    totalEvolutions: number;
    awakendCards: number;
    fusionsMade: number;
    battlesWon: number;
    uniqueCardsOwned: number;
  };
  
  rewards: {
    diamonds: number;
    materials: Record<string, number>;
    exclusiveCards: string[];
    titles: string[];
    cosmetics: string[];
  };
  
  isRepeatable: boolean;
  prestigeRequired?: number;
}

export interface MasterySystem {
  playerLevel: number;
  totalExperience: number;
  
  // Specializations
  masteries: {
    cardEvolution: {
      level: number;
      experience: number;
      bonuses: {
        evolutionCostReduction: number;
        experienceBonus: number;
        fusionSuccessRateBonus: number;
      };
    };
    battleMastery: {
      level: number;
      experience: number;
      bonuses: {
        cardExperienceBonus: number;
        victoryBonusMultiplier: number;
        unlockRareEvolutions: boolean;
      };
    };
    collectionMastery: {
      level: number;
      experience: number;
      bonuses: {
        cardDropRateBonus: number;
        materialFindBonus: number;
        tradeValueBonus: number;
      };
    };
  };
  
  // Milestones
  achievedMilestones: string[];
  availableMilestones: ProgressionMilestone[];
  
  // Season Progress
  seasonLevel: number;
  seasonExperience: number;
  seasonRewards: Array<{
    level: number;
    rewards: any;
    claimed: boolean;
  }>;
}

// Evolution Chain Definition
export interface EvolutionChain {
  chainId: string;
  name: string;
  description: string;
  baseCard: string;
  
  stages: Record<EvolutionStage, {
    cardId: string;
    name: string;
    description: string;
    unlockLevel: number;
    paths: EvolutionPath[];
  }>;
  
  // Special Evolution Branches
  branches: Array<{
    branchId: string;
    name: string;
    triggerCondition: string;
    alternativeStages: Record<EvolutionStage, string>;
  }>;
  
  // Lore and Story
  lore: {
    backstory: string;
    evolutionNarrative: Record<EvolutionStage, string>;
    legendaryForm?: {
      name: string;
      story: string;
      unlockCondition: string;
    };
  };
}

// Utility Types
export interface EvolutionPreview {
  currentCard: BattleCard;
  targetStage: EvolutionStage;
  previewCard: BattleCard;
  requirements: EvolutionRequirement[];
  cost: Record<string, number>;
  canAfford: boolean;
  estimatedTime: number;
}

export interface ProgressionAnalytics {
  totalCardsEvolved: number;
  averageCardLevel: number;
  masteryPoints: number;
  evolutionEfficiency: number;
  progressionRank: number;
  weeklyProgress: {
    experienceGained: number;
    evolutionsCompleted: number;
    milestonesAchieved: number;
  };
}

export interface EvolutionEvent {
  type: 'evolution_completed' | 'fusion_success' | 'awakening_achieved' | 'milestone_reached';
  cardId: string;
  details: {
    fromStage?: EvolutionStage;
    toStage?: EvolutionStage;
    newAbilities?: string[];
    statChanges?: Record<string, number>;
    rewards?: Record<string, any>;
  };
  timestamp: number;
  celebrationLevel: 'minor' | 'major' | 'epic' | 'legendary';
}