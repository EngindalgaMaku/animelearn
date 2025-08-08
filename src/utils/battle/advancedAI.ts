import { GameState, BattleCard, Player, AIDifficulty, AIPersonality, GameAction, ElementType } from '../../types/battle/core';
import { getElementEffectiveness } from './gameStateManager';
import { checkAbilityCombo } from './cardAbilities';

export interface AIStrategy {
  difficulty: AIDifficulty;
  personality: AIPersonality;
  adaptiveLearning: boolean;
  mistakeRate: number;
  reactionTime: number;
  playStyle: AIPlayStyle;
}

export interface AIPlayStyle {
  aggression: number; // 0-100
  defense: number; // 0-100
  efficiency: number; // 0-100
  riskTaking: number; // 0-100
  comboFocus: number; // 0-100
}

export interface AIDecision {
  action: GameAction;
  confidence: number;
  reasoning: string;
  alternativeActions?: GameAction[];
}

// Advanced AI Strategy Class
export class AdvancedAI {
  private strategy: AIStrategy;
  private gameHistory: GameAction[] = [];
  private playerPatterns: PlayerPattern[] = [];
  private adaptationCounter: number = 0;

  constructor(difficulty: AIDifficulty, personality: AIPersonality) {
    this.strategy = this.createStrategy(difficulty, personality);
  }

  private createStrategy(difficulty: AIDifficulty, personality: AIPersonality): AIStrategy {
    const baseStrategy: AIStrategy = {
      difficulty,
      personality,
      adaptiveLearning: difficulty !== AIDifficulty.NOVICE,
      mistakeRate: this.getMistakeRate(difficulty),
      reactionTime: this.getReactionTime(difficulty),
      playStyle: this.getPlayStyle(personality, difficulty)
    };

    return baseStrategy;
  }

  private getMistakeRate(difficulty: AIDifficulty): number {
    switch (difficulty) {
      case AIDifficulty.NOVICE: return 0.3;
      case AIDifficulty.BEGINNER: return 0.2;
      case AIDifficulty.INTERMEDIATE: return 0.1;
      case AIDifficulty.ADVANCED: return 0.05;
      case AIDifficulty.EXPERT: return 0.02;
      case AIDifficulty.MASTER: return 0.01;
      default: return 0.1;
    }
  }

  private getReactionTime(difficulty: AIDifficulty): number {
    switch (difficulty) {
      case AIDifficulty.NOVICE: return 3000;
      case AIDifficulty.BEGINNER: return 2500;
      case AIDifficulty.INTERMEDIATE: return 2000;
      case AIDifficulty.ADVANCED: return 1500;
      case AIDifficulty.EXPERT: return 1000;
      case AIDifficulty.MASTER: return 500;
      default: return 2000;
    }
  }

  private getPlayStyle(personality: AIPersonality, difficulty: AIDifficulty): AIPlayStyle {
    const skillBonus = this.getDifficultyBonus(difficulty);
    
    switch (personality) {
      case AIPersonality.AGGRESSIVE:
        return {
          aggression: 80 + skillBonus,
          defense: 20 + skillBonus,
          efficiency: 70 + skillBonus,
          riskTaking: 90 + skillBonus,
          comboFocus: 60 + skillBonus
        };
      case AIPersonality.DEFENSIVE:
        return {
          aggression: 30 + skillBonus,
          defense: 90 + skillBonus,
          efficiency: 80 + skillBonus,
          riskTaking: 20 + skillBonus,
          comboFocus: 70 + skillBonus
        };
      case AIPersonality.BALANCED:
        return {
          aggression: 60 + skillBonus,
          defense: 60 + skillBonus,
          efficiency: 75 + skillBonus,
          riskTaking: 50 + skillBonus,
          comboFocus: 65 + skillBonus
        };
      case AIPersonality.TACTICAL:
        return {
          aggression: 50 + skillBonus,
          defense: 70 + skillBonus,
          efficiency: 95 + skillBonus,
          riskTaking: 40 + skillBonus,
          comboFocus: 90 + skillBonus
        };
      case AIPersonality.CHAOTIC:
        return {
          aggression: 70 + skillBonus,
          defense: 40 + skillBonus,
          efficiency: 50 + skillBonus,
          riskTaking: 95 + skillBonus,
          comboFocus: 30 + skillBonus
        };
      default:
        return {
          aggression: 50,
          defense: 50,
          efficiency: 50,
          riskTaking: 50,
          comboFocus: 50
        };
    }
  }

