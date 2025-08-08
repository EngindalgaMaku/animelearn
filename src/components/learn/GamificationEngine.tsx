"use client";

import { useState, useEffect, useRef } from "react";

// Advanced Gamification System 2.0
export interface PlayerCharacter {
  id: string;
  username: string;
  level: number;
  experience: number;
  experienceToNext: number;
  totalExperience: number;
  prestige: number;
  
  // Core Stats
  stats: {
    intelligence: number;
    memory: number;
    speed: number;
    focus: number;
    creativity: number;
    persistence: number;
  };
  
  // Character Customization
  appearance: {
    avatar: string;
    theme: string;
    title: string;
    badge: string;
    nameColor: string;
    effectTrail: string;
  };
  
  // Progression
  skillPoints: number;
  unlockedSkills: string[];
  activeSkills: string[];
  achievements: string[];
  
  // Game Progress
  completedChallenges: number;
  totalPlayTime: number;
  streakRecord: number;
  perfectGames: number;
  multiplayerWins: number;
  
  // Currency & Resources
  diamonds: number;
  tokens: number;
  craftingMaterials: {[key: string]: number};
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'memory' | 'speed' | 'focus' | 'strategy' | 'social' | 'learning';
  tier: number;
  cost: number;
  prerequisites: string[];
  effects: SkillEffect[];
  isUnlocked: boolean;
  isActive: boolean;
  maxLevel: number;
  currentLevel: number;
}

export interface SkillEffect {
  type: 'stat_boost' | 'ability_unlock' | 'resource_bonus' | 'special_power';
  target: string;
  value: number;
  description: string;
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  nodes: SkillNode[];
  totalNodes: number;
  unlockedNodes: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'gameplay' | 'social' | 'progression' | 'special' | 'seasonal';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
  isHidden: boolean;
}

export interface AchievementRequirement {
  type: 'complete_challenges' | 'reach_level' | 'win_multiplayer' | 'perfect_games' | 'streak' | 'playtime';
  value: number;
  description: string;
}

export interface AchievementReward {
  type: 'experience' | 'diamonds' | 'skill_points' | 'title' | 'avatar' | 'badge';
  value: number | string;
  description: string;
}

export interface ProgressionMilestone {
  level: number;
  rewards: {
    skillPoints: number;
    diamonds: number;
    unlocks: string[];
  };
  title: string;
  description: string;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  specialAchievements: Achievement[];
  bonusMultipliers: {[key: string]: number};
  exclusiveRewards: string[];
}

class GamificationEngine {
  private character: PlayerCharacter;
  private skillTrees: SkillTree[] = [];
  private achievements: Achievement[] = [];
  private progressionMilestones: ProgressionMilestone[] = [];
  private seasonalEvents: SeasonalEvent[] = [];
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(userId: string) {
    this.character = this.initializeCharacter(userId);
    this.initializeSkillTrees();
    this.initializeAchievements();
    this.initializeProgressionMilestones();
    this.checkSeasonalEvents();
  }

