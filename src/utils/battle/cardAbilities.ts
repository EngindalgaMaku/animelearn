import { BattleCard, GameState, Player, StatusEffect, StatusEffectType, ElementType } from '../../types/battle/core';

export interface EnhancedAbility {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldown: number;
  targetRequired: boolean;
  triggerCondition: 'on_play' | 'on_attack' | 'on_defense' | 'on_turn_start' | 'on_turn_end' | 'on_death' | 'manual';
  abilityType: 'damage' | 'healing' | 'buff' | 'debuff' | 'utility' | 'combo';
  execute: (caster: BattleCard, target?: BattleCard | Player, gameState?: GameState) => EnhancedAbilityResult;
}

export interface EnhancedAbilityResult {
  success: boolean;
  damage?: number;
  healing?: number;
  statusEffects?: StatusEffect[];
  message: string;
  visualEffect?: string;
  soundEffect?: string;
  comboTriggered?: boolean;
  chainAbilities?: string[];
}

// Powerful Fire Abilities
export const fireAbilities: EnhancedAbility[] = [
  {
    id: 'inferno_blast',
    name: 'Cehennem Patlaması',
    description: 'Tüm düşman kartlarına ateş hasarı verir ve yanma efekti uygular',
    manaCost: 4,
    cooldown: 3,
    targetRequired: false,
    triggerCondition: 'manual',
    abilityType: 'damage',
    execute: (caster, target, gameState) => {
      const damage = Math.floor(caster.attackPower * 1.5);
      const burnEffect: StatusEffect = {
        type: StatusEffectType.BURN,
        duration: 3,
        power: 2,
        source: caster.name
      };
      
      return {
        success: true,
        damage,
        statusEffects: [burnEffect],
        message: `🔥 ${caster.name} cehennem ateşi yağdırıyor! ${damage} hasar + 3 tur yanma!`,
        visualEffect: 'fire_explosion',
        soundEffect: 'inferno_blast.mp3'
      };
    }
  },
  {
    id: 'flame_shield',
    name: 'Alev Kalkanı',
    description: 'Kendini korur ve saldıranlara geri ateş hasarı verir',
    manaCost: 2,
    cooldown: 2,
    targetRequired: false,
    triggerCondition: 'on_defense',
    abilityType: 'buff',
    execute: (caster) => {
      const shieldEffect: StatusEffect = {
        type: StatusEffectType.SHIELD,
        duration: 2,
        power: 3,
        source: caster.name
      };
      
      return {
        success: true,
        statusEffects: [shieldEffect],
        message: `🛡️ ${caster.name} alev kalkanı oluşturuyor!`,
        visualEffect: 'flame_shield',
        soundEffect: 'shield_up.mp3'
      };
    }
  }
];

// Mystical Water Abilities
export const waterAbilities: EnhancedAbility[] = [
  {
    id: 'tidal_wave',
    name: 'Tsunami Dalgası',
    description: 'Büyük hasar verir ve dondurucu efekt uygular',
    manaCost: 5,
    cooldown: 4,
    targetRequired: true,
    triggerCondition: 'manual',
    abilityType: 'damage',
    execute: (caster, target) => {
      const damage = Math.floor(caster.attackPower * 2.0);
      const freezeEffect: StatusEffect = {
        type: StatusEffectType.FREEZE,
        duration: 2,
        power: 0,
        source: caster.name
      };
      
      return {
        success: true,
        damage,
        statusEffects: [freezeEffect],
        message: `🌊 ${caster.name} tsunami dalgası yaratıyor! ${damage} hasar + donduruyor!`,
        visualEffect: 'tidal_wave',
        soundEffect: 'tsunami.mp3'
      };
    }
  },
  {
    id: 'healing_spring',
    name: 'İyileştirici Kaynak',
    description: 'Kendini ve müttefik kartları iyileştirir',
    manaCost: 3,
    cooldown: 2,
    targetRequired: false,
    triggerCondition: 'on_turn_start',
    abilityType: 'healing',
    execute: (caster) => {
      const healing = Math.floor(caster.maxHealth * 0.3);
      
      return {
        success: true,
        healing,
        message: `💧 ${caster.name} iyileştirici su kaynağı yaratıyor! +${healing} can!`,
        visualEffect: 'healing_water',
        soundEffect: 'water_heal.mp3'
      };
    }
  }
];

