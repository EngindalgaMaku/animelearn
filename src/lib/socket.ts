import { io, Socket } from 'socket.io-client';
import { GameState, BattleCard, GameAction } from '../types/battle/core';

export interface MultiplayerGameState extends GameState {
  roomId: string;
  players: {
    player1: {
      id: string;
      username: string;
      connected: boolean;
    };
    player2: {
      id: string;
      username: string;
      connected: boolean;
    };
  };
  spectators: Array<{
    id: string;
    username: string;
  }>;
  matchSettings: {
    timeLimit: number;
    maxSpectators: number;
    ranked: boolean;
    deckFormat: string;
  };
}

export interface MatchmakingState {
  searching: boolean;
  estimatedWaitTime: number;
  rank: string;
  region: string;
}

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(userId: string, userToken: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        auth: {
          userId,
          token: userToken
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to battle server');
        this.reconnectAttempts = 0;
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('❌ Connection failed:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason: string) => {
        console.log('🔌 Disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.socket?.connect();
        }
      });

      this.socket.on('reconnect', (attemptNumber: number) => {
        console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      });

      this.socket.on('reconnect_error', (error: any) => {
        this.reconnectAttempts++;
        console.error(`🔄 Reconnect attempt ${this.reconnectAttempts} failed:`, error);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('💔 Failed to reconnect after maximum attempts');
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Matchmaking
  startMatchmaking(preferences: {
    gameMode: 'ranked' | 'casual' | 'tournament';
    deckFormat: string;
    region?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Not connected to server'));
        return;
      }

      this.socket.emit('start_matchmaking', preferences);
      
      this.socket.once('matchmaking_started', () => {
        resolve();
      });

      this.socket.once('matchmaking_error', (error: string) => {
        reject(new Error(error));
      });
    });
  }

  cancelMatchmaking(): void {
    this.socket?.emit('cancel_matchmaking');
  }

  // Game Room Management
  createPrivateRoom(settings: {
    maxSpectators: number;
    timeLimit: number;
    deckFormat: string;
    password?: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Not connected to server'));
        return;
      }

      this.socket.emit('create_room', settings);
      
      this.socket.once('room_created', (roomId: string) => {
        resolve(roomId);
      });

      this.socket.once('room_error', (error: string) => {
        reject(new Error(error));
      });
    });
  }

  joinRoom(roomId: string, password?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Not connected to server'));
        return;
      }

      this.socket.emit('join_room', { roomId, password });
      
      this.socket.once('room_joined', () => {
        resolve();
      });

      this.socket.once('room_join_error', (error: string) => {
        reject(new Error(error));
      });
    });
  }

  leaveRoom(): void {
    this.socket?.emit('leave_room');
  }

  // Game Actions
  sendGameAction(action: GameAction): void {
    if (!this.socket?.connected) {
      console.error('Cannot send action: not connected');
      return;
    }

    this.socket.emit('game_action', action);
  }

  // Spectator Actions
  spectateGame(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Not connected to server'));
        return;
      }

      this.socket.emit('spectate_game', roomId);
      
      this.socket.once('spectating_started', () => {
        resolve();
      });

      this.socket.once('spectate_error', (error: string) => {
        reject(new Error(error));
      });
    });
  }

  stopSpectating(): void {
    this.socket?.emit('stop_spectating');
  }

  // Event Listeners
  onMatchFound(callback: (gameData: MultiplayerGameState) => void): void {
    this.socket?.on('match_found', callback);
  }

  onGameStateUpdate(callback: (gameState: MultiplayerGameState) => void): void {
    this.socket?.on('game_state_update', callback);
  }

  onPlayerAction(callback: (action: GameAction) => void): void {
    this.socket?.on('player_action', callback);
  }

  onPlayerDisconnected(callback: (playerId: string) => void): void {
    this.socket?.on('player_disconnected', callback);
  }

  onPlayerReconnected(callback: (playerId: string) => void): void {
    this.socket?.on('player_reconnected', callback);
  }

  onGameEnded(callback: (result: {
    winner: string;
    reason: string;
    statistics: any;
    rewards: any;
  }) => void): void {
    this.socket?.on('game_ended', callback);
  }

  onMatchmakingUpdate(callback: (state: MatchmakingState) => void): void {
    this.socket?.on('matchmaking_update', callback);
  }

  onSpectatorJoined(callback: (spectator: { id: string; username: string }) => void): void {
    this.socket?.on('spectator_joined', callback);
  }

  onSpectatorLeft(callback: (spectatorId: string) => void): void {
    this.socket?.on('spectator_left', callback);
  }

  // Chat System
  sendChatMessage(message: string, type: 'game' | 'spectator' = 'game'): void {
    this.socket?.emit('chat_message', { message, type });
  }

  onChatMessage(callback: (data: {
    playerId: string;
    username: string;
    message: string;
    timestamp: number;
    type: 'game' | 'spectator' | 'system';
  }) => void): void {
    this.socket?.on('chat_message', callback);
  }

  // Utility
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionId(): string | undefined {
    return this.socket?.id;
  }

  // Remove all listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  // Clean up specific listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }
}

// Export singleton instance
export const socketManager = new SocketManager();
export default socketManager;