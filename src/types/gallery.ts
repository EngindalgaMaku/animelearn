// 3D Gallery System Types
// Version: 1.0.0 - Ultimate Card Experience

import { ElementType, RarityTier } from './battle/core';

export interface GalleryCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  element: ElementType;
  rarity: RarityTier;
  story?: string;
  lore?: string;
  isAnimated: boolean;
  isHolographic: boolean;
  collectionNumber: number;
  userId: string;
  createdAt: Date;
  // 3D Display Properties
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  displayEffect?: DisplayEffectType;
}

export enum DisplayEffectType {
  NONE = 'none',
  GLOW = 'glow',
  SPARKLE = 'sparkle',
  FLOATING = 'floating',
  ROTATING = 'rotating',
  PULSING = 'pulsing',
  HOLOGRAPHIC = 'holographic'
}

export interface GalleryEnvironment {
  element: ElementType;
  architecture: ArchitectureConfig;
  lighting: LightingConfig;
  effects: EnvironmentEffects;
  audio: AudioConfig;
  interactives: InteractiveElement[];
}

export interface ArchitectureConfig {
  wallTexture: string;
  floorTexture: string;
  ceilingTexture: string;
  pedestalMaterial: string;
  ambientGeometry: GeometryType;
  backgroundImage?: string;
}

export enum GeometryType {
  VOLCANIC_CAVE = 'volcanic_cave',
  ICE_CAVERN = 'ice_cavern',
  FOREST_RUINS = 'forest_ruins',
  CLOUD_PLATFORMS = 'cloud_platforms',
  GOLDEN_TEMPLE = 'golden_temple',
  GOTHIC_HALLS = 'gothic_halls',
  ZEN_GARDEN = 'zen_garden'
}

export interface LightingConfig {
  ambientColor: string;
  ambientIntensity: number;
  directionalColor: string;
  directionalIntensity: number;
  directionalPosition: [number, number, number];
  spotLights: SpotLight[];
  pointLights: PointLight[];
  environmentLighting: boolean;
}

export interface SpotLight {
  position: [number, number, number];
  target: [number, number, number];
  color: string;
  intensity: number;
  angle: number;
  penumbra: number;
  decay: number;
}

export interface PointLight {
  position: [number, number, number];
  color: string;
  intensity: number;
  distance: number;
  decay: number;
}

export interface EnvironmentEffects {
  particles: ParticleSystem[];
  weather?: WeatherType;
  atmosphericEffects: AtmosphericEffect[];
  postProcessing: PostProcessingEffect[];
}

export enum WeatherType {
  NONE = 'none',
  EMBER_RAIN = 'ember_rain',
  SNOW_FALL = 'snow_fall',
  MIST = 'mist',
  AURORA = 'aurora',
  LIGHT_RAYS = 'light_rays',
  SHADOW_FOG = 'shadow_fog'
}

export interface ParticleSystem {
  type: ParticleType;
  count: number;
  position: [number, number, number];
  velocity: [number, number, number];
  size: [number, number];
  color: string;
  opacity: [number, number];
  lifespan: number;
  respawn: boolean;
}

export enum ParticleType {
  EMBERS = 'embers',
  BUBBLES = 'bubbles',
  LEAVES = 'leaves',
  SNOW = 'snow',
  SPARKLES = 'sparkles',
  SMOKE = 'smoke',
  DUST = 'dust'
}

export interface AtmosphericEffect {
  type: 'heat_shimmer' | 'mist' | 'volumetric_light' | 'aurora' | 'fog';
  intensity: number;
  color?: string;
  animation?: boolean;
}

export interface PostProcessingEffect {
  type: 'bloom' | 'chromatic_aberration' | 'depth_of_field' | 'vignette' | 'color_grading';
  intensity: number;
  parameters?: Record<string, any>;
}

export interface AudioConfig {
  ambientTrack?: string;
  volume: number;
  loop: boolean;
  fadeIn: boolean;
  soundEffects: SoundEffect[];
}

export interface SoundEffect {
  trigger: SoundTrigger;
  audioUrl: string;
  volume: number;
  randomPitch: boolean;
  spatial: boolean;
  position?: [number, number, number];
}

export enum SoundTrigger {
  ON_ENTER = 'on_enter',
  ON_EXIT = 'on_exit',
  ON_CARD_HOVER = 'on_card_hover',
  ON_CARD_SELECT = 'on_card_select',
  ON_PORTAL_ACTIVATION = 'on_portal_activation',
  AMBIENT_LOOP = 'ambient_loop'
}

