"use client";

import { GameState, GameAction, BattleCard, Player, GameResult } from '../../types/battle/core';

export interface BattleReplay {
  id: string;
  battleId: string;
  playerName: string;
  opponentName: string;
  gameResult: GameResult;
  startTime: number;
  endTime: number;
  duration: number;
  actions: ReplayAction[];
  gameStates: GameStateSnapshot[];
  metadata: ReplayMetadata;
  tags: string[];
  isPublic: boolean;
  likes: number;
  views: number;
}

export interface ReplayAction extends GameAction {
  gameStateIndex: number; // Index of the game state after this action
  commentary?: string;
  isKeyMoment?: boolean;
  timestamp: number;
}

export interface GameStateSnapshot {
  index: number;
  timestamp: number;
  gameState: GameState;
  actionIndex: number; // Index of the action that led to this state
}

export interface ReplayMetadata {
  version: string;
  playerDecks: {
    player: BattleCard[];
    opponent: BattleCard[];
  };
  finalStats: {
    player: PlayerBattleStats;
    opponent: PlayerBattleStats;
  };
  keyMoments: KeyMoment[];
  analysis: BattleAnalysis;
}

export interface PlayerBattleStats {
  damageDealt: number;
  damageReceived: number;
  cardsPlayed: number;
  abilitiesUsed: number;
  combosExecuted: number;
  avgTurnTime: number;
  maxManaReached: number;
  cardsDrawn: number;
  elementsUsed: string[];
}

export interface KeyMoment {
  timestamp: number;
  actionIndex: number;
  type: 'game_start' | 'first_blood' | 'comeback' | 'decisive_blow' | 'combo' | 'game_end';
  title: string;
  description: string;
  significance: number; // 1-10 scale
}

export interface BattleAnalysis {
  winCondition: string;
  criticalMistakes: CriticalMistake[];
  bestPlays: BestPlay[];
  deckPerformance: DeckAnalysis;
  elementEffectiveness: ElementEffectiveness[];
  suggestions: string[];
}

export interface CriticalMistake {
  actionIndex: number;
  timestamp: number;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'game_changing';
  suggestedAction: string;
}

export interface BestPlay {
  actionIndex: number;
  timestamp: number;
  description: string;
  skillLevel: 'good' | 'great' | 'brilliant' | 'legendary';
  impact: number;
}

export interface DeckAnalysis {
  cardsUsed: number;
  cardEfficiency: number;
  manaCurve: { [cost: number]: number };
  elementDistribution: { [element: string]: number };
  unusedPotential: string[];
}

export interface ElementEffectiveness {
  element: string;
  damageDealt: number;
  damageReceived: number;
  effectiveness: number;
  recommendation: string;
}

export interface ReplayFilters {
  dateRange?: { start: number; end: number };
  result?: 'win' | 'loss' | 'draw';
  opponent?: string;
  duration?: { min: number; max: number };
  elements?: string[];
  tags?: string[];
  minRating?: number;
  maxRating?: number;
}

export interface ReplaySearchOptions {
  query?: string;
  filters?: ReplayFilters;
  sortBy?: 'date' | 'duration' | 'rating' | 'likes' | 'views';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

class BattleReplayManager {
  private replays: Map<string, BattleReplay> = new Map();
  private currentRecording: RecordingSession | null = null;
  private analysisEngine: BattleAnalysisEngine;

  constructor() {
    this.analysisEngine = new BattleAnalysisEngine();
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('battleReplays');
      if (saved) {
        const data = JSON.parse(saved);
        this.replays = new Map(data.replays || []);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('battleReplays', JSON.stringify({
        replays: Array.from(this.replays.entries())
      }));
    }
  }

  // Recording functionality
  startRecording(initialGameState: GameState, playerName: string, opponentName: string): string {
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentRecording = {
      battleId,
      playerName,
      opponentName,
      startTime: Date.now(),
      actions: [],
      gameStates: [{
        index: 0,
        timestamp: Date.now(),
        gameState: this.deepClone(initialGameState),
        actionIndex: -1
      }],
      metadata: {
        version: '1.0.0',
        playerDecks: {
          player: [...initialGameState.player.deck],
          opponent: [...initialGameState.opponent.deck]
        }
      }
    };

    return battleId;
  }

