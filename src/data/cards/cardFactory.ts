import { BattleCard, ElementType, RarityTier, CardType, SpecialAbility, StatusEffect } from '../../types/battle/core';

// Sample Abilities
const createFireBurst = (): SpecialAbility => ({
  id: 'fire_burst',
  name: 'Fire Burst',
  description: 'Deal 3 damage to target enemy',
  manaCost: 2,
  cooldown: 0,
  targetRequired: true,
  execute: (caster, target) => {
    if (target) {
      return {
        success: true,
        damage: 3,
        message: `${caster.name} unleashes Fire Burst for 3 damage!`
      };
    }
    return { success: false, message: 'No valid target' };
  }
});

const createHealing = (): SpecialAbility => ({
  id: 'healing_light',
  name: 'Healing Light',
  description: 'Restore 4 health to self',
  manaCost: 1,
  cooldown: 0,
  targetRequired: false,
  execute: (caster) => ({
    success: true,
    healing: 4,
    message: `${caster.name} heals for 4 health!`
  })
});

const createShield = (): SpecialAbility => ({
  id: 'protective_shield',
  name: 'Protective Shield',
  description: 'Gain +2 defense for 3 turns',
  manaCost: 2,
  cooldown: 0,
  targetRequired: false,
  execute: (caster) => ({
    success: true,
    statusEffects: [{
      type: 'shield' as any,
      duration: 3,
      power: 2,
      source: caster.id
    }],
    message: `${caster.name} gains a protective shield!`
  })
});

const createFreeze = (): SpecialAbility => ({
  id: 'ice_freeze',
  name: 'Ice Freeze',
  description: 'Freeze target for 2 turns',
  manaCost: 3,
  cooldown: 0,
  targetRequired: true,
  execute: (caster, target) => {
    if (target) {
      return {
        success: true,
        statusEffects: [{
          type: 'freeze' as any,
          duration: 2,
          power: 0,
          source: caster.id
        }],
        message: `${target.name} is frozen solid!`
      };
    }
    return { success: false, message: 'No valid target' };
  }
});

// Card Factory Functions
export function createBattleCard(
  id: string,
  name: string,
  description: string,
  element: ElementType,
  rarity: RarityTier,
  cardType: CardType,
  manaCost: number,
  attackPower: number,
  health: number,
  defense: number = 0,
  abilities: SpecialAbility[] = [],
  keywords: string[] = []
): BattleCard {
  return {
    // Core Identity
    id,
    name,
    description,
    
    // Visual & Audio
    imageUrl: `/cards/${element}/${id}.jpg`,
    animationUrl: `/cards/animations/${id}.webm`,
    soundEffects: {
      summon: `/sounds/summon_${element}.mp3`,
      attack: `/sounds/attack_${cardType}.mp3`,
      death: `/sounds/death_generic.mp3`
    },
    
    // Game Mechanics
    element,
    rarity,
    cardType,
    manaCost,
    
    // Combat Stats
    attackPower,
    health,
    maxHealth: health,
    defense,
    speed: 5, // Default speed
    
    // Special Properties
    abilities,
    statusEffects: [],
    keywords,
    
    // Targeting & Positioning
    targetRequired: false,
    
    // Evolution & Progression
    level: 1,
    experience: 0,
    evolutionStage: 0,
    
    // Collection & Economy
    collectionNumber: parseInt(id.replace(/\D/g, '')) || 1,
    isAnimated: rarity === RarityTier.LEGENDARY || rarity === RarityTier.MYTHIC || rarity === RarityTier.DIVINE,
    isHolographic: rarity === RarityTier.MYTHIC || rarity === RarityTier.DIVINE,
    
    // Game State
    canAttack: false,
    canUseAbilities: true,
    turnsSincePlay: 0
  };
}

