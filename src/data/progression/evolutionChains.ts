import { 
  EvolutionChain, 
  EvolutionStage, 
  ProgressionType, 
  EvolutionPath,
  FusionRecipe,
  AwakeningRitual
} from '../../types/progression/evolution';
import { ElementType, RarityTier } from '../../types/battle/core';

// Simplified Evolution Chains for Elements of Legends
export const sampleEvolutionChains: Record<string, EvolutionChain> = {
  'flame_warrior': {
    chainId: 'flame_warrior_chain',
    name: 'Flame Warrior Evolution',
    description: 'The evolutionary path of the legendary Flame Warrior',
    baseCard: 'flame_warrior',
    
    stages: {
      [EvolutionStage.BASE]: {
        cardId: 'flame_warrior',
        name: 'Flame Warrior',
        description: 'A young warrior wielding the power of fire',
        unlockLevel: 1,
        paths: [
          {
            fromStage: EvolutionStage.BASE,
            toStage: EvolutionStage.EVOLVED,
            requirements: [
              {
                type: ProgressionType.BATTLE_EXPERIENCE,
                value: 1000,
                description: 'Gain 1000 battle experience'
              },
              {
                type: ProgressionType.VICTORY_COUNT,
                value: 10,
                description: 'Win 10 battles'
              }
            ],
            unlocks: {
              newAbilities: ['fire_shield', 'flame_burst'],
              statBoosts: {
                attackPower: 3,
                health: 5,
                defense: 2,
                speed: 1
              },
              visualChanges: {
                newImageUrl: '/images/cards/flame_warrior_evolved.jpg',
                newAnimationUrl: '/animations/flame_warrior_evolved.json',
                newSoundEffects: {
                  summon: '/sounds/evolved_summon.mp3',
                  attack: '/sounds/evolved_attack.mp3'
                }
              },
              rarityUpgrade: RarityTier.UNCOMMON
            },
            evolutionCost: {
              diamonds: 100,
              materials: ['fire_crystal'],
              time: 3600000 // 1 hour
            }
          }
        ]
      },
      [EvolutionStage.EVOLVED]: {
        cardId: 'inferno_knight',
        name: 'Inferno Knight',
        description: 'A seasoned knight with mastery over flames',
        unlockLevel: 15,
        paths: [
          {
            fromStage: EvolutionStage.EVOLVED,
            toStage: EvolutionStage.MEGA,
            requirements: [
              {
                type: ProgressionType.BATTLE_EXPERIENCE,
                value: 5000,
                description: 'Gain 5000 total battle experience'
              },
              {
                type: ProgressionType.CARD_USAGE,
                value: 50,
                description: 'Use in 50 battles'
              },
              {
                type: ProgressionType.SPECIAL_CONDITION,
                value: 1,
                description: 'Complete Fire Trial',
                conditions: {
                  minLevel: 25,
                  winStreak: 5
                }
              }
            ],
            unlocks: {
              newAbilities: ['inferno_rage', 'phoenix_resurrection'],
              statBoosts: {
                attackPower: 5,
                health: 8,
                defense: 3,
                speed: 2
              },
              visualChanges: {
                newImageUrl: '/images/cards/flame_warrior_mega.jpg',
                newAnimationUrl: '/animations/flame_warrior_mega.json'
              },
              rarityUpgrade: RarityTier.RARE
            },
            evolutionCost: {
              diamonds: 250,
              materials: ['fire_crystal', 'phoenix_feather'],
              time: 7200000 // 2 hours
            }
          }
        ]
      },
      [EvolutionStage.MEGA]: {
        cardId: 'flame_lord',
        name: 'Flame Lord',
        description: 'A legendary being who commands all fire',
        unlockLevel: 40,
        paths: [
          {
            fromStage: EvolutionStage.MEGA,
            toStage: EvolutionStage.LEGENDARY,
            requirements: [
              {
                type: ProgressionType.BATTLE_EXPERIENCE,
                value: 15000,
                description: 'Gain 15000 total battle experience'
              },
              {
                type: ProgressionType.VICTORY_COUNT,
                value: 100,
                description: 'Win 100 battles'
              }
            ],
            unlocks: {
              newAbilities: ['meteor_storm', 'flame_dominion', 'rebirth'],
              statBoosts: {
                attackPower: 8,
                health: 12,
                defense: 5,
                speed: 3
              },
              visualChanges: {
                newImageUrl: '/images/cards/flame_warrior_legendary.jpg'
              },
              rarityUpgrade: RarityTier.LEGENDARY
            },
            evolutionCost: {
              diamonds: 500,
              materials: ['fire_crystal', 'phoenix_feather', 'dragon_essence'],
              time: 14400000 // 4 hours
            }
          }
        ]
      },
      [EvolutionStage.LEGENDARY]: {
        cardId: 'primordial_flame',
        name: 'Primordial Flame',
        description: 'The ultimate manifestation of fire itself',
        unlockLevel: 60,
        paths: [
          {
            fromStage: EvolutionStage.LEGENDARY,
            toStage: EvolutionStage.AWAKENED,
            requirements: [
              {
                type: ProgressionType.BATTLE_EXPERIENCE,
                value: 50000,
                description: 'Gain 50000 total battle experience'
              },
              {
                type: ProgressionType.VICTORY_COUNT,
                value: 250,
                description: 'Win 250 battles'
              },
              {
                type: ProgressionType.SPECIAL_CONDITION,
                value: 1,
                description: 'Complete Awakening Ritual',
                conditions: {
                  minLevel: 80,
                  winStreak: 10
                }
              }
            ],
            unlocks: {
              newAbilities: ['apocalypse_flame', 'world_burn', 'eternal_rebirth'],
              statBoosts: {
                attackPower: 15,
                health: 20,
                defense: 10,
                speed: 5
              },
              visualChanges: {
                newImageUrl: '/images/cards/flame_warrior_awakened.jpg'
              },
              rarityUpgrade: RarityTier.DIVINE
            },
            evolutionCost: {
              diamonds: 1000,
              materials: ['primordial_essence', 'god_flame', 'cosmic_fire'],
              time: 28800000 // 8 hours
            }
          }
        ]
      },
      [EvolutionStage.AWAKENED]: {
        cardId: 'primordial_flame_awakened',
        name: 'Primordial Flame Awakened',
        description: 'The absolute pinnacle of fire mastery',
        unlockLevel: 100,
        paths: [] // No further evolution
      }
    },
    
    branches: [
      {
        branchId: 'phoenix_branch',
        name: 'Phoenix Path',
        triggerCondition: 'Defeat Phoenix Boss',
        alternativeStages: {
          [EvolutionStage.BASE]: 'flame_warrior',
          [EvolutionStage.EVOLVED]: 'phoenix_knight',
          [EvolutionStage.MEGA]: 'phoenix_lord',
          [EvolutionStage.LEGENDARY]: 'eternal_phoenix',
          [EvolutionStage.AWAKENED]: 'cosmic_phoenix'
        }
      }
    ],
    
    lore: {
      backstory: 'Born from the eternal flames of the first volcano, the Flame Warrior seeks to master all forms of fire magic.',
      evolutionNarrative: {
        [EvolutionStage.BASE]: 'A young warrior discovers their affinity with fire',
        [EvolutionStage.EVOLVED]: 'The warrior trains under a master and gains control',
        [EvolutionStage.MEGA]: 'Achieving perfect harmony with flame energy',
        [EvolutionStage.LEGENDARY]: 'Becoming one with the primordial flames',
        [EvolutionStage.AWAKENED]: 'Transcending physical form to become pure fire essence'
      },
      legendaryForm: {
        name: 'Avatar of the Eternal Flame',
        story: 'The ultimate form achieved only by those who sacrifice everything for power',
        unlockCondition: 'Complete the Trial of Eternal Fire'
      }
    }
  },

  'water_spirit': {
    chainId: 'water_spirit_chain',
    name: 'Water Spirit Evolution',
    description: 'The serene path of water mastery',
    baseCard: 'water_spirit',
    
    stages: {
      [EvolutionStage.BASE]: {
        cardId: 'water_spirit',
        name: 'Water Spirit',
        description: 'A gentle spirit of flowing water',
        unlockLevel: 1,
        paths: [
          {
            fromStage: EvolutionStage.BASE,
            toStage: EvolutionStage.EVOLVED,
            requirements: [
              {
                type: ProgressionType.BATTLE_EXPERIENCE,
                value: 800,
                description: 'Gain 800 battle experience'
              },
              {
                type: ProgressionType.CARD_USAGE,
                value: 15,
                description: 'Use in 15 battles'
              }
            ],
            unlocks: {
              newAbilities: ['healing_wave', 'water_shield'],
              statBoosts: {
                attackPower: 2,
                health: 6,
                defense: 3,
                speed: 2
              },
              visualChanges: {
                newImageUrl: '/images/cards/water_spirit_evolved.jpg'
              },
              rarityUpgrade: RarityTier.UNCOMMON
            },
            evolutionCost: {
              diamonds: 80,
              materials: ['water_crystal'],
              time: 2700000 // 45 minutes
            }
          }
        ]
      },
      [EvolutionStage.EVOLVED]: {
        cardId: 'ocean_guardian',
        name: 'Ocean Guardian',
        description: 'A powerful guardian of the seas',
        unlockLevel: 12,
        paths: [
          {
            fromStage: EvolutionStage.EVOLVED,
            toStage: EvolutionStage.MEGA,
            requirements: [
              {
                type: ProgressionType.BATTLE_EXPERIENCE,
                value: 4000,
                description: 'Gain 4000 total battle experience'
              },
              {
                type: ProgressionType.VICTORY_COUNT,
                value: 30,
                description: 'Win 30 battles'
              }
            ],
            unlocks: {
              newAbilities: ['tsunami', 'oceanic_blessing'],
              statBoosts: {
                attackPower: 4,
                health: 10,
                defense: 5,
                speed: 3
              },
              visualChanges: {
                newImageUrl: '/images/cards/water_spirit_mega.jpg'
              },
              rarityUpgrade: RarityTier.RARE
            },
            evolutionCost: {
              diamonds: 200,
              materials: ['water_crystal', 'pearl_essence'],
              time: 5400000 // 1.5 hours
            }
          }
        ]
      },
      [EvolutionStage.MEGA]: {
        cardId: 'ocean_sovereign',
        name: 'Ocean Sovereign',
        description: 'Ruler of all water realms',
        unlockLevel: 35,
        paths: []
      },
      [EvolutionStage.LEGENDARY]: {
        cardId: 'tidal_deity',
        name: 'Tidal Deity',
        description: 'Divine embodiment of water',
        unlockLevel: 55,
        paths: []
      },
      [EvolutionStage.AWAKENED]: {
        cardId: 'primordial_ocean',
        name: 'Primordial Ocean',
        description: 'The source of all water',
        unlockLevel: 90,
        paths: []
      }
    },
    
    branches: [],
    
    lore: {
      backstory: 'Ancient spirits that emerged from the first rains that fell upon the world.',
      evolutionNarrative: {
        [EvolutionStage.BASE]: 'A spirit learns to control small bodies of water',
        [EvolutionStage.EVOLVED]: 'Growing stronger to protect the oceans',
        [EvolutionStage.MEGA]: 'Achieving dominion over all water',
        [EvolutionStage.LEGENDARY]: 'Becoming a deity of the seas',
        [EvolutionStage.AWAKENED]: 'Merging with the primordial waters'
      }
    }
  }
};

