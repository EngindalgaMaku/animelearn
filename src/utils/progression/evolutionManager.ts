import { 
  BattleCard, 
  ElementType, 
  RarityTier 
} from '../../types/battle/core';
import { 
  EvolutionStage, 
  ProgressionType, 
  EvolutionPath, 
  EvolutionRequirement, 
  CardProgression, 
  FusionRecipe, 
  AwakeningRitual, 
  EvolutionChain,
  EvolutionPreview,
  EvolutionEvent
} from '../../types/progression/evolution';

export class EvolutionManager {
  
  // Experience calculation
  static calculateExperienceGain(
    cardLevel: number, 
    battleResult: 'win' | 'loss' | 'draw',
    battleDuration: number,
    opponentLevel: number
  ): number {
    let baseExperience = 10;
    
    // Result multiplier
    const resultMultiplier = {
      'win': 1.5,
      'draw': 1.0,
      'loss': 0.7
    }[battleResult];
    
    // Level difference bonus/penalty
    const levelDiff = opponentLevel - cardLevel;
    const levelMultiplier = Math.max(0.5, 1 + (levelDiff * 0.1));
    
    // Duration bonus (longer battles give more experience)
    const durationMultiplier = Math.min(2.0, 1 + (battleDuration / 600000)); // 10 min max bonus
    
    // Card level penalty (higher level cards gain less experience)
    const levelPenalty = Math.max(0.1, 1 - (cardLevel * 0.02));
    
    return Math.floor(
      baseExperience * 
      resultMultiplier * 
      levelMultiplier * 
      durationMultiplier * 
      levelPenalty
    );
  }

  // Level progression
  static getExperienceForLevel(level: number): number {
    // Exponential curve with some softening at higher levels
    return Math.floor(100 * Math.pow(level, 1.5) + (level * 50));
  }

  static getExperienceToNextLevel(currentLevel: number, currentExperience: number): number {
    const currentLevelExp = this.getExperienceForLevel(currentLevel);
    const nextLevelExp = this.getExperienceForLevel(currentLevel + 1);
    return nextLevelExp - (currentExperience - currentLevelExp);
  }

  static canLevelUp(progression: CardProgression): boolean {
    const requiredExp = this.getExperienceForLevel(progression.level + 1);
    return progression.experience >= requiredExp;
  }

  static levelUpCard(progression: CardProgression): CardProgression {
    if (!this.canLevelUp(progression)) {
      return progression;
    }

    const newLevel = progression.level + 1;
    const updatedProgression = {
      ...progression,
      level: newLevel,
      experienceToNext: this.getExperienceToNextLevel(newLevel, progression.experience)
    };

    // Check for stat bonuses every 5 levels
    if (newLevel % 5 === 0) {
      updatedProgression.statBonuses = {
        attackPower: updatedProgression.statBonuses.attackPower + 1,
        health: updatedProgression.statBonuses.health + 2,
        defense: updatedProgression.statBonuses.defense + 1,
        speed: updatedProgression.statBonuses.speed + 1
      };
    }

    return updatedProgression;
  }

  // Evolution management
  static checkEvolutionRequirements(
    progression: CardProgression, 
    requirements: EvolutionRequirement[],
    playerMaterials: Record<string, number> = {}
  ): { canEvolve: boolean; missingRequirements: string[] } {
    const missingRequirements: string[] = [];

    for (const requirement of requirements) {
      switch (requirement.type) {
        case ProgressionType.BATTLE_EXPERIENCE:
          if (progression.experience < requirement.value) {
            missingRequirements.push(`Need ${requirement.value - progression.experience} more experience`);
          }
          break;

        case ProgressionType.CARD_USAGE:
          if (progression.battlesParticipated < requirement.value) {
            missingRequirements.push(`Need ${requirement.value - progression.battlesParticipated} more battles`);
          }
          break;

        case ProgressionType.VICTORY_COUNT:
          if (progression.victoriesAchieved < requirement.value) {
            missingRequirements.push(`Need ${requirement.value - progression.victoriesAchieved} more victories`);
          }
          break;

        case ProgressionType.MATERIAL_FUSION:
          if (requirement.materials) {
            for (const material of requirement.materials) {
              const available = playerMaterials[material.cardId] || 0;
              if (available < material.quantity) {
                missingRequirements.push(`Need ${material.quantity - available} more ${material.cardId}`);
              }
            }
          }
          break;

        case ProgressionType.SPECIAL_CONDITION:
          // Check special conditions
          if (requirement.conditions) {
            if (requirement.conditions.minLevel && progression.level < requirement.conditions.minLevel) {
              missingRequirements.push(`Need level ${requirement.conditions.minLevel}`);
            }
            if (requirement.conditions.winStreak && progression.currentWinStreak < requirement.conditions.winStreak) {
              missingRequirements.push(`Need win streak of ${requirement.conditions.winStreak}`);
            }
          }
          break;
      }
    }

    return {
      canEvolve: missingRequirements.length === 0,
      missingRequirements
    };
  }

