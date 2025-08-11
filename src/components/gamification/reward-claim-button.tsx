"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Star, Diamond, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface RewardData {
  diamonds: number;
  experience: number;
  levelUp?: boolean;
  newLevel?: number;
  badges?: any[];
  activityTitle: string;
  score: number;
}

interface RewardClaimButtonProps {
  rewards: RewardData;
  onClaimRewards: () => void;
  disabled?: boolean;
  className?: string;
}

interface RewardSummaryProps {
  rewards: RewardData;
  isVisible: boolean;
  onClaim: () => void;
  onClose: () => void;
}

// Reward Summary Modal Component
const RewardSummary: React.FC<RewardSummaryProps> = ({
  rewards,
  isVisible,
  onClaim,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-4 max-w-md rounded-3xl border border-indigo-200 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Challenge Complete!
              </h2>
              <p className="text-slate-600">{rewards.activityTitle}</p>
              <div className="mt-3 inline-block rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2">
                <span className="font-bold text-green-700">
                  Score: {rewards.score}%
                </span>
              </div>
            </div>

            {/* Rewards Preview */}
            <div className="mb-6 space-y-4">
              <h3 className="text-center text-lg font-bold text-slate-700">
                🎁 Your Rewards
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Diamond Reward */}
                <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 text-center">
                  <Diamond className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
                  <div className="text-2xl font-bold text-yellow-700">
                    +{rewards.diamonds}
                  </div>
                  <div className="text-sm text-yellow-600">Diamonds</div>
                </div>

                {/* XP Reward */}
                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 text-center">
                  <Star className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-700">
                    +{rewards.experience}
                  </div>
                  <div className="text-sm text-purple-600">Experience</div>
                </div>
              </div>

              {/* Level Up Bonus */}
              {rewards.levelUp && (
                <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 text-center">
                  <Trophy className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <div className="text-xl font-bold text-green-700">
                    LEVEL UP!
                  </div>
                  <div className="text-sm text-green-600">
                    Congratulations! You reached Level {rewards.newLevel}
                  </div>
                  <div className="mt-1 text-xs text-green-500">
                    Bonus: +50 💎 +100 XP
                  </div>
                </div>
              )}

              {/* Badges */}
              {rewards.badges && rewards.badges.length > 0 && (
                <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 text-center">
                  <div className="mb-2 text-3xl">🏆</div>
                  <div className="text-lg font-bold text-indigo-700">
                    New Badge{rewards.badges.length > 1 ? "s" : ""} Earned!
                  </div>
                  <div className="text-sm text-indigo-600">
                    {rewards.badges.length} new achievement
                    {rewards.badges.length > 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={onClaim}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-6 w-6" />
                  <span>🎁 CLAIM REWARDS</span>
                  <Sparkles className="h-6 w-6" />
                </div>
              </motion.button>

              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-slate-100 px-6 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Claim Later
              </button>
            </div>

            {/* Floating Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-yellow-400 opacity-70"
                style={{
                  left: `${20 + (i % 3) * 30}%`,
                  top: `${20 + Math.floor(i / 3) * 40}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Reward Claim Button Component
export const RewardClaimButton: React.FC<RewardClaimButtonProps> = ({
  rewards,
  onClaimRewards,
  disabled = false,
  className,
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    onClaimRewards();
    setShowSummary(false);
  };

  const getTotalRewardValue = () => {
    let total = rewards.diamonds + rewards.experience;
    if (rewards.levelUp) total += 150; // Bonus for level up
    if (rewards.badges?.length) total += rewards.badges.length * 50; // Bonus for badges
    return total;
  };

  if (claimed) {
    return (
      <motion.div
        className={cn(
          "rounded-2xl border border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center",
          className
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <div className="flex items-center justify-center space-x-2 font-bold text-green-700">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            ✅
          </motion.div>
          <span>Rewards Claimed!</span>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setShowSummary(true)}
        disabled={disabled}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 300,
          delay: 0.5,
        }}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 opacity-0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Button Content */}
        <div className="relative flex items-center justify-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <Gift className="h-6 w-6" />
          </motion.div>
          <span className="font-black">🎁 GET REWARDS</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
        </div>

        {/* Floating Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white opacity-80"
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Reward Preview Badge */}
        <motion.div
          className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {getTotalRewardValue()}
        </motion.div>
      </motion.button>

      {/* Reward Summary Modal */}
      <RewardSummary
        rewards={rewards}
        isVisible={showSummary}
        onClaim={handleClaim}
        onClose={() => setShowSummary(false)}
      />
    </>
  );
};

// Hook for managing reward claim state
export const useRewardClaim = () => {
  const [pendingRewards, setPendingRewards] = useState<RewardData | null>(null);
  const [showClaimButton, setShowClaimButton] = useState(false);

  const showRewardClaim = (rewards: RewardData) => {
    setPendingRewards(rewards);
    setShowClaimButton(true);
  };

  const hideRewardClaim = () => {
    setShowClaimButton(false);
    setPendingRewards(null);
  };

  return {
    pendingRewards,
    showClaimButton,
    showRewardClaim,
    hideRewardClaim,
  };
};

// Quick reward claim component for smaller rewards
interface QuickRewardClaimProps {
  diamonds: number;
  experience: number;
  onClaim: () => void;
  className?: string;
}

export const QuickRewardClaim: React.FC<QuickRewardClaimProps> = ({
  diamonds,
  experience,
  onClaim,
  className,
}) => {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    onClaim();
  };

  if (claimed) {
    return (
      <motion.div
        className={cn(
          "rounded-xl border border-green-200 bg-green-100 p-3 text-center font-semibold text-green-700",
          className
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        ✅ Claimed!
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={handleClaim}
      className={cn(
        "rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center space-x-2">
        <Diamond className="h-4 w-4" />
        <span>+{diamonds}</span>
        <Star className="h-4 w-4" />
        <span>+{experience}</span>
        <span className="ml-1">🎁</span>
      </div>
    </motion.button>
  );
};
