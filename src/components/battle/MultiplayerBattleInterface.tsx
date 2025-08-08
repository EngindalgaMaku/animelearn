"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Wifi, 
  WifiOff, 
  MessageCircle, 
  Send, 
  Eye,
  Crown,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import socketManager, { MultiplayerGameState, MatchmakingState } from '../../lib/socket';
import { BattleCard, GameAction } from '../../types/battle/core';
import BattleField from './BattleField';
import PlayerHand from './PlayerHand';
import BattleCardComponent from './BattleCard';

interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'game' | 'spectator' | 'system';
}

export default function MultiplayerBattleInterface() {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [gameState, setGameState] = useState<MultiplayerGameState | null>(null);
  const [matchmakingState, setMatchmakingState] = useState<MatchmakingState>({
    searching: false,
    estimatedWaitTime: 0,
    rank: 'Bronze III',
    region: 'EU-West'
  });
  const [selectedCard, setSelectedCard] = useState<BattleCard | null>(null);
  const [targetingMode, setTargetingMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [connectionTimer, setConnectionTimer] = useState(0);
  const [lastAction, setLastAction] = useState<GameAction | null>(null);

  // Socket Connection Management
  useEffect(() => {
    if (!user) return;

    const connectToServer = async () => {
      try {
        setConnectionStatus('connecting');
        await socketManager.connect(user.id, 'mock-token');
        setConnectionStatus('connected');
        
        // Set up event listeners
        setupSocketListeners();
      } catch (error) {
        console.error('Failed to connect:', error);
        setConnectionStatus('disconnected');
      }
    };

    connectToServer();

    return () => {
      socketManager.removeAllListeners();
      socketManager.disconnect();
    };
  }, [user]);

  // Connection Timer
  useEffect(() => {
    if (connectionStatus === 'connecting') {
      const timer = setInterval(() => {
        setConnectionTimer(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setConnectionTimer(0);
    }
  }, [connectionStatus]);

  const setupSocketListeners = useCallback(() => {
    // Matchmaking events
    socketManager.onMatchFound((gameData) => {
      console.log('🎮 Match found!', gameData);
      setGameState(gameData);
      setMatchmakingState(prev => ({ ...prev, searching: false }));
      addSystemMessage(`Match found! Opponent: ${getOpponentUsername(gameData)}`);
    });

    socketManager.onMatchmakingUpdate((state) => {
      setMatchmakingState(state);
    });

    // Game events
    socketManager.onGameStateUpdate((newGameState) => {
      setGameState(newGameState);
    });

    socketManager.onPlayerAction((action) => {
      setLastAction(action);
      addSystemMessage(`${action.playerId} played ${action.card?.name || 'an action'}`);
    });

    socketManager.onPlayerDisconnected((playerId) => {
      addSystemMessage(`Player ${playerId} disconnected`, 'warning');
    });

    socketManager.onPlayerReconnected((playerId) => {
      addSystemMessage(`Player ${playerId} reconnected`, 'success');
    });

    socketManager.onGameEnded((result) => {
      addSystemMessage(`Game ended! Winner: ${result.winner}`, result.winner === user?.id ? 'success' : 'error');
    });

    // Chat events
    socketManager.onChatMessage((chatData) => {
      const newMessage: ChatMessage = {
        id: `${chatData.timestamp}-${chatData.playerId}`,
        ...chatData
      };
      setChatMessages(prev => [...prev, newMessage]);
    });

    // Spectator events
    socketManager.onSpectatorJoined((spectator) => {
      setSpectatorCount(prev => prev + 1);
      addSystemMessage(`${spectator.username} is now spectating`);
    });

    socketManager.onSpectatorLeft(() => {
      setSpectatorCount(prev => Math.max(0, prev - 1));
    });
  }, [user]);

  const getOpponentUsername = (gameData: MultiplayerGameState): string => {
    if (!user) return 'Unknown';
    const opponent = gameData.players.player1.id === user.id ? 
      gameData.players.player2 : gameData.players.player1;
    return opponent.username;
  };

  const addSystemMessage = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      playerId: 'system',
      username: 'System',
      message,
      timestamp: Date.now(),
      type: 'system'
    };
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const startMatchmaking = async (gameMode: 'ranked' | 'casual') => {
    try {
      await socketManager.startMatchmaking({
        gameMode,
        deckFormat: 'standard',
        region: 'EU-West'
      });
      setMatchmakingState(prev => ({ ...prev, searching: true }));
      addSystemMessage(`Searching for ${gameMode} match...`);
    } catch (error) {
      console.error('Failed to start matchmaking:', error);
      addSystemMessage('Failed to start matchmaking', 'error');
    }
  };

  const cancelMatchmaking = () => {
    socketManager.cancelMatchmaking();
    setMatchmakingState(prev => ({ ...prev, searching: false }));
    addSystemMessage('Matchmaking cancelled');
  };

  const handleCardPlay = (card: BattleCard, targetPosition?: { x: number; y: number }) => {
    if (!gameState || !user) return;

    const action: GameAction = {
      type: 'play_card',
      playerId: user.id,
      timestamp: Date.now(),
      card,
      targetPosition
    };

    socketManager.sendGameAction(action);
    setSelectedCard(null);
    setTargetingMode(false);
  };

  const handleCardSelect = (card: BattleCard) => {
    setSelectedCard(card);
    if (card.targetRequired) {
      setTargetingMode(true);
    } else {
      handleCardPlay(card);
    }
  };

  const handleTargetSelect = (targetPosition: { x: number; y: number }) => {
    if (selectedCard && targetingMode) {
      handleCardPlay(selectedCard, targetPosition);
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    socketManager.sendChatMessage(chatInput);
    setChatInput('');
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // Connection Status Indicator
  const ConnectionIndicator = () => (
    <div className="flex items-center space-x-2">
      {connectionStatus === 'connected' ? (
        <>
          <Wifi className="h-4 w-4 text-green-400" />
          <span className="text-green-400 text-sm">Connected</span>
        </>
      ) : connectionStatus === 'connecting' ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
          <span className="text-yellow-400 text-sm">Connecting... ({connectionTimer}s)</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-400" />
          <span className="text-red-400 text-sm">Disconnected</span>
        </>
      )}
    </div>
  );

  // If not connected, show connection screen
  if (connectionStatus !== 'connected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-md">
          <div className="mb-6">
            <ConnectionIndicator />
          </div>
          {connectionStatus === 'connecting' ? (
            <div>
              <h2 className="text-white text-xl font-bold mb-2">Connecting to Battle Server</h2>
              <p className="text-gray-300 text-sm">Establishing secure connection...</p>
            </div>
          ) : (
            <div>
              <h2 className="text-white text-xl font-bold mb-2">Connection Failed</h2>
              <p className="text-gray-300 text-sm mb-4">Unable to connect to battle server</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If connected but no game, show matchmaking
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Multiplayer Battle Arena</h1>
                <p className="text-gray-300">Challenge players worldwide in epic card battles</p>
              </div>
              <ConnectionIndicator />
            </div>
          </div>

          {/* Matchmaking Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Match</h2>
              
              {matchmakingState.searching ? (
                <div className="text-center">
                  <div className="animate-pulse mb-4">
                    <Users className="h-16 w-16 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Searching for opponent...</p>
                    <p className="text-gray-400 text-sm">Est. wait time: {matchmakingState.estimatedWaitTime}s</p>
                  </div>
                  <button
                    onClick={cancelMatchmaking}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => startMatchmaking('ranked')}
                    className="w-full p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
                  >
                    <Crown className="h-5 w-5 inline mr-2" />
                    Ranked Match
                  </button>
                  <button
                    onClick={() => startMatchmaking('casual')}
                    className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    <Zap className="h-5 w-5 inline mr-2" />
                    Casual Match
                  </button>
                </div>
              )}
            </div>

            {/* Player Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Rank:</span>
                  <span className="text-yellow-400 font-semibold">{matchmakingState.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Region:</span>
                  <span className="text-blue-400">{matchmakingState.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Wins Today:</span>
                  <span className="text-green-400">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Win Rate:</span>
                  <span className="text-purple-400">67%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game in progress - render full battle interface
  const isMyTurn = gameState.currentPlayer === user?.id;
  const opponent = gameState.players.player1.id === user?.id ? 
    gameState.players.player2 : gameState.players.player1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative">
      {/* Game Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">
              Multiplayer Battle - Room: {gameState.roomId.slice(-6)}
            </h1>
            <ConnectionIndicator />
          </div>

          <div className="flex items-center space-x-4">
            {/* Turn Indicator */}
            <div className={`px-3 py-1 rounded-lg font-semibold ${
              isMyTurn ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              {isMyTurn ? 'Your Turn' : `${opponent.username}'s Turn`}
            </div>

            {/* Spectator Count */}
            {spectatorCount > 0 && (
              <div className="flex items-center space-x-1 text-gray-300">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{spectatorCount}</span>
              </div>
            )}

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 text-white hover:text-yellow-400 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Battle Field - Main Area */}
          <div className="lg:col-span-3">
            <BattleField
              gameState={gameState}
              onTargetSelect={handleTargetSelect}
              targetingMode={targetingMode}
            />

            {/* Player Hand */}
            <div className="mt-4">
              <PlayerHand
                cards={gameState.player.hand}
                selectedCard={selectedCard}
                onCardSelect={handleCardSelect}
                disabled={!isMyTurn}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Opponent Info */}
            <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-4 border border-red-500/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${
                  opponent.connected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-white font-semibold">{opponent.username}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Health:</span>
                  <span className="text-red-300">{gameState.opponent.health}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mana:</span>
                  <span className="text-blue-300">{gameState.opponent.mana}/{gameState.opponent.maxMana}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cards:</span>
                  <span className="text-gray-300">{gameState.opponent.hand.length}</span>
                </div>
              </div>
            </div>

            {/* Chat */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
                >
                  <div className="p-3 border-b border-white/20">
                    <h3 className="text-white font-semibold">Game Chat</h3>
                  </div>
                  
                  <div className="h-48 overflow-y-auto p-3 space-y-2">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        {msg.type === 'system' ? (
                          <div className="text-yellow-400 italic">
                            ⚡ {msg.message}
                          </div>
                        ) : (
                          <div>
                            <span className="text-blue-400">{msg.username}:</span>
                            <span className="text-gray-300 ml-1">{msg.message}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-white/20">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={handleChatKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                        maxLength={100}
                      />
                      <button
                        onClick={sendChatMessage}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}