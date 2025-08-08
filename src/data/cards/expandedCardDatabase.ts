import { BattleCard, ElementType, RarityTier, CardType, SpecialAbility, StatusEffectType } from '../../types/battle/core';
import { createBattleCard } from './cardFactory';

// Advanced Fire Cards
const advancedFireCards: BattleCard[] = [
  createBattleCard(
    'fire_004',
    'Phoenix Reborn',
    'Legendary phoenix that rises from its own ashes.',
    ElementType.FIRE,
    RarityTier.MYTHIC,
    CardType.CREATURE,
    7, 8, 6, 2,
    [{
      id: 'phoenix_rebirth',
      name: 'Phoenix Rebirth',
      description: 'When destroyed, return to hand and gain +2/+2',
      manaCost: 0,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} rises from the ashes stronger than before!`,
        statusEffects: [{
          type: StatusEffectType.BLESSING,
          duration: -1, // Permanent
          power: 2,
          source: caster.id
        }]
      })
    }],
    ['flying', 'rebirth', 'phoenix']
  ),

  createBattleCard(
    'fire_005',
    'Molten Golem',
    'Creature of living lava that burns everything it touches.',
    ElementType.FIRE,
    RarityTier.EPIC,
    CardType.CREATURE,
    5, 6, 7, 1,
    [{
      id: 'molten_touch',
      name: 'Molten Touch',
      description: 'Deal 2 burn damage to all enemy cards',
      manaCost: 2,
      cooldown: 2,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        damage: 2,
        message: `${caster.name} radiates intense heat, burning all enemies!`,
        statusEffects: [{
          type: StatusEffectType.BURN,
          duration: 2,
          power: 1,
          source: caster.id
        }]
      })
    }],
    ['elemental', 'burn']
  ),

  createBattleCard(
    'fire_006',
    'Flame Burst',
    'Devastating fire spell that grows stronger with each target.',
    ElementType.FIRE,
    RarityTier.RARE,
    CardType.SPELL,
    4, 0, 0, 0,
    [{
      id: 'escalating_flames',
      name: 'Escalating Flames',
      description: 'Deal 3 damage, +1 for each enemy on field',
      manaCost: 0,
      cooldown: 0,
      targetRequired: true,
      execute: (caster, target, gameState) => {
        const enemyCount = gameState?.opponent.field.length || 0;
        const damage = 3 + enemyCount;
        return {
          success: true,
          damage,
          message: `Escalating flames deal ${damage} damage!`
        };
      }
    }],
    ['spell', 'escalating']
  )
];

// Advanced Water Cards
const advancedWaterCards: BattleCard[] = [
  createBattleCard(
    'water_003',
    'Leviathan',
    'Ancient sea monster with power over tides.',
    ElementType.WATER,
    RarityTier.DIVINE,
    CardType.CREATURE,
    9, 12, 10, 4,
    [{
      id: 'tidal_dominance',
      name: 'Tidal Dominance',
      description: 'Control the battlefield - freeze all enemies for 2 turns',
      manaCost: 5,
      cooldown: 4,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} commands the tides! All enemies are frozen!`,
        statusEffects: [{
          type: StatusEffectType.FREEZE,
          duration: 2,
          power: 0,
          source: caster.id
        }]
      })
    }],
    ['legendary', 'sea_monster', 'control']
  ),

  createBattleCard(
    'water_004',
    'Coral Guardian',
    'Protector of underwater realms with healing abilities.',
    ElementType.WATER,
    RarityTier.UNCOMMON,
    CardType.CREATURE,
    3, 2, 6, 3,
    [{
      id: 'reef_sanctuary',
      name: 'Reef Sanctuary',
      description: 'Heal all friendly units for 3 health',
      manaCost: 2,
      cooldown: 1,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        healing: 3,
        message: `${caster.name} creates a healing sanctuary!`
      })
    }],
    ['guardian', 'healing']
  ),

  createBattleCard(
    'water_005',
    'Mist Veil',
    'Enchantment that conceals and protects allies.',
    ElementType.WATER,
    RarityTier.RARE,
    CardType.ENCHANTMENT,
    3, 0, 0, 0,
    [{
      id: 'concealment',
      name: 'Concealment',
      description: 'All friendly units gain stealth for 3 turns',
      manaCost: 0,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `Mist conceals your forces!`,
        statusEffects: [{
          type: StatusEffectType.SHIELD,
          duration: 3,
          power: 2,
          source: caster.id
        }]
      })
    }],
    ['enchantment', 'stealth']
  )
];