  private initializeCharacter(userId: string): PlayerCharacter {
    const saved = typeof window !== 'undefined' 
      ? localStorage.getItem(`character_${userId}`)
      : null;
    
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      id: userId,
      username: "Novice Coder",
      level: 1,
      experience: 0,
      experienceToNext: 100,
      totalExperience: 0,
      prestige: 0,
      
      stats: {
        intelligence: 10,
        memory: 10,
        speed: 10,
        focus: 10,
        creativity: 10,
        persistence: 10,
      },
      
      appearance: {
        avatar: "🧑‍💻",
        theme: "default",
        title: "Novice",
        badge: "bronze",
        nameColor: "#6B7280",
        effectTrail: "none",
      },
      
      skillPoints: 3,
      unlockedSkills: [],
      activeSkills: [],
      achievements: [],
      
      completedChallenges: 0,
      totalPlayTime: 0,
      streakRecord: 0,
      perfectGames: 0,
      multiplayerWins: 0,
      
      diamonds: 100,
      tokens: 50,
      craftingMaterials: {},
    };
  }

  private initializeSkillTrees() {
    this.skillTrees = [
      {
        id: 'memory_mastery',
        name: 'Memory Mastery',
        description: 'Enhance your memory capabilities and unlock powerful recall abilities',
        icon: '🧠',
        color: 'purple',
        totalNodes: 15,
        unlockedNodes: 0,
        nodes: [
          {
            id: 'enhanced_recall',
            name: 'Enhanced Recall',
            description: '+25% memory accuracy for matching pairs',
            icon: '💭',
            category: 'memory',
            tier: 1,
            cost: 1,
            prerequisites: [],
            effects: [
              { type: 'stat_boost', target: 'memory', value: 25, description: '+25% Memory' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 3,
            currentLevel: 0,
          },
          {
            id: 'pattern_recognition',
            name: 'Pattern Recognition',
            description: 'Highlights similar card patterns for 3 seconds',
            icon: '🔍',
            category: 'memory',
            tier: 2,
            cost: 2,
            prerequisites: ['enhanced_recall'],
            effects: [
              { type: 'ability_unlock', target: 'pattern_highlight', value: 1, description: 'Pattern highlighting ability' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 1,
            currentLevel: 0,
          },
          {
            id: 'photographic_memory',
            name: 'Photographic Memory',
            description: 'Perfect recall - see all cards for 1 second at game start',
            icon: '📸',
            category: 'memory',
            tier: 3,
            cost: 3,
            prerequisites: ['pattern_recognition'],
            effects: [
              { type: 'special_power', target: 'photographic_preview', value: 1000, description: '1-second preview ability' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 1,
            currentLevel: 0,
          },
        ],
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Become lightning fast with enhanced reflexes and time bonuses',
        icon: '⚡',
        color: 'yellow',
        totalNodes: 12,
        unlockedNodes: 0,
        nodes: [
          {
            id: 'quick_fingers',
            name: 'Quick Fingers',
            description: '+15% card flip speed',
            icon: '👆',
            category: 'speed',
            tier: 1,
            cost: 1,
            prerequisites: [],
            effects: [
              { type: 'stat_boost', target: 'speed', value: 15, description: '+15% Speed' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 5,
            currentLevel: 0,
          },
          {
            id: 'time_dilation',
            name: 'Time Dilation',
            description: 'Slow down time for 5 seconds once per game',
            icon: '⏰',
            category: 'speed',
            tier: 2,
            cost: 2,
            prerequisites: ['quick_fingers'],
            effects: [
              { type: 'special_power', target: 'slow_time', value: 5000, description: 'Time dilation ability' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 1,
            currentLevel: 0,
          },
        ],
      },
      {
        id: 'focus_master',
        name: 'Focus Master',
        description: 'Develop laser focus and resistance to distractions',
        icon: '🎯',
        color: 'blue',
        totalNodes: 10,
        unlockedNodes: 0,
        nodes: [
          {
            id: 'zen_mode',
            name: 'Zen Mode',
            description: 'Immunity to mistake penalties for 10 seconds',
            icon: '🧘',
            category: 'focus',
            tier: 1,
            cost: 1,
            prerequisites: [],
            effects: [
              { type: 'special_power', target: 'mistake_immunity', value: 10000, description: 'Mistake immunity' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 1,
            currentLevel: 0,
          },
        ],
      },
      {
        id: 'strategist',
        name: 'Strategist',
        description: 'Master tactical gameplay and resource management',
        icon: '♟️',
        color: 'green',
        totalNodes: 14,
        unlockedNodes: 0,
        nodes: [
          {
            id: 'power_efficiency',
            name: 'Power Efficiency',
            description: 'Power-ups cost 50% less to use',
            icon: '🔋',
            category: 'strategy',
            tier: 1,
            cost: 1,
            prerequisites: [],
            effects: [
              { type: 'resource_bonus', target: 'powerup_cost', value: -50, description: '-50% Power-up costs' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 1,
            currentLevel: 0,
          },
        ],
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Excel in multiplayer and community interactions',
        icon: '🦋',
        color: 'pink',
        totalNodes: 8,
        unlockedNodes: 0,
        nodes: [
          {
            id: 'team_player',
            name: 'Team Player',
            description: '+20% experience from multiplayer games',
            icon: '🤝',
            category: 'social',
            tier: 1,
            cost: 1,
            prerequisites: [],
            effects: [
              { type: 'resource_bonus', target: 'multiplayer_exp', value: 20, description: '+20% Multiplayer XP' }
            ],
            isUnlocked: false,
            isActive: false,
            maxLevel: 3,
            currentLevel: 0,
          },
        ],
      },
    ];
  }

  private initializeAchievements() {
    this.achievements = [
      // Gameplay Achievements
      {
        id: 'first_victory',
        name: 'First Victory',
        description: 'Complete your first memory challenge',
        icon: '🏆',
        category: 'gameplay',
        rarity: 'common',
        requirements: [
          { type: 'complete_challenges', value: 1, description: 'Complete 1 challenge' }
        ],
        rewards: [
          { type: 'experience', value: 50, description: '+50 XP' },
          { type: 'diamonds', value: 25, description: '+25 Diamonds' }
        ],
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isHidden: false,
      },
      {
        id: 'perfect_ten',
        name: 'Perfect Ten',
        description: 'Complete 10 challenges with 100% accuracy',
        icon: '💯',
        category: 'gameplay',
        rarity: 'rare',
        requirements: [
          { type: 'perfect_games', value: 10, description: 'Complete 10 perfect games' }
        ],
        rewards: [
          { type: 'skill_points', value: 2, description: '+2 Skill Points' },
          { type: 'title', value: 'Perfectionist', description: 'Perfectionist title' }
        ],
        progress: 0,
        maxProgress: 10,
        isCompleted: false,
        isHidden: false,
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a challenge in under 30 seconds',
        icon: '💨',
        category: 'gameplay',
        rarity: 'epic',
        requirements: [
          { type: 'complete_challenges', value: 1, description: 'Complete challenge in <30s' }
        ],
        rewards: [
          { type: 'avatar', value: '⚡', description: 'Lightning avatar' },
          { type: 'skill_points', value: 3, description: '+3 Skill Points' }
        ],
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isHidden: false,
      },
      
      // Progression Achievements
      {
        id: 'level_up',
        name: 'Level Up!',
        description: 'Reach level 5',
        icon: '📈',
        category: 'progression',
        rarity: 'common',
        requirements: [
          { type: 'reach_level', value: 5, description: 'Reach level 5' }
        ],
        rewards: [
          { type: 'skill_points', value: 1, description: '+1 Skill Point' },
          { type: 'diamonds', value: 50, description: '+50 Diamonds' }
        ],
        progress: 0,
        maxProgress: 5,
        isCompleted: false,
        isHidden: false,
      },
      {
        id: 'centurion',
        name: 'Centurion',
        description: 'Complete 100 challenges',
        icon: '💪',
        category: 'progression',
        rarity: 'legendary',
        requirements: [
          { type: 'complete_challenges', value: 100, description: 'Complete 100 challenges' }
        ],
        rewards: [
          { type: 'title', value: 'Memory Master', description: 'Memory Master title' },
          { type: 'badge', value: 'gold', description: 'Gold badge' },
          { type: 'skill_points', value: 5, description: '+5 Skill Points' }
        ],
        progress: 0,
        maxProgress: 100,
        isCompleted: false,
        isHidden: false,
      },
      
      // Social Achievements
      {
        id: 'multiplayer_champion',
        name: 'Multiplayer Champion',
        description: 'Win 25 multiplayer matches',
        icon: '👑',
        category: 'social',
        rarity: 'epic',
        requirements: [
          { type: 'win_multiplayer', value: 25, description: 'Win 25 multiplayer matches' }
        ],
        rewards: [
          { type: 'title', value: 'Champion', description: 'Champion title' },
          { type: 'skill_points', value: 4, description: '+4 Skill Points' }
        ],
        progress: 0,
        maxProgress: 25,
        isCompleted: false,
        isHidden: false,
      },
      
      // Special Hidden Achievements
      {
        id: 'easter_egg',
        name: 'Easter Egg Hunter',
        description: 'Find the hidden easter egg',
        icon: '🥚',
        category: 'special',
        rarity: 'mythic',
        requirements: [
          { type: 'complete_challenges', value: 1, description: 'Find the secret' }
        ],
        rewards: [
          { type: 'avatar', value: '🔮', description: 'Mystical avatar' },
          { type: 'diamonds', value: 500, description: '+500 Diamonds' }
        ],
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isHidden: true,
      },
    ];
  }

  private initializeProgressionMilestones() {
    this.progressionMilestones = [
      { level: 5, rewards: { skillPoints: 2, diamonds: 100, unlocks: ['advanced_themes'] }, title: 'Novice Graduate', description: 'Basic training complete!' },
      { level: 10, rewards: { skillPoints: 3, diamonds: 200, unlocks: ['prestige_system'] }, title: 'Apprentice', description: 'Your skills are developing nicely.' },
      { level: 15, rewards: { skillPoints: 4, diamonds: 300, unlocks: ['legendary_powerups'] }, title: 'Adept', description: 'You\'ve mastered the fundamentals.' },
      { level: 25, rewards: { skillPoints: 5, diamonds: 500, unlocks: ['master_challenges'] }, title: 'Expert', description: 'Few can match your expertise.' },
      { level: 50, rewards: { skillPoints: 10, diamonds: 1000, unlocks: ['grandmaster_content'] }, title: 'Master', description: 'You are among the elite.' },
      { level: 100, rewards: { skillPoints: 20, diamonds: 2500, unlocks: ['transcendent_abilities'] }, title: 'Grandmaster', description: 'Legendary status achieved!' },
    ];
  }

  private checkSeasonalEvents() {
    // Check for active seasonal events
    const now = new Date();
    this.seasonalEvents = [
      {
        id: 'winter_festival',
        name: 'Winter Code Festival',
        description: 'Special winter-themed challenges and bonuses!',
        startDate: new Date(now.getFullYear(), 11, 1), // December 1st
        endDate: new Date(now.getFullYear() + 1, 0, 31), // January 31st
        isActive: now.getMonth() === 11 || now.getMonth() === 0,
        specialAchievements: [],
        bonusMultipliers: { experience: 1.5, diamonds: 2.0 },
        exclusiveRewards: ['winter_avatar', 'snowflake_trail'],
      },
    ];
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Experience and leveling
  addExperience(amount: number, source: string = 'gameplay') {
    // Apply seasonal bonuses
    const activeEvent = this.seasonalEvents.find(e => e.isActive);
    if (activeEvent && activeEvent.bonusMultipliers.experience) {
      amount *= activeEvent.bonusMultipliers.experience;
    }

    // Apply social bonuses
    if (source === 'multiplayer' && this.hasSkill('team_player')) {
      amount *= 1.2; // 20% bonus from Team Player skill
    }

    this.character.experience += amount;
    this.character.totalExperience += amount;

    // Check for level up
    while (this.character.experience >= this.character.experienceToNext) {
      this.levelUp();
    }

    this.saveCharacter();
    this.emit('experience_gained', { amount, source, newTotal: this.character.experience });
  }

  private levelUp() {
    this.character.experience -= this.character.experienceToNext;
    this.character.level++;
    this.character.experienceToNext = this.calculateExpToNext(this.character.level);

    // Award skill points
    this.character.skillPoints += Math.floor(this.character.level / 5) + 1;

    // Check milestones
    const milestone = this.progressionMilestones.find(m => m.level === this.character.level);
    if (milestone) {
      this.character.skillPoints += milestone.rewards.skillPoints;
      this.character.diamonds += milestone.rewards.diamonds;
      this.emit('milestone_reached', milestone);
    }

    // Update achievements
    this.updateAchievementProgress('reach_level', this.character.level);

    this.emit('level_up', { 
      newLevel: this.character.level, 
      skillPointsAwarded: Math.floor(this.character.level / 5) + 1,
      milestone 
    });
  }

  private calculateExpToNext(level: number): number {
    // Exponential growth with slight scaling
    return Math.floor(100 * Math.pow(1.15, level - 1));
  }

  // Skill system
  unlockSkill(skillId: string): boolean {
    const skill = this.findSkill(skillId);
    if (!skill) return false;

    // Check prerequisites
    const prerequisitesMet = skill.prerequisites.every(prereqId => 
      this.character.unlockedSkills.includes(prereqId)
    );

    if (!prerequisitesMet || this.character.skillPoints < skill.cost) {
      return false;
    }

    // Unlock skill
    this.character.skillPoints -= skill.cost;
    this.character.unlockedSkills.push(skillId);
    skill.isUnlocked = true;
    skill.currentLevel = 1;

    // Apply skill effects
    this.applySkillEffects(skill);

    // Update skill tree progress
    const tree = this.skillTrees.find(t => t.nodes.some(n => n.id === skillId));
    if (tree) {
      tree.unlockedNodes++;
    }

    this.saveCharacter();
    this.emit('skill_unlocked', { skill, character: this.character });
    return true;
  }

  upgradeSkill(skillId: string): boolean {
    const skill = this.findSkill(skillId);
    if (!skill || !skill.isUnlocked || skill.currentLevel >= skill.maxLevel) {
      return false;
    }

    const upgradeCost = skill.cost * skill.currentLevel;
    if (this.character.skillPoints < upgradeCost) {
      return false;
    }

    this.character.skillPoints -= upgradeCost;
    skill.currentLevel++;

    // Apply additional effects
    this.applySkillEffects(skill, skill.currentLevel - 1);

    this.saveCharacter();
    this.emit('skill_upgraded', { skill, character: this.character });
    return true;
  }

  private findSkill(skillId: string): SkillNode | null {
    for (const tree of this.skillTrees) {
      const skill = tree.nodes.find(n => n.id === skillId);
      if (skill) return skill;
    }
    return null;
  }

  private applySkillEffects(skill: SkillNode, previousLevel: number = 0) {
    skill.effects.forEach(effect => {
      const levelMultiplier = skill.currentLevel - previousLevel;
      
      switch (effect.type) {
        case 'stat_boost':
          if (effect.target in this.character.stats) {
            (this.character.stats as any)[effect.target] += effect.value * levelMultiplier;
          }
          break;
        case 'ability_unlock':
          if (!this.character.activeSkills.includes(effect.target)) {
            this.character.activeSkills.push(effect.target);
          }
          break;
        case 'resource_bonus':
          // These are handled dynamically during gameplay
          break;
        case 'special_power':
          if (!this.character.activeSkills.includes(effect.target)) {
            this.character.activeSkills.push(effect.target);
          }
          break;
      }
    });
  }

  hasSkill(skillId: string): boolean {
    return this.character.unlockedSkills.includes(skillId);
  }

  // Achievement system
  updateAchievementProgress(type: string, value: number) {
    const updatedAchievements: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.isCompleted) return;

      const requirement = achievement.requirements.find(req => req.type === type);
      if (requirement) {
        const oldProgress = achievement.progress;
        achievement.progress = Math.min(achievement.maxProgress, value);
        
        if (achievement.progress >= achievement.maxProgress && !achievement.isCompleted) {
          this.completeAchievement(achievement);
          updatedAchievements.push(achievement);
        } else if (achievement.progress > oldProgress) {
          updatedAchievements.push(achievement);
        }
      }
    });

    if (updatedAchievements.length > 0) {
      this.emit('achievements_updated', updatedAchievements);
    }
  }

  private completeAchievement(achievement: Achievement) {
    achievement.isCompleted = true;
    achievement.completedAt = new Date();
    this.character.achievements.push(achievement.id);

    // Award rewards
    achievement.rewards.forEach(reward => {
      switch (reward.type) {
        case 'experience':
          this.addExperience(reward.value as number, 'achievement');
          break;
        case 'diamonds':
          this.character.diamonds += reward.value as number;
          break;
        case 'skill_points':
          this.character.skillPoints += reward.value as number;
          break;
        case 'title':
          this.character.appearance.title = reward.value as string;
          break;
        case 'avatar':
          // Add to available avatars (would be handled by UI)
          break;
        case 'badge':
          this.character.appearance.badge = reward.value as string;
          break;
      }
    });

    this.saveCharacter();
    this.emit('achievement_completed', { achievement, character: this.character });
  }

  // Game event handlers
  onGameComplete(score: number, timeSpent: number, accuracy: number, isMultiplayer: boolean = false) {
    // Update game statistics
    this.character.completedChallenges++;
    this.character.totalPlayTime += timeSpent;
    
    if (accuracy === 1.0) {
      this.character.perfectGames++;
    }

    if (isMultiplayer && score > 0) { // Assuming positive score means win
      this.character.multiplayerWins++;
    }

    // Award base experience
    let experienceGained = Math.floor(score / 10) + 20;
    
    // Bonus for perfect games
    if (accuracy === 1.0) {
      experienceGained *= 1.5;
    }

    // Speed bonus
    if (timeSpent < 60) {
      experienceGained *= 1.25;
    }

    this.addExperience(experienceGained, isMultiplayer ? 'multiplayer' : 'gameplay');

    // Update achievements
    this.updateAchievementProgress('complete_challenges', this.character.completedChallenges);
    if (accuracy === 1.0) {
      this.updateAchievementProgress('perfect_games', this.character.perfectGames);
    }
    if (isMultiplayer && score > 0) {
      this.updateAchievementProgress('win_multiplayer', this.character.multiplayerWins);
    }

    this.saveCharacter();
  }

  // Character management
  getCharacter(): PlayerCharacter {
    return { ...this.character };
  }

  getSkillTrees(): SkillTree[] {
    return [...this.skillTrees];
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getProgressionMilestones(): ProgressionMilestone[] {
    return [...this.progressionMilestones];
  }

  getSeasonalEvents(): SeasonalEvent[] {
    return [...this.seasonalEvents];
  }

  // Prestige system
  canPrestige(): boolean {
    return this.character.level >= 100 && this.character.prestige < 5;
  }

  prestige(): boolean {
    if (!this.canPrestige()) return false;

    // Reset character with bonuses
    const prestigeBonus = {
      skillPoints: this.character.prestige * 5 + 10,
      statBoost: this.character.prestige * 2 + 5,
    };

    this.character.prestige++;
    this.character.level = 1;
    this.character.experience = 0;
    this.character.experienceToNext = 100;
    this.character.skillPoints = prestigeBonus.skillPoints;

    // Keep some progress
    this.character.achievements = [...this.character.achievements];
    this.character.totalExperience += this.character.totalExperience;

    // Boost base stats
    Object.keys(this.character.stats).forEach(stat => {
      (this.character.stats as any)[stat] += prestigeBonus.statBoost;
    });

    // Reset skill trees but keep some nodes unlocked
    this.resetSkillTrees(true);

    this.saveCharacter();
    this.emit('prestige_completed', { character: this.character, prestigeLevel: this.character.prestige });
    return true;
  }

  private resetSkillTrees(keepTier1: boolean = false) {
    this.skillTrees.forEach(tree => {
      tree.unlockedNodes = 0;
      tree.nodes.forEach(node => {
        if (keepTier1 && node.tier === 1) {
          // Keep tier 1 skills for prestige bonus
          return;
        }
        node.isUnlocked = false;
        node.isActive = false;
        node.currentLevel = 0;
      });
    });

    if (keepTier1) {
      this.character.unlockedSkills = this.character.unlockedSkills.filter(skillId => {
        const skill = this.findSkill(skillId);
        return skill?.tier === 1;
      });
    } else {
      this.character.unlockedSkills = [];
    }
  }

  private saveCharacter() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`character_${this.character.id}`, JSON.stringify(this.character));
    }
  }
}

export default GamificationEngine;