// Sample Card Database
export function createSampleCards(): BattleCard[] {
  return [
    // Fire Element Cards
    createBattleCard(
      'fire_001',
      'Flame Sprite',
      'A mischievous spirit born from eternal flames.',
      ElementType.FIRE,
      RarityTier.COMMON,
      CardType.CREATURE,
      2, // mana
      3, // attack
      2, // health
      0, // defense
      [createFireBurst()]
    ),
    
    createBattleCard(
      'fire_002',
      'Inferno Dragon',
      'Ancient dragon whose breath can melt mountains.',
      ElementType.FIRE,
      RarityTier.LEGENDARY,
      CardType.CREATURE,
      8, // mana
      9, // attack
      8, // health
      2, // defense
      [createFireBurst()],
      ['flying', 'dragon']
    ),
    
    createBattleCard(
      'fire_003',
      'Meteor Strike',
      'Summon a devastating meteor from the heavens.',
      ElementType.FIRE,
      RarityTier.RARE,
      CardType.SPELL,
      5, // mana
      0, // attack
      0, // health
      0, // defense
      [{
        id: 'meteor_strike',
        name: 'Meteor Impact',
        description: 'Deal 6 damage to all enemies',
        manaCost: 0,
        cooldown: 0,
        targetRequired: false,
        execute: () => ({
          success: true,
          damage: 6,
          message: 'A massive meteor crashes down!'
        })
      }]
    ),

    // Water Element Cards
    createBattleCard(
      'water_001',
      'Tide Caller',
      'Mystic who commands the power of ocean waves.',
      ElementType.WATER,
      RarityTier.UNCOMMON,
      CardType.CREATURE,
      3, // mana
      2, // attack
      5, // health
      1, // defense
      [createHealing()]
    ),
    
    createBattleCard(
      'water_002',
      'Kraken Lord',
      'Legendary sea beast from the deepest trenches.',
      ElementType.WATER,
      RarityTier.MYTHIC,
      CardType.CREATURE,
      9, // mana
      8, // attack
      10, // health
      3, // defense
      [createFreeze()],
      ['tentacles', 'sea_beast']
    ),

    // Earth Element Cards
    createBattleCard(
      'earth_001',
      'Stone Guardian',
      'Animated rock formation protecting ancient secrets.',
      ElementType.EARTH,
      RarityTier.COMMON,
      CardType.CREATURE,
      4, // mana
      4, // attack
      6, // health
      3, // defense
      [createShield()],
      ['defender']
    ),
    
    createBattleCard(
      'earth_002',
      'Mountain Giant',
      'Colossal being formed from living stone.',
      ElementType.EARTH,
      RarityTier.EPIC,
      CardType.CREATURE,
      7, // mana
      7, // attack
      9, // health
      4, // defense
      [],
      ['giant', 'mountainous']
    ),

    // Air Element Cards
    createBattleCard(
      'air_001',
      'Wind Dancer',
      'Graceful elemental that moves like the breeze.',
      ElementType.AIR,
      RarityTier.COMMON,
      CardType.CREATURE,
      2, // mana
      4, // attack
      1, // health
      0, // defense
      [],
      ['flying', 'swift']
    ),
    
    createBattleCard(
      'air_002',
      'Storm Lord',
      'Master of thunder and lightning.',
      ElementType.AIR,
      RarityTier.LEGENDARY,
      CardType.CREATURE,
      6, // mana
      6, // attack
      5, // health
      1, // defense
      [{
        id: 'lightning_bolt',
        name: 'Lightning Bolt',
        description: 'Deal 4 damage to target',
        manaCost: 1,
        cooldown: 0,
        targetRequired: true,
        execute: (caster, target) => ({
          success: true,
          damage: 4,
          message: `Lightning strikes ${target?.name}!`
        })
      }],
      ['flying', 'storm']
    ),

    // Light Element Cards
    createBattleCard(
      'light_001',
      'Angel Guardian',
      'Divine protector radiating pure light.',
      ElementType.LIGHT,
      RarityTier.RARE,
      CardType.CREATURE,
      5, // mana
      4, // attack
      6, // health
      2, // defense
      [createHealing()],
      ['flying', 'divine']
    ),
    
    createBattleCard(
      'light_002',
      'Solar Phoenix',
      'Majestic bird reborn from celestial flames.',
      ElementType.LIGHT,
      RarityTier.DIVINE,
      CardType.CREATURE,
      10, // mana
      10, // attack
      8, // health
      3, // defense
      [{
        id: 'rebirth',
        name: 'Phoenix Rebirth',
        description: 'Return to life when destroyed',
        manaCost: 0,
        cooldown: 0,
        targetRequired: false,
        execute: (caster) => ({
          success: true,
          healing: caster.maxHealth,
          message: `${caster.name} rises from the ashes!`
        })
      }],
      ['flying', 'phoenix', 'rebirth']
    ),

    // Shadow Element Cards
    createBattleCard(
      'shadow_001',
      'Shadow Assassin',
      'Silent killer who strikes from darkness.',
      ElementType.SHADOW,
      RarityTier.UNCOMMON,
      CardType.CREATURE,
      3, // mana
      5, // attack
      2, // health
      0, // defense
      [],
      ['stealth', 'assassin']
    ),
    
    createBattleCard(
      'shadow_002',
      'Void Walker',
      'Ancient entity from the space between worlds.',
      ElementType.SHADOW,
      RarityTier.EPIC,
      CardType.CREATURE,
      6, // mana
      6, // attack
      6, // health
      1, // defense
      [{
        id: 'void_drain',
        name: 'Void Drain',
        description: 'Steal 3 health from target',
        manaCost: 2,
        cooldown: 0,
        targetRequired: true,
        execute: (caster, target) => ({
          success: true,
          damage: 3,
          healing: 3,
          message: `${caster.name} drains life from ${target?.name}!`
        })
      }],
      ['void', 'drain']
    ),

    // Neutral Element Cards
    createBattleCard(
      'neutral_001',
      'Crystal Golem',
      'Construct powered by pure magical energy.',
      ElementType.NEUTRAL,
      RarityTier.COMMON,
      CardType.ARTIFACT,
      3, // mana
      3, // attack
      4, // health
      2, // defense
      [],
      ['construct', 'magical']
    ),
    
    createBattleCard(
      'neutral_002',
      'Arcane Scholar',
      'Wise mage who has mastered multiple elements.',
      ElementType.NEUTRAL,
      RarityTier.RARE,
      CardType.CREATURE,
      4, // mana
      2, // attack
      4, // health
      1, // defense
      [{
        id: 'elemental_mastery',
        name: 'Elemental Mastery',
        description: 'Draw 2 cards',
        manaCost: 2,
        cooldown: 0,
        targetRequired: false,
        execute: (caster) => ({
          success: true,
          message: `${caster.name} channels elemental knowledge!`
        })
      }],
      ['scholar', 'spellcaster']
    )
  ];
}