// Advanced Earth Cards  
const advancedEarthCards: BattleCard[] = [
  createBattleCard(
    'earth_003',
    'Ancient Treant',
    'Millenia-old tree spirit with deep roots in magic.',
    ElementType.EARTH,
    RarityTier.LEGENDARY,
    CardType.CREATURE,
    6, 5, 12, 5,
    [{
      id: 'root_network',
      name: 'Root Network',
      description: 'Draw 2 cards and gain +1 defense for each card in hand',
      manaCost: 3,
      cooldown: 3,
      targetRequired: false,
      execute: (caster, target, gameState) => {
        const handSize = gameState?.player.hand.length || 0;
        return {
          success: true,
          message: `${caster.name} taps into ancient wisdom! Defense increased by ${handSize}!`
        };
      }
    }],
    ['treant', 'ancient', 'wisdom']
  ),

  createBattleCard(
    'earth_004',
    'Boulder Siege',
    'Massive boulder that crushes defenses.',
    ElementType.EARTH,
    RarityTier.RARE,
    CardType.SPELL,
    5, 0, 0, 0,
    [{
      id: 'defense_breaker',
      name: 'Defense Breaker',
      description: 'Deal 6 damage, ignoring all defense',
      manaCost: 0,
      cooldown: 0,
      targetRequired: true,
      execute: (caster) => ({
        success: true,
        damage: 6,
        message: `Massive boulder crushes through all defenses!`
      })
    }],
    ['spell', 'siege']
  ),

  createBattleCard(
    'earth_005',
    'Crystal Formation',
    'Living crystals that amplify magical energy.',
    ElementType.EARTH,
    RarityTier.EPIC,
    CardType.ARTIFACT,
    4, 0, 8, 0,
    [{
      id: 'mana_amplification',
      name: 'Mana Amplification',
      description: 'All spells cost 1 less mana (minimum 1)',
      manaCost: 0,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} amplifies magical energies!`
      })
    }],
    ['artifact', 'mana', 'amplification']
  )
];

// Advanced Air Cards
const advancedAirCards: BattleCard[] = [
  createBattleCard(
    'air_003',
    'Thunder Phoenix',
    'Majestic bird wreathed in lightning.',
    ElementType.AIR,
    RarityTier.MYTHIC,
    CardType.CREATURE,
    7, 9, 6, 1,
    [{
      id: 'chain_lightning',
      name: 'Chain Lightning',
      description: 'Deal 4 damage to target, then 2 to all other enemies',
      manaCost: 4,
      cooldown: 2,
      targetRequired: true,
      execute: (caster, target) => ({
        success: true,
        damage: 4,
        message: `${caster.name} unleashes chain lightning! 4 damage to target, 2 to all others!`
      })
    }],
    ['phoenix', 'flying', 'lightning']
  ),

  createBattleCard(
    'air_004',
    'Wind Sage',
    'Wise master of air magic and foresight.',
    ElementType.AIR,
    RarityTier.RARE,
    CardType.CREATURE,
    4, 3, 5, 1,
    [{
      id: 'foresight',
      name: 'Foresight',
      description: 'Look at top 3 cards of deck, put one in hand',
      manaCost: 1,
      cooldown: 2,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} peers into the future!`
      })
    }],
    ['sage', 'wisdom', 'foresight']
  ),

  createBattleCard(
    'air_005',
    'Storm Caller',
    'Shaman who commands the fury of tempests.',
    ElementType.AIR,
    RarityTier.EPIC,
    CardType.CREATURE,
    5, 4, 6, 2,
    [{
      id: 'tempest_fury',
      name: 'Tempest Fury',
      description: 'Deal 2 damage to all enemies, +1 for each Air card played',
      manaCost: 3,
      cooldown: 3,
      targetRequired: false,
      execute: (caster, target, gameState) => {
        // This would need to track Air cards played
        const baseDamage = 2;
        return {
          success: true,
          damage: baseDamage,
          message: `${caster.name} calls down the storm's wrath!`
        };
      }
    }],
    ['shaman', 'storm', 'tempest']
  )
];

