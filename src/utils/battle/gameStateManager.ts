import { GameState, Player, BattleCard, GameAction, GamePhase, ElementType, RarityTier } from '../../types/battle/core';

export function createGameState(playerDeck: BattleCard[], opponentDeck: BattleCard[]): GameState {
  const player: Player = {
    id: 'player',
    name: 'Player',
    health: 100,
    maxHealth: 100,
    mana: 3,
    maxMana: 10,
    deck: [...playerDeck],
    hand: [],
    field: [],
    graveyard: [],
    statusEffects: []
  };

  const opponent: Player = {
    id: 'opponent', 
    name: 'AI Opponent',
    health: 100,
    maxHealth: 100,
    mana: 3,
    maxMana: 10,
    deck: [...opponentDeck],
    hand: [],
    field: [],
    graveyard: [],
    statusEffects: []
  };

  // Deal initial hands
  for (let i = 0; i < 5; i++) {
    if (player.deck.length > 0) {
      player.hand.push(player.deck.shift()!);
    }
    if (opponent.deck.length > 0) {
      opponent.hand.push(opponent.deck.shift()!);
    }
  }

  return {
    gameId: `game_${Date.now()}`,
    turn: 1,
    phase: GamePhase.MAIN,
    currentPlayer: 'player',
    player,
    opponent,
    globalEffects: [],
    actionHistory: [],
    turnStartTime: Date.now(),
    turnTimeLimit: 30000
  };
}

export function executePlayerAction(gameState: GameState, action: GameAction): GameState {
  const newState = { ...gameState };
  
  switch (action.type) {
    case 'play_card':
      return executePlayCard(newState, action);
    case 'attack':
      return executeAttack(newState, action);
    case 'use_ability':
      return executeAbility(newState, action);
    case 'end_turn':
      return executeEndTurn(newState);
    default:
      return newState;
  }
}

function executePlayCard(gameState: GameState, action: GameAction): GameState {
  if (!action.card) return gameState;
  
  const currentPlayer = gameState.currentPlayer === 'player' ? gameState.player : gameState.opponent;
  const card = action.card;
  
  // Check mana cost
  if (currentPlayer.mana < card.manaCost) {
    return gameState;
  }
  
  // Check if card is in hand
  const cardIndex = currentPlayer.hand.findIndex(c => c.id === card.id);
  if (cardIndex === -1) {
    return gameState;
  }
  
  // Create new state
  const newState = { ...gameState };
  const newCurrentPlayer = gameState.currentPlayer === 'player' ? newState.player : newState.opponent;
  
  // Pay mana cost
  newCurrentPlayer.mana -= card.manaCost;
  
  // Move card from hand to field
  newCurrentPlayer.hand.splice(cardIndex, 1);
  
  // Set position if provided
  if (action.targetPosition) {
    card.position = action.targetPosition;
  }
  
  // Reset card state for field play
  card.canAttack = false; // Summoning sickness
  card.canUseAbilities = true;
  card.turnsSincePlay = 0;
  
  newCurrentPlayer.field.push(card);
  
  // Apply immediate card effects on play
  const opponent = gameState.currentPlayer === 'player' ? newState.opponent : newState.player;
  
  // Some cards deal immediate damage when played (like spell cards)
  if (card.cardType === 'spell' || card.keywords.includes('immediate')) {
    const damage = Math.floor(card.attackPower * 0.5); // Spells deal reduced immediate damage
    opponent.health -= damage;
    opponent.health = Math.max(0, opponent.health);
  }
  
  // Execute any instant abilities
  if (card.abilities && card.abilities.length > 0) {
    for (const ability of card.abilities) {
      // Execute abilities that don't require specific targets
      if (!ability.targetRequired) {
        try {
          const result = ability.execute(card, undefined, newState);
          
          if (result.damage) {
            opponent.health -= result.damage;
            opponent.health = Math.max(0, opponent.health);
          }
          
          if (result.healing) {
            newCurrentPlayer.health = Math.min(newCurrentPlayer.maxHealth, newCurrentPlayer.health + result.healing);
          }
        } catch (error) {
          // Ability execution failed, continue
        }
      }
    }
  }
  
  // Add to action history
  newState.actionHistory.push({
    ...action,
    timestamp: Date.now()
  });
  
  return newState;
}

function executeAttack(gameState: GameState, action: GameAction): GameState {
  if (!action.card || !action.target) return gameState;
  
  const newState = { ...gameState };
  const attacker = action.card;
  const target = action.target;
  
  // Calculate damage with element interactions
  let damage = attacker.attackPower;
  
  if ('element' in target) {
    // Attacking another card
    const targetCard = target as BattleCard;
    const effectiveness = getElementEffectiveness(attacker.element, targetCard.element);
    damage = Math.floor(damage * effectiveness.multiplier);
    
    // Show element interaction message
    console.log(`🔥 Element Interaction: ${effectiveness.message}`);
    
    // Apply damage
    targetCard.health -= Math.max(0, damage - targetCard.defense);
    
    // Check if target dies
    if (targetCard.health <= 0) {
      // Move to graveyard
      const targetPlayer = gameState.currentPlayer === 'player' ? newState.opponent : newState.player;
      const fieldIndex = targetPlayer.field.findIndex(c => c.id === targetCard.id);
      if (fieldIndex !== -1) {
        targetPlayer.field.splice(fieldIndex, 1);
        targetPlayer.graveyard.push(targetCard);
      }
    }
  } else {
    // Attacking player directly
    const targetPlayer = target as Player;
    targetPlayer.health -= damage;
  }
  
  // Mark attacker as used
  attacker.canAttack = false;
  
  // Add to action history
  newState.actionHistory.push({
    ...action,
    timestamp: Date.now()
  });
  
  return newState;
}

function executeAbility(gameState: GameState, action: GameAction): GameState {
  if (!action.card || !action.abilityId) return gameState;
  
  const newState = { ...gameState };
  const caster = action.card;
  const ability = caster.abilities.find(a => a.id === action.abilityId);
  
  if (!ability) return gameState;
  
  // Check mana cost
  const currentPlayer = gameState.currentPlayer === 'player' ? newState.player : newState.opponent;
  if (currentPlayer.mana < ability.manaCost) {
    return gameState;
  }
  
  // Pay mana cost
  currentPlayer.mana -= ability.manaCost;
  
  // Execute ability
  const result = ability.execute(caster, action.target as BattleCard, newState);
  
  // Apply results
  if (result.damage && action.target && 'health' in action.target) {
    (action.target as BattleCard).health -= result.damage;
  }
  
  if (result.healing && 'health' in caster) {
    caster.health = Math.min(caster.maxHealth, caster.health + result.healing);
  }
  
  // Add status effects
  if (result.statusEffects) {
    if (action.target && 'statusEffects' in action.target) {
      (action.target as BattleCard).statusEffects.push(...result.statusEffects);
    }
  }
  
  // Mark ability as used
  caster.canUseAbilities = false;
  
  // Add to action history
  newState.actionHistory.push({
    ...action,
    timestamp: Date.now()
  });
  
  return newState;
}

function executeEndTurn(gameState: GameState): GameState {
  const newState = { ...gameState };
  
  // Switch current player
  newState.currentPlayer = gameState.currentPlayer === 'player' ? 'opponent' : 'player';
  newState.turn += 1;
  newState.turnStartTime = Date.now();
  
  const currentPlayer = newState.currentPlayer === 'player' ? newState.player : newState.opponent;
  
  // Increase max mana (up to 10)
  if (currentPlayer.maxMana < 10) {
    currentPlayer.maxMana += 1;
  }
  
  // Restore mana
  currentPlayer.mana = currentPlayer.maxMana;
  
  // Draw a card
  if (currentPlayer.deck.length > 0) {
    currentPlayer.hand.push(currentPlayer.deck.shift()!);
  }
  
  // Reset field cards
  currentPlayer.field.forEach(card => {
    card.canAttack = card.turnsSincePlay > 0; // Remove summoning sickness
    card.canUseAbilities = true;
    card.turnsSincePlay += 1;
  });
  
  // Process status effects
  processStatusEffects(currentPlayer);
  
  // Auto-combat: Field cards attack opponent directly
  executeCombatPhase(newState, currentPlayer, currentPlayer === newState.player ? newState.opponent : newState.player);
  
  return newState;
}

