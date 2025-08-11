"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RewardNotificationProvider,
  useRewardHelpers,
  useToastRewards,
} from "@/contexts/RewardNotificationContext";
import {
  AnimatedProfileStats,
  useAnimatedStats,
} from "@/components/gamification/animated-profile-stats";
import {
  FloatingReward,
  RewardCascade,
  RewardShowcase,
} from "@/components/gamification/reward-animations";
import {
  DiamondCounter,
  useDiamondAnimation,
} from "@/components/gamification/diamond-counter";
import {
  LevelIndicator,
  LevelUpAnimation,
} from "@/components/gamification/level-indicator";
import {
  AchievementCelebration,
  achievementTemplates,
} from "@/components/gamification/achievement-celebration";

// Test Component
function RewardTestContent() {
  const {
    showDiamondReward,
    showXPReward,
    showLevelUp,
    showBadgeEarned,
    showCodeArenaComplete,
  } = useRewardHelpers();

  const { showToast, ToastContainer } = useToastRewards();

  const [userStats, setUserStats] = useState({
    level: 5,
    experience: 4750,
    diamonds: 1250,
    expToNextLevel: 1250,
    totalXP: 4750,
    codeArenasCompleted: 23,
    quizzesCompleted: 47,
  });

  const {
    stats: animatedStats,
    updateStats,
    incrementStat,
  } = useAnimatedStats(userStats);
  const { isAnimating, increaseAmount, triggerIncrease } =
    useDiamondAnimation();

  const [showAchievement, setShowAchievement] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  // Test functions
  const testSimpleRewards = () => {
    showDiamondReward(50);
    setTimeout(() => showXPReward(100), 1000);
  };

  const testToastRewards = () => {
    showToast("diamond", 25);
    setTimeout(() => showToast("xp", 50), 500);
    setTimeout(() => showToast("badge", 1), 1000);
  };

  const testProfileStatsUpdate = () => {
    const newStats = {
      ...userStats,
      diamonds: userStats.diamonds + 100,
      experience: userStats.experience + 200,
      level:
        userStats.experience + 200 >= 6000
          ? userStats.level + 1
          : userStats.level,
    };

    setUserStats(newStats);
    updateStats(newStats);
    triggerIncrease(100);
  };

  const testCompleteCodeArena = () => {
    // Simulate API response for code arena completion
    const mockApiResponse = {
      success: true,
      progression: {
        previous: {
          experience: userStats.experience,
          diamonds: userStats.diamonds,
          level: userStats.level,
          expToNextLevel: userStats.expToNextLevel,
        },
        current: {
          experience: userStats.experience + 150,
          diamonds: userStats.diamonds + 75,
          level: userStats.level,
          expToNextLevel: userStats.expToNextLevel - 150,
        },
        earned: {
          experience: 150,
          diamonds: 75,
        },
        levelUp:
          userStats.experience + 150 >= 6000
            ? {
                newLevel: userStats.level + 1,
                bonusDiamonds: 50,
                bonusExperience: 100,
              }
            : null,
      },
      animations: [
        {
          type: "experience",
          amount: 150,
          icon: "⭐",
          color: "#FFD700",
          delay: 0,
        },
        {
          type: "diamonds",
          amount: 75,
          icon: "💎",
          color: "#00D4FF",
          delay: 500,
        },
      ],
      rewards: {
        diamonds: 75,
        experience: 150,
        levelUp: userStats.experience + 150 >= 6000,
        newLevel:
          userStats.experience + 150 >= 6000 ? userStats.level + 1 : undefined,
        badges: [],
      },
    };

    showCodeArenaComplete(mockApiResponse);

    // Update stats
    setTimeout(() => {
      const newStats = {
        ...userStats,
        diamonds: userStats.diamonds + 75,
        experience: userStats.experience + 150,
        level:
          userStats.experience + 150 >= 6000
            ? userStats.level + 1
            : userStats.level,
        codeArenasCompleted: userStats.codeArenasCompleted + 1,
      };
      setUserStats(newStats);
      updateStats(newStats);
    }, 1000);
  };

  const testAchievement = () => {
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 4000);
  };

  const testLevelUp = () => {
    setShowLevelUpModal(true);
    setTimeout(() => setShowLevelUpModal(false), 4000);

    // Update stats for level up
    const newStats = {
      ...userStats,
      level: userStats.level + 1,
      experience: userStats.experience + 500,
      diamonds: userStats.diamonds + 100,
    };
    setUserStats(newStats);
    updateStats(newStats);
  };

  const testBadgeReward = () => {
    const badge = {
      id: "test-badge",
      title: "Code Master!",
      description: "You've completed 25 code challenges",
      icon: "🏆",
      color: "#FFD700",
      rarity: "epic" as const,
    };
    showBadgeEarned(badge);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            🎮 Reward System Test Arena
          </h1>
          <p className="text-lg text-slate-600">
            Test all the animated reward components and flows
          </p>
        </div>

        {/* Profile Stats Display */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Profile Stats
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <AnimatedProfileStats
              stats={animatedStats}
              variant="card"
              animated={true}
            />
            <div className="space-y-4">
              <DiamondCounter
                count={animatedStats.diamonds}
                animated={isAnimating}
                showIncrease={isAnimating}
                increaseAmount={increaseAmount}
                size="lg"
                variant="detailed"
              />
              <LevelIndicator
                currentLevel={animatedStats.level}
                currentXP={animatedStats.experience}
                xpForNextLevel={(animatedStats.level + 1) * 1000}
                totalXPForCurrentLevel={animatedStats.level * 1000}
                animated={true}
                variant="detailed"
              />
            </div>
            <AnimatedProfileStats
              stats={animatedStats}
              variant="sidebar"
              animated={true}
            />
          </div>
        </div>

        {/* Test Controls */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Test Controls
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <motion.button
              onClick={testSimpleRewards}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💎 Simple Rewards
            </motion.button>

            <motion.button
              onClick={testToastRewards}
              className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🍞 Toast Notifications
            </motion.button>

            <motion.button
              onClick={testProfileStatsUpdate}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📊 Update Stats
            </motion.button>

            <motion.button
              onClick={testCompleteCodeArena}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏟️ Complete Arena
            </motion.button>

            <motion.button
              onClick={testAchievement}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏆 Achievement
            </motion.button>

            <motion.button
              onClick={testLevelUp}
              className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Level Up
            </motion.button>

            <motion.button
              onClick={testBadgeReward}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎖️ Badge Reward
            </motion.button>

            <motion.button
              onClick={() => {
                showLevelUp(animatedStats.level + 1);
                setTimeout(() => testCompleteCodeArena(), 2000);
              }}
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 font-bold text-white transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎭 Full Demo
            </motion.button>
          </div>
        </div>

        {/* Component Showcase */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Component Showcase
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Header Variant */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700">Header Variant</h3>
              <AnimatedProfileStats
                stats={animatedStats}
                variant="header"
                animated={true}
              />
            </div>

            {/* Compact Variant */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700">Compact Variant</h3>
              <AnimatedProfileStats
                stats={animatedStats}
                variant="compact"
                animated={true}
              />
            </div>

            {/* Diamond Counter Variants */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700">Diamond Counters</h3>
              <DiamondCounter
                count={animatedStats.diamonds}
                size="sm"
                variant="compact"
              />
              <DiamondCounter
                count={animatedStats.diamonds}
                size="md"
                variant="default"
              />
              <DiamondCounter
                count={animatedStats.diamonds}
                size="lg"
                variant="detailed"
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            🎯 Test Instructions
          </h2>
          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-bold text-slate-700">Basic Tests:</h3>
              <ul className="space-y-1 text-slate-600">
                <li>• Simple Rewards: Test individual floating rewards</li>
                <li>• Toast Notifications: Test small notification toasts</li>
                <li>• Update Stats: Test animated counter updates</li>
                <li>• Complete Arena: Test full code arena completion flow</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-bold text-slate-700">Advanced Tests:</h3>
              <ul className="space-y-1 text-slate-600">
                <li>• Achievement: Test achievement celebration modal</li>
                <li>• Level Up: Test level up animation and stats update</li>
                <li>• Badge Reward: Test badge earning notification</li>
                <li>• Full Demo: Test complete reward sequence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />

      {/* Achievement Modal */}
      <AchievementCelebration
        achievement={achievementTemplates.firstLesson}
        isVisible={showAchievement}
        onComplete={() => setShowAchievement(false)}
      />

      {/* Level Up Modal */}
      {showLevelUpModal && (
        <LevelUpAnimation
          newLevel={animatedStats.level + 1}
          onAnimationComplete={() => setShowLevelUpModal(false)}
        />
      )}
    </div>
  );
}

// Main Test Page
export default function RewardTestPage() {
  return (
    <RewardNotificationProvider>
      <RewardTestContent />
    </RewardNotificationProvider>
  );
}