// Solid Earth Abilities
export const earthAbilities: EnhancedAbility[] = [
  {
    id: 'earthquake',
    name: 'Deprem',
    description: 'Tüm kartlara hasar verir ve sarsıntı efekti yaratır',
    manaCost: 6,
    cooldown: 5,
    targetRequired: false,
    triggerCondition: 'manual',
    abilityType: 'damage',
    execute: (caster) => {
      const damage = Math.floor(caster.attackPower * 1.2);
      const stunEffect: StatusEffect = {
        type: StatusEffectType.STUN,
        duration: 1,
        power: 0,
        source: caster.name
      };
      
      return {
        success: true,
        damage,
        statusEffects: [stunEffect],
        message: `⛰️ ${caster.name} deprem yaratıyor! ${damage} alan hasarı + sarsıntı!`,
        visualEffect: 'earthquake',
        soundEffect: 'earthquake.mp3'
      };
    }
  },
  {
    id: 'stone_armor',
    name: 'Taş Zırh',
    description: 'Dayanıklılığı artırır ve hasar azaltır',
    manaCost: 2,
    cooldown: 3,
    targetRequired: false,
    triggerCondition: 'on_play',
    abilityType: 'buff',
    execute: (caster) => {
      caster.defense += 3;
      caster.maxHealth += 5;
      caster.health += 5;
      
      return {
        success: true,
        message: `🗿 ${caster.name} taş zırh kuşanıyor! +3 savunma, +5 can!`,
        visualEffect: 'stone_armor',
        soundEffect: 'armor_equip.mp3'
      };
    }
  }
];

// Swift Air Abilities
export const airAbilities: EnhancedAbility[] = [
  {
    id: 'lightning_strike',
    name: 'Şimşek Çarpması',
    description: 'Hızlı ve yüksek hasarlı saldırı',
    manaCost: 3,
    cooldown: 2,
    targetRequired: true,
    triggerCondition: 'manual',
    abilityType: 'damage',
    execute: (caster, target) => {
      const damage = Math.floor(caster.attackPower * 1.8);
      
      return {
        success: true,
        damage,
        message: `⚡ ${caster.name} şimşek çarpıyor! ${damage} elektrik hasarı!`,
        visualEffect: 'lightning_strike',
        soundEffect: 'lightning.mp3'
      };
    }
  },
  {
    id: 'wind_boost',
    name: 'Rüzgar Desteği',
    description: 'Hızı ve saldırı gücünü artırır',
    manaCost: 2,
    cooldown: 2,
    targetRequired: false,
    triggerCondition: 'on_turn_start',
    abilityType: 'buff',
    execute: (caster) => {
      caster.speed += 2;
      caster.attackPower += 2;
      
      return {
        success: true,
        message: `💨 ${caster.name} rüzgarla güçleniyor! +2 hız, +2 saldırı!`,
        visualEffect: 'wind_boost',
        soundEffect: 'wind_gust.mp3'
      };
    }
  }
];

// Divine Light Abilities
export const lightAbilities: EnhancedAbility[] = [
  {
    id: 'divine_judgment',
    name: 'İlahi Yargı',
    description: 'Gölge kartlarına çok büyük hasar verir',
    manaCost: 4,
    cooldown: 3,
    targetRequired: true,
    triggerCondition: 'manual',
    abilityType: 'damage',
    execute: (caster, target) => {
      let damage = Math.floor(caster.attackPower * 1.5);
      let message = `✨ ${caster.name} ilahi ışık yayıyor!`;
      
      if (target && 'element' in target && target.element === ElementType.SHADOW) {
        damage *= 2;
        message = `✨ ${caster.name} gölgeleri MAHVEDIYOR! SÜPER EFEKTİF!`;
      }
      
      return {
        success: true,
        damage,
        message: `${message} ${damage} kutsal hasar!`,
        visualEffect: 'divine_light',
        soundEffect: 'divine_judgment.mp3'
      };
    }
  },
  {
    id: 'blessing',
    name: 'Kutsama',
    description: 'Müttefik kartları güçlendirir ve korur',
    manaCost: 3,
    cooldown: 2,
    targetRequired: false,
    triggerCondition: 'on_play',
    abilityType: 'buff',
    execute: (caster) => {
      const blessingEffect: StatusEffect = {
        type: StatusEffectType.BLESSING,
        duration: 4,
        power: 2,
        source: caster.name
      };
      
      return {
        success: true,
        statusEffects: [blessingEffect],
        message: `🙏 ${caster.name} kutsama yayıyor! 4 tur koruma ve güç!`,
        visualEffect: 'blessing_aura',
        soundEffect: 'blessing.mp3'
      };
    }
  }
];

