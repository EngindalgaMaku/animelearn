"use client";

import { useState } from "react";
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
  Clock,
  Brain,
  Layers,
  Rocket,
  MousePointer,
  Globe,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 1,
      icon: Book,
      title: "⚔️ Interactive Code Arena Battles",
      description:
        "Master Python programming through epic coding battles and real-time challenges",
      details:
        "50+ comprehensive arena battles covering Python fundamentals to advanced topics",
      image: "/features/features1.jpg",
      benefits: [
        "Step-by-step guided learning path",
        "Real-time code editor with instant feedback",
        "Progressive difficulty levels",
        "Code examples and exercises",
      ],
    },
    {
      id: 2,
      icon: ShoppingBag,
      title: "🎌 Anime Card Collection",
      description:
        "Collect rare and exclusive anime cards as you conquer arena battles",
      details:
        "200+ unique anime cards with different rarity levels and special abilities",
      image: "/features/features2.jpg",
      benefits: [
        "Exclusive anime artwork and characters",
        "Card trading and collection system",
        "Rare and legendary card drops",
        "Character backstories and stats",
      ],
    },
    {
      id: 3,
      icon: Award,
      title: "🏆 Achievement System",
      description:
        "Earn badges and achievements for your programming milestones",
      details:
        "50+ different badges covering various programming skills and achievements",
      image: "/features/features3.jpg",
      benefits: [
        "Skill-based achievement tracking",
        "Progress visualization",
        "Social sharing capabilities",
        "Exclusive badge rewards",
      ],
    },
    {
      id: 4,
      icon: Target,
      title: "🎯 Daily Quest System",
      description: "Complete daily challenges and earn bonus rewards",
      details: "Fresh challenges every day to keep you motivated and engaged",
      image: "/features/features4.jpg",
      benefits: [
        "Daily coding challenges",
        "Streak bonuses and rewards",
        "Varying difficulty levels",
        "Special weekend quests",
      ],
    },
    {
      id: 5,
      icon: BarChart3,
      title: "📊 Gamification Hub",
      description:
        "Comprehensive dashboard with XP, streaks, mini-games and progress tracking",
      details:
        "Complete gamification experience with detailed analytics and insights",
      image: "/features/features5.jpg",
      benefits: [
        "XP and level progression system",
        "Login streak tracking",
        "Mini-games and challenges",
        "Detailed progress analytics",
      ],
    },
  ];

  const stats = {
    users: "1,250+",
    lessons: "50+",
    cards: "200+",
    completion: "92%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-[radial-gradient(circle_at_25%_25%,#3b82f6_1px,transparent_1px),radial-gradient(circle_at_75%_75%,#8b5cf6_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        {/* Hero Images */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/hero/hero1.jpg"
            alt="Python Learning with Anime"
            className="absolute right-10 top-10 h-44 w-44 rotate-12 rounded-2xl object-cover opacity-40 shadow-lg md:h-64 md:w-64"
          />
          <img
            src="/hero/hero2.jpg"
            alt="Gamified Programming Education"
            className="absolute bottom-20 left-10 h-36 w-36 -rotate-12 rounded-2xl object-cover opacity-45 shadow-lg md:h-52 md:w-52"
          />
          <img
            src="/hero/hero3.jpg"
            alt="Interactive Coding Platform"
            className="absolute right-1/4 top-1/2 h-40 w-40 rotate-45 rounded-2xl object-cover opacity-35 shadow-lg md:h-56 md:w-56"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <Link
                href="/"
                className="text-blue-600 transition-colors hover:text-blue-800"
              >
                Home
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-700">Features</span>
            </nav>

            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 text-sm font-medium text-blue-700 shadow-lg">
              <Sparkles className="mr-2 h-4 w-4" />
              🚀 World's Most Advanced Python Learning Platform
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 text-5xl font-black leading-tight text-gray-900 md:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Zumenzu
              </span>
              <br />
              <span className="text-3xl text-gray-800 md:text-4xl">
                Features & Benefits
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-gray-600 md:text-2xl">
              <span className="font-bold text-blue-600">
                10x more effective
              </span>{" "}
              than traditional programming education,{" "}
              <span className="font-bold text-purple-600">
                gamification-powered
              </span>{" "}
              Python learning experience. Interactive lessons, anime card
              collection, achievement system and daily quests make{" "}
              <span className="font-bold text-green-600">
                coding education incredibly fun
              </span>
              !
            </p>

            {/* CTA Buttons */}
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/code-arena"
                className="group flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl"
              >
                <Rocket className="h-6 w-6" />
                <span>Enter Arena</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop"
                className="flex items-center space-x-3 rounded-2xl border border-gray-200 bg-white/80 px-8 py-4 text-lg font-medium text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
              >
                <Crown className="h-6 w-6 text-yellow-500" />
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Platform Stats */}
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.users}
                </div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {stats.lessons}
                </div>
                <div className="text-sm text-gray-600">Code Arenas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.cards}
                </div>
                <div className="text-sm text-gray-600">Anime Cards</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {stats.completion}
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="bg-white/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              🎯 Core Features
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Discover Zumenzu's unique features and see why thousands of
              students choose our platform
            </p>
          </div>

          {/* Interactive Feature Showcase */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${
                    activeFeature === index
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`rounded-xl p-3 ${
                        activeFeature === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                      {activeFeature === index && (
                        <div className="mt-4">
                          <p className="mb-3 text-sm font-medium text-blue-700">
                            {feature.details}
                          </p>
                          <ul className="space-y-1">
                            {feature.benefits.map((benefit, i) => (
                              <li
                                key={i}
                                className="flex items-center text-sm text-gray-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Image Display */}
            <div className="relative">
              <div className="sticky top-8">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                  <div className="rounded-3xl bg-white p-8">
                    <img
                      src={features[activeFeature].image}
                      alt={features[activeFeature].title}
                      className="h-96 w-full rounded-2xl object-cover shadow-lg"
                    />
                    <div className="mt-6 text-center">
                      <h4 className="text-xl font-bold text-gray-900">
                        {features[activeFeature].title}
                      </h4>
                      <p className="mt-2 text-gray-600">
                        {features[activeFeature].details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              ⚡ Why Zumenzu?
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Advantages we offer compared to traditional programming education
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Advantage 1 */}
            <div className="group rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                🚀 10x Faster Learning
              </h3>
              <p className="mb-4 text-gray-600">
                Thanks to our gamification system, your motivation never drops.
                Learn 10 times faster than traditional methods.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Continuous motivation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Instant feedback
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Progress tracking
                </li>
              </ul>
            </div>

            {/* Advantage 2 */}
            <div className="group rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                ❤️ Fun & Addictive
              </h3>
              <p className="mb-4 text-gray-600">
                We gamify the learning process with anime characters and card
                collection system.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Anime card collection
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Daily quests
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Achievement system
                </li>
              </ul>
            </div>

            {/* Advantage 3 */}
            <div className="group rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-green-600">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                📈 Proven Success
              </h3>
              <p className="mb-4 text-gray-600">
                Our proven success with 92% completion rate and 1,250+ active
                students.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  High completion rate
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Active community
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Regular updates
                </li>
              </ul>
            </div>

            {/* Advantage 4 */}
            <div className="group rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                💻 Real Coding Experience
              </h3>
              <p className="mb-4 text-gray-600">
                Write, run and see instant results with our real code editor.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Live code editor
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Instant execution
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Debugging tools
                </li>
              </ul>
            </div>

            {/* Advantage 5 */}
            <div className="group rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                🌍 Global & Accessible
              </h3>
              <p className="mb-4 text-gray-600">
                Multi-language interface designed for students worldwide with
                global accessibility.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Multi-language support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Global content
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  24/7 support
                </li>
              </ul>
            </div>

            {/* Advantage 6 */}
            <div className="group rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                📱 Access Anywhere
              </h3>
              <p className="mb-4 text-gray-600">
                Continue learning from phone, tablet or computer with our
                mobile-responsive design.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Mobile responsive
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Offline capability
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Cross-device sync
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Feature Breakdown */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              🔍 Detailed Feature Analysis
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-300">
              Examine each of our features in detail and learn how they work
            </p>
          </div>

          <div className="space-y-16">
            {/* Learning System */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-6 flex items-center space-x-4">
                  <div className="rounded-xl bg-blue-500 p-3">
                    <Book className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">
                    Interactive Learning System
                  </h3>
                </div>
                <p className="mb-6 text-lg text-gray-300">
                  Unlike traditional video-based education, our students
                  actively learn by writing code at every step.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-400" />
                    <div>
                      <h4 className="font-semibold">Step-by-Step Guidance</h4>
                      <p className="text-gray-300">
                        Each lesson is broken into small, digestible parts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-400" />
                    <div>
                      <h4 className="font-semibold">Instant Feedback</h4>
                      <p className="text-gray-300">
                        See the results of your code immediately
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-400" />
                    <div>
                      <h4 className="font-semibold">Personalized Learning</h4>
                      <p className="text-gray-300">
                        Progress at your own pace, review anytime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <img
                  src="/features/features1.jpg"
                  alt="Interactive Learning System"
                  className="h-64 w-full rounded-xl object-cover"
                />
                <div className="mt-4 text-center">
                  <p className="text-gray-300">
                    50+ Interactive Code Arena Battles
                  </p>
                </div>
              </div>
            </div>

            {/* Gamification System */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="order-2 rounded-2xl bg-white/10 p-8 backdrop-blur-sm lg:order-1">
                <img
                  src="/features/features5.jpg"
                  alt="Gamification Dashboard"
                  className="h-64 w-full rounded-xl object-cover"
                />
                <div className="mt-4 text-center">
                  <p className="text-gray-300">
                    Comprehensive Gamification Hub
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="rounded-xl bg-purple-500 p-3">
                    <Gamepad2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">Gamification Hub</h3>
                </div>
                <p className="mb-6 text-lg text-gray-300">
                  Our comprehensive system that gamifies your learning process
                  ensures your motivation never drops.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Star className="mt-1 h-5 w-5 text-yellow-400" />
                    <div>
                      <h4 className="font-semibold">XP and Level System</h4>
                      <p className="text-gray-300">
                        Earn XP with every conquered arena battle and level up
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Trophy className="mt-1 h-5 w-5 text-yellow-400" />
                    <div>
                      <h4 className="font-semibold">Daily Login Streaks</h4>
                      <p className="text-gray-300">
                        Log in consecutive days, earn bonus rewards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="mt-1 h-5 w-5 text-yellow-400" />
                    <div>
                      <h4 className="font-semibold">Mini Games</h4>
                      <p className="text-gray-300">
                        Daily mini quizzes and special events
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-white/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              📚 The Future of Python Learning
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Take your Python programming learning experience to the next level
              with Zumenzu
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                🎯 Revolution in Python Programming Education
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Zumenzu</strong> is starting a new era in Python
                  programming education worldwide. Unlike traditional teaching
                  methods, we dramatically increase students'{" "}
                  <strong>motivation</strong> and
                  <strong>success rates</strong> by gamifying the learning
                  process with <strong>gamification technology</strong>.
                </p>
                <p>
                  Our <strong>Python learning platform</strong> is supported by
                  <strong>50+ interactive arena battles</strong> from beginner to
                  advanced level. Each battle is equipped with a{" "}
                  <strong>code editor</strong> and
                  <strong>instant feedback system</strong> that enables students
                  to
                  <strong>learn by practicing</strong>.
                </p>
                <p>
                  Our <strong>anime card collection</strong> feature makes the
                  learning process even more fun, while our{" "}
                  <strong>achievement system</strong> and
                  <strong>daily quests</strong> ensure our students stay
                  regularly engaged with the platform.
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                💡 Why Python and Why Zumenzu?
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Python programming language</strong> is one of the
                  most popular and easiest to learn programming languages in the
                  world. It is widely used in{" "}
                  <strong>artificial intelligence</strong>,{" "}
                  <strong>data science</strong>,<strong>web development</strong>{" "}
                  and <strong>automation</strong> fields.
                </p>
                <p>
                  <strong>Zumenzu platform</strong> makes Python learning not
                  only educational but also <strong>extremely fun</strong>. We
                  are industry leaders with our{" "}
                  <strong>92% completion rate</strong> and
                  <strong>1,250+ active students</strong>.
                </p>
                <p>
                  Thanks to our <strong>mobile-responsive design</strong>, our
                  students can access <strong>Code Arena battles</strong> and
                  practice
                  <strong>coding</strong> whenever and wherever they want.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section for SEO */}
          <div className="mt-16">
            <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
              ❓ Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Do I need prior knowledge to learn Python?
                </h4>
                <p className="text-gray-600">
                  No, no programming knowledge is required. Zumenzu starts
                  completely from beginner level and takes you step by step through
                  arena battles to advanced level.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h4 className="mb-3 font-semibold text-gray-900">
                  What are anime cards used for?
                </h4>
                <p className="text-gray-600">
                  Anime cards expand your collection while boosting your
                  learning motivation. You can earn rare cards as you conquer
                  arena battles.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Does the platform work on mobile devices?
                </h4>
                <p className="text-gray-600">
                  Yes, Zumenzu is fully mobile responsive. You can easily access
                  and write code from phone, tablet or computer.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h4 className="mb-3 font-semibold text-gray-900">
                  How long does it take to learn Python?
                </h4>
                <p className="text-gray-600">
                  By dedicating 30-60 minutes per day, you can learn Python
                  basics in 2-3 months and reach advanced level in 6 months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            🚀 Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Join thousands of students and start your Python learning journey
            today!
          </p>

          <div className="space-y-4">
            <Link
              href="/code-arena"
              className="inline-flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-4 text-xl font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl"
            >
              <Crown className="h-8 w-8" />
              <span>Enter Arena</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
            <p className="text-gray-500">
              ✨ Create free account • 💎 First 100 diamonds free • 🎯 Start
              learning immediately
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