  private getDifficultyBonus(difficulty: AIDifficulty): number {
    switch (difficulty) {
      case AIDifficulty.NOVICE: return 0;
      case AIDifficulty.BEGINNER: return 5;
      case AIDifficulty.INTERMEDIATE: return 10;
      case AIDifficulty.ADVANCED: return 15;
      case AIDifficulty.EXPERT: return 20;
      case AIDifficulty.MASTER: return 25;
      default: return 10;
    }
  }

  public async makeDecision(gameState: GameState): Promise<AIDecision> {
    // Simulate thinking time based on difficulty
    await this.simulateThinking();

    // Analyze game state
    const gameAnalysis = this.analyzeGameState(gameState);
    
    // Generate possible actions
    const possibleActions = this.generatePossibleActions(gameState);
    
    // Evaluate each action
    const evaluatedActions = possibleActions.map(action => ({
      action,
      score: this.evaluateAction(action, gameState, gameAnalysis)
    }));

    // Sort by score
    evaluatedActions.sort((a, b) => b.score - a.score);

    // Apply difficulty-based mistakes
    const finalAction = this.applyMistakes(evaluatedActions);

    // Learn from decision
    if (this.strategy.adaptiveLearning) {
      this.learnFromDecision(finalAction.action, gameState);
    }

    return {
      action: finalAction.action,
      confidence: finalAction.score / 100,
      reasoning: this.generateReasoning(finalAction.action, gameState),
      alternativeActions: evaluatedActions.slice(1, 3).map(ea => ea.action)
    };
  }

  private async simulateThinking(): Promise<void> {
    const thinkingTime = this.strategy.reactionTime + Math.random() * 1000;
    return new Promise(resolve => setTimeout(resolve, thinkingTime));
  }

  private analyzeGameState(gameState: GameState): GameAnalysis {
    const player = gameState.player;
    const opponent = gameState.opponent;

    return {
      healthAdvantage: opponent.health - player.health,
      manaAdvantage: opponent.mana - player.mana,
      fieldAdvantage: opponent.field.length - player.field.length,
      handAdvantage: opponent.hand.length - player.hand.length,
      threatLevel: this.calculateThreatLevel(player),
      opportunities: this.findOpportunities(gameState),
      gamePhase: this.determineGamePhase(gameState)
    };
  }

  private calculateThreatLevel(player: Player): number {
    let threat = 0;
    
    // Calculate total field power
    const fieldPower = player.field.reduce((sum, card) => sum + card.attackPower, 0);
    threat += fieldPower * 2;
    
    // High mana = potential for big plays
    threat += player.mana * 3;
    
    // Many cards in hand = more options
    threat += player.hand.length * 5;
    
    return Math.min(threat, 100);
  }

  private findOpportunities(gameState: GameState): Opportunity[] {
    const opportunities: Opportunity[] = [];
    const opponent = gameState.opponent;
    const player = gameState.player;

    // Check for combo opportunities
    for (let i = 0; i < opponent.hand.length - 1; i++) {
      for (let j = i + 1; j < opponent.hand.length; j++) {
        const combo = checkAbilityCombo(opponent.hand[i], opponent.hand[j]);
        if (combo) {
          opportunities.push({
            type: 'combo',
            cards: [opponent.hand[i], opponent.hand[j]],
            value: 30,
            description: 'Combo opportunity available'
          });
        }
      }
    }

    // Check for element advantage opportunities
    opponent.hand.forEach(card => {
      player.field.forEach(playerCard => {
        const effectiveness = getElementEffectiveness(card.element, playerCard.element);
        if (effectiveness.multiplier > 1.2) {
          opportunities.push({
            type: 'element_advantage',
            cards: [card],
            value: 20 * effectiveness.multiplier,
            description: `Element advantage: ${effectiveness.message}`
          });
        }
      });
    });

    // Check for direct damage opportunities
    if (player.health <= 20) {
      opportunities.push({
        type: 'lethal',
        cards: [],
        value: 100,
        description: 'Potential lethal damage available'
      });
    }

    return opportunities;
  }