function executeCombatPhase(gameState: GameState, attacker: Player, defender: Player): void {
  // Each card on the field attacks the opponent player directly
  for (const card of attacker.field) {
    if (card.canAttack && card.attackPower > 0) {
      let damage = card.attackPower;
      
      // Apply element bonuses against opponent (assuming neutral defense)
      const effectiveness = getElementEffectiveness(card.element, ElementType.NEUTRAL);
      damage = Math.floor(damage * effectiveness.multiplier);
      
      // Deal damage directly to opponent's health
      defender.health -= damage;
      defender.health = Math.max(0, defender.health);
      
      // Mark card as having attacked this turn
      card.canAttack = false;
      
      console.log(`⚔️ ${card.name} attacked for ${damage} damage! ${effectiveness.message}`);
    }
  }
}

function processStatusEffects(player: Player): void {
  // Process player status effects
  player.statusEffects = player.statusEffects.filter(effect => {
    effect.duration -= 1;
    
    // Apply effect
    switch (effect.type) {
      case 'burn':
        player.health -= effect.power;
        break;
      case 'heal':
        player.health = Math.min(player.maxHealth, player.health + effect.power);
        break;
    }
    
    return effect.duration > 0;
  });
  
  // Process field card status effects
  player.field.forEach(card => {
    card.statusEffects = card.statusEffects.filter(effect => {
      effect.duration -= 1;
      
      // Apply effect
      switch (effect.type) {
        case 'burn':
          card.health -= effect.power;
          break;
        case 'heal':
          card.health = Math.min(card.maxHealth, card.health + effect.power);
          break;
        case 'freeze':
          card.canAttack = false;
          break;
      }
      
      return effect.duration > 0;
    });
  });
}

export function checkGameEnd(gameState: GameState): { ended: boolean; winner?: 'player' | 'opponent'; reason?: string } {
  // Check health
  if (gameState.player.health <= 0) {
    return { ended: true, winner: 'opponent', reason: 'Player health reached 0' };
  }
  
  if (gameState.opponent.health <= 0) {
    return { ended: true, winner: 'player', reason: 'Opponent health reached 0' };
  }
  
  // Check deck empty (alternative win condition)
  if (gameState.player.deck.length === 0 && gameState.player.hand.length === 0) {
    return { ended: true, winner: 'opponent', reason: 'Player ran out of cards' };
  }
  
  if (gameState.opponent.deck.length === 0 && gameState.opponent.hand.length === 0) {
    return { ended: true, winner: 'player', reason: 'Opponent ran out of cards' };
  }
  
  return { ended: false };
}

