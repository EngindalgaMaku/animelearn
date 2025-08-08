// Core Types for Elements of Legends Card Battle System
// Version: 1.0.0 - Professional TCG Implementation

export enum ElementType {
  FIRE = 'fire',
  WATER = 'water', 
  EARTH = 'earth',
  AIR = 'air',
  LIGHT = 'light',
  SHADOW = 'shadow',
  NEUTRAL = 'neutral'
}

export enum RarityTier {
  COMMON = 'common',
  UNCOMMON = 'uncommon', 
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
  DIVINE = 'divine'
}

export enum CardType {
  CREATURE = 'creature',
  SPELL = 'spell',
  ARTIFACT = 'artifact',
  ENCHANTMENT = 'enchantment'
}

export enum StatusEffectType {
  BURN = 'burn',
  FREEZE = 'freeze', 
  POISON = 'poison',
  SHIELD = 'shield',
  RAGE = 'rage',
  HEAL = 'heal',
  STUN = 'stun',
  BLESSING = 'blessing',
  CURSE = 'curse'
}

export interface StatusEffect {
  type: StatusEffectType;
  duration: number;
  power: number;
  source: string;
}

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldown: number;
  targetRequired: boolean;
  execute: (caster: BattleCard, target?: BattleCard, gameState?: GameState) => AbilityResult;
}

export interface AbilityResult {
  success: boolean;
  damage?: number;
  healing?: number;
  statusEffects?: StatusEffect[];
  message: string;
}

export interface BattleCard {
  // Core Identity
  id: string;
  name: string;
  description: string;
  
  // Visual & Audio
  imageUrl: string;
  animationUrl?: string;
  soundEffects?: {
    summon?: string;
    attack?: string;
    death?: string;
  };
  
  // Game Mechanics
  element: ElementType;
  rarity: RarityTier;
  cardType: CardType;
  manaCost: number;
  
  // Combat Stats
  attackPower: number;
  health: number;
  maxHealth: number;
  defense: number;
  speed: number;
  
  // Special Properties
  abilities: SpecialAbility[];
  statusEffects: StatusEffect[];
  keywords: string[];
  
  // Targeting & Positioning
  targetRequired: boolean;
  position?: { x: number; y: number };
  
  // Evolution & Progression
  level: number;
  experience: number;
  evolutionStage: number;
  
  // Collection & Economy
  collectionNumber: number;
  isAnimated: boolean;
  isHolographic: boolean;
  
  // Game State
  canAttack: boolean;
  canUseAbilities: boolean;
  turnsSincePlay: number;
}

export interface Player {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  deck: BattleCard[];
  hand: BattleCard[];
  field: BattleCard[];
  graveyard: BattleCard[];
  statusEffects: StatusEffect[];
}

export interface GameState {
  // Game Meta
  gameId: string;
  turn: number;
  phase: GamePhase;
  currentPlayer: 'player' | 'opponent';
  
  // Players
  player: Player;
  opponent: Player;
  
  // Field State
  weather?: WeatherEffect;
  terrain?: TerrainEffect;
  globalEffects: GlobalEffect[];
  
  // Game History
  actionHistory: GameAction[];
  lastAction?: GameAction;
  
  // Timing
  turnStartTime: number;
  turnTimeLimit: number;
}

export enum GamePhase {
  DRAW = 'draw',
  MAIN = 'main', 
  COMBAT = 'combat',
  END = 'end'
}

export interface WeatherEffect {
  type: 'storm' | 'sunshine' | 'fog' | 'blizzard';
  turnsRemaining: number;
  effect: (gameState: GameState) => void;
}

export interface TerrainEffect {
  type: 'mountains' | 'forest' | 'desert' | 'ocean' | 'volcano';
  permanent: boolean;
  effect: (gameState: GameState) => void;
}

export interface GlobalEffect {
  id: string;
  name: string;
  description: string;
  turnsRemaining: number;
  effect: (gameState: GameState) => void;
}

export interface GameAction {
  type: 'play_card' | 'attack' | 'use_ability' | 'end_turn' | 'surrender';
  playerId: string;
  timestamp: number;
  card?: BattleCard;
  target?: BattleCard | Player;
  targetPosition?: { x: number; y: number };
  abilityId?: string;
}

export interface GameResult {
  winner: 'player' | 'opponent' | 'draw';
  reason: 'health' | 'deck_empty' | 'surrender' | 'timeout';
  turns: number;
  duration: number;
  playerStats: PlayerGameStats;
  opponentStats: PlayerGameStats;
}

export interface PlayerGameStats {
  damageDealt: number;
  healingDone: number;
  cardsPlayed: number;
  abilitiesUsed: number;
  cardsDrawn: number;
  maxManaReached: number;
}

// Element Interaction Matrix
export interface ElementInteraction {
  attacker: ElementType;
  defender: ElementType;
  effectiveness: number; // 0.5 = weak, 1.0 = normal, 1.5 = strong, 2.0 = super effective
  description: string;
}

// Deck Building Constraints
export interface DeckConstraints {
  minCards: number;
  maxCards: number;
  maxCopiesPerCard: number;
  rarityLimits: { [key in RarityTier]: number };
  elementRestrictions?: ElementType[];
}

// Tournament & Competitive Play
export interface BattleRating {
  rating: number;
  wins: number;
  losses: number;
  winStreak: number;
  seasonRank: string;
  tier: CompetitiveTier;
}

export enum CompetitiveTier {
  BRONZE = 'bronze',
  SILVER = 'silver', 
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  MASTER = 'master',
  GRANDMASTER = 'grandmaster'
}

// AI Difficulty and Personality
export enum AIDifficulty {
  NOVICE = 'novice',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  MASTER = 'master'
}

export enum AIPersonality {
  AGGRESSIVE = 'aggressive',
  DEFENSIVE = 'defensive',
  BALANCED = 'balanced',
  TACTICAL = 'tactical',
  CHAOTIC = 'chaotic'
}

export interface AIConfig {
  difficulty: AIDifficulty;
  personality: AIPersonality;
  adaptiveLearning: boolean;
  mistakeRate: number;
  reactionTime: number;
}