export interface InteractiveElement {
  id: string;
  type: InteractiveType;
  position: [number, number, number];
  model?: string;
  animation?: string;
  clickHandler?: (element: InteractiveElement) => void;
  hoverHandler?: (element: InteractiveElement) => void;
}

export enum InteractiveType {
  PORTAL = 'portal',
  INFO_PANEL = 'info_panel',
  DECORATION = 'decoration',
  COLLECTIBLE = 'collectible',
  EASTER_EGG = 'easter_egg'
}

export interface GalleryNavigation {
  currentGallery: ElementType;
  previousGallery?: ElementType;
  availableGalleries: ElementType[];
  transitionProgress: number;
  isTransitioning: boolean;
  portals: Portal[];
}

export interface Portal {
  id: string;
  sourceGallery: ElementType;
  targetGallery: ElementType;
  position: [number, number, number];
  rotation: [number, number, number];
  isActive: boolean;
  unlocked: boolean;
  requirements?: PortalRequirement[];
}

export interface PortalRequirement {
  type: 'card_count' | 'rarity_collection' | 'achievement' | 'level';
  element?: ElementType;
  rarity?: RarityTier;
  count?: number;
  achievementId?: string;
  minLevel?: number;
}

export interface GalleryViewState {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraFov: number;
  selectedCard?: GalleryCard;
  hoveredCard?: GalleryCard;
  inspectionMode: boolean;
  galleryLayout: GalleryLayout;
}

export enum GalleryLayout {
  GRID = 'grid',
  SPIRAL = 'spiral',
  WALL = 'wall',
  FLOATING = 'floating',
  CUSTOM = 'custom'
}

export interface CardDisplaySettings {
  spacing: [number, number, number];
  pedestalHeight: number;
  cardScale: number;
  hoverScale: number;
  rotationSpeed: number;
  floatingAnimation: boolean;
  glowIntensity: number;
  showInfo: boolean;
  autoRotate: boolean;
}

export interface GalleryPerformanceSettings {
  lodDistance: number;
  maxParticles: number;
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high' | 'ultra';
  antialiasing: boolean;
  postProcessing: boolean;
  adaptiveQuality: boolean;
  targetFPS: number;
}

export interface FusionLaboratory {
  isActive: boolean;
  selectedCards: GalleryCard[];
  fusionStage: FusionStage;
  availableRecipes: FusionRecipe[];
  fusionHistory: FusionResult[];
  laboratoryEffects: LaboratoryEffect[];
}

export enum FusionStage {
  SELECTION = 'selection',
  COMPATIBILITY_CHECK = 'compatibility_check',
  ENERGY_GATHERING = 'energy_gathering',
  FUSION_REACTION = 'fusion_reaction',
  CARD_CREATION = 'card_creation',
  COMPLETION = 'completion'
}

export interface FusionRecipe {
  id: string;
  name: string;
  description: string;
  elements: ElementType[];
  requiredRarities: RarityTier[];
  successRate: number;
  resultPreview: Partial<GalleryCard>;
  unlocked: boolean;
  discoveredBy?: string;
  discoveryDate?: Date;
}

export interface FusionResult {
  success: boolean;
  newCard?: GalleryCard;
  experience: number;
  fusionRecipe: FusionRecipe;
  timestamp: Date;
  sourceCards: GalleryCard[];
  specialEffects?: string[];
}

export interface LaboratoryEffect {
  type: 'energy_stream' | 'fusion_chamber' | 'particle_burst' | 'card_materialization';
  duration: number;
  intensity: number;
  position: [number, number, number];
  color: string;
}

export interface GalleryState {
  navigation: GalleryNavigation;
  viewState: GalleryViewState;
  cards: GalleryCard[];
  environment: GalleryEnvironment;
  displaySettings: CardDisplaySettings;
  performanceSettings: GalleryPerformanceSettings;
  fusionLab: FusionLaboratory;
  user: {
    id: string;
    level: number;
    experience: number;
    unlockedGalleries: ElementType[];
    achievements: string[];
    preferences: UserGalleryPreferences;
  };
}

export interface UserGalleryPreferences {
  defaultLayout: GalleryLayout;
  autoPlay: boolean;
  soundEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  cameraSpeed: number;
  tooltipDelay: number;
  highQualityMode: boolean;
}