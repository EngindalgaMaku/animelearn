"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Star, Trophy, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface UserStats {
  level: number;
  experience: number;
  diamonds: number;
  expToNextLevel: number;
  totalXP: number;
  codeArenasCompleted: number;
  quizzesCompleted: number;
}

interface AnimatedProfileStatsProps {
  stats: UserStats;
  animated?: boolean;
  variant?: "header" | "sidebar" | "card" | "compact";
  className?: string;
  onStatsUpdate?: (newStats: UserStats) => void;
}

interface StatCounterProps {
  value: number;
  previousValue?: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
}

// Animated counter component
const StatCounter: React.FC<StatCounterProps> = ({
  value,
  previousValue = 0,
  duration = 1000,
  format = (val) => val.toLocaleString(),
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(previousValue);

  useEffect(() => {
    if (value === previousValue) return;

    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + difference * easeOutQuart);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, previousValue, duration, displayValue]);

  return (
    <motion.span
      key={value}
      className={cn("tabular-nums", className)}
      animate={{ scale: value !== previousValue ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      {format(displayValue)}
    </motion.span>
  );
};

// XP Progress Bar Component
interface XPProgressBarProps {
  currentXP: number;
  level: number;
  expToNext: number;
  animated?: boolean;
  variant?: "default" | "compact" | "detailed";
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  level,
  expToNext,
  animated = true,
  variant = "default",
}) => {
  const levelXP = level * 1000; // Simple level calculation
  const nextLevelXP = (level + 1) * 1000;
  const progressXP = currentXP - levelXP;
  const neededXP = nextLevelXP - levelXP;
  const progressPercentage = Math.min((progressXP / neededXP) * 100, 100);

  return (
    <div className="space-y-2">
      {variant !== "compact" && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-slate-700">Level {level}</span>
          </div>
          <span className="text-xs text-slate-500">
            {progressXP.toLocaleString()} / {neededXP.toLocaleString()} XP
          </span>
        </div>
      )}

      <div className="relative">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
          />

          {/* Shimmer effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear",
              }}
            />
          )}
        </div>

        {variant === "detailed" && (
          <div className="mt-1 text-center text-xs text-slate-500">
            {expToNext.toLocaleString()} XP to level {level + 1}
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
export const AnimatedProfileStats: React.FC<AnimatedProfileStatsProps> = ({
  stats,
  animated = true,
  variant = "header",
  className,
  onStatsUpdate,
}) => {
  const [previousStats, setPreviousStats] = useState(stats);

  useEffect(() => {
    if (stats !== previousStats) {
      setPreviousStats(stats);
      onStatsUpdate?.(stats);
    }
  }, [stats, previousStats, onStatsUpdate]);

  const variants = {
    header:
      "flex items-center space-x-6 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg",
    sidebar:
      "space-y-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-lg",
    card: "bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl p-8 shadow-2xl",
    compact:
      "flex items-center space-x-4 bg-white rounded-xl px-4 py-2 shadow-md",
  };

  if (variant === "header") {
    return (
      <motion.div
        className={cn(variants.header, className)}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Level & XP */}
        <div className="flex items-center space-x-3">
          <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700">
              Level{" "}
              <StatCounter
                value={stats.level}
                previousValue={previousStats.level}
              />
            </div>
            <div className="text-xs text-slate-500">
              <StatCounter
                value={stats.experience}
                previousValue={previousStats.experience}
              />{" "}
              XP
            </div>
          </div>
        </div>

        {/* Diamonds */}
        <div className="flex items-center space-x-3">
          <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 p-2 text-white">
            <Diamond className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700">
              <StatCounter
                value={stats.diamonds}
                previousValue={previousStats.diamonds}
              />
            </div>
            <div className="text-xs text-slate-500">Diamonds</div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="w-32">
          <XPProgressBar
            currentXP={stats.experience}
            level={stats.level}
            expToNext={stats.expToNextLevel}
            animated={animated}
            variant="compact"
          />
        </div>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        className={cn(variants.compact, className)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 text-white">
            <Star className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-700">
            <StatCounter
              value={stats.level}
              previousValue={previousStats.level}
            />
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 text-white">
            <Diamond className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-700">
            <StatCounter
              value={stats.diamonds}
              previousValue={previousStats.diamonds}
            />
          </span>
        </div>
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        className={cn(variants.card, className)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-bold text-slate-900">
            Profile Stats
          </h3>
          <p className="text-slate-600">Track your learning progress</p>
        </div>

        {/* Level & XP Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-white">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  Level{" "}
                  <StatCounter
                    value={stats.level}
                    previousValue={previousStats.level}
                  />
                </div>
                <div className="text-sm text-slate-500">Current Level</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                <StatCounter
                  value={stats.experience}
                  previousValue={previousStats.experience}
                />
              </div>
              <div className="text-xs text-slate-500">Total XP</div>
            </div>
          </div>

          <XPProgressBar
            currentXP={stats.experience}
            level={stats.level}
            expToNext={stats.expToNextLevel}
            animated={animated}
            variant="detailed"
          />
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
            <div className="flex items-center space-x-3">
              <Diamond className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-700">
                  <StatCounter
                    value={stats.diamonds}
                    previousValue={previousStats.diamonds}
                  />
                </div>
                <div className="text-sm text-yellow-600">Diamonds</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">
                  <StatCounter
                    value={stats.codeArenasCompleted}
                    previousValue={previousStats.codeArenasCompleted}
                  />
                </div>
                <div className="text-sm text-green-600">Challenges</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-slate-600">
              <StatCounter
                value={stats.quizzesCompleted}
                previousValue={previousStats.quizzesCompleted}
              />{" "}
              Quizzes
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-slate-600">
              <StatCounter
                value={stats.expToNextLevel}
                previousValue={previousStats.expToNextLevel}
              />{" "}
              to next level
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Sidebar variant
  return (
    <motion.div
      className={cn(variants.sidebar, className)}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <XPProgressBar
        currentXP={stats.experience}
        level={stats.level}
        expToNext={stats.expToNextLevel}
        animated={animated}
        variant="default"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Diamond className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold text-slate-700">
            <StatCounter
              value={stats.diamonds}
              previousValue={previousStats.diamonds}
            />
          </span>
        </div>
        <span className="text-sm text-slate-500">Diamonds</span>
      </div>

      <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Code Arenas</span>
          <span className="font-semibold">
            <StatCounter
              value={stats.codeArenasCompleted}
              previousValue={previousStats.codeArenasCompleted}
            />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Quizzes</span>
          <span className="font-semibold">
            <StatCounter
              value={stats.quizzesCompleted}
              previousValue={previousStats.quizzesCompleted}
            />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Hook for real-time stats updates
export const useAnimatedStats = (initialStats: UserStats) => {
  const [stats, setStats] = useState(initialStats);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStats = (newStats: Partial<UserStats>) => {
    setIsUpdating(true);
    setStats((prev) => ({ ...prev, ...newStats }));
    setTimeout(() => setIsUpdating(false), 1500);
  };

  const incrementStat = (stat: keyof UserStats, amount: number) => {
    setStats((prev) => ({
      ...prev,
      [stat]: (prev[stat] as number) + amount,
    }));
  };

  return {
    stats,
    isUpdating,
    updateStats,
    incrementStat,
  };
};