  static evolveCard(
    baseCard: BattleCard, 
    progression: CardProgression, 
    evolutionPath: EvolutionPath
  ): { evolvedCard: BattleCard; updatedProgression: CardProgression; event: EvolutionEvent } {
    const evolvedCard: BattleCard = {
      ...baseCard,
      id: `${baseCard.id}_${evolutionPath.toStage}`,
      name: `${baseCard.name} (${evolutionPath.toStage})`,
      evolutionStage: evolutionPath.toStage === EvolutionStage.BASE ? 0 : 
                      evolutionPath.toStage === EvolutionStage.EVOLVED ? 1 :
                      evolutionPath.toStage === EvolutionStage.MEGA ? 2 :
                      evolutionPath.toStage === EvolutionStage.LEGENDARY ? 3 : 4,
      
      // Apply stat boosts
      attackPower: baseCard.attackPower + evolutionPath.unlocks.statBoosts.attackPower,
      health: baseCard.health + evolutionPath.unlocks.statBoosts.health,
      maxHealth: baseCard.maxHealth + evolutionPath.unlocks.statBoosts.health,
      defense: baseCard.defense + evolutionPath.unlocks.statBoosts.defense,
      speed: baseCard.speed + evolutionPath.unlocks.statBoosts.speed,
      
      // Add new abilities
      abilities: [
        ...baseCard.abilities,
        ...evolutionPath.unlocks.newAbilities.map(abilityId => this.createAbilityFromId(abilityId))
      ].filter(Boolean),
      
      // Visual updates
      imageUrl: evolutionPath.unlocks.visualChanges.newImageUrl,
      animationUrl: evolutionPath.unlocks.visualChanges.newAnimationUrl,
      soundEffects: {
        ...baseCard.soundEffects,
        ...evolutionPath.unlocks.visualChanges.newSoundEffects
      },
      
      // Rarity upgrade
      rarity: evolutionPath.unlocks.rarityUpgrade || baseCard.rarity,
      
      // Animation and effects
      isAnimated: true
    };

    const updatedProgression: CardProgression = {
      ...progression,
      currentStage: evolutionPath.toStage,
      unlockedAbilities: [
        ...progression.unlockedAbilities,
        ...evolutionPath.unlocks.newAbilities
      ],
      statBonuses: {
        attackPower: progression.statBonuses.attackPower + evolutionPath.unlocks.statBoosts.attackPower,
        health: progression.statBonuses.health + evolutionPath.unlocks.statBoosts.health,
        defense: progression.statBonuses.defense + evolutionPath.unlocks.statBoosts.defense,
        speed: progression.statBonuses.speed + evolutionPath.unlocks.statBoosts.speed
      },
      evolutionHistory: [
        ...progression.evolutionHistory,
        {
          fromStage: evolutionPath.fromStage,
          toStage: evolutionPath.toStage,
          timestamp: Date.now(),
          cost: {
            diamonds: evolutionPath.evolutionCost.diamonds,
            time: evolutionPath.evolutionCost.time
          }
        }
      ]
    };

    const event: EvolutionEvent = {
      type: 'evolution_completed',
      cardId: baseCard.id,
      details: {
        fromStage: evolutionPath.fromStage,
        toStage: evolutionPath.toStage,
        newAbilities: evolutionPath.unlocks.newAbilities,
        statChanges: evolutionPath.unlocks.statBoosts
      },
      timestamp: Date.now(),
      celebrationLevel: this.getCelebrationLevel(evolutionPath.toStage)
    };

    return { evolvedCard, updatedProgression, event };
  }

