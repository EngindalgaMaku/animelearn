'use client';

import { ElementType, RarityTier } from './battle/core';
import { GalleryCard } from './gallery';

// Fusion Laboratory Types
export interface FusionRecipe {
  id: string;
  name: string;
  description: string;
  requiredElements: ElementType[];
  requiredRarities: RarityTier[];
  energyCost: number;
  successRate: number;
  unlockLevel: number;
  resultCard?: GalleryCard;
  alternativeResults?: GalleryCard[];
}

export interface FusionResult {
  success: boolean;
  resultCard?: GalleryCard;
  experienceGained: number;
  energyUsed: number;
  fusionTime: number;
  criticalFusion: boolean;
  message: string;
}

export interface FusionSlot {
  id: string;
  position: [number, number, number];
  card?: GalleryCard;
  elementType?: ElementType;
  isActive: boolean;
  glowColor: string;
  energy: number;
}

export interface FusionChamber {
  id: string;
  slots: FusionSlot[];
  centralPosition: [number, number, number];
  energyLevel: number;
  maxEnergy: number;
  isActive: boolean;
  fusionInProgress: boolean;
  temperature: number;
  stability: number;
}

export interface ElementalEnergy {
  type: ElementType;
  amount: number;
  purity: number;
  resonance: number;
  color: string;
  particleCount: number;
}

export interface FusionParticle {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  color: string;
  size: number;
  life: number;
  maxLife: number;
  elementType: ElementType;
}

export interface FusionAnimation {
  phase: 'preparation' | 'charging' | 'fusion' | 'completion' | 'failure';
  duration: number;
  intensity: number;
  particles: FusionParticle[];
  energyStreams: EnergyStream[];
  cameraShake: number;
  bloomIntensity: number;
}

export interface EnergyStream {
  id: string;
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  color: string;
  intensity: number;
  thickness: number;
  flow: number;
  elementType: ElementType;
}

export interface FusionLaboratoryState {
  chamber: FusionChamber;
  selectedCards: GalleryCard[];
  availableRecipes: FusionRecipe[];
  currentRecipe?: FusionRecipe;
  animation?: FusionAnimation;
  userEnergy: number;
  userLevel: number;
  userExperience: number;
  fusionHistory: FusionResult[];
  laboratoryUpgrades: LaboratoryUpgrade[];
}

export interface LaboratoryUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  energyBonus: number;
  successRateBonus: number;
  unlockLevel: number;
  isUnlocked: boolean;
  isPurchased: boolean;
}

export interface FusionUI {
  selectedSlot?: string;
  hoveredCard?: GalleryCard;
  showRecipes: boolean;
  showHistory: boolean;
  showUpgrades: boolean;
  animationSpeed: number;
  soundEnabled: boolean;
  particleQuality: 'low' | 'medium' | 'high' | 'ultra';
}

// Fusion Laboratory Events
export type FusionEvent = 
  | { type: 'CARD_PLACED'; payload: { slotId: string; card: GalleryCard } }
  | { type: 'CARD_REMOVED'; payload: { slotId: string } }
  | { type: 'FUSION_STARTED'; payload: { recipe: FusionRecipe } }
  | { type: 'FUSION_COMPLETED'; payload: { result: FusionResult } }
  | { type: 'ENERGY_CHANGED'; payload: { amount: number } }
  | { type: 'RECIPE_SELECTED'; payload: { recipe: FusionRecipe } }
  | { type: 'CHAMBER_UPGRADED'; payload: { upgrade: LaboratoryUpgrade } };

// Element Combination Matrix
export interface ElementCombination {
  element1: ElementType;
  element2: ElementType;
  resultElement?: ElementType;
  bonusMultiplier: number;
  specialEffect?: string;
  particleColor: string;
  energyRequirement: number;
}

