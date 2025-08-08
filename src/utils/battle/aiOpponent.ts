import { GameState, BattleCard, GameAction, AIDifficulty, AIPersonality, Player } from '../../types/battle/core';

interface AIDecision {
  action: GameAction;
  priority: number;
  reasoning: string;
}

export async function getAIAction(
  gameState: GameState,
  difficulty: AIDifficulty = AIDifficulty.INTERMEDIATE,
  personality: AIPersonality = AIPersonality.BALANCED
): Promise<GameAction | null> {
  
  if (gameState.currentPlayer !== 'opponent') {
    return null;
  }

  const ai = gameState.opponent;
  const player = gameState.player;
  
  // Get all possible actions
  const possibleActions = getAllPossibleActions(gameState);
  
  if (possibleActions.length === 0) {
    return {
      type: 'end_turn',
      playerId: ai.id,
      timestamp: Date.now()
    };
  }

  // Evaluate each action based on AI difficulty and personality
  const evaluatedActions = possibleActions.map(action => ({
    action,
    score: evaluateAction(action, gameState, difficulty, personality)
  }));

  // Sort by score (highest first)
  evaluatedActions.sort((a, b) => b.score - a.score);

  // Add some randomness based on difficulty
  const randomnessFactor = getDifficultyRandomness(difficulty);
  const selectedIndex = Math.floor(Math.random() * Math.min(3, evaluatedActions.length) * randomnessFactor);
  
  return evaluatedActions[selectedIndex]?.action || null;
}

function getAllPossibleActions(gameState: GameState): GameAction[] {
  const actions: GameAction[] = [];
  const ai = gameState.opponent;
  const player = gameState.player;

  // Play card actions
  ai.hand.forEach(card => {
    if (ai.mana >= card.manaCost) {
      actions.push({
        type: 'play_card',
        playerId: ai.id,
        timestamp: Date.now(),
        card: card
      });
    }
  });

  // Attack actions
  ai.field.forEach(attacker => {
    if (attacker.canAttack) {
      // Attack player directly
      actions.push({
        type: 'attack',
        playerId: ai.id,
        timestamp: Date.now(),
        card: attacker,
        target: player
      });

      // Attack player's creatures
      player.field.forEach(target => {
        actions.push({
          type: 'attack',
          playerId: ai.id,
          timestamp: Date.now(),
          card: attacker,
          target: target
        });
      });
    }
  });

  // Ability actions
  ai.field.forEach(caster => {
    if (caster.canUseAbilities) {
      caster.abilities.forEach(ability => {
        if (ai.mana >= ability.manaCost) {
          if (ability.targetRequired) {
            // Target player's creatures
            player.field.forEach(target => {
              actions.push({
                type: 'use_ability',
                playerId: ai.id,
                timestamp: Date.now(),
                card: caster,
                target: target,
                abilityId: ability.id
              });
            });
          } else {
            // Self-targeting or no target required
            actions.push({
              type: 'use_ability',
              playerId: ai.id,
              timestamp: Date.now(),
              card: caster,
              abilityId: ability.id
            });
          }
        }
      });
    }
  });

  return actions;
}

function evaluateAction(
  action: GameAction, 
  gameState: GameState, 
  difficulty: AIDifficulty,
  personality: AIPersonality
): number {
  let score = 0;
  const ai = gameState.opponent;
  const player = gameState.player;

  switch (action.type) {
    case 'play_card':
      score = evaluatePlayCard(action, gameState, personality);
      break;
    case 'attack':
      score = evaluateAttack(action, gameState, personality);
      break;
    case 'use_ability':
      score = evaluateAbility(action, gameState, personality);
      break;
  }

  // Adjust score based on difficulty
  score *= getDifficultyMultiplier(difficulty);

  // Add personality modifications
  score = applyPersonalityModifier(score, action, personality, gameState);

  return score;
}

function evaluatePlayCard(action: GameAction, gameState: GameState, personality: AIPersonality): number {
  if (!action.card) return 0;

  const card = action.card;
  let score = 0;

  // Base value from card stats
  score += card.attackPower * 2;
  score += card.health * 1.5;
  score += card.defense;

  // Mana efficiency
  const manaEfficiency = (card.attackPower + card.health) / card.manaCost;
  score += manaEfficiency * 10;

  // Field presence value
  if (gameState.opponent.field.length < 3) {
    score += 15; // Encourage board presence
  }

  // Rarity bonus (better cards usually worth playing)
  const rarityBonus = {
    'common': 0,
    'uncommon': 5,
    'rare': 10,
    'epic': 15,
    'legendary': 20,
    'mythic': 25,
    'divine': 30
  };
  score += rarityBonus[card.rarity] || 0;

  return score;
}

