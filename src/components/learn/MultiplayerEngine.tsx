"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Multiplayer Infrastructure for Real-time PvP Memory Game
export interface Player {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  rating: number;
  wins: number;
  losses: number;
  isReady: boolean;
  isConnected: boolean;
  currentScore: number;
  matchedPairs: number;
  mistakes: number;
  powerUpsUsed: string[];
  status: 'waiting' | 'playing' | 'finished' | 'disconnected';
}

export interface GameRoom {
  id: string;
  name: string;
  type: 'casual' | 'ranked' | 'tournament';
  maxPlayers: number;
  currentPlayers: Player[];
  gameState: 'waiting' | 'starting' | 'active' | 'finished';
  settings: {
    timeLimit: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    powerUpsEnabled: boolean;
    spectatorMode: boolean;
  };
  startTime?: Date;
  endTime?: Date;
  winner?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'bracket' | 'round_robin' | 'swiss';
  status: 'registration' | 'active' | 'finished';
  maxParticipants: number;
  currentParticipants: Player[];
  rounds: TournamentRound[];
  prizePool: {
    first: number;
    second: number;
    third: number;
  };
  startDate: Date;
  endDate: Date;
  entryFee: number;
}

export interface TournamentRound {
  roundNumber: number;
  matches: TournamentMatch[];
  status: 'pending' | 'active' | 'completed';
}

export interface TournamentMatch {
  id: string;
  players: Player[];
  winner?: string;
  score: {[playerId: string]: number};
  status: 'pending' | 'active' | 'completed';
  room?: GameRoom;
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  score: number;
  gamesPlayed: number;
  winRate: number;
  averageScore: number;
  bestStreak: number;
  lastActive: Date;
}

export interface GameEvent {
  type: 'card_flip' | 'match_found' | 'powerup_used' | 'game_end' | 'player_join' | 'player_leave';
  playerId: string;
  data: any;
  timestamp: Date;
}

class MultiplayerEngine {
  private ws: WebSocket | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private eventListeners: Map<string, Function[]> = new Map();
  private currentRoom: GameRoom | null = null;
  private currentPlayer: Player | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;
    
    this.isConnecting = true;
    
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For now, we'll simulate the connection
      this.simulateWebSocketConnection();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  private simulateWebSocketConnection() {
    // Simulate WebSocket for demo purposes
    setTimeout(() => {
      this.isConnecting = false;
      this.emit('connected', {});
      this.startHeartbeat();
    }, 1000);
  }

  private scheduleReconnect() {
    if (this.reconnectInterval) return;
    
    this.reconnectInterval = setTimeout(() => {
      this.reconnectInterval = null;
      this.initializeWebSocket();
    }, 5000);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('heartbeat', {});
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private send(type: string, data: any) {
    const message = JSON.stringify({ type, data, timestamp: new Date() });
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      // Queue message for when connection is restored
      console.log('Queueing message:', type, data);
    }
  }

  // Player management
  async authenticatePlayer(username: string, token?: string): Promise<Player> {
    return new Promise((resolve) => {
      // Simulate authentication
      setTimeout(() => {
        const player: Player = {
          id: `player_${Date.now()}`,
          username,
          level: Math.floor(Math.random() * 50) + 1,
          rating: Math.floor(Math.random() * 2000) + 1000,
          wins: Math.floor(Math.random() * 100),
          losses: Math.floor(Math.random() * 50),
          isReady: false,
          isConnected: true,
          currentScore: 0,
          matchedPairs: 0,
          mistakes: 0,
          powerUpsUsed: [],
          status: 'waiting',
        };
        
        this.currentPlayer = player;
        this.emit('player_authenticated', player);
        resolve(player);
      }, 500);
    });
  }

  // Room management
  async createRoom(settings: Partial<GameRoom['settings']>): Promise<GameRoom> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const room: GameRoom = {
          id: `room_${Date.now()}`,
          name: `${this.currentPlayer?.username}'s Room`,
          type: 'casual',
          maxPlayers: 2,
          currentPlayers: this.currentPlayer ? [this.currentPlayer] : [],
          gameState: 'waiting',
          settings: {
            timeLimit: 300,
            difficulty: 'medium',
            powerUpsEnabled: true,
            spectatorMode: false,
            ...settings,
          },
        };
        
