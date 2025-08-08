"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Timer,
  Star,
  Trophy,
  Zap,
  Target,
  CheckCircle,
  X,
  ArrowRight,
  Flame,
  Diamond,
  Gift,
  RotateCcw,
  Home,
  Settings,
  Volume2,
  VolumeX,
  Pause,
  Play
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import CardPackOpening from "@/components/gamification/card-pack-opening";
import CodeHighlight from "@/components/quiz/code-highlight";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  category: string;
  tags: string[];
}

interface QuizSession {
  id: string;
  currentStreak: number;
  questions: Question[];
  currentQuestionIndex: number;
  startTime: Date;
  totalTime: number;
  isActive: boolean;
}

interface QuizStats {
  bestStreak: number;
  totalQuestions: number;
  totalCorrect: number;
  averageTime: number;
  rewardsEarned: {
    diamonds: number;
    cards: number;
    experience: number;
  };
}

export default function QuizArenaPage() {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Game State
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result' | 'gameOver'>('menu');
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  
  // Quiz Configuration
  const [selectedCategory, setSelectedCategory] = useState('Python Basics');
  const [selectedMode, setSelectedMode] = useState<'progressive' | 'mixed'>('progressive');
  const [categories, setCategories] = useState<{name: string, questionCount: number}[]>([]);
  
  // Stats & Rewards
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);
  
  // Timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load user stats and categories on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserStats();
      loadCategories();
    }
  }, [isAuthenticated, user]);

  // Timer management
  useEffect(() => {
    if (gameState === 'playing' && !isPaused && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      // Time's up - mark as wrong
      handleAnswerSubmit(-1);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameState, isPaused]);

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/quiz-arena/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setCurrentStreak(data.currentStreak || 0);
      }
    } catch (error) {
      console.error('Failed to load quiz stats:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/quiz-arena/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        if (data.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(data.categories[0].name);
        }
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const startNewGame = async () => {
    if (isStartingGame) return; // Prevent multiple clicks
    
    try {
      setIsStartingGame(true);
      const response = await fetch('/api/quiz-arena/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: selectedMode,
          category: selectedCategory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuizSession(data.session);
        setCurrentQuestion(data.firstQuestion);
        setGameState('playing');
        setTimeLeft(30);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
        playSound('game_start');
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
    } finally {
      setIsStartingGame(false);
    }
  };

  const handleAnswerSubmit = async (answerIndex: number) => {
    if (!currentQuestion || !quizSession || isAnswerRevealed) return;

    setSelectedAnswer(answerIndex);
    setIsAnswerRevealed(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCurrentStreak(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    try {
      const response = await fetch('/api/quiz-arena/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: quizSession.id,
          questionId: currentQuestion.id,
          answerIndex,
          timeSpent: 30 - timeLeft
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.gameOver) {
          // Game over - show final results
          setTimeout(() => {
            setGameState('gameOver');
            if (data.rewards) {
              setRewardData(data.rewards);
              setShowReward(true);
            }
          }, 2000);
        } else if (isCorrect) {
          // Continue to next question
          setTimeout(() => {
            setCurrentQuestion(data.nextQuestion);
            setTimeLeft(30);
            setSelectedAnswer(null);
            setIsAnswerRevealed(false);
          }, 2000);
        } else {
          // Wrong answer - game over
          setTimeout(() => {
            setGameState('gameOver');
            if (data.rewards) {
              setRewardData(data.rewards);
              setShowReward(true);
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const playSound = (type: 'correct' | 'wrong' | 'game_start' | 'reward') => {
    if (!soundEnabled) return;
    
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      const frequencies = {
        correct: 659,
        wrong: 220,
        game_start: 440,
        reward: 880
      };
      
      oscillator.frequency.setValueAtTime(frequencies[type], context.currentTime);
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
      console.log('Sound effect:', type);
    }
  };

  const resetGame = () => {
    if (isRestarting) return; // Prevent multiple clicks
    
    setIsRestarting(true);
    setGameState('menu');
    setQuizSession(null);
    setCurrentQuestion(null);
    setCurrentStreak(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setTimeLeft(30);
    setIsPaused(false);
    loadUserStats();
    
    // Reset restart state after a short delay
    setTimeout(() => {
      setIsRestarting(false);
    }, 500);
  };

  const getStreakReward = (streak: number) => {
    if (streak >= 25) return { type: 'legendary', color: 'from-purple-500 to-pink-500', icon: '👑', name: 'Legendary Card' };
    if (streak >= 15) return { type: 'epic', color: 'from-purple-400 to-purple-600', icon: '✨', name: 'Epic Card' };
    if (streak >= 10) return { type: 'rare', color: 'from-blue-400 to-blue-600', icon: '🎴', name: 'Rare Card' };
    if (streak >= 5) return { type: 'common', color: 'from-green-400 to-green-600', icon: '🃏', name: 'Common Card' };
    return null;
  };

  const getNextMilestone = (streak: number) => {
    if (streak < 5) return 5;
    if (streak < 10) return 10;
    if (streak < 15) return 15;
    if (streak < 25) return 25;
    return streak + 5;
  };

  // Complete HTML cleaning - no code highlighting at all
  const cleanHtml = (text: string): string => {
    if (!text) return '';
    
    let cleaned = text;
    
    // Remove ALL HTML patterns aggressively
    cleaned = cleaned.replace(/<span[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/span>/gi, '');
    cleaned = cleaned.replace(/span>/gi, '');
    cleaned = cleaned.replace(/<span/gi, '');
    cleaned = cleaned.replace(/\bspan\b/gi, '');
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    cleaned = cleaned.replace(/[<>]/g, '');
    
    // Remove CSS and class patterns
    cleaned = cleaned.replace(/class\s*=\s*[^\s]*/gi, '');
    cleaned = cleaned.replace(/text-[a-z]+-\d+/gi, '');
    cleaned = cleaned.replace(/font-[a-z-]+/gi, '');
    
    // Remove quotes and equals
    cleaned = cleaned.replace(/['"=]/g, '');
    
    // Clean multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  };

  // Simple text rendering - NO CODE HIGHLIGHTING
  const renderTextWithCode = (text: string) => {
    return cleanHtml(text);
  };

  // Simple option rendering - NO CODE HIGHLIGHTING
  const renderOption = (option: string) => {
    return cleanHtml(option);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading Quiz Arena...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <Brain className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Quiz Arena Access</h1>
          <p className="text-gray-300 mb-6">
            You need to be logged in to challenge yourself with Python quizzes.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            Login to Play
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 flex space-x-2 z-10">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        <Link
          href="/dashboard"
          className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <Home className="h-5 w-5" />
        </Link>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        
        {/* Menu State */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl w-full"
          >
            {/* Header */}
            <div className="mb-12">
              <motion.div
                className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="h-16 w-16 text-white" />
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="block text-white">Python</span>
                <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Quiz Arena
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Test your programming knowledge in rapid-fire questions.
                Build your streak to earn amazing card rewards!
              </p>
            </div>

            {/* Quiz Configuration */}
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Quiz Settings</h3>
                
                {/* Category Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name} className="bg-gray-800 text-white">
                        {cat.name} ({cat.questionCount} questions)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedMode('progressive')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedMode === 'progressive'
                          ? 'border-purple-400 bg-purple-500/20 text-white'
                          : 'border-white/30 bg-white/10 text-gray-300 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="font-medium">📈 Progressive</div>
                      <div className="text-xs mt-1">Easy → Hard</div>
                    </button>
                    <button
                      onClick={() => setSelectedMode('mixed')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedMode === 'mixed'
                          ? 'border-purple-400 bg-purple-500/20 text-white'
                          : 'border-white/30 bg-white/10 text-gray-300 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="font-medium">🎲 Mixed</div>
                      <div className="text-xs mt-1">Random Order</div>
                    </button>
                  </div>
                </div>

                {/* Selected Category Info */}
                {selectedCategory && (
                  <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                    <div className="text-center">
                      <div className="text-blue-300 font-medium">Selected: {selectedCategory}</div>
                      <div className="text-xs text-blue-200 mt-1">
                        {selectedMode === 'progressive'
                          ? 'Questions will start easy and get progressively harder'
                          : 'Questions will be in random order'
                        }
                      </div>
                      <div className="text-xs text-blue-200">
                        ⚡ Continue until you get a question wrong!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.bestStreak}</div>
                  <div className="text-sm text-gray-400">Best Streak</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{Math.round((stats.totalCorrect / stats.totalQuestions) * 100)}%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Diamond className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.rewardsEarned.diamonds}</div>
                  <div className="text-sm text-gray-400">Diamonds Earned</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Gift className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.rewardsEarned.cards}</div>
                  <div className="text-sm text-gray-400">Cards Earned</div>
                </div>
              </div>
            )}

            {/* Reward Milestones */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Strike Rewards</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div className="text-sm text-white">🃏 Common Card</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">10</span>
                  </div>
                  <div className="text-sm text-white">🎴 Rare Card</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">15</span>
                  </div>
                  <div className="text-sm text-white">✨ Epic Card</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">25</span>
                  </div>
                  <div className="text-sm text-white">👑 Legendary Card</div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              onClick={startNewGame}
              disabled={isStartingGame}
              className={`group relative inline-flex items-center px-12 py-4 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform shadow-2xl ${
                isStartingGame
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:scale-105'
              }`}
              whileHover={!isStartingGame ? { scale: 1.05 } : {}}
              whileTap={!isStartingGame ? { scale: 0.95 } : {}}
            >
              {isStartingGame ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Starting Quiz...
                </>
              ) : (
                <>
                  <Brain className="h-6 w-6 mr-3" />
                  Start Quiz Challenge
                </>
              )}
              {!isStartingGame && (
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-full">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="text-white font-bold">{currentStreak} Streak</span>
                </div>
                <div className="text-gray-400">
                  Next reward at {getNextMilestone(currentStreak)}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <Timer className="h-5 w-5" />
                  <span className="font-bold">{timeLeft}s</span>
                </div>
                
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Progress to next reward */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress to next reward</span>
                <span>{currentStreak}/{getNextMilestone(currentStreak)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStreak / getNextMilestone(currentStreak)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentQuestion.category}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Difficulty: {currentQuestion.difficulty}/5
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {renderTextWithCode(currentQuestion.question)}
                  </h2>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => !isAnswerRevealed && handleAnswerSubmit(index)}
                    disabled={isAnswerRevealed}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isAnswerRevealed
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500/20 text-green-300'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-500/20 text-red-300'
                          : 'border-gray-600 bg-gray-800/50 text-gray-400'
                        : 'border-white/30 bg-white/10 text-white hover:border-purple-400 hover:bg-purple-500/20'
                    }`}
                    whileHover={!isAnswerRevealed ? { scale: 1.02 } : {}}
                    whileTap={!isAnswerRevealed ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="font-medium">{renderOption(option)}</div>
                    </div>
                    
                    {isAnswerRevealed && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-400 ml-auto" />
                    )}
                    {isAnswerRevealed && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <X className="h-5 w-5 text-red-400 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              {isAnswerRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30"
                >
                  <h4 className="text-blue-300 font-bold mb-2">Explanation:</h4>
                  <p className="text-white">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Game Over State */}
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl w-full"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-xl text-gray-300 mb-6">
                Final Streak: <span className="text-orange-400 font-bold">{currentStreak}</span>
              </p>

              {rewardData && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                  <h3 className="text-white font-bold mb-2">Rewards Earned:</h3>
                  <div className="flex justify-center space-x-4 text-sm">
                    {rewardData.diamonds > 0 && (
                      <span className="text-yellow-400">💎 {rewardData.diamonds} Diamonds</span>
                    )}
                    {rewardData.experience > 0 && (
                      <span className="text-blue-400">⚡ {rewardData.experience} XP</span>
                    )}
                    {rewardData.cards && rewardData.cards.length > 0 && (
                      <span className="text-purple-400">🎴 {rewardData.cards.length} Cards</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={startNewGame}
                  disabled={isStartingGame}
                  className={`px-6 py-3 text-white font-bold rounded-lg transition-all flex items-center space-x-2 ${
                    isStartingGame
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  {isStartingGame ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      <span>Play Again</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetGame}
                  disabled={isRestarting}
                  className={`px-6 py-3 text-white font-bold rounded-lg transition-all flex items-center space-x-2 ${
                    isRestarting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                  }`}
                >
                  {isRestarting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Home className="h-4 w-4" />
                      <span>Back to Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Card Pack Opening Modal */}
      {showReward && rewardData?.cardPack && (
        <CardPackOpening
          isOpen={showReward}
          onClose={() => setShowReward(false)}
          cardPack={rewardData.cardPack}
          cards={rewardData.cards || []}
          celebrationType="pack"
          onOpenComplete={() => {
            setShowReward(false);
            loadUserStats();
          }}
        />
      )}
    </div>
  );
}