  private static createAbilityFromId(abilityId: string): any {
    // This would reference a database of abilities
    const abilityDatabase: Record<string, any> = {
      'fire_shield': {
        id: 'fire_shield',
        name: 'Fire Shield',
        description: 'Gain +2 defense against Water attacks',
        manaCost: 1,
        cooldown: 0,
        targetRequired: false,
        execute: () => ({ success: true, message: 'Fire Shield activated!' })
      },
      'mega_blast': {
        id: 'mega_blast',
        name: 'Mega Blast',
        description: 'Deal massive damage to target',
        manaCost: 4,
        cooldown: 2,
        targetRequired: true,
        execute: () => ({ success: true, damage: 8, message: 'Mega Blast unleashed!' })
      }
    };
    
    return abilityDatabase[abilityId];
  }

  private static getCelebrationLevel(stage: EvolutionStage): 'minor' | 'major' | 'epic' | 'legendary' {
    switch (stage) {
      case EvolutionStage.EVOLVED:
        return 'minor';
      case EvolutionStage.MEGA:
        return 'major';
      case EvolutionStage.LEGENDARY:
        return 'epic';
      case EvolutionStage.AWAKENED:
        return 'legendary';
      default:
        return 'minor';
    }
  }

  // Fusion system
  static attemptFusion(
    recipe: FusionRecipe, 
    primaryCard: BattleCard, 
    materialCards: BattleCard[],
    catalysts: Record<string, number> = {}
  ): { success: boolean; resultCard?: BattleCard; failureReason?: string } {
    // Validate primary card
    if (primaryCard.id !== recipe.primaryCard.cardId) {
      return { success: false, failureReason: 'Invalid primary card' };
    }

    if (primaryCard.level < recipe.primaryCard.minLevel) {
      return { success: false, failureReason: 'Primary card level too low' };
    }

    // Validate material cards
    const requiredMaterials = new Map<string, number>();
    recipe.materialCards.forEach(req => {
      requiredMaterials.set(req.cardId, req.quantity);
    });

    const providedMaterials = new Map<string, number>();
    materialCards.forEach(card => {
      const current = providedMaterials.get(card.id) || 0;
      providedMaterials.set(card.id, current + 1);
    });

    for (const [cardId, required] of requiredMaterials) {
      const provided = providedMaterials.get(cardId) || 0;
      if (provided < required) {
        return { success: false, failureReason: `Insufficient ${cardId} materials` };
      }
    }

    // Calculate success rate
    let successRate = recipe.fusionCost.successRate;
    
    // Apply catalyst bonuses
    if (recipe.catalysts) {
      for (const catalyst of recipe.catalysts) {
        const available = catalysts[catalyst.itemId] || 0;
        if (available >= catalyst.quantity) {
          successRate = Math.min(1.0, successRate + 0.1); // +10% per catalyst
        }
      }
    }

    // Attempt fusion
    const success = Math.random() < successRate;
    
    if (!success) {
      return { success: false, failureReason: 'Fusion failed due to chance' };
    }

    // Create result card
    const resultCard: BattleCard = this.createCardFromId(
      recipe.resultCard.cardId, 
      recipe.resultCard.guaranteedLevel,
      recipe.resultCard.inheritedStats / 100, // Convert percentage to decimal
      primaryCard
    );

    return { success: true, resultCard };
  }

  private static createCardFromId(
    cardId: string, 
    level: number, 
    inheritanceRatio: number,
    primaryCard: BattleCard
  ): BattleCard {
    // This would fetch from card database and apply inheritance
    const baseStats = {
      attackPower: Math.floor(primaryCard.attackPower * inheritanceRatio),
      health: Math.floor(primaryCard.health * inheritanceRatio),
      defense: Math.floor(primaryCard.defense * inheritanceRatio),
      speed: Math.floor(primaryCard.speed * inheritanceRatio)
    };

    return {
      ...primaryCard,
      id: cardId,
      name: `Fused ${primaryCard.name}`,
      level,
      attackPower: baseStats.attackPower,
      health: baseStats.health,
      maxHealth: baseStats.health,
      defense: baseStats.defense,
      speed: baseStats.speed,
      rarity: this.upgradeRarity(primaryCard.rarity),
      isAnimated: true,
      isHolographic: true
    };
  }

