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
  Play,
  ArrowLeft,
  Menu,
  User,
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
  const [gameState, setGameState] = useState<
    "menu" | "playing" | "result" | "gameOver"
  >("menu");
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
  const [selectedCategory, setSelectedCategory] = useState("Python Basics");
  const [selectedMode, setSelectedMode] = useState<"progressive" | "mixed">(
    "progressive"
  );
  const [categories, setCategories] = useState<
    { name: string; questionCount: number }[]
  >([]);

  // Stats & Rewards
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);

  // Timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load user stats and categories on mount
  useEffect(() => {
    loadCategories(); // Always load categories for anonymous users too
    if (isAuthenticated && user) {
      loadUserStats();
    }
  }, [isAuthenticated, user]);

  // Timer management
  useEffect(() => {
    if (gameState === "playing" && !isPaused && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
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
      const response = await fetch("/api/quiz-arena/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setCurrentStreak(data.currentStreak || 0);
      }
    } catch (error) {
      console.error("Failed to load quiz stats:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/quiz-arena/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        if (data.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(data.categories[0].name);
        }
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      // For anonymous users, provide default categories
      setCategories([
        { name: "Python Basics", questionCount: 50 },
        { name: "Data Structures", questionCount: 30 },
        { name: "Algorithms", questionCount: 25 },
      ]);
    }
  };

  const startNewGame = async () => {
    if (isStartingGame) return; // Prevent multiple clicks

    try {
      setIsStartingGame(true);
      const response = await fetch("/api/quiz-arena/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty: selectedMode,
          category: selectedCategory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuizSession(data.session);
        setCurrentQuestion(data.firstQuestion);
        setGameState("playing");
        setTimeLeft(30);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
        playSound("game_start");
      } else if (response.status === 401 && !isAuthenticated) {
        // Anonymous user - show login incentive but allow to continue
        console.log(
          "Anonymous user starting quiz with potential rewards preview"
        );
        // For now, continue with a demo quiz
        const demoQuestion = {
          id: "demo_1",
          question:
            "Welcome to Python Quiz Arena! This is a demo question. Which operator is used to concatenate strings in Python?",
          options: ["&", "+", ".", "*"],
          correctAnswer: 1,
          explanation:
            "The + operator is used to concatenate strings in Python. Example: 'Hello' + ' World' = 'Hello World'",
          difficulty: 1,
          category: selectedCategory,
          tags: [],
        };

        setQuizSession({
          id: "demo_session",
          currentStreak: 0,
          questions: [demoQuestion],
          currentQuestionIndex: 0,
          startTime: new Date(),
          totalTime: 0,
          isActive: true,
        });
        setCurrentQuestion(demoQuestion);
        setGameState("playing");
        setTimeLeft(30);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
        playSound("game_start");
      }
    } catch (error) {
      console.error("Failed to start quiz:", error);
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
      setCurrentStreak((prev) => prev + 1);
      playSound("correct");
    } else {
      playSound("wrong");
    }

    // For anonymous users, handle demo quiz locally
    if (!isAuthenticated && quizSession.id === "demo_session") {
      setTimeout(() => {
        setGameState("gameOver");
        // Show potential rewards for anonymous users
        setRewardData({
          diamonds: currentStreak * 2,
          experience: currentStreak * 5,
          cards: [],
          loginMessage: "Login to earn real rewards!",
        });
      }, 2000);
      return;
    }

    try {
      const response = await fetch("/api/quiz-arena/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: quizSession.id,
          questionId: currentQuestion.id,
          answerIndex,
          timeSpent: 30 - timeLeft,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.gameOver) {
          // Game over - show final results
          setTimeout(() => {
            setGameState("gameOver");
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
            setGameState("gameOver");
            if (data.rewards) {
              setRewardData(data.rewards);
              setShowReward(true);
            }
          }, 2000);
        }
      } else if (response.status === 401 && !isAuthenticated) {
        // Anonymous user completed demo - show login incentive
        setTimeout(() => {
          setGameState("gameOver");
          setRewardData({
            diamonds: Math.max(1, currentStreak * 2),
            experience: Math.max(5, currentStreak * 5),
            cards: [],
            loginMessage: `🎯 ${currentStreak} correct answers! Login to earn ${currentStreak * 2} diamonds and ${currentStreak * 5} XP!`,
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      // For anonymous users, show demo completion
      if (!isAuthenticated) {
        setTimeout(() => {
          setGameState("gameOver");
          setRewardData({
            diamonds: Math.max(1, currentStreak * 2),
            experience: Math.max(5, currentStreak * 5),
            cards: [],
            loginMessage: "Login to earn real rewards and track your progress!",
          });
        }, 2000);
      }
    }
  };

  const playSound = (type: "correct" | "wrong" | "game_start" | "reward") => {
    if (!soundEnabled) return;

    try {
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      const frequencies = {
        correct: 659,
        wrong: 220,
        game_start: 440,
        reward: 880,
      };

      oscillator.frequency.setValueAtTime(
        frequencies[type],
        context.currentTime
      );
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        context.currentTime + 0.5
      );

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
      console.log("Sound effect:", type);
    }
  };

  const resetGame = () => {
    if (isRestarting) return; // Prevent multiple clicks

    setIsRestarting(true);
    setGameState("menu");
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
    if (streak >= 25)
      return {
        type: "legendary",
        color: "from-purple-500 to-pink-500",
        icon: "👑",
        name: "Legendary Card",
      };
    if (streak >= 15)
      return {
        type: "epic",
        color: "from-purple-400 to-purple-600",
        icon: "✨",
        name: "Epic Card",
      };
    if (streak >= 10)
      return {
        type: "rare",
        color: "from-blue-400 to-blue-600",
        icon: "🎴",
        name: "Rare Card",
      };
    if (streak >= 5)
      return {
        type: "common",
        color: "from-green-400 to-green-600",
        icon: "🃏",
        name: "Common Card",
      };
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
    if (!text) return "";

    let cleaned = text;

    // Remove ALL HTML patterns aggressively
    cleaned = cleaned.replace(/<span[^>]*>/gi, "");
    cleaned = cleaned.replace(/<\/span>/gi, "");
    cleaned = cleaned.replace(/span>/gi, "");
    cleaned = cleaned.replace(/<span/gi, "");
    cleaned = cleaned.replace(/\bspan\b/gi, "");
    cleaned = cleaned.replace(/<[^>]*>/g, "");
    cleaned = cleaned.replace(/[<>]/g, "");

    // Remove CSS and class patterns
    cleaned = cleaned.replace(/class\s*=\s*[^\s]*/gi, "");
    cleaned = cleaned.replace(/text-[a-z]+-\d+/gi, "");
    cleaned = cleaned.replace(/font-[a-z-]+/gi, "");

    // Remove quotes and equals
    cleaned = cleaned.replace(/['"=]/g, "");

    // Clean multiple spaces
    cleaned = cleaned.replace(/\s+/g, " ").trim();

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-yellow-400"></div>
          <p className="text-lg">Loading Quiz Arena...</p>
        </div>
      </div>
    );
  }

  // Anonymous users can now access Quiz Arena with incentive messaging

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* Improved Header Navigation */}
      <div className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Back Home Button - More Prominent */}
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-xl border border-white/30 bg-white/20 px-4 py-2 font-medium text-white transition-all hover:scale-105 hover:bg-white/30"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>

            {/* Center: Page Title */}
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-400" />
              <h1 className="hidden text-xl font-bold text-white sm:block">
                Quiz Arena
              </h1>
            </div>

            {/* Right: Settings & User */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="rounded-lg bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                title={soundEnabled ? "Disable Sound" : "Enable Sound"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </button>

              {user && (
                <div className="flex items-center space-x-2 rounded-lg bg-white/20 px-3 py-2 text-white">
                  <User className="h-4 w-4" />
                  <span className="hidden text-sm sm:inline">
                    {user.username || user.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 flex items-center justify-center p-4"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        {/* Menu State */}
        {gameState === "menu" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl text-center"
          >
            {/* Simplified Header */}
            <div className="mb-8">
              <motion.div
                className="mb-6 inline-block rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 p-6 shadow-2xl"
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="h-20 w-20 text-white" />
              </motion.div>

              <h1 className="mb-4 text-4xl font-bold lg:text-6xl">
                <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Python Quiz Arena
                </span>
              </h1>

              <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-300">
                🚀 Test your Python knowledge • 🔥 Build streaks • 🎁 Earn
                rewards
              </p>
            </div>

            {/* Quick Stats - Simplified */}
            {stats && (
              <div className="mx-auto mb-8 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 backdrop-blur-sm">
                  <Flame className="mx-auto mb-2 h-8 w-8 text-orange-400" />
                  <div className="text-2xl font-bold text-white">
                    {stats.bestStreak}
                  </div>
                  <div className="text-sm text-orange-200">Best Streak</div>
                </div>
                <div className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 backdrop-blur-sm">
                  <Target className="mx-auto mb-2 h-8 w-8 text-green-400" />
                  <div className="text-2xl font-bold text-white">
                    {Math.round(
                      (stats.totalCorrect / stats.totalQuestions) * 100
                    )}
                    %
                  </div>
                  <div className="text-sm text-green-200">Accuracy</div>
                </div>
                <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 backdrop-blur-sm">
                  <Diamond className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">
                    {stats.rewardsEarned.diamonds}
                  </div>
                  <div className="text-sm text-yellow-200">Diamonds</div>
                </div>
                <div className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-sm">
                  <Gift className="mx-auto mb-2 h-8 w-8 text-purple-400" />
                  <div className="text-2xl font-bold text-white">
                    {stats.rewardsEarned.cards}
                  </div>
                  <div className="text-sm text-purple-200">Cards</div>
                </div>
              </div>
            )}

            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
              {/* Quiz Configuration - Cleaner Design */}
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-6 flex items-center space-x-2">
                  <Settings className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">
                    Quiz Settings
                  </h3>
                </div>

                {/* Category Selection */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    📚 Choose Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-lg text-white transition-colors focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat.name}
                        value={cat.name}
                        className="bg-gray-800 text-white"
                      >
                        {cat.name} ({cat.questionCount} questions)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode Selection */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    🎯 Difficulty Mode
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => setSelectedMode("progressive")}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        selectedMode === "progressive"
                          ? "border-purple-400 bg-purple-500/20 text-white"
                          : "border-white/30 bg-white/10 text-gray-300 hover:border-purple-400/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📈</span>
                        <div>
                          <div className="font-medium">Progressive Mode</div>
                          <div className="text-sm opacity-75">
                            Start easy, get progressively harder
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedMode("mixed")}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        selectedMode === "mixed"
                          ? "border-purple-400 bg-purple-500/20 text-white"
                          : "border-white/30 bg-white/10 text-gray-300 hover:border-purple-400/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎲</span>
                        <div>
                          <div className="font-medium">Mixed Mode</div>
                          <div className="text-sm opacity-75">
                            Random difficulty levels
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Game Rules */}
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/20 p-4">
                  <div className="text-center">
                    <div className="mb-2 font-medium text-blue-300">
                      ⚡ Game Rules
                    </div>
                    <div className="space-y-1 text-sm text-blue-200">
                      <div>
                        • Answer questions correctly to build your streak
                      </div>
                      <div>• One wrong answer ends the game</div>
                      <div>• Earn cards and diamonds for high streaks!</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward Milestones - Visual Improvement */}
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-6 flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">
                    Streak Rewards
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 rounded-xl border border-green-500/30 bg-green-500/20 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 text-lg font-bold text-white">
                      5
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        🃏 Common Card
                      </div>
                      <div className="text-sm text-green-200">
                        First milestone reward
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-xl border border-blue-500/30 bg-blue-500/20 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-lg font-bold text-white">
                      10
                    </div>
                    <div>
                      <div className="font-medium text-white">🎴 Rare Card</div>
                      <div className="text-sm text-blue-200">
                        Getting serious!
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-xl border border-purple-500/30 bg-purple-500/20 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-lg font-bold text-white">
                      15
                    </div>
                    <div>
                      <div className="font-medium text-white">✨ Epic Card</div>
                      <div className="text-sm text-purple-200">
                        Expert level!
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-lg font-bold text-white">
                      25
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        👑 Legendary Card
                      </div>
                      <div className="text-sm text-yellow-200">
                        Master achievement!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button - More Prominent */}
            <div className="mt-8">
              <motion.button
                onClick={startNewGame}
                disabled={isStartingGame}
                className={`group relative inline-flex transform items-center rounded-2xl px-16 py-6 text-2xl font-bold text-white shadow-2xl transition-all duration-300 ${
                  isStartingGame
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                }`}
                whileHover={!isStartingGame ? { scale: 1.05 } : {}}
                whileTap={!isStartingGame ? { scale: 0.95 } : {}}
              >
                {isStartingGame ? (
                  <>
                    <div className="mr-4 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                    Starting Quiz...
                  </>
                ) : (
                  <>
                    <Zap className="mr-4 h-8 w-8" />
                    Start Quiz Challenge
                    <ArrowRight className="ml-4 h-8 w-8" />
                  </>
                )}
                {!isStartingGame && (
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === "playing" && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl"
          >
            {/* Game Header with Better Navigation */}
            <div className="mb-8 flex items-center justify-between rounded-xl border border-white/20 bg-black/20 p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <button
                  onClick={resetGame}
                  className="flex items-center space-x-2 rounded-lg bg-gray-600/50 px-4 py-2 text-white transition-colors hover:bg-gray-600/70"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Exit</span>
                </button>
                <div className="flex items-center space-x-2 rounded-full bg-orange-500/20 px-4 py-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="font-bold text-white">
                    {currentStreak} Streak
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Next reward at {getNextMilestone(currentStreak)}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center space-x-2 rounded-full px-4 py-2 ${
                    timeLeft <= 10
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  <Timer className="h-5 w-5" />
                  <span className="text-lg font-bold">{timeLeft}s</span>
                </div>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="rounded-lg bg-white/20 p-3 text-white transition-colors hover:bg-white/30"
                >
                  {isPaused ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    <Pause className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Progress to next reward */}
            <div className="mb-8">
              <div className="mb-2 flex justify-between text-sm text-gray-300">
                <span>Progress to next reward</span>
                <span>
                  {currentStreak}/{getNextMilestone(currentStreak)}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-700">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{
                    width: `${(currentStreak / getNextMilestone(currentStreak)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center space-x-2">
                    <span className="rounded-full bg-purple-500 px-4 py-2 text-sm font-medium text-white">
                      {currentQuestion.category}
                    </span>
                    <span className="text-sm text-gray-400">
                      Difficulty: {currentQuestion.difficulty}/5
                    </span>
                  </div>
                  <h2 className="mb-4 text-2xl font-bold leading-relaxed text-white lg:text-3xl">
                    {renderTextWithCode(currentQuestion.question)}
                  </h2>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() =>
                      !isAnswerRevealed && handleAnswerSubmit(index)
                    }
                    disabled={isAnswerRevealed}
                    className={`rounded-xl border-2 p-6 text-left transition-all ${
                      isAnswerRevealed
                        ? index === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-500/20 text-green-300"
                          : index === selectedAnswer
                            ? "border-red-500 bg-red-500/20 text-red-300"
                            : "border-gray-600 bg-gray-800/50 text-gray-400"
                        : "border-white/30 bg-white/10 text-white hover:border-purple-400 hover:bg-purple-500/20"
                    }`}
                    whileHover={!isAnswerRevealed ? { scale: 1.02 } : {}}
                    whileTap={!isAnswerRevealed ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <div className="text-lg font-medium">
                          {renderOption(option)}
                        </div>
                      </div>

                      {isAnswerRevealed &&
                        index === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        )}
                      {isAnswerRevealed &&
                        index === selectedAnswer &&
                        index !== currentQuestion.correctAnswer && (
                          <X className="h-6 w-6 text-red-400" />
                        )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              {isAnswerRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl border border-blue-500/30 bg-blue-500/20 p-6"
                >
                  <h4 className="mb-2 text-lg font-bold text-blue-300">
                    💡 Explanation:
                  </h4>
                  <p className="text-lg leading-relaxed text-white">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Game Over State */}
        {gameState === "gameOver" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl text-center"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <Trophy className="mx-auto mb-6 h-20 w-20 text-yellow-400" />
              <h2 className="mb-4 text-4xl font-bold text-white">Game Over!</h2>
              <p className="mb-6 text-2xl text-gray-300">
                Final Streak:{" "}
                <span className="font-bold text-orange-400">
                  {currentStreak}
                </span>
              </p>

              {rewardData && (
                <div className="mb-8 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6">
                  {isAuthenticated ? (
                    <>
                      <h3 className="mb-4 text-xl font-bold text-white">
                        🎁 Rewards Earned:
                      </h3>
                      <div className="flex justify-center space-x-6 text-lg">
                        {rewardData.diamonds > 0 && (
                          <span className="font-bold text-yellow-400">
                            💎 {rewardData.diamonds} Diamonds
                          </span>
                        )}
                        {rewardData.experience > 0 && (
                          <span className="font-bold text-blue-400">
                            ⚡ {rewardData.experience} XP
                          </span>
                        )}
                        {rewardData.cards && rewardData.cards.length > 0 && (
                          <span className="font-bold text-purple-400">
                            🎴 {rewardData.cards.length} Cards
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="mb-4 text-xl font-bold text-white">
                        🎁 Your Potential Rewards:
                      </h3>
                      <div className="mb-4 flex justify-center space-x-6 text-lg">
                        {rewardData.diamonds > 0 && (
                          <span className="font-bold text-yellow-400">
                            💎 {rewardData.diamonds} Diamonds
                          </span>
                        )}
                        {rewardData.experience > 0 && (
                          <span className="font-bold text-blue-400">
                            ⚡ {rewardData.experience} XP
                          </span>
                        )}
                      </div>
                      {rewardData.loginMessage && (
                        <div className="rounded-lg border border-orange-500/30 bg-orange-500/20 p-4 text-center">
                          <p className="mb-3 text-orange-200">
                            {rewardData.loginMessage}
                          </p>
                          <Link
                            href="/login"
                            className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 font-medium text-white transition-all hover:from-orange-600 hover:to-red-600"
                          >
                            Login and Earn Rewards
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={startNewGame}
                  disabled={isStartingGame}
                  className={`flex items-center space-x-2 rounded-xl px-8 py-4 text-lg font-bold text-white transition-all ${
                    isStartingGame
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:from-blue-600 hover:to-purple-600"
                  }`}
                >
                  {isStartingGame ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-5 w-5" />
                      <span>Play Again</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetGame}
                  disabled={isRestarting}
                  className={`flex items-center space-x-2 rounded-xl px-8 py-4 text-lg font-bold text-white transition-all ${
                    isRestarting
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 hover:scale-105 hover:from-gray-600 hover:to-gray-700"
                  }`}
                >
                  {isRestarting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Home className="h-5 w-5" />
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