// Advanced Light Cards
const advancedLightCards: BattleCard[] = [
  createBattleCard(
    'light_003',
    'Celestial Avatar',
    'Divine being of pure light and justice.',
    ElementType.LIGHT,
    RarityTier.DIVINE,
    CardType.CREATURE,
    10, 10, 10, 5,
    [{
      id: 'divine_intervention',
      name: 'Divine Intervention',
      description: 'Prevent all damage to friendly units this turn',
      manaCost: 4,
      cooldown: 5,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} grants divine protection!`,
        statusEffects: [{
          type: StatusEffectType.SHIELD,
          duration: 1,
          power: 999, // Blocks all damage
          source: caster.id
        }]
      })
    }],
    ['divine', 'avatar', 'protection']
  ),

  createBattleCard(
    'light_004',
    'Purification',
    'Sacred spell that cleanses corruption.',
    ElementType.LIGHT,
    RarityTier.UNCOMMON,
    CardType.SPELL,
    2, 0, 0, 0,
    [{
      id: 'cleanse',
      name: 'Cleanse',
      description: 'Remove all negative effects from friendly units',
      manaCost: 0,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `Divine light purifies all corruption!`
      })
    }],
    ['spell', 'cleanse', 'purification']
  ),

  createBattleCard(
    'light_005',
    'Radiant Beacon',
    'Tower of light that guides and empowers allies.',
    ElementType.LIGHT,
    RarityTier.RARE,
    CardType.ARTIFACT,
    3, 0, 5, 0,
    [{
      id: 'radiant_aura',
      name: 'Radiant Aura',
      description: 'All friendly units gain +1/+1 each turn',
      manaCost: 1,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} emanates inspiring light!`
      })
    }],
    ['artifact', 'beacon', 'inspiration']
  )
];

// Advanced Shadow Cards
const advancedShadowCards: BattleCard[] = [
  createBattleCard(
    'shadow_003',
    'Nightmare Lord',
    'Ruler of the realm of nightmares and fear.',
    ElementType.SHADOW,
    RarityTier.MYTHIC,
    CardType.CREATURE,
    8, 8, 8, 3,
    [{
      id: 'terror_aura',
      name: 'Terror Aura',
      description: 'Enemy units lose -2/-2 permanently',
      manaCost: 4,
      cooldown: 4,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} spreads overwhelming terror!`,
        statusEffects: [{
          type: StatusEffectType.CURSE,
          duration: -1, // Permanent
          power: 2,
          source: caster.id
        }]
      })
    }],
    ['nightmare', 'lord', 'terror']
  ),

  createBattleCard(
    'shadow_004',
    'Soul Reaper',
    'Harvester of souls that grows stronger with each kill.',
    ElementType.SHADOW,
    RarityTier.EPIC,
    CardType.CREATURE,
    5, 4, 5, 1,
    [{
      id: 'soul_harvest',
      name: 'Soul Harvest',
      description: 'Gain +1/+1 permanently when any unit dies',
      manaCost: 0,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} harvests another soul!`
      })
    }],
    ['reaper', 'soul', 'growth']
  ),

  createBattleCard(
    'shadow_005',
    'Dark Ritual',
    'Forbidden magic that sacrifices for power.',
    ElementType.SHADOW,
    RarityTier.RARE,
    CardType.SPELL,
    3, 0, 0, 0,
    [{
      id: 'sacrifice_power',
      name: 'Sacrifice Power',
      description: 'Destroy a friendly unit to deal its power as damage',
      manaCost: 0,
      cooldown: 0,
      targetRequired: true,
      execute: (caster, target) => {
        const targetCard = target as BattleCard;
        return {
          success: true,
          damage: targetCard.attackPower,
          message: `Dark ritual converts life into ${targetCard.attackPower} damage!`
        };
      }
    }],
    ['spell', 'ritual', 'sacrifice']
  )
];