  private determineGamePhase(gameState: GameState): 'early' | 'mid' | 'late' {
    if (gameState.turn <= 3) return 'early';
    if (gameState.turn <= 8) return 'mid';
    return 'late';
  }

  private generatePossibleActions(gameState: GameState): GameAction[] {
    const actions: GameAction[] = [];
    const opponent = gameState.opponent;

    // Generate card play actions
    opponent.hand.forEach(card => {
      if (card.manaCost <= opponent.mana) {
        actions.push({
          type: 'play_card',
          playerId: 'opponent',
          timestamp: Date.now(),
          card
        });
      }
    });

    // Generate attack actions
    opponent.field.forEach(card => {
      if (card.canAttack) {
        // Attack player directly
        actions.push({
          type: 'attack',
          playerId: 'opponent',
          timestamp: Date.now(),
          card,
          target: gameState.player
        });

        // Attack player's field cards
        gameState.player.field.forEach(target => {
          actions.push({
            type: 'attack',
            playerId: 'opponent',
            timestamp: Date.now(),
            card,
            target
          });
        });
      }
    });

    // Generate ability actions
    opponent.field.forEach(card => {
      if (card.canUseAbilities && card.abilities.length > 0) {
        card.abilities.forEach(ability => {
          if (ability.manaCost <= opponent.mana) {
            actions.push({
              type: 'use_ability',
              playerId: 'opponent',
              timestamp: Date.now(),
              card,
              abilityId: ability.id
            });
          }
        });
      }
    });

    // End turn action
    actions.push({
      type: 'end_turn',
      playerId: 'opponent',
      timestamp: Date.now()
    });

    return actions;
  }

  private evaluateAction(action: GameAction, gameState: GameState, analysis: GameAnalysis): number {
    let score = 50; // Base score

    switch (action.type) {
      case 'play_card':
        score += this.evaluateCardPlay(action, gameState, analysis);
        break;
      case 'attack':
        score += this.evaluateAttack(action, gameState, analysis);
        break;
      case 'use_ability':
        score += this.evaluateAbility(action, gameState, analysis);
        break;
      case 'end_turn':
        score += this.evaluateEndTurn(gameState, analysis);
        break;
    }

    // Apply personality modifiers
    score = this.applyPersonalityModifiers(score, action, analysis);

    return Math.max(0, Math.min(100, score));
  }

  private evaluateCardPlay(action: GameAction, gameState: GameState, analysis: GameAnalysis): number {
    if (!action.card) return 0;

    let score = 0;
    const card = action.card;

    // Basic value based on stats
    score += card.attackPower * 2;
    score += card.health;
    score += card.defense;

    // Mana efficiency
    const manaEfficiency = (card.attackPower + card.health) / Math.max(1, card.manaCost);
    score += manaEfficiency * 5;

    // Game phase considerations
    if (analysis.gamePhase === 'early' && card.manaCost <= 3) score += 10;
    if (analysis.gamePhase === 'late' && card.manaCost >= 5) score += 15;

    // Threat response
    if (analysis.threatLevel > 70 && card.defense > 3) score += 20;

    return score;
  }

  private evaluateAttack(action: GameAction, gameState: GameState, analysis: GameAnalysis): number {
    if (!action.card || !action.target) return 0;

    let score = 0;
    const attacker = action.card;

    if ('health' in action.target) {
      // Attacking player directly
      score += attacker.attackPower * 3;
      
      // Prioritize if player is low on health
      if (action.target.health <= 30) score += 30;
      if (action.target.health <= 15) score += 50; // Lethal range
    } else {
      // Attacking a card
      const target = action.target as BattleCard;
      const effectiveness = getElementEffectiveness(attacker.element, target.element);
      
      score += attacker.attackPower * effectiveness.multiplier * 2;
      
      // Bonus for destroying enemy card
      if (attacker.attackPower >= target.health) score += 25;
      
      // Trade evaluation
      if (target.attackPower >= attacker.health) {
        // Unfavorable trade
        score -= 15;
      }
    }

    return score;
  }