  recordAction(action: GameAction, resultingGameState: GameState) {
    if (!this.currentRecording) return;

    const replayAction: ReplayAction = {
      ...action,
      gameStateIndex: this.currentRecording.gameStates.length,
      timestamp: Date.now()
    };

    this.currentRecording.actions.push(replayAction);
    
    this.currentRecording.gameStates.push({
      index: this.currentRecording.gameStates.length,
      timestamp: Date.now(),
      gameState: this.deepClone(resultingGameState),
      actionIndex: this.currentRecording.actions.length - 1
    });
  }

  finishRecording(gameResult: GameResult): BattleReplay | null {
    if (!this.currentRecording) return null;

    const endTime = Date.now();
    const duration = endTime - this.currentRecording.startTime;

    // Analyze the battle
    const analysis = this.analysisEngine.analyzeBattle(
      this.currentRecording.actions,
      this.currentRecording.gameStates,
      gameResult
    );

    const replay: BattleReplay = {
      id: `replay_${this.currentRecording.battleId}`,
      battleId: this.currentRecording.battleId,
      playerName: this.currentRecording.playerName,
      opponentName: this.currentRecording.opponentName,
      gameResult,
      startTime: this.currentRecording.startTime,
      endTime,
      duration,
      actions: this.currentRecording.actions,
      gameStates: this.currentRecording.gameStates,
      metadata: {
        version: this.currentRecording.metadata.version || '1.0.0',
        playerDecks: this.currentRecording.metadata.playerDecks!,
        finalStats: analysis.finalStats,
        keyMoments: analysis.keyMoments,
        analysis: analysis.battleAnalysis
      },
      tags: this.generateTags(analysis, gameResult),
      isPublic: false,
      likes: 0,
      views: 0
    };

    this.replays.set(replay.id, replay);
    this.saveToStorage();
    this.currentRecording = null;

    return replay;
  }

  private generateTags(analysis: any, result: GameResult): string[] {
    const tags: string[] = [];
    
    // Result tags
    tags.push(result.winner === 'player' ? 'victory' : 'defeat');
    
    // Duration tags
    if (result.duration < 300) tags.push('quick');
    else if (result.duration > 900) tags.push('epic');
    
    // Performance tags
    if (analysis.battleAnalysis.bestPlays.some((p: BestPlay) => p.skillLevel === 'legendary')) {
      tags.push('legendary_play');
    }
    
    if (analysis.battleAnalysis.criticalMistakes.length === 0) {
      tags.push('flawless');
    }
    
    // Comeback detection
    const keyMoments = analysis.keyMoments;
    if (keyMoments.some((m: KeyMoment) => m.type === 'comeback')) {
      tags.push('comeback');
    }

    return tags;
  }

  // Playback functionality
  createPlaybackSession(replayId: string): ReplayPlaybackSession | null {
    const replay = this.replays.get(replayId);
    if (!replay) return null;

    return new ReplayPlaybackSession(replay);
  }