        this.currentRoom = room;
        this.emit('room_created', room);
        resolve(room);
      }, 300);
    });
  }

  async joinRoom(roomId: string): Promise<GameRoom> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate finding and joining room
        if (Math.random() < 0.9 && this.currentPlayer) { // 90% success rate
          const room: GameRoom = {
            id: roomId,
            name: 'Public Room',
            type: 'casual',
            maxPlayers: 2,
            currentPlayers: [
              {
                id: 'opponent_1',
                username: 'MemoryMaster',
                level: 25,
                rating: 1500,
                wins: 45,
                losses: 20,
                isReady: true,
                isConnected: true,
                currentScore: 0,
                matchedPairs: 0,
                mistakes: 0,
                powerUpsUsed: [],
                status: 'waiting',
              },
              this.currentPlayer,
            ],
            gameState: 'waiting',
            settings: {
              timeLimit: 300,
              difficulty: 'medium',
              powerUpsEnabled: true,
              spectatorMode: false,
            },
          };
          
          this.currentRoom = room;
          this.emit('room_joined', room);
          resolve(room);
        } else {
          reject(new Error('Room not found or full'));
        }
      }, 500);
    });
  }

  async findMatch(difficulty: string = 'any'): Promise<GameRoom> {
    return new Promise((resolve) => {
      this.emit('matchmaking_started', { difficulty });
      
      // Simulate matchmaking delay
      setTimeout(() => {
        const room: GameRoom = {
          id: `match_${Date.now()}`,
          name: 'Ranked Match',
          type: 'ranked',
          maxPlayers: 2,
          currentPlayers: [
            this.currentPlayer!,
            {
              id: 'matched_opponent',
              username: 'QuickMatch',
              level: this.currentPlayer!.level + Math.floor(Math.random() * 10) - 5,
              rating: this.currentPlayer!.rating + Math.floor(Math.random() * 200) - 100,
              wins: Math.floor(Math.random() * 80),
              losses: Math.floor(Math.random() * 40),
              isReady: true,
              isConnected: true,
              currentScore: 0,
              matchedPairs: 0,
              mistakes: 0,
              powerUpsUsed: [],
              status: 'waiting',
            },
          ],
          gameState: 'starting',
          settings: {
            timeLimit: 300,
            difficulty: difficulty as any,
            powerUpsEnabled: true,
            spectatorMode: false,
          },
        };
        
        this.currentRoom = room;
        this.emit('match_found', room);
        resolve(room);
      }, Math.random() * 5000 + 2000); // 2-7 seconds
    });
  }

  // Game state synchronization
  sendGameEvent(event: GameEvent) {
    this.send('game_event', event);
    this.emit('game_event_sent', event);
  }

  setPlayerReady(ready: boolean) {
    if (this.currentPlayer) {
      this.currentPlayer.isReady = ready;
      this.send('player_ready', { playerId: this.currentPlayer.id, ready });
    }
  }

  updatePlayerScore(score: number, matchedPairs: number, mistakes: number) {
    if (this.currentPlayer) {
      this.currentPlayer.currentScore = score;
      this.currentPlayer.matchedPairs = matchedPairs;
      this.currentPlayer.mistakes = mistakes;
      
      this.send('score_update', {
        playerId: this.currentPlayer.id,
        score,
        matchedPairs,
        mistakes,
      });
    }
  }

  // Tournament system
  async createTournament(tournamentData: Partial<Tournament>): Promise<Tournament> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tournament: Tournament = {
          id: `tournament_${Date.now()}`,
          name: 'Memory Championship',
          description: 'Battle for glory in the ultimate memory competition!',
          type: 'bracket',
          status: 'registration',
          maxParticipants: 16,
          currentParticipants: [],
          rounds: [],
          prizePool: {
            first: 1000,
            second: 500,
            third: 250,
          },
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          entryFee: 100,
          ...tournamentData,
        };
        
        this.emit('tournament_created', tournament);
        resolve(tournament);
      }, 500);
    });
  }

  async joinTournament(tournamentId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate tournament join
        const success = Math.random() < 0.95; // 95% success rate
        this.emit('tournament_joined', { tournamentId, success });
        resolve(success);
      }, 300);
    });
  }

  async getTournaments(filter: 'all' | 'open' | 'active' | 'completed' = 'all'): Promise<Tournament[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tournaments: Tournament[] = [
          {
            id: 'tournament_1',
            name: 'Weekly Championship',
            description: 'Compete against the best players for amazing prizes!',
            type: 'bracket',
            status: 'registration',
            maxParticipants: 32,
            currentParticipants: Array.from({ length: 24 }, (_, i) => ({
              id: `player_${i}`,
              username: `Player${i + 1}`,
              level: Math.floor(Math.random() * 50) + 1,
              rating: Math.floor(Math.random() * 2000) + 1000,
              wins: Math.floor(Math.random() * 100),
              losses: Math.floor(Math.random() * 50),
              isReady: true,
              isConnected: true,
              currentScore: 0,
              matchedPairs: 0,
              mistakes: 0,
              powerUpsUsed: [],
              status: 'waiting',
            })),
            rounds: [],
            prizePool: { first: 2000, second: 1000, third: 500 },
            startDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 30 * 60 * 60 * 1000),
            entryFee: 200,
          },
          {
            id: 'tournament_2',
            name: 'Speed Challenge',
            description: 'Fast-paced tournament for quick thinkers!',
            type: 'swiss',
            status: 'active',
            maxParticipants: 16,
            currentParticipants: Array.from({ length: 16 }, (_, i) => ({
              id: `speed_player_${i}`,
              username: `Speed${i + 1}`,
              level: Math.floor(Math.random() * 30) + 10,
              rating: Math.floor(Math.random() * 1500) + 1200,
              wins: Math.floor(Math.random() * 60),
              losses: Math.floor(Math.random() * 30),
              isReady: true,
              isConnected: true,
              currentScore: 0,
              matchedPairs: 0,
              mistakes: 0,
              powerUpsUsed: [],
              status: 'playing',
            })),
            rounds: [],
            prizePool: { first: 800, second: 400, third: 200 },
            startDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
            entryFee: 100,
          },
        ];
        
        resolve(tournaments);
      }, 400);
    });
  }

  // Leaderboard system
  async getLeaderboard(type: 'global' | 'weekly' | 'tournament' = 'global', limit: number = 100): Promise<LeaderboardEntry[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leaderboard: LeaderboardEntry[] = Array.from({ length: limit }, (_, i) => ({
          rank: i + 1,
          player: {
            id: `top_player_${i}`,
            username: `Champion${i + 1}`,
            level: Math.max(1, 50 - Math.floor(i / 2)),
            rating: Math.max(1000, 3000 - i * 10),
            wins: Math.max(10, 200 - i * 2),
            losses: Math.max(0, Math.floor((200 - i * 2) * 0.3)),
            isReady: false,
            isConnected: Math.random() < 0.3,
            currentScore: 0,
            matchedPairs: 0,
            mistakes: 0,
            powerUpsUsed: [],
            status: 'waiting',
          },
          score: Math.max(1000, 10000 - i * 50),
          gamesPlayed: Math.max(20, 500 - i * 5),
          winRate: Math.max(0.5, 0.95 - i * 0.005),
          averageScore: Math.max(800, 2000 - i * 8),
          bestStreak: Math.max(3, 50 - Math.floor(i / 3)),
          lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        }));
        
        resolve(leaderboard);
      }, 600);
    });
  }

  // Spectator mode
  async joinAsSpectator(roomId: string): Promise<GameRoom> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate joining as spectator
        const room = this.currentRoom || {
          id: roomId,
          name: 'Spectated Game',
          type: 'casual',
          maxPlayers: 2,
          currentPlayers: [
            {
              id: 'spectated_player_1',
              username: 'ProPlayer1',
              level: 40,
              rating: 1800,
              wins: 80,
              losses: 25,
              isReady: true,
              isConnected: true,
              currentScore: 1250,
              matchedPairs: 5,
              mistakes: 2,
              powerUpsUsed: ['freeze', 'peek'],
              status: 'playing',
            },
            {
              id: 'spectated_player_2',
              username: 'ProPlayer2',
              level: 35,
              rating: 1750,
              wins: 70,
              losses: 30,
              isReady: true,
              isConnected: true,
              currentScore: 980,
              matchedPairs: 4,
              mistakes: 3,
              powerUpsUsed: ['multiplier'],
              status: 'playing',
            },
          ],
          gameState: 'active',
          settings: {
            timeLimit: 300,
            difficulty: 'hard',
            powerUpsEnabled: true,
            spectatorMode: true,
          },
        } as GameRoom;
        
        this.emit('spectator_joined', room);
        resolve(room);
      }, 300);
    });
  }

  // Connection management
  disconnect() {
    this.stopHeartbeat();
    
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.emit('disconnected', {});
  }

  getCurrentRoom(): GameRoom | null {
    return this.currentRoom;
  }

  getCurrentPlayer(): Player | null {
    return this.currentPlayer;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || true; // Simulated as always connected
  }
}

export default MultiplayerEngine;