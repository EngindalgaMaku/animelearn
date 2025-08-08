"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LevelIndicatorProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  totalXPForCurrentLevel?: number;
  showXPNumbers?: boolean;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  currentLevel,
  currentXP,
  xpForNextLevel,
  totalXPForCurrentLevel = 0,
  showXPNumbers = true,
  animated = true,
  size = "md",
  variant = "default",
  className,
}) => {
  // Calculate progress percentage
  const levelXP = currentXP - totalXPForCurrentLevel;
  const neededXP = xpForNextLevel - totalXPForCurrentLevel;
  const progressPercentage = Math.min((levelXP / neededXP) * 100, 100);

  const sizeClasses = {
    sm: {
      container: "px-3 py-2",
      levelText: "text-xs font-bold",
      progressBar: "h-1",
      xpText: "text-xs",
    },
    md: {
      container: "px-4 py-3",
      levelText: "text-sm font-bold",
      progressBar: "h-2",
      xpText: "text-sm",
    },
    lg: {
      container: "px-6 py-4",
      levelText: "text-lg font-bold",
      progressBar: "h-3",
      xpText: "text-base",
    },
  };

  const currentSizeClasses = sizeClasses[size];

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white shadow-lg",
        currentSizeClasses.container,
        className
      )}
    >
      {/* Level Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-300">⭐</span>
          <span className={currentSizeClasses.levelText}>
            Level {currentLevel}
          </span>
        </div>

        {variant === "detailed" && (
          <span className="text-xs text-purple-200">
            Next: {currentLevel + 1}
          </span>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background Bar */}
        <div
          className={cn(
            "bg-purple-800/50 rounded-full overflow-hidden",
            currentSizeClasses.progressBar
          )}
        >
          {/* Progress Fill */}
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{
              duration: animated ? 1.5 : 0,
              ease: "easeOut",
              delay: 0.2,
            }}
          />

          {/* Shimmer Effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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

        {/* XP Numbers */}
        {showXPNumbers && variant !== "compact" && (
          <div
            className={cn(
              "flex justify-between mt-1 text-purple-200",
              currentSizeClasses.xpText
            )}
          >
            <span>{levelXP.toLocaleString("tr-TR")} XP</span>
            <span>{neededXP.toLocaleString("tr-TR")} XP</span>
          </div>
        )}
      </div>

      {/* Detailed Info */}
      {variant === "detailed" && (
        <div className="mt-2 text-xs text-purple-200">
          <div className="flex justify-between">
            <span>İlerleme: {progressPercentage.toFixed(1)}%</span>
            <span>
              Kalan: {(neededXP - levelXP).toLocaleString("tr-TR")} XP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Compact variant for navigation bars
export const CompactLevelIndicator: React.FC<
  Omit<LevelIndicatorProps, "variant" | "showXPNumbers">
> = (props) => (
  <LevelIndicator
    {...props}
    variant="compact"
    showXPNumbers={false}
    size="sm"
  />
);

// Detailed variant for profile pages
export const DetailedLevelIndicator: React.FC<
  Omit<LevelIndicatorProps, "variant">
> = (props) => <LevelIndicator {...props} variant="detailed" />;

// Level up animation component
interface LevelUpAnimationProps {
  newLevel: number;
  onAnimationComplete?: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  newLevel,
  onAnimationComplete,
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, repeat: 2 }}
        >
          ⭐
        </motion.div>

        <motion.h2
          className="text-4xl font-bold text-yellow-400 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          LEVEL UP!
        </motion.h2>

        <motion.p
          className="text-2xl text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Level {newLevel} Achieved!
        </motion.p>

        {/* Particle effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: Math.cos((i * 45 * Math.PI) / 180) * 100,
              y: Math.sin((i * 45 * Math.PI) / 180) * 100,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Hook for level calculations
export const useLevelCalculation = (totalXP: number) => {
  // XP requirements increase exponentially
  const calculateLevelFromXP = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  const calculateXPForLevel = (level: number) => {
    return Math.pow(level - 1, 2) * 100;
  };

  const currentLevel = calculateLevelFromXP(totalXP);
  const currentLevelXP = calculateXPForLevel(currentLevel);
  const nextLevelXP = calculateXPForLevel(currentLevel + 1);

  return {
    currentLevel,
    currentXP: totalXP,
    xpForCurrentLevel: currentLevelXP,
    xpForNextLevel: nextLevelXP,
    progressToNextLevel:
      ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100,
  };
};