// Predefined Element Combinations
export const ELEMENT_COMBINATIONS: ElementCombination[] = [
  // Fire combinations
  { element1: ElementType.FIRE, element2: ElementType.EARTH, resultElement: ElementType.NEUTRAL, bonusMultiplier: 1.2, particleColor: '#ff6600', energyRequirement: 50 },
  { element1: ElementType.FIRE, element2: ElementType.AIR, resultElement: ElementType.LIGHT, bonusMultiplier: 1.5, particleColor: '#ffaa00', energyRequirement: 75 },
  { element1: ElementType.FIRE, element2: ElementType.WATER, bonusMultiplier: 0.8, particleColor: '#ff0066', energyRequirement: 100, specialEffect: 'steam_explosion' },
  
  // Water combinations
  { element1: ElementType.WATER, element2: ElementType.EARTH, resultElement: ElementType.NEUTRAL, bonusMultiplier: 1.1, particleColor: '#66ccff', energyRequirement: 40 },
  { element1: ElementType.WATER, element2: ElementType.AIR, resultElement: ElementType.NEUTRAL, bonusMultiplier: 1.3, particleColor: '#aaccff', energyRequirement: 60 },
  { element1: ElementType.WATER, element2: ElementType.SHADOW, resultElement: ElementType.SHADOW, bonusMultiplier: 1.4, particleColor: '#4466aa', energyRequirement: 80 },
  
  // Earth combinations
  { element1: ElementType.EARTH, element2: ElementType.AIR, resultElement: ElementType.NEUTRAL, bonusMultiplier: 1.0, particleColor: '#88aa66', energyRequirement: 45 },
  { element1: ElementType.EARTH, element2: ElementType.SHADOW, resultElement: ElementType.SHADOW, bonusMultiplier: 1.3, particleColor: '#554433', energyRequirement: 70 },
  
  // Air combinations
  { element1: ElementType.AIR, element2: ElementType.LIGHT, resultElement: ElementType.LIGHT, bonusMultiplier: 1.6, particleColor: '#ffffaa', energyRequirement: 90 },
  { element1: ElementType.AIR, element2: ElementType.SHADOW, bonusMultiplier: 0.9, particleColor: '#6666aa', energyRequirement: 85, specialEffect: 'void_distortion' },
  
  // Light combinations
  { element1: ElementType.LIGHT, element2: ElementType.SHADOW, bonusMultiplier: 2.0, particleColor: '#aaaaaa', energyRequirement: 150, specialEffect: 'balance_resonance' },
  
  // Same element combinations (power amplification)
  { element1: ElementType.FIRE, element2: ElementType.FIRE, resultElement: ElementType.FIRE, bonusMultiplier: 1.8, particleColor: '#ff3300', energyRequirement: 80 },
  { element1: ElementType.WATER, element2: ElementType.WATER, resultElement: ElementType.WATER, bonusMultiplier: 1.7, particleColor: '#0066cc', energyRequirement: 70 },
  { element1: ElementType.EARTH, element2: ElementType.EARTH, resultElement: ElementType.EARTH, bonusMultiplier: 1.6, particleColor: '#228B22', energyRequirement: 65 },
  { element1: ElementType.AIR, element2: ElementType.AIR, resultElement: ElementType.AIR, bonusMultiplier: 1.9, particleColor: '#87CEEB', energyRequirement: 75 },
  { element1: ElementType.LIGHT, element2: ElementType.LIGHT, resultElement: ElementType.LIGHT, bonusMultiplier: 2.2, particleColor: '#FFD700', energyRequirement: 120 },
  { element1: ElementType.SHADOW, element2: ElementType.SHADOW, resultElement: ElementType.SHADOW, bonusMultiplier: 2.1, particleColor: '#8A2BE2', energyRequirement: 110 }
];

// Rarity Progression System
export const RARITY_FUSION_MATRIX = {
  [RarityTier.COMMON]: {
    [RarityTier.COMMON]: { result: RarityTier.COMMON, chance: 0.7, bonusChance: { [RarityTier.UNCOMMON]: 0.3 } },
    [RarityTier.UNCOMMON]: { result: RarityTier.UNCOMMON, chance: 0.6, bonusChance: { [RarityTier.RARE]: 0.4 } },
    [RarityTier.RARE]: { result: RarityTier.RARE, chance: 0.8, bonusChance: { [RarityTier.EPIC]: 0.2 } },
    [RarityTier.EPIC]: { result: RarityTier.EPIC, chance: 0.9, bonusChance: { [RarityTier.LEGENDARY]: 0.1 } },
    [RarityTier.LEGENDARY]: { result: RarityTier.LEGENDARY, chance: 1.0 }
  },
  [RarityTier.UNCOMMON]: {
    [RarityTier.UNCOMMON]: { result: RarityTier.UNCOMMON, chance: 0.5, bonusChance: { [RarityTier.RARE]: 0.5 } },
    [RarityTier.RARE]: { result: RarityTier.RARE, chance: 0.7, bonusChance: { [RarityTier.EPIC]: 0.3 } },
    [RarityTier.EPIC]: { result: RarityTier.EPIC, chance: 0.8, bonusChance: { [RarityTier.LEGENDARY]: 0.2 } },
    [RarityTier.LEGENDARY]: { result: RarityTier.LEGENDARY, chance: 1.0 }
  },
  [RarityTier.RARE]: {
    [RarityTier.RARE]: { result: RarityTier.RARE, chance: 0.4, bonusChance: { [RarityTier.EPIC]: 0.6 } },
    [RarityTier.EPIC]: { result: RarityTier.EPIC, chance: 0.6, bonusChance: { [RarityTier.LEGENDARY]: 0.4 } },
    [RarityTier.LEGENDARY]: { result: RarityTier.LEGENDARY, chance: 1.0 }
  },
  [RarityTier.EPIC]: {
    [RarityTier.EPIC]: { result: RarityTier.EPIC, chance: 0.3, bonusChance: { [RarityTier.LEGENDARY]: 0.7 } },
    [RarityTier.LEGENDARY]: { result: RarityTier.LEGENDARY, chance: 1.0 }
  },
  [RarityTier.LEGENDARY]: {
    [RarityTier.LEGENDARY]: { result: RarityTier.LEGENDARY, chance: 1.0 }
  }
};