export function getElementEffectiveness(attacker: ElementType, defender: ElementType): ElementEffectivenessResult {
  const interactions: { [key: string]: ElementEffectivenessResult } = {
    // Fire Interactions
    [`${ElementType.FIRE}_${ElementType.EARTH}`]: {
      multiplier: 1.5,
      type: 'strong',
      message: 'Ateş, toprağı eritiyor!'
    },
    [`${ElementType.FIRE}_${ElementType.WATER}`]: {
      multiplier: 0.5,
      type: 'weak',
      message: 'Su, ateşi söndürüyor...'
    },
    [`${ElementType.FIRE}_${ElementType.AIR}`]: {
      multiplier: 1.2,
      type: 'advantage',
      message: 'Ateş, havada güçleniyor!'
    },
    [`${ElementType.FIRE}_${ElementType.SHADOW}`]: {
      multiplier: 1.3,
      type: 'advantage',
      message: 'Ateş, gölgeleri yakıyor!'
    },

    // Water Interactions
    [`${ElementType.WATER}_${ElementType.FIRE}`]: {
      multiplier: 1.5,
      type: 'strong',
      message: 'Su, ateşi söndürüyor!'
    },
    [`${ElementType.WATER}_${ElementType.EARTH}`]: {
      multiplier: 1.3,
      type: 'advantage',
      message: 'Su, toprağı erozyona uğratıyor!'
    },
    [`${ElementType.WATER}_${ElementType.LIGHT}`]: {
      multiplier: 1.2,
      type: 'advantage',
      message: 'Su, ışığı kırıyor!'
    },
    [`${ElementType.WATER}_${ElementType.AIR}`]: {
      multiplier: 0.8,
      type: 'weak',
      message: 'Hava, suyu dağıtıyor...'
    },

    // Earth Interactions
    [`${ElementType.EARTH}_${ElementType.AIR}`]: {
      multiplier: 1.5,
      type: 'strong',
      message: 'Toprak, havayı bloke ediyor!'
    },
    [`${ElementType.EARTH}_${ElementType.WATER}`]: {
      multiplier: 0.7,
      type: 'weak',
      message: 'Su, toprağı yumuşatıyor...'
    },
    [`${ElementType.EARTH}_${ElementType.FIRE}`]: {
      multiplier: 0.5,
      type: 'weak',
      message: 'Ateş, toprağı eritiyor...'
    },
    [`${ElementType.EARTH}_${ElementType.SHADOW}`]: {
      multiplier: 1.2,
      type: 'advantage',
      message: 'Toprak, gölgelere dayanıklı!'
    },

    // Air Interactions
    [`${ElementType.AIR}_${ElementType.FIRE}`]: {
      multiplier: 0.8,
      type: 'weak',
      message: 'Ateş, havayı yakıyor...'
    },
    [`${ElementType.AIR}_${ElementType.EARTH}`]: {
      multiplier: 0.5,
      type: 'weak',
      message: 'Toprak, havayı durdururuyor...'
    },
    [`${ElementType.AIR}_${ElementType.WATER}`]: {
      multiplier: 1.3,
      type: 'advantage',
      message: 'Hava, suyu dağıtıyor!'
    },
    [`${ElementType.AIR}_${ElementType.LIGHT}`]: {
      multiplier: 1.2,
      type: 'advantage',
      message: 'Hava, ışığı yayıyor!'
    },

    // Light Interactions
    [`${ElementType.LIGHT}_${ElementType.SHADOW}`]: {
      multiplier: 2.0,
      type: 'super_effective',
      message: 'IŞIK, gölgeleri yok ediyor!'
    },
    [`${ElementType.LIGHT}_${ElementType.FIRE}`]: {
      multiplier: 1.1,
      type: 'synergy',
      message: 'Işık ve ateş sinerjisi!'
    },
    [`${ElementType.LIGHT}_${ElementType.WATER}`]: {
      multiplier: 0.9,
      type: 'neutral',
      message: 'Su, ışığı büküyor...'
    },

    // Shadow Interactions
    [`${ElementType.SHADOW}_${ElementType.LIGHT}`]: {
      multiplier: 2.0,
      type: 'super_effective',
      message: 'GÖLGELER, ışığı yutuyor!'
    },
    [`${ElementType.SHADOW}_${ElementType.EARTH}`]: {
      multiplier: 1.2,
      type: 'advantage',
      message: 'Gölgeler, toprakta saklanıyor!'
    },
    [`${ElementType.SHADOW}_${ElementType.AIR}`]: {
      multiplier: 1.3,
      type: 'advantage',
      message: 'Gölgeler, havada uçuyor!'
    },

    // Neutral Interactions
    [`${ElementType.NEUTRAL}_${ElementType.FIRE}`]: {
      multiplier: 1.0,
      type: 'neutral',
      message: 'Nötr güç dengede!'
    },
    [`${ElementType.NEUTRAL}_${ElementType.WATER}`]: {
      multiplier: 1.0,
      type: 'neutral',
      message: 'Nötr güç dengede!'
    },
    [`${ElementType.NEUTRAL}_${ElementType.EARTH}`]: {
      multiplier: 1.0,
      type: 'neutral',
      message: 'Nötr güç dengede!'
    },
    [`${ElementType.NEUTRAL}_${ElementType.AIR}`]: {
      multiplier: 1.0,
      type: 'neutral',
      message: 'Nötr güç dengede!'
    },
    [`${ElementType.NEUTRAL}_${ElementType.LIGHT}`]: {
      multiplier: 1.0,
      type: 'neutral',
      message: 'Nötr güç dengede!'
    },
    [`${ElementType.NEUTRAL}_${ElementType.SHADOW}`]: {
      multiplier: 1.0,
      type: 'neutral',
      message: 'Nötr güç dengede!'
    },
  };
  
  const key = `${attacker}_${defender}`;
  return interactions[key] || {
    multiplier: 1.0,
    type: 'neutral',
    message: 'Elementler dengede!'
  };
}

interface ElementEffectivenessResult {
  multiplier: number;
  type: 'super_effective' | 'strong' | 'advantage' | 'synergy' | 'neutral' | 'weak';
  message: string;
}