function evaluateAttack(action: GameAction, gameState: GameState, personality: AIPersonality): number {
  if (!action.card || !action.target) return 0;

  const attacker = action.card;
  let score = 0;

  if ('health' in action.target) {
    // Attacking a creature
    const target = action.target as BattleCard;
    
    // Damage value
    score += attacker.attackPower * 3;
    
    // Trade evaluation
    if (attacker.attackPower >= target.health) {
      score += 20; // Can kill target
      
      if (target.attackPower < attacker.health) {
        score += 15; // Favorable trade
      }
    }
    
    // Remove threats
    if (target.attackPower > 5) {
      score += 10; // Remove dangerous creatures
    }
  } else {
    // Attacking player directly
    const damage = attacker.attackPower;
    score += damage * 4; // Direct damage is valuable
    
    // Lethal check
    if (damage >= gameState.player.health) {
      score += 1000; // Winning move!
    }
    
    // Pressure bonus
    if (gameState.player.health <= 20) {
      score += 25; // Apply pressure when low
    }
  }

  return score;
}

function evaluateAbility(action: GameAction, gameState: GameState, personality: AIPersonality): number {
  if (!action.card || !action.abilityId) return 0;

  const caster = action.card;
  const ability = caster.abilities.find(a => a.id === action.abilityId);
  
  if (!ability) return 0;

  let score = 0;

  // Base ability value
  score += 20;

  // Mana efficiency for abilities
  const efficiency = 30 / ability.manaCost;
  score += efficiency;

  // Target value
  if (action.target && 'health' in action.target) {
    const target = action.target as BattleCard;
    
    // Damage abilities
    if (ability.name.toLowerCase().includes('damage') || 
        ability.name.toLowerCase().includes('burn') ||
        ability.name.toLowerCase().includes('strike')) {
      score += target.health * 2;
      
      if (target.attackPower > 5) {
        score += 15; // Remove threats
      }
    }
    
    // Control abilities
    if (ability.name.toLowerCase().includes('freeze') ||
        ability.name.toLowerCase().includes('stun') ||
        ability.name.toLowerCase().includes('silence')) {
      score += target.attackPower * 1.5;
    }
  }

  return score;
}

function getDifficultyMultiplier(difficulty: AIDifficulty): number {
  const multipliers = {
    'novice': 0.3,
    'beginner': 0.5,
    'intermediate': 0.7,
    'advanced': 0.9,
    'expert': 1.0,
    'master': 1.2
  };
  return multipliers[difficulty] || 0.7;
}

function getDifficultyRandomness(difficulty: AIDifficulty): number {
  const randomness = {
    'novice': 0.9,
    'beginner': 0.8,
    'intermediate': 0.6,
    'advanced': 0.4,
    'expert': 0.2,
    'master': 0.1
  };
  return randomness[difficulty] || 0.5;
}

function applyPersonalityModifier(
  score: number, 
  action: GameAction, 
  personality: AIPersonality,
  gameState: GameState
): number {
  let modifier = 1.0;

  switch (personality) {
    case 'aggressive':
      if (action.type === 'attack') {
        modifier = 1.3;
      } else if (action.type === 'play_card' && action.card?.attackPower && action.card.attackPower > 4) {
        modifier = 1.2;
      }
      break;

    case 'defensive':
      if (action.type === 'play_card' && action.card?.health && action.card.health > 4) {
        modifier = 1.2;
      } else if (action.type === 'attack' && 'health' in action.target!) {
        modifier = 1.1; // Prefer creature combat over face damage
      }
      break;

    case 'tactical':
      if (action.type === 'use_ability') {
        modifier = 1.4;
      } else if (action.type === 'play_card' && action.card?.abilities.length) {
        modifier = 1.2;
      }
      break;

    case 'chaotic':
      // Random modifier for unpredictability
      modifier = 0.5 + Math.random();
      break;

    case 'balanced':
    default:
      // No modification for balanced personality
      break;
  }

  return score * modifier;
}

// AI Difficulty Profiles
export const AI_PROFILES = {
  novice: {
    difficulty: 'novice' as AIDifficulty,
    personality: 'chaotic' as AIPersonality,
    description: 'New to the game, makes random plays',
    mistakeRate: 0.4,
    thinkingTime: 500
  },
  beginner: {
    difficulty: 'beginner' as AIDifficulty,
    personality: 'balanced' as AIPersonality,
    description: 'Learning the basics, occasionally misplays',
    mistakeRate: 0.25,
    thinkingTime: 1000
  },
  intermediate: {
    difficulty: 'intermediate' as AIDifficulty,
    personality: 'tactical' as AIPersonality,
    description: 'Understands combos and synergies',
    mistakeRate: 0.15,
    thinkingTime: 1500
  },
  advanced: {
    difficulty: 'advanced' as AIDifficulty,
    personality: 'aggressive' as AIPersonality,
    description: 'Plays aggressively with good card evaluation',
    mistakeRate: 0.1,
    thinkingTime: 2000
  },
  expert: {
    difficulty: 'expert' as AIDifficulty,
    personality: 'defensive' as AIPersonality,
    description: 'Masters defensive play and resource management',
    mistakeRate: 0.05,
    thinkingTime: 2500
  },
  master: {
    difficulty: 'master' as AIDifficulty,
    personality: 'balanced' as AIPersonality,
    description: 'Perfect play with adaptive strategies',
    mistakeRate: 0.02,
    thinkingTime: 3000
  }
};