// Simplified Fusion Recipes
export const sampleFusionRecipes: FusionRecipe[] = [
  {
    id: 'flame_fusion_basic',
    name: 'Basic Flame Fusion',
    description: 'Combine fire cards to create a stronger flame warrior',
    primaryCard: {
      cardId: 'flame_warrior',
      minLevel: 10,
      consumed: false // Primary card is not consumed
    },
    materialCards: [
      { cardId: 'fire_sprite', quantity: 2, consumed: true },
      { cardId: 'ember_golem', quantity: 1, consumed: true }
    ],
    catalysts: [
      { itemId: 'fusion_catalyst', quantity: 1 }
    ],
    resultCard: {
      cardId: 'inferno_champion',
      guaranteedLevel: 15,
      inheritedStats: 75
    },
    fusionCost: {
      diamonds: 150,
      successRate: 0.7,
      time: 1800000 // 30 minutes
    },
    unlockConditions: {
      playerLevel: 10,
      fusionMasteryLevel: 1
    }
  },
  {
    id: 'elemental_harmony',
    name: 'Elemental Harmony Fusion',
    description: 'Fuse cards of different elements to create a balanced hybrid',
    primaryCard: {
      cardId: 'flame_warrior',
      minLevel: 20,
      consumed: false
    },
    materialCards: [
      { cardId: 'water_spirit', quantity: 1, consumed: true },
      { cardId: 'earth_guardian', quantity: 1, consumed: true }
    ],
    catalysts: [
      { itemId: 'harmony_stone', quantity: 1 },
      { itemId: 'fusion_catalyst', quantity: 2 }
    ],
    resultCard: {
      cardId: 'elemental_sage',
      guaranteedLevel: 25,
      inheritedStats: 85
    },
    fusionCost: {
      diamonds: 300,
      successRate: 0.5,
      time: 3600000 // 1 hour
    },
    unlockConditions: {
      playerLevel: 25,
      fusionMasteryLevel: 3
    }
  }
];

