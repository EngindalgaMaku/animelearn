"use client";

import { ElementType, BattleCard } from '../../types/battle/core';

export interface SoundConfig {
  enabled: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
}

export interface SoundEffect {
  id: string;
  src: string;
  volume?: number;
  loop?: boolean;
  category: 'music' | 'sfx' | 'voice' | 'ambient';
}

class BattleSoundManager {
  private config: SoundConfig;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentMusic: HTMLAudioElement | null = null;
  private initialized = false;

  constructor() {
    this.config = {
      enabled: true,
      masterVolume: 0.7,
      musicVolume: 0.4,
      sfxVolume: 0.8,
      voiceVolume: 0.9
    };
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('battleSoundConfig');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('battleSoundConfig', JSON.stringify(this.config));
    }
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Pre-load essential sounds
      await this.preloadSounds([
        'card_play',
        'card_attack',
        'fire_spell',
        'water_spell',
        'combo_success',
        'turn_change',
        'victory',
        'defeat'
      ]);
      
      this.initialized = true;
    } catch (error) {
      console.warn('Sound system initialization failed:', error);
    }
  }

  private async preloadSounds(soundIds: string[]) {
    const promises = soundIds.map(id => this.loadSound(id));
    await Promise.allSettled(promises);
  }

  private async loadSound(soundId: string): Promise<HTMLAudioElement> {
    if (this.audioCache.has(soundId)) {
      return this.audioCache.get(soundId)!;
    }

    const audio = new Audio();
    const soundPath = this.getSoundPath(soundId);
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', () => {
        this.audioCache.set(soundId, audio);
        resolve(audio);
      });
      
      audio.addEventListener('error', () => {
        console.warn(`Failed to load sound: ${soundId}`);
        reject(new Error(`Failed to load sound: ${soundId}`));
      });
      
      audio.src = soundPath;
      audio.preload = 'auto';
    });
  }

  private getSoundPath(soundId: string): string {
    const soundMap: Record<string, string> = {
      // Background Music
      'battle_theme': '/sounds/music/battle_theme.mp3',
      'victory_theme': '/sounds/music/victory.mp3',
      'defeat_theme': '/sounds/music/defeat.mp3',
      
      // Card Sounds
      'card_play': '/sounds/sfx/card_play.wav',
      'card_attack': '/sounds/sfx/card_attack.wav',
      'card_destroy': '/sounds/sfx/card_destroy.wav',
      'card_summon': '/sounds/sfx/card_summon.wav',
      
      // Element Spells
      'fire_spell': '/sounds/sfx/fire_spell.wav',
      'water_spell': '/sounds/sfx/water_spell.wav',
      'earth_spell': '/sounds/sfx/earth_spell.wav',
      'air_spell': '/sounds/sfx/air_spell.wav',
      'light_spell': '/sounds/sfx/light_spell.wav',
      'shadow_spell': '/sounds/sfx/shadow_spell.wav',
      
      // Combat
      'damage_dealt': '/sounds/sfx/damage.wav',
      'healing': '/sounds/sfx/heal.wav',
      'critical_hit': '/sounds/sfx/critical.wav',
      'combo_success': '/sounds/sfx/combo.wav',
      
      // UI
      'turn_change': '/sounds/sfx/turn_change.wav',
      'timer_warning': '/sounds/sfx/timer_warning.wav',
      'button_click': '/sounds/sfx/button_click.wav',
      'victory': '/sounds/sfx/victory.wav',
      'defeat': '/sounds/sfx/defeat.wav',
      
      // Ambient
      'battle_ambience': '/sounds/ambient/battle_field.mp3',
      'wind_ambient': '/sounds/ambient/wind.mp3',
      'fire_crackle': '/sounds/ambient/fire.mp3'
    };

    return soundMap[soundId] || `/sounds/sfx/${soundId}.wav`;
  }

  playSound(soundId: string, options: {
    volume?: number;
    pitch?: number;
    delay?: number;
    interrupt?: boolean;
  } = {}) {
    if (!this.config.enabled) return;

    const { volume = 1, pitch = 1, delay = 0, interrupt = false } = options;

    const playAudio = () => {
      this.loadSound(soundId).then(audio => {
        if (interrupt && !audio.paused) {
          audio.currentTime = 0;
        }

        const category = this.getSoundCategory(soundId);
        const finalVolume = this.calculateVolume(category, volume);
        
        audio.volume = finalVolume;
        audio.playbackRate = pitch;
        
        audio.play().catch(error => {
          console.warn(`Failed to play sound ${soundId}:`, error);
        });
      }).catch(() => {
        // Sound loading failed, silently continue
      });
    };

    if (delay > 0) {
      setTimeout(playAudio, delay);
    } else {
      playAudio();
    }
  }

  playMusic(musicId: string, loop = true) {
    if (!this.config.enabled) return;

    if (this.currentMusic) {
      this.currentMusic.pause();
    }

    this.loadSound(musicId).then(audio => {
      audio.loop = loop;
      audio.volume = this.calculateVolume('music', 1);
      this.currentMusic = audio;
      
      audio.play().catch(error => {
        console.warn(`Failed to play music ${musicId}:`, error);
      });
    }).catch(() => {
      // Music loading failed, silently continue
    });
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  private getSoundCategory(soundId: string): 'music' | 'sfx' | 'voice' | 'ambient' {
    if (soundId.includes('theme') || soundId.includes('music')) return 'music';
    if (soundId.includes('ambient') || soundId.includes('crackle')) return 'ambient';
    if (soundId.includes('voice') || soundId.includes('narrator')) return 'voice';
    return 'sfx';
  }

  private calculateVolume(category: 'music' | 'sfx' | 'voice' | 'ambient', baseVolume: number): number {
    const categoryVolume = {
      music: this.config.musicVolume,
      sfx: this.config.sfxVolume,
      voice: this.config.voiceVolume,
      ambient: this.config.sfxVolume * 0.6
    }[category];

    return Math.max(0, Math.min(1, this.config.masterVolume * categoryVolume * baseVolume));
  }

  // Element-specific sound effects
  playElementSound(element: ElementType, action: 'summon' | 'attack' | 'ability') {
    const elementSounds = {
      [ElementType.FIRE]: {
        summon: 'fire_summon',
        attack: 'fire_attack',
        ability: 'fire_spell'
      },
      [ElementType.WATER]: {
        summon: 'water_summon',
        attack: 'water_attack',
        ability: 'water_spell'
      },
      [ElementType.EARTH]: {
        summon: 'earth_summon',
        attack: 'earth_attack',
        ability: 'earth_spell'
      },
      [ElementType.AIR]: {
        summon: 'air_summon',
        attack: 'air_attack',
        ability: 'air_spell'
      },
      [ElementType.LIGHT]: {
        summon: 'light_summon',
        attack: 'light_attack',
        ability: 'light_spell'
      },
      [ElementType.SHADOW]: {
        summon: 'shadow_summon',
        attack: 'shadow_attack',
        ability: 'shadow_spell'
      },
      [ElementType.NEUTRAL]: {
        summon: 'card_summon',
        attack: 'card_attack',
        ability: 'neutral_spell'
      }
    };

    const soundId = elementSounds[element]?.[action] || 'card_play';
    this.playSound(soundId);
  }

  // Card-specific sound effects
  playCardSound(card: BattleCard, action: 'play' | 'attack' | 'destroy' | 'ability') {
    switch (action) {
      case 'play':
        this.playElementSound(card.element, 'summon');
        break;
      case 'attack':
        this.playElementSound(card.element, 'attack');
        break;
      case 'destroy':
        this.playSound('card_destroy');
        break;
      case 'ability':
        this.playElementSound(card.element, 'ability');
        break;
    }
  }

  // Battle event sounds
  playBattleEvent(event: 'turn_start' | 'turn_end' | 'damage' | 'heal' | 'combo' | 'victory' | 'defeat') {
    const eventSounds = {
      turn_start: 'turn_change',
      turn_end: 'turn_change',
      damage: 'damage_dealt',
      heal: 'healing',
      combo: 'combo_success',
      victory: 'victory',
      defeat: 'defeat'
    };

    this.playSound(eventSounds[event]);
  }

  // Sequence for complex audio events
  playSequence(sounds: Array<{
    soundId: string;
    delay: number;
    volume?: number;
    pitch?: number;
  }>) {
    sounds.forEach(({ soundId, delay, volume, pitch }) => {
      this.playSound(soundId, { volume, pitch, delay });
    });
  }

  // Configuration methods
  updateConfig(newConfig: Partial<SoundConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveToStorage();
    
    // Update current music volume if playing
    if (this.currentMusic) {
      this.currentMusic.volume = this.calculateVolume('music', 1);
    }
  }

  getConfig(): SoundConfig {
    return { ...this.config };
  }

  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
    this.saveToStorage();
    
    if (!enabled) {
      this.stopMusic();
    }
  }

  setMasterVolume(volume: number) {
    this.updateConfig({ masterVolume: Math.max(0, Math.min(1, volume)) });
  }

  // Preset sound combinations for common scenarios
  playCardPlaySequence(card: BattleCard) {
    this.playSequence([
      { soundId: 'card_play', delay: 0, volume: 0.8 },
      { soundId: this.getElementSoundId(card.element, 'summon'), delay: 200, volume: 1.0 }
    ]);
  }

  playAttackSequence(attackerCard: BattleCard, damage: number) {
    const sounds = [
      { soundId: 'card_attack', delay: 0, volume: 0.9 }
    ];

    if (damage > 5) {
      sounds.push({ soundId: 'critical_hit', delay: 300, volume: 1.0 });
    }

    sounds.push({ 
      soundId: this.getElementSoundId(attackerCard.element, 'attack'), 
      delay: 100, 
      volume: 0.8 
    });

    this.playSequence(sounds);
  }

  playComboSequence(elements: ElementType[]) {
    const sounds = [
      { soundId: 'combo_success', delay: 0, volume: 1.0, pitch: 1.2 }
    ];

    elements.forEach((element, index) => {
      sounds.push({
        soundId: this.getElementSoundId(element, 'ability'),
        delay: 200 + (index * 150),
        volume: 0.7,
        pitch: 1.0 + (index * 0.1)
      });
    });

    this.playSequence(sounds);
  }

  private getElementSoundId(element: ElementType, action: 'summon' | 'attack' | 'ability'): string {
    return `${element}_${action}`;
  }
}

