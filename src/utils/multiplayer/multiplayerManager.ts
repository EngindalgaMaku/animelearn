"use client";

import { GameState, GameAction, BattleCard, Player } from '../../types/battle/core';

export interface MultiplayerConfig {
  serverUrl: string;
  roomId?: string;
  playerId: string;
  playerName: string;
  isHost: boolean;
}

export interface MultiplayerGameState extends GameState {
  multiplayerInfo: {
    roomId: string;
    hostPlayerId: string;
    connectedPlayers: MultiplayerPlayer[];
    gameStatus: 'waiting' | 'starting' | 'in_progress' | 'finished';
    spectators: MultiplayerSpectator[];
  };
}

export interface MultiplayerPlayer {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  isReady: boolean;
  isConnected: boolean;
  deck: BattleCard[];
}

export interface MultiplayerSpectator {
  id: string;
  name: string;
  joinedAt: number;
}

export interface MultiplayerMessage {
  type: 'game_action' | 'chat' | 'system' | 'emote' | 'game_state_sync';
  playerId: string;
  timestamp: number;
  data: any;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'text' | 'emote' | 'system';
}

export interface MatchmakingCriteria {
  gameMode: 'ranked' | 'casual' | 'custom';
  skillRange: 'any' | 'similar' | 'exact';
  preferredElements?: string[];
  maxWaitTime: number;
}

class MultiplayerManager {
  private socket: WebSocket | null = null;
  private config: MultiplayerConfig | null = null;
  private gameState: MultiplayerGameState | null = null;
  private messageHandlers: Map<string, (message: MultiplayerMessage) => void> = new Map();
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' = 'disconnected';
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Event listeners
  private onGameStateUpdate?: (gameState: MultiplayerGameState) => void;
  private onChatMessage?: (message: ChatMessage) => void;
  private onPlayerJoin?: (player: MultiplayerPlayer) => void;
  private onPlayerLeave?: (playerId: string) => void;
  private onConnectionChange?: (status: string) => void;
  private onError?: (error: string) => void;

  constructor() {
    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    this.messageHandlers.set('game_action', this.handleGameAction.bind(this));
    this.messageHandlers.set('chat', this.handleChatMessage.bind(this));
    this.messageHandlers.set('system', this.handleSystemMessage.bind(this));
    this.messageHandlers.set('game_state_sync', this.handleGameStateSync.bind(this));
    this.messageHandlers.set('emote', this.handleEmote.bind(this));
  }

  async connect(config: MultiplayerConfig): Promise<boolean> {
    this.config = config;
    this.connectionState = 'connecting';
    this.onConnectionChange?.('connecting');

    try {
      const wsUrl = `${config.serverUrl}/battle/${config.roomId || 'matchmaking'}`;
      this.socket = new WebSocket(wsUrl);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket!.onopen = () => {
          clearTimeout(timeout);
          this.connectionState = 'connected';
          this.onConnectionChange?.('connected');
          this.startHeartbeat();
          this.authenticate();
          resolve(true);
        };

        this.socket!.onmessage = this.handleMessage.bind(this);
        this.socket!.onclose = this.handleDisconnection.bind(this);
        this.socket!.onerror = (error) => {
          clearTimeout(timeout);
          this.connectionState = 'disconnected';
          this.onConnectionChange?.('disconnected');
          this.onError?.('Connection failed');
          reject(error);
        };
      });
    } catch (error) {
      this.connectionState = 'disconnected';
      this.onConnectionChange?.('disconnected');
      this.onError?.('Failed to establish connection');
      return false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
    this.stopHeartbeat();
    this.connectionState = 'disconnected';
    this.onConnectionChange?.('disconnected');
  }

  private authenticate() {
    if (!this.config) return;

    this.sendMessage({
      type: 'system',
      playerId: this.config.playerId,
      timestamp: Date.now(),
      data: {
        action: 'authenticate',
        playerName: this.config.playerName,
        isHost: this.config.isHost
      }
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'system',
          playerId: this.config!.playerId,
          timestamp: Date.now(),
          data: { action: 'ping' }
        });
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: MultiplayerMessage = JSON.parse(event.data);
      const handler = this.messageHandlers.get(message.type);
      
      if (handler) {
        handler(message);
      } else {
        console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  private handleDisconnection() {
    this.connectionState = 'disconnected';
    this.onConnectionChange?.('disconnected');
    this.stopHeartbeat();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnection();
    } else {
      this.onError?.('Connection lost and failed to reconnect');
    }
  }

  private async attemptReconnection() {
    if (!this.config) return;

    this.connectionState = 'reconnecting';
    this.onConnectionChange?.('reconnecting');
    this.reconnectAttempts++;

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    
    setTimeout(async () => {
      try {
        await this.connect(this.config!);
        this.reconnectAttempts = 0;
      } catch (error) {
        this.handleDisconnection();
      }
    }, delay);
  }

  private sendMessage(message: MultiplayerMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // Game Actions
  sendGameAction(action: GameAction) {
    this.sendMessage({
      type: 'game_action',
      playerId: this.config!.playerId,
      timestamp: Date.now(),
      data: action
    });
  }

  sendChatMessage(message: string) {
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      playerId: this.config!.playerId,
      playerName: this.config!.playerName,
      message,
      timestamp: Date.now(),
      type: 'text'
    };

    this.sendMessage({
      type: 'chat',
      playerId: this.config!.playerId,
      timestamp: Date.now(),
      data: chatMessage
    });
  }

  sendEmote(emoteId: string) {
    this.sendMessage({
      type: 'emote',
      playerId: this.config!.playerId,
      timestamp: Date.now(),
      data: { emoteId }
    });
  }

  setPlayerReady(ready: boolean) {
    this.sendMessage({
      type: 'system',
      playerId: this.config!.playerId,
      timestamp: Date.now(),
      data: { action: 'set_ready', ready }
    });
  }

  // Message Handlers
  private handleGameAction(message: MultiplayerMessage) {
    const action: GameAction = message.data;
    
    // Validate action is from opponent
    if (message.playerId !== this.config!.playerId && this.gameState) {
      // Apply action to game state
      // This would integrate with the existing game state manager
      console.log('Received opponent action:', action);
    }
  }

  private handleChatMessage(message: MultiplayerMessage) {
    const chatMessage: ChatMessage = message.data;
    this.onChatMessage?.(chatMessage);
  }

  private handleSystemMessage(message: MultiplayerMessage) {
    const { action, data } = message.data;

    switch (action) {
      case 'player_joined':
        this.onPlayerJoin?.(data.player);
        break;
      case 'player_left':
        this.onPlayerLeave?.(data.playerId);
        break;
      case 'game_started':
        this.handleGameStart(data.gameState);
        break;
      case 'pong':
        // Heartbeat response
        break;
      default:
        console.log('System message:', action, data);
    }
  }

  private handleGameStateSync(message: MultiplayerMessage) {
    this.gameState = message.data.gameState;
    if (this.gameState) {
      this.onGameStateUpdate?.(this.gameState);
    }
  }

  private handleEmote(message: MultiplayerMessage) {
    const { emoteId } = message.data;
    console.log(`Player ${message.playerId} used emote: ${emoteId}`);
  }

  private handleGameStart(gameState: MultiplayerGameState) {
    this.gameState = gameState;
    this.onGameStateUpdate?.(gameState);
  }

  // Event Listeners
  onGameUpdate(callback: (gameState: MultiplayerGameState) => void) {
    this.onGameStateUpdate = callback;
  }

  onChat(callback: (message: ChatMessage) => void) {
    this.onChatMessage = callback;
  }

  onPlayerActivity(callbacks: {
    onJoin?: (player: MultiplayerPlayer) => void;
    onLeave?: (playerId: string) => void;
  }) {
    this.onPlayerJoin = callbacks.onJoin;
    this.onPlayerLeave = callbacks.onLeave;
  }

  onConnection(callback: (status: string) => void) {
    this.onConnectionChange = callback;
  }

  onErrorEvent(callback: (error: string) => void) {
    this.onError = callback;
  }

  // Getters
  getConnectionState() {
    return this.connectionState;
  }

  getCurrentGameState() {
    return this.gameState;
  }

  isConnected() {
    return this.connectionState === 'connected';
  }

  isHost() {
    return this.config?.isHost || false;
  }
}