// Simplified Awakening Rituals
export const sampleAwakeningRituals: AwakeningRitual[] = [
  {
    cardId: 'flame_awakening',
    awakeningType: 'elemental',
    requirements: {
      baseLevel: 75,
      evolutionStage: EvolutionStage.LEGENDARY,
      elementalHarmony: [
        {
          element: ElementType.FIRE,
          cardsRequired: 10,
          minLevel: 30
        },
        {
          element: ElementType.LIGHT,
          cardsRequired: 3,
          minLevel: 25
        }
      ],
      sacredMaterials: [
        { materialId: 'god_flame', quantity: 1 },
        { materialId: 'phoenix_heart', quantity: 1 },
        { materialId: 'stellar_fire', quantity: 3 }
      ],
      ritualConditions: {
        moonPhase: 'full',
        timeWindow: {
          start: 0,
          end: 86400000 // 24 hours
        },
        location: 'Sacred Fire Temple'
      }
    },
    rewards: {
      newAbilities: ['reality_burn', 'dimension_flame', 'time_stop'],
      ultimateAttack: 'Apocalypse Inferno',
      statMultipliers: {
        attackPower: 1.5,
        health: 1.3,
        defense: 1.2,
        speed: 1.1
      },
      specialEffects: {
        aura: 'eternal_flame_aura',
        transformationSequence: 'divine_ascension',
        battleEntryEffect: 'reality_distortion'
      },
      title: 'Avatar of Eternal Flame'
    }
  },
  {
    cardId: 'water_awakening',
    awakeningType: 'divine',
    requirements: {
      baseLevel: 70,
      evolutionStage: EvolutionStage.LEGENDARY,
      elementalHarmony: [
        {
          element: ElementType.WATER,
          cardsRequired: 8,
          minLevel: 35
        },
        {
          element: ElementType.EARTH,
          cardsRequired: 2,
          minLevel: 30
        }
      ],
      sacredMaterials: [
        { materialId: 'ocean_heart', quantity: 1 },
        { materialId: 'leviathan_scale', quantity: 5 },
        { materialId: 'deep_crystal', quantity: 10 }
      ],
      ritualConditions: {
        moonPhase: 'new',
        location: 'Abyssal Depths'
      }
    },
    rewards: {
      newAbilities: ['absolute_healing', 'dimensional_tide', 'time_flow'],
      ultimateAttack: 'Primordial Tsunami',
      statMultipliers: {
        attackPower: 1.2,
        health: 1.8,
        defense: 1.6,
        speed: 1.0
      },
      specialEffects: {
        aura: 'oceanic_serenity',
        transformationSequence: 'tidal_ascension',
        battleEntryEffect: 'reality_ripple'
      },
      title: 'Guardian of the Infinite Deep'
    }
  }
];

// Player Material Examples
export const samplePlayerMaterials: Record<string, number> = {
  'fire_crystal': 15,
  'water_crystal': 12,
  'earth_crystal': 8,
  'air_crystal': 10,
  'light_crystal': 5,
  'shadow_crystal': 3,
  'phoenix_feather': 2,
  'dragon_essence': 1,
  'pearl_essence': 4,
  'fusion_catalyst': 8,
  'harmony_stone': 2,
  'divine_catalyst': 1,
  'luck_charm': 10,
  'god_flame': 0,
  'phoenix_heart': 0,
  'stellar_fire': 1,
  'ocean_heart': 0,
  'leviathan_scale': 2,
  'deep_crystal': 7,
  'primordial_essence': 0,
  'cosmic_fire': 0
};