// Global sound manager instance
export const battleSoundManager = new BattleSoundManager();

// React hook for sound management
export function useBattleSound() {
  const playCardSound = (card: BattleCard, action: 'play' | 'attack' | 'destroy' | 'ability') => {
    battleSoundManager.playCardSound(card, action);
  };

  const playBattleEvent = (event: 'turn_start' | 'turn_end' | 'damage' | 'heal' | 'combo' | 'victory' | 'defeat') => {
    battleSoundManager.playBattleEvent(event);
  };

  const playSound = (soundId: string, options?: {
    volume?: number;
    pitch?: number;
    delay?: number;
  }) => {
    battleSoundManager.playSound(soundId, options);
  };

  const setEnabled = (enabled: boolean) => {
    battleSoundManager.setEnabled(enabled);
  };

  const updateVolume = (volume: number) => {
    battleSoundManager.setMasterVolume(volume);
  };

  return {
    playCardSound,
    playBattleEvent,
    playSound,
    setEnabled,
    updateVolume,
    config: battleSoundManager.getConfig()
  };
}

// Sound effect mappings for easy access
export const BATTLE_SOUNDS = {
  CARD_PLAY: 'card_play',
  CARD_ATTACK: 'card_attack',
  CARD_DESTROY: 'card_destroy',
  TURN_CHANGE: 'turn_change',
  DAMAGE: 'damage_dealt',
  HEAL: 'healing',
  COMBO: 'combo_success',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  FIRE_SPELL: 'fire_spell',
  WATER_SPELL: 'water_spell',
  EARTH_SPELL: 'earth_spell',
  AIR_SPELL: 'air_spell',
  LIGHT_SPELL: 'light_spell',
  SHADOW_SPELL: 'shadow_spell'
} as const;

export default battleSoundManager;