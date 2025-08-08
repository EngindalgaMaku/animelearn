import { GameState, GameAction, AIDifficulty, AIPersonality } from '../../types/battle/core';
import { createAdvancedAI } from './advancedAI';

// Simple AI opponent implementation that integrates with the advanced AI system
let currentAI: any = null;

export async function getAIAction(
  gameState: GameState, 
  difficulty: AIDifficulty = AIDifficulty.INTERMEDIATE,
  personality: AIPersonality = AIPersonality.BALANCED
): Promise<GameAction | null> {
  try {
    // Initialize AI if not exists or difficulty changed
    if (!currentAI) {
      currentAI = createAdvancedAI(difficulty, personality);
    }

    // Get AI decision
    const aiDecision = await currentAI.makeDecision(gameState);
    
    if (aiDecision && aiDecision.action) {
      console.log(`🤖 AI Decision: ${aiDecision.reasoning} (Confidence: ${(aiDecision.confidence * 100).toFixed(1)}%)`);
      return aiDecision.action;
    }

    // Fallback: simple end turn if no valid action found
    return {
      type: 'end_turn',
      playerId: 'opponent',
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('AI action error:', error);
    
    // Emergency fallback: just end turn
    return {
      type: 'end_turn',
      playerId: 'opponent', 
      timestamp: Date.now()
    };
  }
}

// Helper function to reset AI (useful for difficulty changes)
export function resetAI(): void {
  currentAI = null;
}

// Get AI difficulty name for display
export function getAIDifficultyName(difficulty: AIDifficulty): string {
  switch (difficulty) {
    case AIDifficulty.NOVICE: return 'Çaylak';
    case AIDifficulty.BEGINNER: return 'Başlangıç';
    case AIDifficulty.INTERMEDIATE: return 'Orta';
    case AIDifficulty.ADVANCED: return 'İleri';
    case AIDifficulty.EXPERT: return 'Uzman';
    case AIDifficulty.MASTER: return 'Usta';
    default: return 'Bilinmeyen';
  }
}

// Get AI personality name for display
export function getAIPersonalityName(personality: AIPersonality): string {
  switch (personality) {
    case AIPersonality.AGGRESSIVE: return 'Saldırgan';
    case AIPersonality.DEFENSIVE: return 'Savunmacı';
    case AIPersonality.BALANCED: return 'Dengeli';
    case AIPersonality.TACTICAL: return 'Taktiksel';
    case AIPersonality.CHAOTIC: return 'Kaotik';
    default: return 'Bilinmeyen';
  }
}