  private static upgradeRarity(currentRarity: RarityTier): RarityTier {
    const rarityProgression = {
      [RarityTier.COMMON]: RarityTier.UNCOMMON,
      [RarityTier.UNCOMMON]: RarityTier.RARE,
      [RarityTier.RARE]: RarityTier.EPIC,
      [RarityTier.EPIC]: RarityTier.LEGENDARY,
      [RarityTier.LEGENDARY]: RarityTier.MYTHIC,
      [RarityTier.MYTHIC]: RarityTier.DIVINE,
      [RarityTier.DIVINE]: RarityTier.DIVINE // Max rarity
    };
    
    return rarityProgression[currentRarity];
  }

  // Evolution preview system
  static getEvolutionPreview(
    currentCard: BattleCard,
    progression: CardProgression,
    targetStage: EvolutionStage,
    evolutionChain: EvolutionChain
  ): EvolutionPreview | null {
    const currentStageData = evolutionChain.stages[progression.currentStage];
    const targetStageData = evolutionChain.stages[targetStage];
    
    if (!currentStageData || !targetStageData) {
      return null;
    }

    const evolutionPath = currentStageData.paths.find(path => path.toStage === targetStage);
    if (!evolutionPath) {
      return null;
    }

    // Create preview of evolved card
    const previewCard: BattleCard = {
      ...currentCard,
      attackPower: currentCard.attackPower + evolutionPath.unlocks.statBoosts.attackPower,
      health: currentCard.health + evolutionPath.unlocks.statBoosts.health,
      maxHealth: currentCard.maxHealth + evolutionPath.unlocks.statBoosts.health,
      defense: currentCard.defense + evolutionPath.unlocks.statBoosts.defense,
      speed: currentCard.speed + evolutionPath.unlocks.statBoosts.speed,
      imageUrl: evolutionPath.unlocks.visualChanges.newImageUrl,
      rarity: evolutionPath.unlocks.rarityUpgrade || currentCard.rarity
    };

    const requirementCheck = this.checkEvolutionRequirements(progression, evolutionPath.requirements);
    
    return {
      currentCard,
      targetStage,
      previewCard,
      requirements: evolutionPath.requirements,
      cost: {
        diamonds: evolutionPath.evolutionCost.diamonds,
        materials: evolutionPath.evolutionCost.materials.length
      },
      canAfford: requirementCheck.canEvolve,
      estimatedTime: evolutionPath.evolutionCost.time
    };
  }

  // Awakening system
  static canPerformAwakening(
    card: BattleCard,
    progression: CardProgression,
    ritual: AwakeningRitual,
    playerMaterials: Record<string, number>,
    playerCards: BattleCard[]
  ): { canAwaken: boolean; missingRequirements: string[] } {
    const missing: string[] = [];

    // Check base requirements
    if (progression.level < ritual.requirements.baseLevel) {
      missing.push(`Need level ${ritual.requirements.baseLevel}`);
    }

    if (progression.currentStage !== ritual.requirements.evolutionStage) {
      missing.push(`Must be at ${ritual.requirements.evolutionStage} stage`);
    }

    // Check elemental harmony
    for (const harmony of ritual.requirements.elementalHarmony) {
      const elementCards = playerCards.filter(c => 
        c.element === harmony.element && 
        c.level >= harmony.minLevel
      );
      
      if (elementCards.length < harmony.cardsRequired) {
        missing.push(`Need ${harmony.cardsRequired - elementCards.length} more ${harmony.element} cards at level ${harmony.minLevel}+`);
      }
    }

    // Check sacred materials
    for (const material of ritual.requirements.sacredMaterials) {
      const available = playerMaterials[material.materialId] || 0;
      if (available < material.quantity) {
        missing.push(`Need ${material.quantity - available} more ${material.materialId}`);
      }
    }

    return {
      canAwaken: missing.length === 0,
      missingRequirements: missing
    };
  }