  private evaluateAbility(action: GameAction, gameState: GameState, analysis: GameAnalysis): number {
    if (!action.card || !action.abilityId) return 0;

    let score = 20; // Base ability value

    // High-value abilities in specific situations
    if (analysis.threatLevel > 80) score += 30; // Defensive abilities
    if (analysis.healthAdvantage < -20) score += 25; // Aggressive abilities

    return score;
  }

  private evaluateEndTurn(gameState: GameState, analysis: GameAnalysis): number {
    let score = 10; // Base end turn value

    // Prefer ending turn if no good plays available
    if (gameState.opponent.mana < 3 && gameState.opponent.hand.length === 0) {
      score += 40;
    }

    // Don't end turn if there are high-value opportunities
    if (analysis.opportunities.some(opp => opp.value > 50)) {
      score -= 30;
    }

    return score;
  }

  private applyPersonalityModifiers(score: number, action: GameAction, analysis: GameAnalysis): number {
    const style = this.strategy.playStyle;

    switch (action.type) {
      case 'attack':
        score += (style.aggression - 50) * 0.5;
        break;
      case 'play_card':
        if (action.card && action.card.defense > action.card.attackPower) {
          score += (style.defense - 50) * 0.3;
        } else {
          score += (style.aggression - 50) * 0.3;
        }
        break;
      case 'use_ability':
        score += (style.efficiency - 50) * 0.4;
        break;
    }

    return score;
  }

  private applyMistakes(evaluatedActions: { action: GameAction; score: number }[]): { action: GameAction; score: number } {
    if (Math.random() < this.strategy.mistakeRate) {
      // Make a mistake - choose a suboptimal action
      const mistakeIndex = Math.min(
        evaluatedActions.length - 1,
        Math.floor(Math.random() * 3) + 1
      );
      return evaluatedActions[mistakeIndex] || evaluatedActions[0];
    }

    return evaluatedActions[0];
  }

  private learnFromDecision(action: GameAction, gameState: GameState): void {
    this.gameHistory.push(action);
    this.adaptationCounter++;

    // Adapt strategy every 10 moves
    if (this.adaptationCounter >= 10) {
      this.adaptStrategy(gameState);
      this.adaptationCounter = 0;
    }
  }

  private adaptStrategy(gameState: GameState): void {
    // Simple adaptation: adjust aggression based on game state
    if (gameState.opponent.health < gameState.player.health) {
      this.strategy.playStyle.aggression = Math.min(100, this.strategy.playStyle.aggression + 5);
    } else {
      this.strategy.playStyle.defense = Math.min(100, this.strategy.playStyle.defense + 5);
    }
  }

  private generateReasoning(action: GameAction, gameState: GameState): string {
    switch (action.type) {
      case 'play_card':
        return `Played ${action.card?.name} to strengthen field position`;
      case 'attack':
        if (action.target && 'health' in action.target) {
          return `Attacked player directly for ${action.card?.attackPower} damage`;
        } else if (action.target && 'name' in action.target) {
          const targetCard = action.target as BattleCard;
          return `Attacked ${targetCard.name} for tactical advantage`;
        } else {
          return `Attacked enemy target for tactical advantage`;
        }
      case 'use_ability':
        return `Used ${action.card?.name}'s ability for strategic benefit`;
      case 'end_turn':
        return `Ended turn to draw cards and gain mana`;
      default:
        return 'Made strategic decision';
    }
  }
}

// Supporting interfaces
interface GameAnalysis {
  healthAdvantage: number;
  manaAdvantage: number;
  fieldAdvantage: number;
  handAdvantage: number;
  threatLevel: number;
  opportunities: Opportunity[];
  gamePhase: 'early' | 'mid' | 'late';
}

interface Opportunity {
  type: 'combo' | 'element_advantage' | 'lethal' | 'defensive';
  cards: BattleCard[];
  value: number;
  description: string;
}

interface PlayerPattern {
  actionType: string;
  frequency: number;
  context: string;
  success: boolean;
}

// Factory function for creating AI instances
export function createAdvancedAI(difficulty: AIDifficulty, personality: AIPersonality): AdvancedAI {
  return new AdvancedAI(difficulty, personality);
}