  // Search and filter
  searchReplays(options: ReplaySearchOptions = {}): BattleReplay[] {
    let results = Array.from(this.replays.values());

    // Apply filters
    if (options.filters) {
      results = this.applyFilters(results, options.filters);
    }

    // Apply text search
    if (options.query) {
      results = results.filter(replay => 
        replay.playerName.toLowerCase().includes(options.query!.toLowerCase()) ||
        replay.opponentName.toLowerCase().includes(options.query!.toLowerCase()) ||
        replay.tags.some(tag => tag.toLowerCase().includes(options.query!.toLowerCase()))
      );
    }

    // Sort
    if (options.sortBy) {
      results.sort((a, b) => {
        let comparison = 0;
        switch (options.sortBy) {
          case 'date':
            comparison = a.startTime - b.startTime;
            break;
          case 'duration':
            comparison = a.duration - b.duration;
            break;
          case 'likes':
            comparison = a.likes - b.likes;
            break;
          case 'views':
            comparison = a.views - b.views;
            break;
        }
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Pagination
    const start = options.offset || 0;
    const end = options.limit ? start + options.limit : results.length;
    
    return results.slice(start, end);
  }

  private applyFilters(replays: BattleReplay[], filters: ReplayFilters): BattleReplay[] {
    return replays.filter(replay => {
      if (filters.dateRange) {
        if (replay.startTime < filters.dateRange.start || replay.startTime > filters.dateRange.end) {
          return false;
        }
      }

      if (filters.result) {
        const isWin = replay.gameResult.winner === 'player';
        if ((filters.result === 'win' && !isWin) || (filters.result === 'loss' && isWin)) {
          return false;
        }
      }

      if (filters.opponent && !replay.opponentName.toLowerCase().includes(filters.opponent.toLowerCase())) {
        return false;
      }

      if (filters.duration) {
        if (replay.duration < filters.duration.min || replay.duration > filters.duration.max) {
          return false;
        }
      }

      if (filters.elements && !filters.elements.some(element => 
        replay.metadata.analysis.elementEffectiveness.some(e => e.element === element)
      )) {
        return false;
      }

      if (filters.tags && !filters.tags.some(tag => replay.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }

  // Utility methods
  getReplay(id: string): BattleReplay | undefined {
    return this.replays.get(id);
  }

  deleteReplay(id: string): boolean {
    const deleted = this.replays.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  exportReplay(id: string): string | null {
    const replay = this.replays.get(id);
    if (!replay) return null;
    
    return JSON.stringify(replay, null, 2);
  }

  importReplay(replayData: string): boolean {
    try {
      const replay: BattleReplay = JSON.parse(replayData);
      this.replays.set(replay.id, replay);
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import replay:', error);
      return false;
    }
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

// Playback session for replay viewing
class ReplayPlaybackSession {
  private replay: BattleReplay;
  private currentStateIndex: number = 0;
  private isPlaying: boolean = false;
  private playbackSpeed: number = 1;
  private playbackInterval: NodeJS.Timeout | null = null;

  constructor(replay: BattleReplay) {
    this.replay = replay;
  }

  play() {
    this.isPlaying = true;
    this.startPlayback();
  }

  pause() {
    this.isPlaying = false;
    this.stopPlayback();
  }

  stop() {
    this.isPlaying = false;
    this.stopPlayback();
    this.currentStateIndex = 0;
  }

  seekTo(stateIndex: number) {
    this.currentStateIndex = Math.max(0, Math.min(this.replay.gameStates.length - 1, stateIndex));
  }

  seekToAction(actionIndex: number) {
    if (actionIndex >= 0 && actionIndex < this.replay.actions.length) {
      this.currentStateIndex = this.replay.actions[actionIndex].gameStateIndex;
    }
  }

  seekToKeyMoment(momentIndex: number) {
    if (momentIndex >= 0 && momentIndex < this.replay.metadata.keyMoments.length) {
      const moment = this.replay.metadata.keyMoments[momentIndex];
      this.seekToAction(moment.actionIndex);
    }
  }

  setSpeed(speed: number) {
    this.playbackSpeed = Math.max(0.25, Math.min(4, speed));
    if (this.isPlaying) {
      this.stopPlayback();
      this.startPlayback();
    }
  }

  private startPlayback() {
    const interval = 1000 / this.playbackSpeed; // 1 second per state at 1x speed
    
    this.playbackInterval = setInterval(() => {
      if (this.currentStateIndex < this.replay.gameStates.length - 1) {
        this.currentStateIndex++;
      } else {
        this.pause();
      }
    }, interval);
  }

  private stopPlayback() {
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  getCurrentState(): GameStateSnapshot {
    return this.replay.gameStates[this.currentStateIndex];
  }

  getCurrentAction(): ReplayAction | null {
    const state = this.getCurrentState();
    return state.actionIndex >= 0 ? this.replay.actions[state.actionIndex] : null;
  }

  getProgress(): number {
    return this.currentStateIndex / (this.replay.gameStates.length - 1);
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }
}

// Battle analysis engine
class BattleAnalysisEngine {
  analyzeBattle(actions: ReplayAction[], gameStates: GameStateSnapshot[], result: GameResult): {
    finalStats: { player: PlayerBattleStats; opponent: PlayerBattleStats };
    keyMoments: KeyMoment[];
    battleAnalysis: BattleAnalysis;
  } {
    const finalStats = this.calculateFinalStats(actions, gameStates);
    const keyMoments = this.identifyKeyMoments(actions, gameStates, result);
    const battleAnalysis = this.generateBattleAnalysis(actions, gameStates, result, finalStats);

    return { finalStats, keyMoments, battleAnalysis };
  }

  private calculateFinalStats(actions: ReplayAction[], gameStates: GameStateSnapshot[]): {
    player: PlayerBattleStats;
    opponent: PlayerBattleStats;
  } {
    const playerStats: PlayerBattleStats = {
      damageDealt: 0,
      damageReceived: 0,
      cardsPlayed: 0,
      abilitiesUsed: 0,
      combosExecuted: 0,
      avgTurnTime: 0,
      maxManaReached: 0,
      cardsDrawn: 0,
      elementsUsed: []
    };

    const opponentStats: PlayerBattleStats = { ...playerStats };

    // Calculate stats from actions
    actions.forEach(action => {
      const stats = action.playerId === 'player' ? playerStats : opponentStats;
      
      switch (action.type) {
        case 'play_card':
          stats.cardsPlayed++;
          if (action.card?.element && !stats.elementsUsed.includes(action.card.element)) {
            stats.elementsUsed.push(action.card.element);
          }
          break;
        case 'use_ability':
          stats.abilitiesUsed++;
          break;
        case 'attack':
          // Damage calculation would need access to the actual damage dealt
          break;
      }
    });

    return { player: playerStats, opponent: opponentStats };
  }

  private identifyKeyMoments(actions: ReplayAction[], gameStates: GameStateSnapshot[], result: GameResult): KeyMoment[] {
    const keyMoments: KeyMoment[] = [];

    // Game start
    keyMoments.push({
      timestamp: gameStates[0].timestamp,
      actionIndex: 0,
      type: 'game_start',
      title: 'Battle Begins',
      description: 'The epic duel commences!',
      significance: 5
    });

    // First blood (first damage dealt)
    for (let i = 0; i < actions.length; i++) {
      if (actions[i].type === 'attack') {
        keyMoments.push({
          timestamp: actions[i].timestamp,
          actionIndex: i,
          type: 'first_blood',
          title: 'First Strike',
          description: 'First damage of the battle!',
          significance: 6
        });
        break;
      }
    }

    // Game end
    keyMoments.push({
      timestamp: gameStates[gameStates.length - 1].timestamp,
      actionIndex: actions.length - 1,
      type: 'game_end',
      title: result.winner === 'player' ? 'Victory!' : 'Defeat',
      description: `Game ended by ${result.reason}`,
      significance: 10
    });

    return keyMoments.sort((a, b) => a.timestamp - b.timestamp);
  }

  private generateBattleAnalysis(
    actions: ReplayAction[], 
    gameStates: GameStateSnapshot[], 
    result: GameResult,
    stats: { player: PlayerBattleStats; opponent: PlayerBattleStats }
  ): BattleAnalysis {
    return {
      winCondition: result.reason,
      criticalMistakes: [],
      bestPlays: [],
      deckPerformance: {
        cardsUsed: stats.player.cardsPlayed,
        cardEfficiency: stats.player.cardsPlayed / Math.max(1, actions.length),
        manaCurve: {},
        elementDistribution: {},
        unusedPotential: []
      },
      elementEffectiveness: [],
      suggestions: [
        'Review your mana curve for better efficiency',
        'Consider adding more diverse elements to your deck',
        'Practice combo execution timing'
      ]
    };
  }
}

// Recording session interface
interface RecordingSession {
  battleId: string;
  playerName: string;
  opponentName: string;
  startTime: number;
  actions: ReplayAction[];
  gameStates: GameStateSnapshot[];
  metadata: Partial<ReplayMetadata>;
}

// Global replay manager instance
export const replayManager = new BattleReplayManager();

// React hook for replay functionality
export function useReplaySystem() {
  const startRecording = (gameState: GameState, playerName: string, opponentName: string) => {
    return replayManager.startRecording(gameState, playerName, opponentName);
  };

  const recordAction = (action: GameAction, gameState: GameState) => {
    replayManager.recordAction(action, gameState);
  };

  const finishRecording = (result: GameResult) => {
    return replayManager.finishRecording(result);
  };

  const searchReplays = (options?: ReplaySearchOptions) => {
    return replayManager.searchReplays(options);
  };

  const getReplay = (id: string) => {
    return replayManager.getReplay(id);
  };

  const createPlayback = (replayId: string) => {
    return replayManager.createPlaybackSession(replayId);
  };

  const exportReplay = (id: string) => {
    return replayManager.exportReplay(id);
  };

  const importReplay = (data: string) => {
    return replayManager.importReplay(data);
  };

  return {
    startRecording,
    recordAction,
    finishRecording,
    searchReplays,
    getReplay,
    createPlayback,
    exportReplay,
    importReplay
  };
}

export default replayManager;