  // Batch operations for efficiency
  static batchUpdateProgression(
    progressions: CardProgression[],
    battleResults: Array<{
      cardId: string;
      result: 'win' | 'loss' | 'draw';
      duration: number;
      opponentLevel: number;
    }>
  ): CardProgression[] {
    const updatedProgressions = [...progressions];
    
    for (const result of battleResults) {
      const progressionIndex = updatedProgressions.findIndex(p => p.cardId === result.cardId);
      if (progressionIndex === -1) continue;
      
      const progression = updatedProgressions[progressionIndex];
      const expGain = this.calculateExperienceGain(
        progression.level,
        result.result,
        result.duration,
        result.opponentLevel
      );
      
      progression.experience += expGain;
      progression.battlesParticipated += 1;
      
      if (result.result === 'win') {
        progression.victoriesAchieved += 1;
        progression.currentWinStreak += 1;
        progression.bestWinStreak = Math.max(progression.bestWinStreak, progression.currentWinStreak);
      } else {
        progression.currentWinStreak = 0;
      }
      
      progression.lastUsed = Date.now();
      
      // Check for level up
      while (this.canLevelUp(progression)) {
        const leveledUp = this.levelUpCard(progression);
        Object.assign(progression, leveledUp);
      }
    }
    
    return updatedProgressions;
  }
}

// Progression analytics and insights
export class ProgressionAnalytics {
  static calculateProgressionEfficiency(progression: CardProgression): number {
    const battlesPerLevel = progression.battlesParticipated / Math.max(1, progression.level);
    const winRate = progression.victoriesAchieved / Math.max(1, progression.battlesParticipated);
    const timeEfficiency = (Date.now() - progression.createdAt) / (progression.level * 86400000); // days per level
    
    // Lower is better for battles per level and time efficiency
    const efficiency = (winRate * 100) / (battlesPerLevel * timeEfficiency);
    return Math.min(100, Math.max(0, efficiency));
  }

  static getProgressionInsights(progression: CardProgression): Array<{ type: string; message: string; priority: number }> {
    const insights: Array<{ type: string; message: string; priority: number }> = [];
    
    // Win rate insights
    const winRate = progression.victoriesAchieved / Math.max(1, progression.battlesParticipated);
    if (winRate < 0.3) {
      insights.push({
        type: 'warning',
        message: 'Low win rate - consider evolving or improving deck synergy',
        priority: 3
      });
    } else if (winRate > 0.8) {
      insights.push({
        type: 'success',
        message: 'Excellent performance! Ready for higher-tier battles',
        priority: 1
      });
    }
    
    // Evolution readiness
    if (progression.availableEvolutions.length > 0) {
      insights.push({
        type: 'info',
        message: `Evolution available! Can advance to ${progression.availableEvolutions[0]}`,
        priority: 2
      });
    }
    
    // Usage patterns
    const daysSinceLastUse = (Date.now() - progression.lastUsed) / 86400000;
    if (daysSinceLastUse > 7) {
      insights.push({
        type: 'info',
        message: 'Card hasn\'t been used recently - might be outpaced by collection',
        priority: 1
      });
    }
    
    return insights.sort((a, b) => b.priority - a.priority);
  }

  static predictOptimalEvolutionPath(
    progression: CardProgression,
    availablePaths: EvolutionPath[],
    playerStyle: 'aggressive' | 'defensive' | 'balanced'
  ): EvolutionPath | null {
    if (availablePaths.length === 0) return null;
    
    const scored = availablePaths.map(path => {
      let score = 0;
      const boosts = path.unlocks.statBoosts;
      
      switch (playerStyle) {
        case 'aggressive':
          score = boosts.attackPower * 2 + boosts.speed * 1.5;
          break;
        case 'defensive':
          score = boosts.health * 2 + boosts.defense * 1.5;
          break;
        case 'balanced':
          score = boosts.attackPower + boosts.health + boosts.defense + boosts.speed;
          break;
      }
      
      // Factor in cost efficiency
      const costEfficiency = score / (path.evolutionCost.diamonds + path.evolutionCost.materials.length * 100);
      
      return { path, score: score * costEfficiency };
    });
    
    scored.sort((a, b) => b.score - a.score);
    return scored[0].path;
  }
}