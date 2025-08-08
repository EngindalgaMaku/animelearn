"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Head from "next/head";

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
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Image protection functions (same as shop)
  const disableImageInteractions = () => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12" ||
          (e.ctrlKey && ['s', 'a', 'c', 'x', 'v', 'p', 'u'].includes(e.key)) ||
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key))) {
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
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        totalUsers: 1250,
        totalLessons: 45,
        animeCards: 250,
        carCards: 200,
        totalDiamonds: 50000,
      });
    } catch (error) {
      console.error("Stats fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleCards = async () => {
    try {
      // Fetch anime cards (from anime-collection category)
      const animeResponse = await fetch('/api/shop?category=anime-collection&limit=3&sort=newest');
      if (animeResponse.ok) {
        const animeData = await animeResponse.json();
        setAnimeCards(animeData.cards || []);
      }

      // Fetch star cards (from star-collection category)
      const starResponse = await fetch('/api/shop?category=star-collection&limit=3&sort=newest');
      if (starResponse.ok) {
        const starData = await starResponse.json();
        setStarCards(starData.cards || []);
      }
    } catch (error) {
      console.error("Failed to fetch sample cards:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Zumenzu - Learn Python Programming with Anime Cards & Gamification | Interactive Code Arena</title>
        <meta name="description" content="Master Python programming through gamified learning! Earn diamonds, collect anime cards, battle in Code Arena challenges, and track progress with badges. The most engaging way to learn coding." />
        <meta name="keywords" content="Python learning, programming tutorial, coding education, anime cards, gamification, interactive coding, Code Arena, Python course, learn programming, coding challenges" />
        <meta property="og:title" content="Zumenzu - Learn Python Programming with Anime Cards & Gamification" />
        <meta property="og:description" content="Master Python programming through gamified learning! Earn diamonds, collect anime cards, and battle in interactive Code Arena challenges." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://zumenzu.com" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16 lg:py-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          
          {/* Floating Elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-4 top-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl"></div>
            <div className="absolute -left-4 bottom-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              {/* Hero Badge */}
              <div className="mb-6 inline-flex items-center rounded-full bg-white/20 px-6 py-3 text-sm font-semibold backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
                #1 Python Learning Platform with Gamification
              </div>

              {/* Main Headlines */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block">Master Python</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Through Epic Battles
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg text-blue-100 sm:text-xl lg:text-2xl">
                Learn Python programming in the <strong className="text-yellow-300">Code Arena</strong> • 
                Earn <strong className="text-yellow-300">💎 diamonds</strong> • 
                Collect <strong className="text-pink-300">🎌 anime cards</strong> • 
                Unlock <strong className="text-green-300">🏆 achievements</strong>
              </p>

              {/* Main CTA Buttons */}
              <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/code-arena"
                      className="group flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:-translate-y-1 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Rocket className="h-6 w-6" />
                      <span>Enter Code Arena</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/shop"
                      className="flex items-center space-x-3 rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <ShoppingBag className="h-6 w-6" />
                      <span>Card Shop</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="group flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:-translate-y-1 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Crown className="h-6 w-6" />
                      <span>Start Free Journey</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/code-arena"
                      className="flex items-center space-x-3 rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <Monitor className="h-6 w-6" />
                      <span>Preview Arena</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-blue-200">Learning Python</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{stats.totalLessons}</div>
                  <div className="text-sm text-blue-200">Code Challenges</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{stats.animeCards + stats.carCards}</div>
                  <div className="text-sm text-blue-200">Collectible Cards</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-blue-200">Satisfaction</div>
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
                      Battle & Learn
                    </span>
                  </h2>
                  
                  <p className="mb-8 text-lg text-slate-300">
                    Master Python programming through interactive coding battles. Each challenge teaches real concepts 
                    while keeping you engaged with rewards, progression, and competitive elements.
                  </p>

                  <div className="mb-8 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                      <Brain className="mb-2 h-8 w-8 text-blue-400" />
                      <div className="text-sm font-semibold">Interactive Challenges</div>
                      <div className="text-xs text-slate-400">Memory games & puzzles</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                      <Trophy className="mb-2 h-8 w-8 text-yellow-400" />
                      <div className="text-sm font-semibold">Progressive Unlocks</div>
                      <div className="text-xs text-slate-400">Earn your way forward</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                      <Diamond className="mb-2 h-8 w-8 text-purple-400" />
                      <div className="text-sm font-semibold">Real Rewards</div>
                      <div className="text-xs text-slate-400">Diamonds & XP system</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                      <Timer className="mb-2 h-8 w-8 text-green-400" />
                      <div className="text-sm font-semibold">Bite-sized Learning</div>
                      <div className="text-xs text-slate-400">5-15 minute sessions</div>
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
                      <div className="text-sm text-slate-400">Python Challenge</div>
                    </div>
                    
                    <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm">
                      <div className="mb-2 text-green-400"># Python Fundamentals - Memory Challenge</div>
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
                      <div className="text-xs text-green-400">Challenge Complete! 🎉</div>
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
                From beginner to expert through structured, gamified learning paths
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Beginner Path */}
              <div className="group rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 transition-all hover:shadow-xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-3xl text-white">
                  🌱
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Python Basics</h3>
                <p className="mb-6 text-slate-600">
                  Start your journey with variables, data types, and fundamental programming concepts.
                </p>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-slate-700">Variables & Data Types</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-slate-700">Conditional Statements</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-slate-700">Loops & Functions</span>
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
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Data Structures</h3>
                <p className="mb-6 text-slate-600">
                  Master lists, dictionaries, and advanced data manipulation techniques.
                </p>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-slate-700">Lists & Dictionaries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-slate-700">String Manipulation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-slate-700">File Operations</span>
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
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Advanced Concepts</h3>
                <p className="mb-6 text-slate-600">
                  Explore object-oriented programming, algorithms, and real-world applications.
                </p>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-slate-700">OOP & Classes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-slate-700">Algorithms & Logic</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-slate-700">Web Development</span>
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

        {/* Card Collection Showcase */}
        <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
                🎌 Collect Epic Cards
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-slate-600">
                Earn diamonds through Python challenges and collect rare anime & star cards
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
                    <h3 className="text-2xl font-bold text-slate-900">Anime Collection</h3>
                    <p className="text-slate-600">{stats.animeCards} unique characters available</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  {animeCards.length > 0 ? (
                    animeCards.slice(0, 3).map((card, index) => (
                      <div key={card.id} className="group aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 p-2 transition-all hover:scale-105 hover:shadow-lg">
                        <img
                          src={card.secureThumbnailUrl || card.secureImageUrl || `/api/secure-image?cardId=${card.id}&type=thumbnail` || card.thumbnailUrl || card.imageUrl}
                          alt={`${card.name} - ${card.rarity?.name || 'Anime'} card - ${card.diamondCost} diamonds`}
                          className="h-full w-full rounded-lg object-cover shadow-md transition-all group-hover:shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-card.svg';
                          }}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                    ))
                  ) : (
                    // Fallback placeholder cards
                    Array.from({ length: 3 }, (_, index) => (
                      <div key={index} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 p-4">
                        <div className="h-full w-full rounded-lg bg-gradient-to-br from-pink-200 to-purple-200"></div>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Common Cards</span>
                    <span className="font-semibold text-slate-900">50-100 💎</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Rare Cards</span>
                    <span className="font-semibold text-slate-900">200-500 💎</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Legendary Cards</span>
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
                    <h3 className="text-2xl font-bold text-slate-900">Star Collection</h3>
                    <p className="text-slate-600">{stats.carCards} celestial stars available</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  {starCards.length > 0 ? (
                    starCards.slice(0, 3).map((card, index) => (
                      <div key={card.id} className="group aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 p-2 transition-all hover:scale-105 hover:shadow-lg">
                        <img
                          src={card.secureThumbnailUrl || card.secureImageUrl || `/api/secure-image?cardId=${card.id}&type=thumbnail` || card.thumbnailUrl || card.imageUrl}
                          alt={`${card.name} - ${card.rarity?.name || 'Star'} card - ${card.diamondCost} diamonds`}
                          className="h-full w-full rounded-lg object-cover shadow-md transition-all group-hover:shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-card.svg';
                          }}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                    ))
                  ) : (
                    // Fallback placeholder cards
                    Array.from({ length: 3 }, (_, index) => (
                      <div key={index} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
                        <div className="h-full w-full rounded-lg bg-gradient-to-br from-yellow-200 to-orange-200"></div>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Common Stars</span>
                    <span className="font-semibold text-slate-900">60-120 💎</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Bright Stars</span>
                    <span className="font-semibold text-slate-900">250-600 💎</span>
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
                    <h2 className="mb-2 text-3xl font-bold">Welcome back, {user.username}! 👋</h2>
                    <p className="text-lg text-slate-300">Continue your Python mastery journey</p>
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
                    <p className="mt-1 text-sm text-slate-400">Expand your collection</p>
                  </Link>

                  <Link
                    href="/badges"
                    className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    <Award className="mb-3 h-8 w-8 text-orange-400 transition-transform group-hover:scale-110" />
                    <h3 className="font-semibold">Achievements</h3>
                    <p className="mt-1 text-sm text-slate-400">View your badges</p>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    <BarChart3 className="mb-3 h-8 w-8 text-blue-400 transition-transform group-hover:scale-110" />
                    <h3 className="font-semibold">Progress Hub</h3>
                    <p className="mt-1 text-sm text-slate-400">Complete dashboard</p>
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
                Join thousands of students who've mastered Python through gamified learning
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Ahmet K.</div>
                    <div className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="text-slate-600">
                  "The Code Arena made learning Python addictive! I collected over 50 anime cards while mastering data structures. Best learning experience ever!"
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold">
                    E
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Elif S.</div>
                    <div className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="text-slate-600">
                  "Finally, a platform that makes coding fun! The memory challenges helped me understand Python concepts better than any textbook."
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Mehmet Y.</div>
                    <div className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="text-slate-600">
                  "From zero to Python developer in 6 months! The progressive unlocking system kept me motivated throughout the journey."
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
              Join thousands of students who've transformed their coding skills through gamified learning
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

        {/* Footer */}
        <footer className="bg-slate-900 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Zumenzu</h3>
                </div>
                <p className="mb-4 text-lg text-slate-300">
                  Master Python programming through gamified learning. Collect cards, earn rewards, and become a coding expert!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">🐍 Python</span>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">🎮 Gamification</span>
                  <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300">🎌 Anime Cards</span>
                  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-300">⭐ Star Cards</span>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold">🚀 Features</h4>
                <ul className="space-y-2 text-slate-300">
                  <li>⚔️ Interactive Code Arena</li>
                  <li>💎 Diamond Reward System</li>
                  <li>🏆 Achievement Badges</li>
                  <li>📈 Progress Tracking</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold">📊 Platform Stats</h4>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-bold text-blue-400">{stats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Challenges:</span>
                    <span className="font-bold text-green-400">{stats.totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cards:</span>
                    <span className="font-bold text-pink-400">{stats.animeCards + stats.carCards}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-8 text-center">
              <p className="text-lg text-slate-400">
                🎯 Master Python • 💎 Earn Rewards • 🎌 Collect Anime & Star Cards • 🏆 Achieve Greatness
              </p>
              <p className="mt-2 text-sm text-slate-500">
                © 2024 Zumenzu. The ultimate Python learning platform with gamification.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