// Matchmaking Service
export class MatchmakingService {
  private static instance: MatchmakingService;
  private socket: WebSocket | null = null;
  private searchingForMatch = false;
  private currentCriteria: MatchmakingCriteria | null = null;

  static getInstance(): MatchmakingService {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService();
    }
    return MatchmakingService.instance;
  }

  async findMatch(criteria: MatchmakingCriteria): Promise<{
    roomId: string;
    opponent: MultiplayerPlayer;
  }> {
    this.searchingForMatch = true;
    this.currentCriteria = criteria;

    return new Promise((resolve, reject) => {
      // Connect to matchmaking service
      const wsUrl = `${process.env.NEXT_PUBLIC_MULTIPLAYER_SERVER || 'ws://localhost:8080'}/matchmaking`;
      this.socket = new WebSocket(wsUrl);

      const timeout = setTimeout(() => {
        this.cancelMatchmaking();
        reject(new Error('Matchmaking timeout'));
      }, criteria.maxWaitTime);

      this.socket.onopen = () => {
        this.socket!.send(JSON.stringify({
          type: 'find_match',
          criteria
        }));
      };

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'match_found') {
          clearTimeout(timeout);
          this.searchingForMatch = false;
          resolve({
            roomId: message.data.roomId,
            opponent: message.data.opponent
          });
        }
      };

      this.socket.onerror = () => {
        clearTimeout(timeout);
        this.searchingForMatch = false;
        reject(new Error('Matchmaking service unavailable'));
      };
    });
  }

  cancelMatchmaking() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.searchingForMatch = false;
    this.currentCriteria = null;
  }

  isSearching() {
    return this.searchingForMatch;
  }

  getCurrentCriteria() {
    return this.currentCriteria;
  }
}

// Global multiplayer manager instance
export const multiplayerManager = new MultiplayerManager();

// React hook for multiplayer functionality
export function useMultiplayer() {
  const connect = async (config: MultiplayerConfig) => {
    return await multiplayerManager.connect(config);
  };

  const disconnect = () => {
    multiplayerManager.disconnect();
  };

  const sendAction = (action: GameAction) => {
    multiplayerManager.sendGameAction(action);
  };

  const sendChat = (message: string) => {
    multiplayerManager.sendChatMessage(message);
  };

  const sendEmote = (emoteId: string) => {
    multiplayerManager.sendEmote(emoteId);
  };

  const setReady = (ready: boolean) => {
    multiplayerManager.setPlayerReady(ready);
  };

  return {
    connect,
    disconnect,
    sendAction,
    sendChat,
    sendEmote,
    setReady,
    isConnected: multiplayerManager.isConnected(),
    connectionState: multiplayerManager.getConnectionState(),
    gameState: multiplayerManager.getCurrentGameState()
  };
}

export default multiplayerManager;