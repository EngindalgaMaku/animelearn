"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Settings, 
  Home, 
  Pause, 
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import Link from 'next/link';

// Import battle system
import { BattleCard, GameState, Player, ElementType, RarityTier, AIDifficulty, AIPersonality } from '../../types/battle/core';
import { createGameState, executePlayerAction, checkGameEnd } from '../../utils/battle/gameStateManager';
import { createSampleDecks } from '../../data/cards/cardFactory';
import { getAIAction } from '../../utils/battle/aiOpponent';

// Import UI components
import BattleField from './BattleField';
import PlayerHand from './PlayerHand';
import BattleCardComponent from './BattleCard';

interface BattleStats {
  damage: number;
  healing: number;
  cardsPlayed: number;
  specialAbilitiesUsed: number;
}

export default function BattleInterface() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<BattleCard | null>(null);
  const [targetingMode, setTargetingMode] = useState(false);
  const [battleStats, setBattleStats] = useState<BattleStats>({
    damage: 0,
    healing: 0,
    cardsPlayed: 0,
    specialAbilitiesUsed: 0
  });
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [turnTimer, setTurnTimer] = useState(30);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Turn timer
  useEffect(() => {
    if (!gameState || gameEnded || isPaused) return;

    const timer = setInterval(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
          // Auto-end turn
          if (gameState.currentPlayer === 'player') {
            endTurn();
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState?.turn, gameEnded, isPaused]);

  const initializeGame = () => {
    try {
      const decks = createSampleDecks();
      const newGameState = createGameState(decks.playerDeck, decks.opponentDeck);
      setGameState(newGameState);
      setGameEnded(false);
      setWinner(null);
      setBattleStats({
        damage: 0,
        healing: 0,
        cardsPlayed: 0,
        specialAbilitiesUsed: 0
      });
      setBattleLog(['⚔️ Battle begins! Choose your strategy wisely.']);
      setTurnTimer(30);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setBattleLog(['❌ Failed to initialize battle. Please try again.']);
    }
  };

  const handleCardPlay = async (card: BattleCard, targetPosition?: { x: number; y: number }) => {
    if (!gameState || gameEnded || animating || gameState.currentPlayer !== 'player') return;

    setAnimating(true);
    
    try {
      const action = {
        type: 'play_card' as const,
        playerId: 'player',
        timestamp: Date.now(),
        card,
        targetPosition
      };

      const newGameState = executePlayerAction(gameState, action);
      setGameState(newGameState);
      
      // Update stats
      setBattleStats(prev => ({
        ...prev,
        cardsPlayed: prev.cardsPlayed + 1,
        damage: prev.damage + (card.attackPower || 0)
      }));

      // Add to battle log
      setBattleLog(prev => [...prev, `🃏 Played ${card.name} (${card.element})`]);

      // Check if game ended
      const gameEndResult = checkGameEnd(newGameState);
      if (gameEndResult.ended) {
        setGameEnded(true);
        setWinner(gameEndResult.winner!);
        setBattleLog(prev => [...prev, `🏆 ${gameEndResult.winner === 'player' ? 'Victory!' : 'Defeat!'}`]);
      } else {
        // AI turn after short delay
        setTimeout(() => {
          handleAITurn(newGameState);
        }, 1000);
      }
    } catch (error) {
      console.error('Error playing card:', error);
      setBattleLog(prev => [...prev, '❌ Failed to play card']);
    } finally {
      setTimeout(() => setAnimating(false), 500);
    }
  };

  const handleAITurn = async (currentState: GameState) => {
    if (currentState.currentPlayer !== 'opponent') return;

    try {
      const aiAction = await getAIAction(currentState, AIDifficulty.INTERMEDIATE, AIPersonality.AGGRESSIVE);
      
      if (aiAction) {
        const newGameState = executePlayerAction(currentState, aiAction);
        setGameState(newGameState);
        
        setBattleLog(prev => [...prev, `🤖 AI played ${aiAction.card?.name || 'unknown card'}`]);

        // Check if game ended
        const gameEndResult = checkGameEnd(newGameState);
        if (gameEndResult.ended) {
          setGameEnded(true);
          setWinner(gameEndResult.winner!);
          setBattleLog(prev => [...prev, `🏆 ${gameEndResult.winner === 'player' ? 'Victory!' : 'Defeat!'}`]);
        }
      }
    } catch (error) {
      console.error('AI turn error:', error);
      setBattleLog(prev => [...prev, '⚠️ AI turn failed']);
    }
  };

  const endTurn = () => {
    if (!gameState || gameEnded) return;
    
    // Switch turns and reset timer
    const newGameState = {
      ...gameState,
      currentPlayer: gameState.currentPlayer === 'player' ? 'opponent' as const : 'player' as const,
      turn: gameState.turn + 1
    };
    
    setGameState(newGameState);
    setTurnTimer(30);
    
    if (newGameState.currentPlayer === 'opponent') {
      setTimeout(() => handleAITurn(newGameState), 500);
    }
  };

  const handleCardSelect = (card: BattleCard) => {
    setSelectedCard(card);
    if (card.targetRequired) {
      setTargetingMode(true);
    } else {
      handleCardPlay(card);
      setSelectedCard(null);
    }
  };

  const handleTargetSelect = (targetPosition: { x: number; y: number }) => {
    if (selectedCard && targetingMode) {
      handleCardPlay(selectedCard, targetPosition);
      setSelectedCard(null);
      setTargetingMode(false);
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Initializing Elements of Legends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Game Header */}
      <div className="relative z-10 p-4 border-b border-white/20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Game Title & Status */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              Elements of <span className="text-yellow-400">Legends</span>
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className={`w-2 h-2 rounded-full ${gameState.currentPlayer === 'player' ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>Turn {gameState.turn}</span>
              <span>•</span>
              <span>{gameState.currentPlayer === 'player' ? 'Your Turn' : 'AI Turn'}</span>
            </div>
          </div>

          {/* Turn Timer */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2 text-white">
                <Zap className="h-4 w-4" />
                <span className="font-mono">{turnTimer}s</span>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 text-white hover:text-yellow-400 transition-colors"
              >
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 text-white hover:text-yellow-400 transition-colors"
                disabled={gameEnded}
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </button>

              <button
                onClick={initializeGame}
                className="p-2 text-white hover:text-yellow-400 transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <Link
                href="/dashboard"
                className="p-2 text-white hover:text-yellow-400 transition-colors"
              >
                <Home className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="relative z-10 flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Opponent Area */}
          <div className="mb-6">
            <div className="bg-red-900/30 backdrop-blur-sm rounded-2xl p-4 border border-red-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AI Opponent</h3>
                    <p className="text-red-200 text-sm">Health: {gameState.opponent.health}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">Cards: {gameState.opponent.hand.length}</p>
                  <p className="text-red-200 text-sm">Mana: {gameState.opponent.mana}/10</p>
                </div>
              </div>
              
              {/* Opponent's field cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gameState.opponent.field.map((card: BattleCard, index: number) => (
                  <BattleCardComponent
                    key={`opponent-${index}`}
                    card={card}
                    isOpponent={true}
                    onClick={() => {}}
                    disabled={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Battle Field */}
          <BattleField
            gameState={gameState}
            onTargetSelect={handleTargetSelect}
            targetingMode={targetingMode}
          />

          {/* Player Area */}
          <div className="mt-6">
            <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">You</h3>
                    <p className="text-blue-200 text-sm">Health: {gameState.player.health}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">Cards: {gameState.player.hand.length}</p>
                  <p className="text-blue-200 text-sm">Mana: {gameState.player.mana}/10</p>
                </div>
              </div>

              {/* Player Hand */}
              <PlayerHand
                cards={gameState.player.hand}
                onCardSelect={handleCardSelect}
                selectedCard={selectedCard}
                disabled={gameState.currentPlayer !== 'player' || animating || gameEnded}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Battle Log Sidebar */}
      <div className="fixed right-4 top-20 bottom-4 w-80 bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 p-4 overflow-hidden">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Battle Log
        </h3>
        <div className="space-y-2 h-full overflow-y-auto">
          {battleLog.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-gray-300 bg-white/10 rounded-lg p-2"
            >
              {log}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game End Modal */}
      <AnimatePresence>
        {gameEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md mx-4 border border-white/20"
            >
              <div className="mb-6">
                {winner === 'player' ? (
                  <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                ) : (
                  <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
                )}
                <h2 className="text-3xl font-bold text-white mb-2">
                  {winner === 'player' ? 'Victory!' : 'Defeat!'}
                </h2>
                <p className="text-gray-300">
                  {winner === 'player' 
                    ? 'You have mastered the elements!' 
                    : 'The AI has bested you this time.'}
                </p>
              </div>

              {/* Battle Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-gray-300">Damage Dealt</p>
                  <p className="text-white font-bold">{battleStats.damage}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-gray-300">Cards Played</p>
                  <p className="text-white font-bold">{battleStats.cardsPlayed}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={initializeGame}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  Play Again
                </button>
                <Link
                  href="/dashboard"
                  className="block w-full px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all text-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && !gameEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
              <Pause className="h-16 w-16 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Game Paused</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Resume Battle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}