// Deck Creation Functions
export function createSampleDecks(): { playerDeck: BattleCard[]; opponentDeck: BattleCard[] } {
  const allCards = createSampleCards();
  
  // Create balanced decks from available cards
  const playerDeck = [
    ...allCards.filter(card => 
      card.element === ElementType.FIRE || 
      card.element === ElementType.LIGHT ||
      card.element === ElementType.NEUTRAL
    ).slice(0, 20)
  ];
  
  const opponentDeck = [
    ...allCards.filter(card => 
      card.element === ElementType.WATER || 
      card.element === ElementType.SHADOW ||
      card.element === ElementType.EARTH
    ).slice(0, 20)
  ];
  
  // Shuffle decks
  shuffleArray(playerDeck);
  shuffleArray(opponentDeck);
  
  return { playerDeck, opponentDeck };
}

// Deck Building Utilities
export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function validateDeck(deck: BattleCard[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (deck.length < 20) {
    errors.push('Deck must contain at least 20 cards');
  }
  
  if (deck.length > 40) {
    errors.push('Deck cannot contain more than 40 cards');
  }
  
  // Check for card limits (max 3 copies of each card)
  const cardCounts = new Map<string, number>();
  deck.forEach(card => {
    const count = cardCounts.get(card.id) || 0;
    cardCounts.set(card.id, count + 1);
  });
  
  for (const [cardId, count] of cardCounts) {
    if (count > 3) {
      errors.push(`Too many copies of card ${cardId} (max 3 allowed)`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function getCardsByElement(element: ElementType): BattleCard[] {
  return createSampleCards().filter(card => card.element === element);
}

export function getCardsByRarity(rarity: RarityTier): BattleCard[] {
  return createSampleCards().filter(card => card.rarity === rarity);
}

export function getCardById(id: string): BattleCard | undefined {
  return createSampleCards().find(card => card.id === id);
}