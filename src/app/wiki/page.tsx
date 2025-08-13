"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  Target,
  Brain,
  Code,
  Search,
  Gamepad2,
  Award,
  Star,
  Diamond,
  Trophy,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const WikiPage = () => {
  const challengeTypes = [
    {
      id: "algorithm-viz",
      name: "Algorithm Visualization",
      icon: "🔄",
      description: "Step-by-step visual algorithm learning",
      difficulty: "Intermediate to Expert",
      skills: [
        "Algorithm Understanding",
        "Performance Analysis",
        "Visual Learning",
      ],
      imagePlaceholder: "/images/wiki/algorithm-viz.png",
    },
    {
      id: "matching",
      name: "Matching",
      icon: "🔗",
      description: "Connect concepts and build associations",
      difficulty: "Beginner to Advanced",
      skills: ["Concept Association", "Memory", "Pattern Recognition"],
      imagePlaceholder: "/images/wiki/matching.png",
    },
    {
      id: "data-explorer",
      name: "Data Explorer",
      icon: "🔍",
      description: "Interactive data analysis and visualization",
      difficulty: "Intermediate to Expert",
      skills: ["Data Analysis", "Statistical Thinking", "Visualization"],
      imagePlaceholder: "/images/wiki/data-explorer.png",
    },
    {
      id: "demo",
      name: "Interactive Demo",
      icon: "🎪",
      description: "Guided tutorials and concept introduction",
      difficulty: "All Levels",
      skills: ["Concept Learning", "Tutorial Following", "Foundation Building"],
      imagePlaceholder: "/images/wiki/demo.png",
    },
    {
      id: "drag-drop",
      name: "Drag & Drop",
      icon: "🎯",
      description: "Visual code organization and structure",
      difficulty: "Beginner to Intermediate",
      skills: ["Code Organization", "Logical Flow", "Structure Understanding"],
      imagePlaceholder: "/images/wiki/drag-drop.png",
    },
    {
      id: "fill-blanks",
      name: "Fill Blanks",
      icon: "✏️",
      description: "Complete code with missing parts",
      difficulty: "Beginner to Advanced",
      skills: ["Syntax Mastery", "Code Completion", "Attention to Detail"],
      imagePlaceholder: "/images/wiki/fill-blanks.png",
    },
    {
      id: "code-lab",
      name: "Code Lab",
      icon: "💻",
      description: "Full hands-on coding experience",
      difficulty: "Intermediate to Expert",
      skills: ["Live Coding", "Debugging", "Real-world Programming"],
      imagePlaceholder: "/images/wiki/code-lab.png",
    },
    {
      id: "code-builder",
      name: "Code Builder",
      icon: "🏗️",
      description: "Build complete programs systematically",
      difficulty: "Intermediate to Advanced",
      skills: ["Software Architecture", "Modular Programming", "System Design"],
      imagePlaceholder: "/images/wiki/code-builder.png",
    },
    {
      id: "class-builder",
      name: "Class Builder",
      icon: "🏛️",
      description: "Object-oriented programming and design",
      difficulty: "Advanced to Expert",
      skills: ["OOP Design", "Inheritance", "Design Patterns"],
      imagePlaceholder: "/images/wiki/class-builder.png",
    },
    {
      id: "memory-game",
      name: "Memory Game",
      icon: "🧠",
      description: "Pattern recognition and code memorization",
      difficulty: "Beginner to Intermediate",
      skills: ["Pattern Recognition", "Memory Training", "Code Familiarity"],
      imagePlaceholder: "/images/wiki/memory-game.png",
    },
    {
      id: "quiz",
      name: "Quiz",
      icon: "❓",
      description: "Knowledge assessment and verification",
      difficulty: "All Levels",
      skills: ["Knowledge Retention", "Concept Understanding", "Assessment"],
      imagePlaceholder: "/images/wiki/quiz.png",
    },
  ];

  const learningPaths = [
    {
      name: "Python Fundamentals",
      icon: "🐍",
      description: "Master the building blocks of Python programming",
      challenges: 15,
      difficulty: "Beginner",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Data Structures",
      icon: "📊",
      description: "Learn essential data organization techniques",
      challenges: 12,
      difficulty: "Intermediate",
      color: "from-blue-500 to-cyan-600",
    },
    {
      name: "Algorithms",
      icon: "🧮",
      description: "Solve problems with efficient algorithms",
      challenges: 18,
      difficulty: "Advanced",
      color: "from-purple-500 to-violet-600",
    },
    {
      name: "Web Development",
      icon: "🌐",
      description: "Build modern web applications",
      challenges: 20,
      difficulty: "Intermediate",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="mb-6 flex justify-center">
              <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 text-sm font-black text-purple-900 shadow-2xl">
                📚 COMPREHENSIVE LEARNING GUIDE
              </div>
            </div>
            <h1 className="mb-8 text-5xl font-black md:text-7xl">
              <span className="block bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
                Code Arena
              </span>
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent drop-shadow-2xl">
                Wiki & Guide
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl font-medium text-indigo-100">
              Your complete guide to mastering programming through interactive
              challenges, learning paths, and gamified experiences.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/code-arena"
                className="rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 px-8 py-4 font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                🚀 Start Learning
              </Link>
              <button className="rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                📖 Browse Topics
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow-xl"
            >
              <div className="text-4xl font-black text-blue-600">11</div>
              <div className="text-sm font-bold text-blue-700">
                Challenge Types
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center shadow-xl"
            >
              <div className="text-4xl font-black text-green-600">65+</div>
              <div className="text-sm font-bold text-green-700">
                Interactive Challenges
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-gradient-to-br from-purple-50 to-violet-50 p-8 text-center shadow-xl"
            >
              <div className="text-4xl font-black text-purple-600">4</div>
              <div className="text-sm font-bold text-purple-700">
                Learning Paths
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 p-8 text-center shadow-xl"
            >
              <div className="text-4xl font-black text-orange-600">5</div>
              <div className="text-sm font-bold text-orange-700">
                Difficulty Levels
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge Types Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-black text-slate-900">
              🎮 Interactive Challenge Types
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              Discover 11 different types of interactive programming challenges
              designed to develop specific skills and make learning engaging.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {challengeTypes.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Image Placeholder */}
                <div className="mb-6 h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className="flex h-full items-center justify-center text-6xl">
                    {challenge.icon}
                  </div>
                  {/* This is where you'll add the actual images */}
                  {/* <Image
                    src={challenge.imagePlaceholder}
                    alt={challenge.name}
                    width={400}
                    height={200}
                    className="h-full w-full object-cover"
                  /> */}
                </div>

                <div className="mb-4 flex items-center space-x-3">
                  <div className="text-3xl">{challenge.icon}</div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600">
                    {challenge.name}
                  </h3>
                </div>

                <p className="mb-4 text-slate-600">{challenge.description}</p>

                <div className="mb-4">
                  <div className="mb-2 text-sm font-bold text-slate-700">
                    Difficulty: {challenge.difficulty}
                  </div>
                  <div className="mb-2 text-sm font-bold text-slate-700">
                    Skills Developed:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {challenge.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 font-bold text-white transition-all hover:scale-105">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-black text-slate-900">
              🗺️ Structured Learning Paths
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              Follow carefully designed learning paths that take you from
              beginner to expert in specific programming domains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="mb-6 flex items-center space-x-4">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${path.color} flex items-center justify-center text-2xl text-white shadow-lg`}
                  >
                    {path.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600">
                      {path.name}
                    </h3>
                    <p className="text-slate-600">{path.difficulty} Level</p>
                  </div>
                </div>

                <p className="mb-6 text-slate-600">{path.description}</p>

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gamepad2 className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">
                      {path.challenges} Challenges
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-slate-700">
                      {path.difficulty}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full rounded-2xl bg-gradient-to-r ${path.color} py-3 font-bold text-white shadow-lg transition-all hover:scale-105`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Start Learning Path</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification System */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-black text-slate-900">
              🏆 Reward & Progression System
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              Earn diamonds, gain experience, level up, and unlock achievements
              as you progress through your learning journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center shadow-xl"
            >
              <Diamond className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
              <h3 className="mb-4 text-2xl font-black text-yellow-700">
                Diamonds
              </h3>
              <p className="mb-4 text-slate-600">
                Earn diamonds by completing challenges. Use them to unlock
                premium content and special features.
              </p>
              <div className="text-3xl font-black text-yellow-600">
                💎 10-50
              </div>
              <div className="text-sm text-yellow-700">Per Challenge</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center shadow-xl"
            >
              <Star className="mx-auto mb-4 h-16 w-16 text-purple-600" />
              <h3 className="mb-4 text-2xl font-black text-purple-700">
                Experience Points
              </h3>
              <p className="mb-4 text-slate-600">
                Gain XP to level up your profile and unlock new learning paths
                and advanced challenges.
              </p>
              <div className="text-3xl font-black text-purple-600">
                ⭐ 25-150
              </div>
              <div className="text-sm text-purple-700">XP Per Challenge</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center shadow-xl"
            >
              <Trophy className="mx-auto mb-4 h-16 w-16 text-green-600" />
              <h3 className="mb-4 text-2xl font-black text-green-700">
                Achievements
              </h3>
              <p className="mb-4 text-slate-600">
                Unlock special badges and achievements for completing learning
                milestones and challenges.
              </p>
              <div className="text-3xl font-black text-green-600">🏆 50+</div>
              <div className="text-sm text-green-700">Available Badges</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center text-white"
          >
            <h2 className="mb-8 text-4xl font-black">
              Ready to Start Your Coding Adventure?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl">
              Join thousands of learners mastering programming through
              interactive challenges and gamified learning experiences.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/code-arena"
                className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-4 font-bold text-purple-900 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                🚀 Start Learning Now
              </Link>
              <Link
                href="/auth/register"
                className="rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                📝 Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO Footer Links */}
      <section className="bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Learning</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/code-arena"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Interactive Challenges
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#challenge-types"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Challenge Types
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#learning-paths"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Learning Paths
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#gamification"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Rewards System
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Topics</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/wiki#python-basics"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Python Programming
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#data-structures"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Data Structures
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#algorithms"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Algorithms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#web-development"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Web Development
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Features</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/wiki#interactive-coding"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Live Code Editor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#visual-learning"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Visual Learning
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#progress-tracking"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Progress Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wiki#achievements"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Achievement System
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/wiki"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Complete Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Learning Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tips"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    Programming Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    About Platform
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WikiPage;
