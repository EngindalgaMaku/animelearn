"use client";

import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Star,
  Diamond,
  Trophy,
  Target,
  Book,
  ShoppingBag,
  Award,
  Zap,
  Users,
  TrendingUp,
  Code,
  Play,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Heart,
  Gamepad2,
  Crown,
  Shield,
  Gift,
  Calendar,
  BarChart3,
  Brain,
  Rocket,
  Badge,
  Timer,
  Monitor,
  Flame,
  Globe,
  ChevronRight,
  FileText,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Eye,
  Copy,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/app/clean/components/HeroSection";

interface Stats {
  totalUsers: number;
  totalLessons: number;
  animeCards: number;
  carCards: number;
  totalDiamonds: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalLessons: 0,
    animeCards: 0,
    carCards: 0,
    totalDiamonds: 0,
  });
  const [animeCards, setAnimeCards] = useState<any[]>([]);
  const [starCards, setStarCards] = useState<any[]>([]);
  const [sampleQuiz, setSampleQuiz] = useState<any>(null);
  const [dailyTip, setDailyTip] = useState<any>(null);
  const [tipProgress, setTipProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isTipExpanded, setIsTipExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const dailyTipRef = useRef<HTMLDivElement | null>(null);
  const [dailyTipVisible, setDailyTipVisible] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Image protection functions (same as shop)
  const disableImageInteractions = () => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && ["s", "a", "c", "x", "v", "p", "u"].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key))
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  };

  useEffect(() => {
    const cleanup = disableImageInteractions();
    return cleanup;
  }, []);

  useEffect(() => {
    fetchStats();
    fetchSampleCards();
    fetchSampleQuiz();
  }, []);

  // Lazy-load Daily Tip: observe sentinel near the section and fetch when in view
  useEffect(() => {
    const el = dailyTipRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDailyTipVisible(true);
            observer.disconnect();
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (dailyTipVisible && !dailyTip) {
      fetchDailyTip();
    }
  }, [dailyTipVisible, dailyTip]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/homepage/stats");
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers || 1250,
          totalLessons: data.totalLessons || 45,
          animeCards: data.animeCards || 250,
          carCards: data.carCards || 200,
          totalDiamonds: data.totalDiamonds || 50000,
        });
      } else {
        // Fallback values
        setStats({
          totalUsers: 1250,
          totalLessons: 45,
          animeCards: 250,
          carCards: 200,
          totalDiamonds: 50000,
        });
      }
    } catch (error) {
      console.error("Stats fetch failed:", error);
      // Fallback values
      setStats({
        totalUsers: 1250,
        totalLessons: 45,
        animeCards: 250,
        carCards: 200,
        totalDiamonds: 50000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleQuiz = async () => {
    try {
      const response = await fetch("/api/homepage/sample-quiz");
      if (response.ok) {
        const quizData = await response.json();
        setSampleQuiz(quizData);
      }
    } catch (error) {
      console.error("Sample quiz fetch failed:", error);
      // Fallback quiz will be used in component
    }
  };

  const fetchSampleCards = async () => {
    try {
      // Fetch anime cards (from anime-collection category)
      const animeResponse = await fetch(
        "/api/shop?category=anime-collection&limit=3&sort=newest"
      );
      if (animeResponse.ok) {
        const animeData = await animeResponse.json();
        setAnimeCards(animeData.cards || []);
      }

      // Fetch star cards (from star-collection category)
      const starResponse = await fetch(
        "/api/shop?category=star-collection&limit=3&sort=newest"
      );
      if (starResponse.ok) {
        const starData = await starResponse.json();
        setStarCards(starData.cards || []);
      }
    } catch (error) {
      console.error("Failed to fetch sample cards:", error);
    }
  };

  const fetchDailyTip = async () => {
    try {
      const response = await fetch("/api/python-tips/daily");
      if (response.ok) {
        const data = await response.json();
        setDailyTip(data.dailyTip);
        setTipProgress(data.userProgress);
      }
    } catch (error) {
      console.error("Failed to fetch daily tip:", error);
    }
  };

  const handleTipInteraction = async (action: string, data?: any) => {
    if (!dailyTip || !isAuthenticated) return;

    try {
      const response = await fetch(`/api/python-tips/${dailyTip.id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      });

      if (response.ok) {
        const result = await response.json();
        setTipProgress(result.userProgress);

        // Refresh user data if XP was earned
        if (result.xpEarned && user) {
          // You might want to refresh user context here
        }
      }
    } catch (error) {
      console.error("Tip interaction failed:", error);
    }
  };

  // Tip interaction functions
  const handleTipLike = async () => {
    if (!dailyTip || !isAuthenticated) return;

    const action = tipProgress?.hasLiked ? "unlike" : "like";
    await handleTipInteraction(action);
  };

  const handleTipShare = () => {
    if (!dailyTip) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `Python Tip: ${dailyTip.title}`,
        text: dailyTip.content,
        url: typeof window !== "undefined" ? window.location.href : "",
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this Python tip: ${dailyTip.title}\n${dailyTip.content}\n\n${typeof window !== "undefined" ? window.location.href : ""}`
      );
    }

    handleTipInteraction("share");
  };

  const handleTipCopyCode = () => {
    if (
      dailyTip?.codeExample &&
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(dailyTip.codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTipComplete = async () => {
    if (!dailyTip || !isAuthenticated) return;

    await handleTipInteraction("complete", {
      completionScore: 100,
    });
  };

  // Helper function to render text without code highlighting
  const renderTextWithCode = (text: string) => {
    return text;
  };

  // Helper function to render quiz options without code highlighting
  const renderOption = (option: string) => {
    return option;
  };

  // Don't render until hydrated to prevent hydration mismatches
  if (!isHydrated) {
    // Don't render until hydrated to prevent hydration mismatches
    if (!isHydrated) {
      return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <HeroSection isAuthenticated={isAuthenticated} />

      {/* Login Benefits & Challenge Showcase */}
      <section className="relative bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3 text-sm font-semibold text-orange-700">
              <Trophy className="mr-2 h-4 w-4" />
              🎯 Unlock Premium Rewards with Login
            </div>
            <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
              🧠 Test Your Knowledge
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Earn Massive Rewards
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Join weekly challenges, solve Python quizzes, and unlock exclusive
              rewards only available to registered members
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Mini Quiz Widget */}
            <div className="relative">
              <div className="rounded-3xl border border-purple-200 bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Python Quiz Challenge
                    </h3>
                    <p className="text-slate-600">
                      Test your knowledge and earn diamonds
                    </p>
                  </div>
                </div>

                {/* Sample Quiz Question */}
                <div className="mb-6 rounded-xl bg-slate-50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-600">
                      Question 1/5
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Diamond className="h-4 w-4" />
                      <span className="text-sm font-bold">
                        +{sampleQuiz?.diamondReward || 50} 💎
                      </span>
                    </div>
                  </div>

                  <h4 className="mb-4 text-lg font-semibold text-slate-900">
                    {renderTextWithCode(
                      sampleQuiz?.question ||
                        "What is the correct way to define a function in Python?"
                    )}
                  </h4>

                  <div className="space-y-3">
                    {(
                      sampleQuiz?.options || [
                        "function myFunc(): pass",
                        "def myFunc(): pass",
                        "func myFunc(): pass",
                        "define myFunc(): pass",
                      ]
                    ).map((option: string, index: number) => (
                      <button
                        key={index}
                        className={`w-full rounded-lg border-2 p-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50 ${
                          (sampleQuiz?.correctAnswer || 1) === index
                            ? "border-purple-300 bg-purple-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            (sampleQuiz?.correctAnswer || 1) === index
                              ? "text-purple-700"
                              : "text-slate-700"
                          }`}
                        >
                          {String.fromCharCode(65 + index)})
                        </span>{" "}
                        {renderOption(option)}{" "}
                        {(sampleQuiz?.correctAnswer || 1) === index && " ✓"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reward Preview for Non-Logged Users */}
                {!isAuthenticated ? (
                  <div className="rounded-xl border-2 border-dashed border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 p-3">
                          <Crown className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-slate-900">
                        🔒 Login to Unlock Rewards!
                      </h4>
                      <p className="mb-4 text-sm text-slate-600">
                        Complete this quiz and earn{" "}
                        <strong className="text-yellow-600">
                          250 💎 diamonds
                        </strong>{" "}
                        + <strong className="text-purple-600">XP bonus</strong>
                      </p>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Base Reward:</span>
                          <span className="font-bold text-yellow-600">
                            +50 💎 per question
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Login Bonus:</span>
                          <span className="font-bold text-green-600">
                            +100% multiplier
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Weekly Streak:</span>
                          <span className="font-bold text-purple-600">
                            +50 XP bonus
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/login"
                        className="mt-4 inline-flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 text-sm font-bold text-white transition-all hover:from-yellow-600 hover:to-orange-600"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Login & Claim Rewards</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Link
                      href="/quiz-arena"
                      className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-indigo-600"
                    >
                      <Brain className="h-5 w-5" />
                      <span>Start Quiz Challenge</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-4 -top-4 animate-bounce rounded-lg bg-yellow-500 p-2 shadow-lg">
                <Diamond className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-pulse rounded-lg bg-purple-500 p-2 shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Login Benefits Showcase */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Daily Login Streaks
                    </h4>
                    <p className="text-sm text-slate-600">
                      Consecutive login rewards
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                    <div className="text-lg font-bold text-green-600">
                      Day 1
                    </div>
                    <div className="text-xs text-green-600">+50 💎</div>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">Day 7</div>
                    <div className="text-xs text-blue-600">+500 💎</div>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-center">
                    <div className="text-lg font-bold text-purple-600">
                      Day 30
                    </div>
                    <div className="text-xs text-purple-600">Rare Card</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Weekly Challenges
                    </h4>
                    <p className="text-sm text-slate-600">
                      Exclusive member rewards
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Complete 5 Quizzes
                    </span>
                    <span className="font-bold text-purple-600">+300 💎</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Code Arena Victory
                    </span>
                    <span className="font-bold text-blue-600">+500 💎</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Perfect Week</span>
                    <span className="font-bold text-yellow-600">
                      Epic Card Pack
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 p-2">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Card Pack Opening
                    </h4>
                    <p className="text-sm text-slate-600">
                      Premium animated experience
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-3 text-center">
                    <div className="text-sm font-bold text-blue-600">
                      3D Animations
                    </div>
                    <div className="text-xs text-blue-600">Premium Effects</div>
                  </div>
                  <div className="rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-red-50 p-3 text-center">
                    <div className="text-sm font-bold text-pink-600">
                      Rarity Bursts
                    </div>
                    <div className="text-xs text-pink-600">Legendary Cards</div>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Rocket className="h-6 w-6" />
                    <span>Unlock All Benefits</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <p className="mt-2 text-sm text-slate-500">
                    Free forever • No credit card • Instant access
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 p-8 text-white">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-yellow-400">
                  {(stats.totalUsers || 2500).toLocaleString()}+
                </div>
                <div className="text-sm text-slate-300">
                  Active Quiz Participants
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-green-400">
                  {stats.totalLessons || 50}+
                </div>
                <div className="text-sm text-slate-300">Python Challenges</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-400">
                  {Math.floor((stats.totalDiamonds || 10000000) / 1000000)}M+
                </div>
                <div className="text-sm text-slate-300">Diamonds Earned</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-pink-400">98%</div>
                <div className="text-sm text-slate-300">
                  Member Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Arena Spotlight */}
      <section className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 p-8 text-white lg:p-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-300">
                  <Zap className="mr-2 h-4 w-4" />
                  Featured Experience
                </div>

                <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
                  ⚔️ Code Arena
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Learn & Conquer
                  </span>
                </h2>

                <p className="mb-8 text-lg text-slate-300">
                  Master Python programming through interactive coding
                  challenges. Each lesson teaches real concepts while keeping
                  you engaged with rewards, progression, and gamified elements.
                </p>

                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <Brain className="mb-2 h-8 w-8 text-blue-400" />
                    <div className="text-sm font-semibold">
                      Interactive Challenges
                    </div>
                    <div className="text-xs text-slate-400">
                      Memory games & puzzles
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <Trophy className="mb-2 h-8 w-8 text-yellow-400" />
                    <div className="text-sm font-semibold">
                      Progressive Unlocks
                    </div>
                    <div className="text-xs text-slate-400">
                      Earn your way forward
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <Diamond className="mb-2 h-8 w-8 text-purple-400" />
                    <div className="text-sm font-semibold">Real Rewards</div>
                    <div className="text-xs text-slate-400">
                      Diamonds & XP system
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <Timer className="mb-2 h-8 w-8 text-green-400" />
                    <div className="text-sm font-semibold">
                      Bite-sized Learning
                    </div>
                    <div className="text-xs text-slate-400">
                      5-15 minute sessions
                    </div>
                  </div>
                </div>

                <Link
                  href="/code-arena"
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold text-white transition-all hover:from-yellow-600 hover:to-orange-600"
                >
                  <Play className="h-5 w-5" />
                  <span>Enter the Arena</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative">
                <div className="rounded-2xl bg-slate-800 p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-slate-400">
                      Python Challenge
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm">
                    <div className="mb-2 text-green-400">
                      # Python Fundamentals - Memory Challenge
                    </div>
                    <div className="mb-2 text-slate-300">
                      <span className="text-blue-400">def</span>{" "}
                      <span className="text-yellow-400">calculate_score</span>
                      <span className="text-slate-300">(</span>
                      <span className="text-orange-400">matches</span>
                      <span className="text-slate-300">):</span>
                    </div>
                    <div className="ml-4 text-slate-300">
                      <span className="text-purple-400">return</span>{" "}
                      <span className="text-orange-400">matches</span>{" "}
                      <span className="text-slate-300">*</span>{" "}
                      <span className="text-cyan-400">10</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Diamond className="h-4 w-4" />
                        <span className="text-sm font-semibold">+50</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-400">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-semibold">+25 XP</span>
                      </div>
                    </div>
                    <div className="text-xs text-green-400">
                      Challenge Complete! 🎉
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -right-4 -top-4 rounded-lg bg-yellow-500 p-2 shadow-lg">
                  <Diamond className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-lg bg-purple-500 p-2 shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Python Learning Path */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
              🐍 Master Python Programming
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              From beginner to expert through structured, gamified learning
              paths
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Beginner Path */}
            <div className="group rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-3xl text-white">
                🌱
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                Python Basics
              </h3>
              <p className="mb-6 text-slate-600">
                Start your journey with variables, data types, and fundamental
                programming concepts.
              </p>
              <div className="mb-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-slate-700">
                    Variables & Data Types
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-slate-700">
                    Conditional Statements
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-slate-700">
                    Loops & Functions
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Diamond className="h-4 w-4" />
                  <span className="font-semibold">500+ Diamonds</span>
                </div>
                <span className="text-sm text-slate-500">12 Challenges</span>
              </div>
            </div>

            {/* Intermediate Path */}
            <div className="group rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-3xl text-white">
                ⚡
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                Data Structures
              </h3>
              <p className="mb-6 text-slate-600">
                Master lists, dictionaries, and advanced data manipulation
                techniques.
              </p>
              <div className="mb-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-slate-700">
                    Lists & Dictionaries
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-slate-700">
                    String Manipulation
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-slate-700">
                    File Operations
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Diamond className="h-4 w-4" />
                  <span className="font-semibold">800+ Diamonds</span>
                </div>
                <span className="text-sm text-slate-500">18 Challenges</span>
              </div>
            </div>

            {/* Advanced Path */}
            <div className="group rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-8 transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-3xl text-white">
                🚀
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                Advanced Concepts
              </h3>
              <p className="mb-6 text-slate-600">
                Explore object-oriented programming, algorithms, and real-world
                applications.
              </p>
              <div className="mb-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-slate-700">OOP & Classes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-slate-700">
                    Algorithms & Logic
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-slate-700">
                    Web Development
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-purple-600">
                  <Diamond className="h-4 w-4" />
                  <span className="font-semibold">1200+ Diamonds</span>
                </div>
                <span className="text-sm text-slate-500">15 Challenges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Python Blog Showcase */}
      <section className="bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 px-6 py-3 text-sm font-semibold text-green-700">
              <FileText className="mr-2 h-4 w-4" />
              📚 Python Learning Guides
            </div>
            <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
              📖 Comprehensive Python Blog
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Detailed guides and articles we've prepared for you to master
              Python programming from beginner to advanced level
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Blog Post Card 1 */}
            <Link
              href="/blog/python-programming-introduction-guide"
              className="group block rounded-2xl border border-green-200 bg-white p-6 shadow-lg transition-all hover:border-green-300 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-medium text-white">
                  Python Basics
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>8 dk</span>
                </div>
              </div>

              <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-green-600">
                Python Programming Introduction Guide
              </h3>

              <p className="mb-4 line-clamp-3 text-slate-600">
                A comprehensive guide for those starting to learn Python.
                Everything you need to know about variables, data types, loops
                and functions.
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700">
                  #python
                </span>
                <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  #beginner
                </span>
                <span className="rounded-md bg-purple-100 px-2 py-1 text-xs text-purple-700">
                  #programming
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">August 1, 2025</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Read More</span>
                </div>
              </div>
            </Link>

            {/* Blog Post Card 2 */}
            <Link
              href="/blog/what-can-you-do-with-python-2024-guide"
              className="group block rounded-2xl border border-blue-200 bg-white p-6 shadow-lg transition-all hover:border-blue-300 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-1 text-xs font-medium text-white">
                  Python Applications
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>12 dk</span>
                </div>
              </div>

              <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                What Can You Do with Python? 2024 Guide
              </h3>

              <p className="mb-4 line-clamp-3 text-slate-600">
                Discover Python's application areas and which projects it's used
                in today. A wide range from web development to artificial
                intelligence.
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  #python
                </span>
                <span className="rounded-md bg-purple-100 px-2 py-1 text-xs text-purple-700">
                  #career
                </span>
                <span className="rounded-md bg-orange-100 px-2 py-1 text-xs text-orange-700">
                  #projects
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">August 3, 2025</span>
                <div className="flex items-center space-x-1 text-blue-600">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Read More</span>
                </div>
              </div>
            </Link>

            {/* Blog Post Card 3 */}
            <Link
              href="/blog/python-data-analysis-pandas-guide"
              className="group block rounded-2xl border border-purple-200 bg-white p-6 shadow-lg transition-all hover:border-purple-300 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-medium text-white">
                  Data Science
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>15 dk</span>
                </div>
              </div>

              <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-purple-600">
                Python Data Analysis: Pandas Guide
              </h3>

              <p className="mb-4 line-clamp-3 text-slate-600">
                Learn to do data analysis with the Pandas library. DataFrames,
                data cleaning and visualization techniques.
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-purple-100 px-2 py-1 text-xs text-purple-700">
                  #python
                </span>
                <span className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700">
                  #pandas
                </span>
                <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  #data-analysis
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">August 5, 2025</span>
                <div className="flex items-center space-x-1 text-purple-600">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Read More</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Blog CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex transform items-center space-x-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:from-green-600 hover:to-blue-600"
            >
              <FileText className="h-6 w-6" />
              <span>Explore All Blog Posts</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-3 text-sm text-slate-600">
              20+ detailed guides to accelerate your Python learning journey
            </p>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-green-500/10 blur-3xl"></div>
            <div className="absolute -left-32 bottom-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Daily Python Tip Section */}
      <div id="daily-tip-observer" ref={dailyTipRef}></div>
      {dailyTip && (
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-3 text-sm font-semibold text-blue-700">
                <Terminal className="mr-2 h-4 w-4" />
                🐍 Daily Python Tip
              </div>
              <h2 className="mb-2 text-3xl font-bold text-slate-900 lg:text-4xl">
                Learn Something New Every Day
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Discover practical Python tips and tricks that will improve your
                coding skills
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              {/* Daily Python Tip Accordion */}
              <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                {/* Collapsed Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                        <Terminal className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {dailyTip.title || "Daily Python Tip"}
                        </h3>
                        <div className="mt-1 flex items-center space-x-3">
                          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                            {dailyTip.difficulty || "beginner"}
                          </span>
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Zap className="h-3 w-3" />
                            <span className="text-sm font-bold">
                              +{dailyTip.xpReward || 10} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsTipExpanded(!isTipExpanded)}
                      className="flex items-center space-x-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
                    >
                      <span className="text-sm font-medium">
                        {isTipExpanded ? "Collapse" : "Expand"}
                      </span>
                      {isTipExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Content */}
                {isTipExpanded && (
                  <div className="p-6">
                    {/* Tip Content */}
                    <div className="mb-6">
                      <p className="text-lg leading-relaxed text-gray-700">
                        {dailyTip.content}
                      </p>
                    </div>

                    {/* Tip Info */}
                    <div className="mb-6 flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{dailyTip.viewCount || 0} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{dailyTip.likeCount || 0} likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{dailyTip.estimatedMinutes || 5} min read</span>
                      </div>
                    </div>

                    {/* Code Example - VS Code Style */}
                    {dailyTip.codeExample && (
                      <div className="mb-6">
                        {/* Code Editor Header */}
                        <div className="rounded-t-lg border border-gray-700 bg-[#2d2d30] px-4 py-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* VS Code Traffic Lights */}
                              <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Code className="h-4 w-4 text-blue-400" />
                                <span className="text-sm font-medium text-white">
                                  python_tip.py
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-gray-400">
                                Python
                              </span>
                              <button
                                onClick={handleTipCopyCode}
                                className={`flex items-center space-x-1 rounded px-2 py-1 text-xs transition-colors ${
                                  copied
                                    ? "bg-green-600/20 text-green-400"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                              >
                                <Copy className="h-3 w-3" />
                                <span>{copied ? "Copied!" : "Copy"}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Code Content */}
                        <div className="overflow-x-auto rounded-b-lg border-x border-b border-gray-700">
                          <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              padding: "1rem",
                              background: "#1e1e1e",
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                            showLineNumbers
                            lineNumberStyle={{
                              color: "#6e7681",
                              paddingRight: "1rem",
                              textAlign: "right",
                              userSelect: "none",
                            }}
                            wrapLines={true}
                            wrapLongLines={true}
                          >
                            {dailyTip.codeExample}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}

                    {/* Progress Indicator */}
                    {tipProgress && (
                      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h4 className="mb-3 font-medium text-gray-900">
                          Your Progress
                        </h4>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div
                            className={`flex items-center space-x-2 ${
                              tipProgress.hasViewed
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Viewed</span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 ${
                              tipProgress.hasLiked
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          >
                            <Heart className="h-4 w-4" />
                            <span className="text-xs">Liked</span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 ${
                              tipProgress.hasCompleted
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          >
                            <Trophy className="h-4 w-4" />
                            <span className="text-xs">Completed</span>
                          </div>
                          <div className="flex items-center space-x-2 text-yellow-600">
                            <Zap className="h-4 w-4" />
                            <span className="text-xs">
                              {tipProgress.xpEarned || 0} XP earned
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleTipLike}
                          disabled={!isAuthenticated}
                          className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all ${
                            tipProgress?.hasLiked
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <Heart
                            className="h-4 w-4"
                            fill={
                              tipProgress?.hasLiked ? "currentColor" : "none"
                            }
                          />
                          <span className="text-sm">
                            {dailyTip.likeCount || 0}
                          </span>
                        </button>

                        <button
                          onClick={handleTipShare}
                          className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>

                      {isAuthenticated && !tipProgress?.hasCompleted && (
                        <button
                          onClick={handleTipComplete}
                          className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-all hover:bg-purple-700"
                        >
                          <Trophy className="h-4 w-4" />
                          <span>Mark Complete</span>
                        </button>
                      )}

                      {tipProgress?.hasCompleted && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Completed!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mt-8 text-center">
                <div className="mx-auto max-w-md rounded-xl border-2 border-dashed border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 p-2">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-slate-900">
                    🔓 Login to Earn XP!
                  </h4>
                  <p className="mb-4 text-sm text-slate-600">
                    Complete daily tips and earn{" "}
                    <strong className="text-purple-600">XP + diamonds</strong>{" "}
                    to level up your Python skills
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-sm font-bold text-white transition-all hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Login & Start Learning</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      {/* Card Collection Showcase */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
              🎌 Collect Epic Cards
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Earn diamonds through Python challenges and collect rare anime &
              star cards
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Anime Collection */}
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-2xl text-white">
                  🎌
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Anime Collection
                  </h3>
                  <p className="text-slate-600">
                    {stats.animeCards} unique characters available
                  </p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4">
                {animeCards.length > 0
                  ? animeCards.slice(0, 3).map((card, index) => (
                      <div
                        key={card.id}
                        className="group aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 p-2 transition-all hover:scale-105 hover:shadow-lg"
                      >
                        <img
                          src={
                            card.secureThumbnailUrl ||
                            card.secureImageUrl ||
                            `/api/secure-image?cardId=${card.id}&type=thumbnail` ||
                            card.thumbnailUrl ||
                            card.imageUrl
                          }
                          alt={`${card.name} - ${card.rarity?.name || "Anime"} card - ${card.diamondCost} diamonds`}
                          className="h-full w-full rounded-lg object-cover shadow-md transition-all group-hover:shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-card.svg";
                          }}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                    ))
                  : // Fallback placeholder cards
                    Array.from({ length: 3 }, (_, index) => (
                      <div
                        key={index}
                        className="aspect-[3/4] rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 p-4"
                      >
                        <div className="h-full w-full rounded-lg bg-gradient-to-br from-pink-200 to-purple-200"></div>
                      </div>
                    ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Common Cards</span>
                  <span className="font-semibold text-slate-900">
                    50-100 💎
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Rare Cards</span>
                  <span className="font-semibold text-slate-900">
                    200-500 💎
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Legendary Cards
                  </span>
                  <span className="font-semibold text-slate-900">1000+ 💎</span>
                </div>
              </div>
            </div>

            {/* Star Collection */}
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-2xl text-white">
                  ⭐
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Star Collection
                  </h3>
                  <p className="text-slate-600">
                    {stats.carCards} celestial stars available
                  </p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4">
                {starCards.length > 0
                  ? starCards.slice(0, 3).map((card, index) => (
                      <div
                        key={card.id}
                        className="group aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 p-2 transition-all hover:scale-105 hover:shadow-lg"
                      >
                        <img
                          src={
                            card.secureThumbnailUrl ||
                            card.secureImageUrl ||
                            `/api/secure-image?cardId=${card.id}&type=thumbnail` ||
                            card.thumbnailUrl ||
                            card.imageUrl
                          }
                          alt={`${card.name} - ${card.rarity?.name || "Star"} card - ${card.diamondCost} diamonds`}
                          className="h-full w-full rounded-lg object-cover shadow-md transition-all group-hover:shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-card.svg";
                          }}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                    ))
                  : // Fallback placeholder cards
                    Array.from({ length: 3 }, (_, index) => (
                      <div
                        key={index}
                        className="aspect-[3/4] rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 p-4"
                      >
                        <div className="h-full w-full rounded-lg bg-gradient-to-br from-yellow-200 to-orange-200"></div>
                      </div>
                    ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Common Stars</span>
                  <span className="font-semibold text-slate-900">
                    60-120 💎
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Bright Stars</span>
                  <span className="font-semibold text-slate-900">
                    250-600 💎
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Supernovas</span>
                  <span className="font-semibold text-slate-900">1200+ 💎</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-pink-600 hover:to-purple-600"
            >
              <ShoppingBag className="h-6 w-6" />
              <span>Browse Card Shop</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* User Dashboard Preview */}
      {isAuthenticated && user && (
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 p-8 text-white lg:p-12">
              <div className="mb-8 flex flex-col items-start justify-between lg:flex-row">
                <div>
                  <h2 className="mb-2 text-3xl font-bold">
                    Welcome back, {user.username}! 👋
                  </h2>
                  <p className="text-lg text-slate-300">
                    Continue your Python mastery journey
                  </p>
                </div>
                <div className="mt-4 flex items-center space-x-4 lg:mt-0">
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Diamond className="h-5 w-5 text-yellow-400" />
                      <span className="font-bold">{user.currentDiamonds}</span>
                    </div>
                    <div className="text-xs text-slate-400">Diamonds</div>
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-purple-400" />
                      <span className="font-bold">Lv.{user.level}</span>
                    </div>
                    <div className="text-xs text-slate-400">Level</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/code-arena"
                  className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Rocket className="mb-3 h-8 w-8 text-yellow-400 transition-transform group-hover:scale-110" />
                  <h3 className="font-semibold">Code Arena</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {user.codeArenasCompleted || 0} challenges conquered
                  </p>
                </Link>

                <Link
                  href="/shop"
                  className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <ShoppingBag className="mb-3 h-8 w-8 text-pink-400 transition-transform group-hover:scale-110" />
                  <h3 className="font-semibold">Card Collection</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Expand your collection
                  </p>
                </Link>

                <Link
                  href="/badges"
                  className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Award className="mb-3 h-8 w-8 text-orange-400 transition-transform group-hover:scale-110" />
                  <h3 className="font-semibold">Achievements</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    View your badges
                  </p>
                </Link>

                <Link
                  href="/dashboard"
                  className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <BarChart3 className="mb-3 h-8 w-8 text-blue-400 transition-transform group-hover:scale-110" />
                  <h3 className="font-semibold">Progress Hub</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Complete dashboard
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof & Testimonials */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
              🌟 Loved by Python Learners
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Join thousands of students who've mastered Python through gamified
              learning
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-white">
                  A
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Ahmet K.</div>
                  <div className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-600">
                "The Code Arena made learning Python addictive! I collected over
                50 anime cards while mastering data structures. Best learning
                experience ever!"
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 font-bold text-white">
                  E
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Elif S.</div>
                  <div className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-600">
                "Finally, a platform that makes coding fun! The memory
                challenges helped me understand Python concepts better than any
                textbook."
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 font-bold text-white">
                  M
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Mehmet Y.</div>
                  <div className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-600">
                "From zero to Python developer in 6 months! The progressive
                unlocking system kept me motivated throughout the journey."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-20 text-white lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
            Ready to Master Python?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Join thousands of students who've transformed their coding skills
            through gamified learning
          </p>

          {!isAuthenticated && (
            <div className="space-y-6">
              <Link
                href="/login"
                className="inline-flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-12 py-4 text-xl font-bold shadow-2xl transition-all hover:-translate-y-1 hover:from-yellow-600 hover:to-orange-600"
              >
                <Crown className="h-8 w-8" />
                <span>Start Free Journey</span>
                <ArrowRight className="h-6 w-6" />
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>100% Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Immediate access to challenges</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
