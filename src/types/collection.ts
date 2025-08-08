'use client';

import { ElementType, RarityTier } from './battle/core';
import { GalleryCard } from './gallery';

// Collection Management Types
export interface CollectionStats {
  totalCards: number;
  uniqueCards: number;
  duplicateCards: number;
  completionPercentage: number;
  elementDistribution: Record<ElementType, number>;
  rarityDistribution: Record<RarityTier, number>;
  totalValue: number;
  averageRarity: number;
  newestCard?: GalleryCard;
  rarestCard?: GalleryCard;
  favoriteElement: ElementType;
  favoriteCards: number;
  animatedCards: number;
  holographicCards: number;
}

export interface CollectionFilter {
  elements: ElementType[];
  rarities: RarityTier[];
  searchText: string;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  showDuplicates: boolean;
  showFavorites: boolean;
  showAnimated: boolean;
  showHolographic: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface CollectionGroup {
  id: string;
  name: string;
  description: string;
  cards: GalleryCard[];
  isCustom: boolean;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionSanctuary {
  id: string;
  userId: string;
  name: string;
  description: string;
  isPublic: boolean;
  cards: GalleryCard[];
  groups: CollectionGroup[];
  favorites: string[]; // card IDs
  wishlist: string[]; // card IDs or names
  stats: CollectionStats;
  settings: CollectionSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionSettings {
  displayMode: 'grid' | 'list' | 'showcase' | 'timeline';
  cardsPerPage: number;
  showTooltips: boolean;
  autoGroupByElement: boolean;
  autoGroupByRarity: boolean;
  enableAnimations: boolean;
  sortPreference: SortOption;
  privacyMode: 'public' | 'friends' | 'private';
  allowTrading: boolean;
  notificationPreferences: {
    newCardAdded: boolean;
    rareFindAlert: boolean;
    collectionMilestone: boolean;
    tradingRequests: boolean;
  };
}

export interface CollectionMilestone {
  id: string;
  name: string;
  description: string;
  requirement: MilestoneRequirement;
  reward?: CollectionReward;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface MilestoneRequirement {
  type: 'total_cards' | 'element_complete' | 'rarity_complete' | 'fusion_count' | 'duplicate_count';
  target: number | ElementType | RarityTier;
  value: number;
}

export interface CollectionReward {
  type: 'card' | 'title' | 'badge' | 'frame' | 'energy';
  item: string;
  rarity?: RarityTier;
  description: string;
}

export interface TradeOffer {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredCards: GalleryCard[];
  requestedCards: GalleryCard[];
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export interface CollectionAnalytics {
  dailyStats: {
    date: Date;
    cardsAdded: number;
    fusionsPerformed: number;
    timeSpent: number; // minutes
  }[];
  weeklyGrowth: number;
  monthlyGrowth: number;
  mostActiveHours: number[];
  popularElements: ElementType[];
  collectionValue: {
    current: number;
    peak: number;
    trend: 'up' | 'down' | 'stable';
  };
  comparisons: {
    globalRanking: number;
    friendsRanking: number;
    percentile: number;
  };
}

export interface WishlistItem {
  id: string;
  cardName?: string;
  cardId?: string;
  element?: ElementType;
  rarity?: RarityTier;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  addedAt: Date;
  obtainedAt?: Date;
  isObtained: boolean;
}

export interface CollectionShowcase {
  id: string;
  name: string;
  description: string;
  featuredCards: GalleryCard[];
  theme: ShowcaseTheme;
  layout: ShowcaseLayout;
  isPublic: boolean;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShowcaseTheme {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  cardFrameStyle: 'classic' | 'modern' | 'vintage' | 'neon' | 'royal';
  particleEffects: boolean;
  backgroundPattern?: string;
}

export interface ShowcaseLayout {
  type: 'gallery' | 'pyramid' | 'circle' | 'spiral' | 'constellation';
  spacing: number;
  cardSize: 'small' | 'medium' | 'large' | 'xl';
  animation: 'none' | 'float' | 'rotate' | 'pulse' | 'glow';
  maxCards: number;
}

// Sort Options
export type SortOption = 
  | 'name'
  | 'element'
  | 'rarity' 
  | 'dateAdded'
  | 'collectionNumber'
  | 'value'
  | 'popularity'
  | 'random';

// Predefined Collection Groups
export const DEFAULT_COLLECTION_GROUPS: Omit<CollectionGroup, 'id' | 'cards' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Fire Masters',
    description: 'All Fire element cards',
    isCustom: false,
    color: '#ff4400',
    icon: '🔥'
  },
  {
    name: 'Water Spirits',
    description: 'All Water element cards',
    isCustom: false,
    color: '#0066cc',
    icon: '💧'
  },
  {
    name: 'Earth Guardians',
    description: 'All Earth element cards',
    isCustom: false,
    color: '#228B22',
    icon: '🌍'
  },
  {
    name: 'Air Dancers',
    description: 'All Air element cards',
    isCustom: false,
    color: '#87CEEB',
    icon: '💨'
  },
  {
    name: 'Light Bearers',
    description: 'All Light element cards',
    isCustom: false,
    color: '#FFD700',
    icon: '✨'
  },
  {
    name: 'Shadow Weavers',
    description: 'All Shadow element cards',
    isCustom: false,
    color: '#8A2BE2',
    icon: '🌙'
  },
  {
    name: 'Neutral Harmony',
    description: 'All Neutral element cards',
    isCustom: false,
    color: '#D3D3D3',
    icon: '⚪'
  },
  {
    name: 'Legendary Collection',
    description: 'All Legendary rarity cards',
    isCustom: false,
    color: '#ff6b35',
    icon: '👑'
  },
  {
    name: 'Holographic Showcase',
    description: 'All holographic cards',
    isCustom: false,
    color: '#c77dff',
    icon: '🌈'
  },
  {
    name: 'Animated Gallery',
    description: 'All animated cards',
    isCustom: false,
    color: '#06ffa5',
    icon: '🎬'
  },
  {
    name: 'My Favorites',
    description: 'Personal favorite cards',
    isCustom: false,
    color: '#e056fd',
    icon: '❤️'
  },
  {
    name: 'Recently Added',
    description: 'Cards added in the last 30 days',
    isCustom: false,
    color: '#4cc9f0',
    icon: '🆕'
  }
];

// Collection Events
export type CollectionEvent = 
  | { type: 'CARD_ADDED'; payload: { card: GalleryCard } }
  | { type: 'CARD_REMOVED'; payload: { cardId: string } }
  | { type: 'CARD_FAVORITED'; payload: { cardId: string; isFavorite: boolean } }
  | { type: 'GROUP_CREATED'; payload: { group: CollectionGroup } }
  | { type: 'GROUP_UPDATED'; payload: { groupId: string; updates: Partial<CollectionGroup> } }
  | { type: 'GROUP_DELETED'; payload: { groupId: string } }
  | { type: 'FILTER_CHANGED'; payload: { filter: CollectionFilter } }
  | { type: 'SETTINGS_UPDATED'; payload: { settings: Partial<CollectionSettings> } }
  | { type: 'MILESTONE_UNLOCKED'; payload: { milestone: CollectionMilestone } }
  | { type: 'SHOWCASE_CREATED'; payload: { showcase: CollectionShowcase } }
  | { type: 'TRADE_OFFERED'; payload: { trade: TradeOffer } };

// Utility Functions
export const calculateCollectionValue = (cards: GalleryCard[]): number => {
  const rarityValues: Record<RarityTier, number> = {
    [RarityTier.COMMON]: 10,
    [RarityTier.UNCOMMON]: 25,
    [RarityTier.RARE]: 50,
    [RarityTier.EPIC]: 100,
    [RarityTier.LEGENDARY]: 250,
    [RarityTier.MYTHIC]: 500,
    [RarityTier.DIVINE]: 1000
  };

  return cards.reduce((total, card) => {
    let value = rarityValues[card.rarity] || 10; // fallback to common value
    if (card.isHolographic) value *= 1.5;
    if (card.isAnimated) value *= 1.3;
    return total + value;
  }, 0);
};

export const getCollectionCompletionPercentage = (
  ownedCards: GalleryCard[],
  totalAvailableCards: number
): number => {
  const uniqueCards = new Set(ownedCards.map(card => card.id)).size;
  return Math.round((uniqueCards / totalAvailableCards) * 100);
};

export const getElementDistribution = (cards: GalleryCard[]): Record<ElementType, number> => {
  const distribution = {} as Record<ElementType, number>;
  Object.values(ElementType).forEach(element => {
    distribution[element] = 0;
  });
  
  cards.forEach(card => {
    distribution[card.element]++;
  });
  
  return distribution;
};

export const getRarityDistribution = (cards: GalleryCard[]): Record<RarityTier, number> => {
  const distribution = {} as Record<RarityTier, number>;
  Object.values(RarityTier).forEach(rarity => {
    distribution[rarity] = 0;
  });
  
  cards.forEach(card => {
    distribution[card.rarity]++;
  });
  
  return distribution;
};