// Advanced Neutral Cards
const advancedNeutralCards: BattleCard[] = [
  createBattleCard(
    'neutral_003',
    'Planar Walker',
    'Interdimensional traveler with mastery over all elements.',
    ElementType.NEUTRAL,
    RarityTier.MYTHIC,
    CardType.CREATURE,
    6, 6, 6, 2,
    [{
      id: 'elemental_mastery',
      name: 'Elemental Mastery',
      description: 'Copy the last ability used by any card',
      manaCost: 3,
      cooldown: 2,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} masters the elements!`
      })
    }],
    ['planar', 'walker', 'mastery']
  ),

  createBattleCard(
    'neutral_004',
    'Mana Crystal',
    'Pure crystallized magical energy.',
    ElementType.NEUTRAL,
    RarityTier.COMMON,
    CardType.ARTIFACT,
    1, 0, 1, 0,
    [{
      id: 'mana_boost',
      name: 'Mana Boost',
      description: 'Gain +1 mana this turn',
      manaCost: 0,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} provides extra mana!`
      })
    }],
    ['artifact', 'mana']
  ),

  createBattleCard(
    'neutral_005',
    'Time Weaver',
    'Master of temporal magic and destiny.',
    ElementType.NEUTRAL,
    RarityTier.LEGENDARY,
    CardType.CREATURE,
    7, 5, 7, 3,
    [{
      id: 'temporal_shift',
      name: 'Temporal Shift',
      description: 'Take an extra turn after this one',
      manaCost: 6,
      cooldown: 0, // Can only be used once
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} bends time itself!`
      })
    }],
    ['time', 'weaver', 'temporal']
  )
];

// Combo Cards - Cards designed to work together
const comboCards: BattleCard[] = [
  createBattleCard(
    'combo_001',
    'Elemental Conduit',
    'Artifact that amplifies elemental combinations.',
    ElementType.NEUTRAL,
    RarityTier.EPIC,
    CardType.ARTIFACT,
    4, 0, 4, 0,
    [{
      id: 'elemental_synergy',
      name: 'Elemental Synergy',
      description: 'When you play cards of different elements, draw a card',
      manaCost: 0,
      cooldown: 0,
      targetRequired: false,
      execute: (caster) => ({
        success: true,
        message: `${caster.name} creates elemental harmony!`
      })
    }],
    ['conduit', 'synergy', 'combo']
  ),

  createBattleCard(
    'combo_002',
    'Primal Fusion',
    'Spell that combines the power of all elements.',
    ElementType.NEUTRAL,
    RarityTier.DIVINE,
    CardType.SPELL,
    8, 0, 0, 0,
    [{
      id: 'ultimate_fusion',
      name: 'Ultimate Fusion',
      description: 'Deal damage equal to the number of different elements you control × 3',
      manaCost: 0,
      cooldown: 0,
      targetRequired: true,
      execute: (caster, target, gameState) => {
        // Calculate unique elements
        const elements = new Set();
        gameState?.player.field.forEach(card => elements.add(card.element));
        const damage = elements.size * 3;
        return {
          success: true,
          damage,
          message: `Primal fusion deals ${damage} damage from ${elements.size} elements!`
        };
      }
    }],
    ['fusion', 'primal', 'ultimate']
  )
];

// Export expanded card database
export function createExpandedCardDatabase(): BattleCard[] {
  return [
    ...advancedFireCards,
    ...advancedWaterCards,
    ...advancedEarthCards,
    ...advancedAirCards,
    ...advancedLightCards,
    ...advancedShadowCards,
    ...advancedNeutralCards,
    ...comboCards
  ];
}

// Element-specific card collections
export function getAdvancedCardsByElement(element: ElementType): BattleCard[] {
  const allCards = createExpandedCardDatabase();
  return allCards.filter(card => card.element === element);
}

// Rarity-based collections
export function getCardsByRarity(rarity: RarityTier): BattleCard[] {
  const allCards = createExpandedCardDatabase();
  return allCards.filter(card => card.rarity === rarity);
}

// Competitive deck building
export function createCompetitiveDeck(element: ElementType, secondaryElement?: ElementType): BattleCard[] {
  const allCards = createExpandedCardDatabase();
  const primaryCards = allCards.filter(card => card.element === element);
  const secondaryCards = secondaryElement 
    ? allCards.filter(card => card.element === secondaryElement)
    : [];
  const neutralCards = allCards.filter(card => card.element === ElementType.NEUTRAL);

  // Build a balanced 30-card deck
  const deck: BattleCard[] = [];
  
  // Add 18 primary element cards
  deck.push(...primaryCards.slice(0, 18));
  
  // Add 6 secondary element cards (or more primary if no secondary)
  if (secondaryElement) {
    deck.push(...secondaryCards.slice(0, 6));
  } else {
    deck.push(...primaryCards.slice(18, 24));
  }
  
  // Add 6 neutral cards for utility
  deck.push(...neutralCards.slice(0, 6));

  return deck.slice(0, 30); // Ensure exactly 30 cards
}

// Draft format - random card pool
export function createDraftPool(poolSize: number = 45): BattleCard[] {
  const allCards = createExpandedCardDatabase();
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, poolSize);
}

// Meta-game analysis
export interface CardMetaData {
  card: BattleCard;
  playRate: number;
  winRate: number;
  averageTurnPlayed: number;
  synergies: string[];
  counters: string[];
}

export function analyzeCardMeta(cards: BattleCard[]): CardMetaData[] {
  // This would analyze actual game data in a real implementation
  return cards.map(card => ({
    card,
    playRate: Math.random() * 100,
    winRate: Math.random() * 100,
    averageTurnPlayed: Math.random() * 10 + 1,
    synergies: card.keywords.slice(0, 2),
    counters: ['light_spell', 'silence', 'dispel'].slice(0, Math.floor(Math.random() * 3))
  }));
}

// Deck validation for competitive play
export function validateCompetitiveDeck(deck: BattleCard[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check deck size
  if (deck.length < 30) {
    errors.push(`Deck must contain at least 30 cards (currently ${deck.length})`);
  }
  if (deck.length > 40) {
    errors.push(`Deck cannot contain more than 40 cards (currently ${deck.length})`);
  }

  // Check card limits
  const cardCounts = new Map<string, number>();
  deck.forEach(card => {
    const count = cardCounts.get(card.id) || 0;
    cardCounts.set(card.id, count + 1);
  });

  for (const [cardId, count] of cardCounts) {
    if (count > 3) {
      errors.push(`Too many copies of ${cardId} (${count}/3 max)`);
    }
  }

  // Check mana curve
  const manaCurve = new Array(11).fill(0); // 0-10 mana
  deck.forEach(card => {
    if (card.manaCost <= 10) {
      manaCurve[card.manaCost]++;
    }
  });

  if (manaCurve[0] + manaCurve[1] + manaCurve[2] < deck.length * 0.3) {
    warnings.push('Low number of early game cards may cause slow starts');
  }

  if (manaCurve[7] + manaCurve[8] + manaCurve[9] + manaCurve[10] > deck.length * 0.2) {
    warnings.push('High number of expensive cards may cause consistency issues');
  }

  // Check element distribution
  const elementCounts = new Map<ElementType, number>();
  deck.forEach(card => {
    const count = elementCounts.get(card.element) || 0;
    elementCounts.set(card.element, count + 1);
  });

  if (elementCounts.size > 3) {
    warnings.push('Deck contains many elements - consider focusing on 2-3 for consistency');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}