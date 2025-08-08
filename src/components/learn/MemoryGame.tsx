"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Clock,
  Star,
  Diamond,
  CheckCircle,
  X,
  Trophy,
  Zap,
  Brain,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

interface MemoryCard {
  id: string;
  text: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
  isHighlighted: boolean;
  type: 'question' | 'answer';
}

interface MemoryGameProps {
  activityId: string;
  content: {
    pairs: Array<{ id: number; text: string; match: string }>;
    timeLimit?: number;
    shuffleCards?: boolean;
  };
  diamondReward: number;
  experienceReward: number;
  onComplete: (score: number, timeSpent: number, success: boolean) => void;
  isCompleted?: boolean; // Track if activity was already completed
}

const MemoryGame: React.FC<MemoryGameProps> = ({
  activityId,
  content,
  diamondReward,
  experienceReward,
  onComplete,
  isCompleted = false,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(content.timeLimit || 300);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<MemoryCard | null>(null);
  const [isFirstCompletion, setIsFirstCompletion] = useState(!isCompleted);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize cards
  useEffect(() => {
    const gameCards: MemoryCard[] = [];
    
    content.pairs.forEach((pair) => {
      // Card 1 - Question
      gameCards.push({
        id: `${pair.id}-1`,
        text: pair.text,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'question',
      });
      
      // Card 2 - Answer
      gameCards.push({
        id: `${pair.id}-2`,
        text: pair.match,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'answer',
      });
    });

    // Shuffle cards if enabled
    if (content.shuffleCards !== false) {
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
    }

    setCards(gameCards);
  }, [content]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameCompleted) {
      // Time's up
      endGame(false);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, timeLeft]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [card1Id, card2Id] = flippedCards;
      const card1 = cards.find(c => c.id === card1Id);
      const card2 = cards.find(c => c.id === card2Id);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // Match found! Remove matched cards from the board after a short animation
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.pairId === card1.pairId
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          ));
          setMatchedPairs(prev => new Set([...prev, card1.pairId]));
          setFlippedCards([]);
          
          // Remove matched cards after showing success animation
          setTimeout(() => {
            setCards(prev => prev.filter(card => card.pairId !== card1.pairId));
            setIsProcessing(false);
          }, 800);
        }, 300);
      } else {
        // No match - flip cards back
        setMistakes(prev => prev + 1);
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            flippedCards.includes(card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 800);
      }
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.size === content.pairs.length && gameStarted) {
      endGame(true);
    }
  }, [matchedPairs, content.pairs.length, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  };

  const resetGame = () => {
    setFlippedCards([]);
    setMatchedPairs(new Set());
    setTimeLeft(content.timeLimit || 300);
    setGameStarted(false);
    setGameCompleted(false);
    setMistakes(0);
    setHintsUsed(0);
    setShowHint(false);
    setStartTime(null);
    setIsProcessing(false);
    setSelectedCard(null);
    
    // Recreate all cards from original content
    const gameCards: MemoryCard[] = [];
    
    content.pairs.forEach((pair) => {
      gameCards.push({
        id: `${pair.id}-1`,
        text: pair.text,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'question',
      });
      
      gameCards.push({
        id: `${pair.id}-2`,
        text: pair.match,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'answer',
      });
    });

    // Shuffle cards if enabled
    if (content.shuffleCards !== false) {
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
    }

    setCards(gameCards);
  };

  const endGame = (success: boolean) => {
    setGameCompleted(true);
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    // Calculate score based on success, time, and mistakes
    let score = 0;
    if (success) {
      const timeBonus = Math.max(0, (content.timeLimit || 300) - timeSpent) / (content.timeLimit || 300);
      const mistakesPenalty = Math.max(0, 1 - (mistakes * 0.1));
      const hintsBonus = Math.max(0, 1 - (hintsUsed * 0.05));
      score = Math.round(100 * timeBonus * mistakesPenalty * hintsBonus);
    }
    
    // Only call onComplete if this is first completion (for rewards)
    if (success && isFirstCompletion) {
      setIsFirstCompletion(false);
      onComplete(score, timeSpent, success);
    } else if (!success) {
      // Always call onComplete for failures (no rewards anyway)
      onComplete(score, timeSpent, success);
    }
  };

  const handleCardClick = (cardId: string) => {
    // Prevent clicking if game not started, completed, processing, or already have 2 flipped cards
    if (!gameStarted || gameCompleted || isProcessing || flippedCards.length >= 2 || selectedCard) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Show card content in modal first
    setSelectedCard(card);
    
    // After a shorter delay, flip the card in the game
    setTimeout(() => {
      setCards(prev => prev.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
      setFlippedCards(prev => [...prev, cardId]);
      setSelectedCard(null);
    }, 2000); // Reduced from 4000ms to 2000ms
  };

  const handleModalClose = () => {
    setSelectedCard(null);
  };

  const useHint = () => {
    if (hintsUsed >= 3 || gameCompleted) return;
    
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    
    // Show a matching pair for 2 seconds
    const unmatched = cards.filter(card => !card.isMatched);
    if (unmatched.length >= 2) {
      const randomPairId = unmatched[0].pairId;
      const pairCards = unmatched.filter(card => card.pairId === randomPairId);
      
      setCards(prev => prev.map(card => 
        card.pairId === randomPairId 
          ? { ...card, isHighlighted: true }
          : card
      ));
      
      setTimeout(() => {
        setCards(prev => prev.map(card => ({ ...card, isHighlighted: false })));
        setShowHint(false);
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Memory Game</h2>
              <p className="text-purple-100">Match all the pairs to complete!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl font-bold">{formatTime(timeLeft)}</div>
              <div className="text-sm text-purple-200">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{matchedPairs.size}/{content.pairs.length}</div>
              <div className="text-sm text-purple-200">Pairs</div>
            </div>
          </div>
        </div>
        
        {/* Rewards Display */}
        <div className="mt-4 flex items-center justify-center space-x-6 rounded-lg bg-white/20 p-3 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Diamond className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {isFirstCompletion ? `+${diamondReward} Diamonds` : 'No Rewards (Replay)'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {isFirstCompletion ? `+${experienceReward} XP` : 'Practice Mode'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">
              {isCompleted ? 'Already Completed!' : 'Complete to Earn!'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <X className="h-4 w-4 text-red-500" />
            <span>Mistakes: {mistakes}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Hints: {hintsUsed}/3</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!gameStarted && !gameCompleted && (
            <button
              onClick={startGame}
              className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <Star className="h-4 w-4" />
              <span>Start Game</span>
            </button>
          )}
          
          {gameStarted && !gameCompleted && (
            <button
              onClick={useHint}
              disabled={hintsUsed >= 3 || showHint}
              className="flex items-center space-x-2 rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-4 w-4" />
              <span>Hint</span>
            </button>
          )}
          
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className={`relative grid gap-3 ${
        cards.length <= 6 ? 'grid-cols-2 sm:grid-cols-3' :
        cards.length <= 12 ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4' :
        'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
      }`}>
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: gameStarted && !card.isMatched ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className={`relative aspect-square min-h-[80px] ${
                !gameStarted || card.isMatched || isProcessing || flippedCards.length >= 2 || selectedCard
                  ? 'cursor-default opacity-75'
                  : 'cursor-pointer hover:scale-105'
              } transition-all duration-200`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className={`
                absolute inset-0 rounded-xl border-2 transition-all duration-200
                ${card.isMatched
                  ? 'border-green-400 bg-green-50'
                  : card.isHighlighted
                    ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                    : card.isFlipped
                      ? card.type === 'question'
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-green-400 bg-green-50'
                      : card.type === 'question'
                        ? 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-md'
                        : 'border-green-200 bg-white hover:border-green-400 hover:shadow-md'
                }
              `}>
                <div className="flex h-full items-center justify-center p-3">
                  {card.isFlipped || card.isMatched || card.isHighlighted ? (
                    <div className={`text-center ${
                      card.isMatched ? 'text-green-700' :
                      card.isHighlighted ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      <div className="font-medium leading-snug text-center break-words text-xs overflow-hidden">
                        <div className="line-clamp-3">
                          {card.text.length > 30 ? `${card.text.substring(0, 30)}...` : card.text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center rounded-lg ${
                      card.type === 'question'
                        ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                        : 'bg-gradient-to-br from-green-400 to-emerald-500'
                    }`}>
                      <div className="flex flex-col items-center justify-center text-white">
                        {card.type === 'question' ? (
                          <HelpCircle className="h-6 w-6 mb-1" />
                        ) : (
                          <MessageSquare className="h-6 w-6 mb-1" />
                        )}
                        <span className="font-medium text-xs">
                          {card.type === 'question' ? 'Q' : 'A'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {card.isMatched && (
                  <div className="absolute -right-2 -top-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Card Content Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
                  selectedCard.type === 'question'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {selectedCard.type === 'question' ? (
                    <HelpCircle className="h-7 w-7" />
                  ) : (
                    <MessageSquare className="h-7 w-7" />
                  )}
                </div>
                
                <h3 className={`text-sm font-medium mb-3 ${
                  selectedCard.type === 'question' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {selectedCard.type === 'question' ? 'Question' : 'Answer'}
                </h3>
                
                <p className="text-base font-semibold text-gray-900 mb-5 leading-relaxed px-2">
                  {selectedCard.text}
                </p>
                
                <button
                  onClick={handleModalClose}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium shadow-md"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {gameCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="text-center">
                {matchedPairs.size === content.pairs.length ? (
                  <>
                    <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      Congratulations! 🎉
                    </h3>
                    <p className="mb-4 text-gray-600">
                      You completed the memory game!
                    </p>
                    
                    {/* Score */}
                    <div className="mb-6 rounded-lg bg-gray-50 p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Final Score</div>
                          <div className={`text-xl font-bold ${getScoreColor(
                            Math.round(100 * (1 - mistakes * 0.1) * (1 - hintsUsed * 0.05))
                          )}`}>
                            {Math.round(100 * (1 - mistakes * 0.1) * (1 - hintsUsed * 0.05))}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Time Spent</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatTime((content.timeLimit || 300) - timeLeft)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Mistakes</div>
                          <div className="text-xl font-bold text-red-600">{mistakes}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Hints Used</div>
                          <div className="text-xl font-bold text-yellow-600">{hintsUsed}</div>
                        </div>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="mb-6 flex items-center justify-center space-x-6">
                      {isFirstCompletion ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <Diamond className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-yellow-600">+{diamondReward}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-purple-500" />
                            <span className="font-bold text-purple-600">+{experienceReward} XP</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Practice completed! No rewards for replay.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="mx-auto mb-4 h-16 w-16 text-red-500" />
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      Time's Up! ⏰
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Don't worry, try again to improve your score!
                    </p>
                  </>
                )}
                
                <button
                  onClick={resetGame}
                  className="w-full rounded-lg bg-purple-600 py-3 text-white hover:bg-purple-700"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryGame;