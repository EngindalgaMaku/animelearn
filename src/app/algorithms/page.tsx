"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Play,
  Diamond,
  Zap,
  Clock,
  Target,
  CheckCircle,
  Lock,
  Trophy,
  Brain,
  Code,
  BarChart3,
  Rocket,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  difficulty: {
    level: number;
    badge: string;
    color: string;
  };
  rewards: {
    diamonds: number;
    xp: number;
  };
  duration: string;
  estimatedMinutes: number;
  progress: {
    isStarted: boolean;
    isCompleted: boolean;
    score: number | null;
    attempts: number;
  };
  isLocked: boolean;
  order: number;
}

interface AlgorithmData {
  category: {
    name: string;
    description: string;
    icon: string;
    color: string;
    totalChallenges: number;
    completedChallenges: number;
    progressPercentage: number;
  };
  progress: {
    completed: string;
    percentage: number;
  };
  challenges: Challenge[];
}

export default function AlgorithmsPage() {
  const [algorithmData, setAlgorithmData] = useState<AlgorithmData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchAlgorithms();
  }, []);

  const fetchAlgorithms = async () => {
    try {
      const response = await fetch("/api/algorithms?category=algorithms");
      const data = await response.json();

      if (data.success) {
        setAlgorithmData(data);
      } else {
        setError(data.error || "Failed to load algorithms");
      }
    } catch (err) {
      setError("Failed to load algorithms");
      console.error("Error fetching algorithms:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Algorithm Viz":
        return <BarChart3 className="h-4 w-4" />;
      case "Matching":
        return <Target className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Algorithm Viz":
        return "bg-blue-500";
      case "Matching":
        return "bg-pink-500";
      default:
        return "bg-purple-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !algorithmData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="py-20 text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Error Loading Algorithms
            </h2>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-3xl text-white shadow-lg">
              {algorithmData.category.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 lg:text-5xl">
                {algorithmData.category.name}
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                {algorithmData.category.description}
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Your Progress
                </h3>
                <p className="text-slate-600">
                  {algorithmData.progress.completed} completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {algorithmData.progress.percentage}%
                </div>
                <p className="text-sm text-slate-500">Complete</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 h-3 w-full rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${algorithmData.progress.percentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>🎯 Master fundamental algorithms</span>
              <span>🏆 Earn diamonds and XP</span>
              <span>📈 Track your progress</span>
            </div>
          </div>
        </div>

        {/* Algorithm Challenges Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {algorithmData.challenges.map((challenge) => (
            <div key={challenge.id} className="group">
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                {/* Challenge Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${getTypeColor(challenge.type)} text-white shadow-md`}
                    >
                      {getTypeIcon(challenge.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-purple-600">
                        {challenge.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white ${challenge.difficulty.color}`}
                        >
                          {challenge.type}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {challenge.difficulty.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {challenge.progress.isCompleted && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mb-6 leading-relaxed text-slate-600">
                  {challenge.description}
                </p>

                {/* Challenge Stats */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Diamond className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        +{challenge.rewards.diamonds}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        +{challenge.rewards.xp} XP
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{challenge.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Started Challenges */}
                {challenge.progress.isStarted &&
                  !challenge.progress.isCompleted && (
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>In Progress</span>
                        <span>{challenge.progress.attempts} attempts</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div className="h-2 w-1/3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      </div>
                    </div>
                  )}

                {/* Action Button */}
                <div className="flex items-center justify-center">
                  {challenge.isLocked ? (
                    <button
                      disabled
                      className="flex w-full cursor-not-allowed items-center justify-center space-x-2 rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-500"
                    >
                      <Lock className="h-5 w-5" />
                      <span>Locked</span>
                    </button>
                  ) : challenge.progress.isCompleted ? (
                    <Link
                      href={`/code-arena/${challenge.slug}`}
                      className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Trophy className="h-5 w-5" />
                      <span>Completed</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : challenge.progress.isStarted ? (
                    <Link
                      href={`/code-arena/${challenge.slug}`}
                      className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Play className="h-5 w-5" />
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/code-arena/${challenge.slug}`}
                      className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Rocket className="h-5 w-5" />
                      <span>START CHALLENGE</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <h4 className="mb-2 text-xl font-bold text-slate-900">
                🔓 Login to Save Progress!
              </h4>
              <p className="mb-4 text-sm text-slate-600">
                Track your algorithm mastery, earn rewards, and unlock advanced
                challenges
              </p>
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-bold text-white transition-all hover:from-purple-600 hover:to-pink-600"
              >
                <Trophy className="h-4 w-4" />
                <span>Login & Start Learning</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