// Dark Shadow Abilities
export const shadowAbilities: EnhancedAbility[] = [
  {
    id: 'shadow_drain',
    name: 'Gölge Emici',
    description: 'Düşmandan can çalar ve kendini iyileştirir',
    manaCost: 3,
    cooldown: 2,
    targetRequired: true,
    triggerCondition: 'manual',
    abilityType: 'damage',
    execute: (caster, target) => {
      const damage = Math.floor(caster.attackPower * 1.3);
      const healing = Math.floor(damage * 0.5);
      
      return {
        success: true,
        damage,
        healing,
        message: `🌑 ${caster.name} yaşam enerjisi emiyor! ${damage} hasar verir, ${healing} can kazanır!`,
        visualEffect: 'life_drain',
        soundEffect: 'shadow_drain.mp3'
      };
    }
  },
  {
    id: 'curse',
    name: 'Lanet',
    description: 'Düşmanı zayıflatır ve sürekli hasar verir',
    manaCost: 2,
    cooldown: 3,
    targetRequired: true,
    triggerCondition: 'manual',
    abilityType: 'debuff',
    execute: (caster, target) => {
      const curseEffect: StatusEffect = {
        type: StatusEffectType.CURSE,
        duration: 5,
        power: 1,
        source: caster.name
      };
      
      return {
        success: true,
        statusEffects: [curseEffect],
        message: `💀 ${caster.name} lanet gönderiyor! 5 tur boyunca zayıflama!`,
        visualEffect: 'dark_curse',
        soundEffect: 'curse.mp3'
      };
    }
  }
];

// Combo System
export function checkAbilityCombo(card1: BattleCard, card2: BattleCard): EnhancedAbilityResult | null {
  // Fire + Air = Explosive Combo
  if ((card1.element === ElementType.FIRE && card2.element === ElementType.AIR) ||
      (card1.element === ElementType.AIR && card2.element === ElementType.FIRE)) {
    return {
      success: true,
      damage: 8,
      message: `🔥💨 COMBO! Ateş ve hava birleşerek patlama yaratıyor! +8 bonus hasar!`,
      visualEffect: 'fire_air_combo',
      soundEffect: 'combo_explosion.mp3',
      comboTriggered: true
    };
  }
  
  // Water + Earth = Healing Combo
  if ((card1.element === ElementType.WATER && card2.element === ElementType.EARTH) ||
      (card1.element === ElementType.EARTH && card2.element === ElementType.WATER)) {
    return {
      success: true,
      healing: 6,
      message: `💧⛰️ COMBO! Su ve toprak birleşerek yaşam kaynağı oluşturuyor! +6 iyileştirme!`,
      visualEffect: 'water_earth_combo',
      soundEffect: 'nature_heal.mp3',
      comboTriggered: true
    };
  }
  
  // Light + Light = Divine Power
  if (card1.element === ElementType.LIGHT && card2.element === ElementType.LIGHT) {
    return {
      success: true,
      damage: 12,
      message: `✨✨ İLAHİ COMBO! Çifte ışık gücü! +12 kutsal hasar!`,
      visualEffect: 'divine_combo',
      soundEffect: 'divine_power.mp3',
      comboTriggered: true
    };
  }
  
  // Shadow + Shadow = Dark Ritual
  if (card1.element === ElementType.SHADOW && card2.element === ElementType.SHADOW) {
    return {
      success: true,
      damage: 10,
      healing: 5,
      message: `🌑🌑 KARANLIK RİTÜEL! Çifte gölge gücü! +10 hasar, +5 yaşam emme!`,
      visualEffect: 'shadow_ritual',
      soundEffect: 'dark_ritual.mp3',
      comboTriggered: true
    };
  }
  
  return null;
}

// Get abilities by element
export function getAbilitiesByElement(element: ElementType): EnhancedAbility[] {
  switch (element) {
    case ElementType.FIRE:
      return fireAbilities;
    case ElementType.WATER:
      return waterAbilities;
    case ElementType.EARTH:
      return earthAbilities;
    case ElementType.AIR:
      return airAbilities;
    case ElementType.LIGHT:
      return lightAbilities;
    case ElementType.SHADOW:
      return shadowAbilities;
    default:
      return [];
  }
}