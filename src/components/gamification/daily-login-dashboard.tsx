"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Gift,
  Diamond,
  Star,
  Coins,
  CheckCircle,
  Lock,
  Trophy,
  Flame,
  Clock,
  RefreshCw,
  Package,
  Sparkles,
} from "lucide-react";

interface DailyLoginBonus {
  id: string;
  day: number;
  diamonds: number;
  experience: number;
  cardPacks: number;
  specialReward?: string;
  isClaimable: boolean;
  isClaimed: boolean;
  isCurrentDay: boolean;
}

interface LoginStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysLoggedIn: number;
  totalRewardsClaimed: number;
  cycleStartDate: string;
  nextResetDate: string;
  canClaimToday: boolean;
  todayClaimed: boolean;
}

interface DailyLoginDashboardProps {
  className?: string;
}

const DailyLoginDashboard: React.FC<DailyLoginDashboardProps> = ({
  className = "",
}) => {
  const [bonuses, setBonuses] = useState<DailyLoginBonus[]>([]);
  const [stats, setStats] = useState<LoginStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [showClaimAnimation, setShowClaimAnimation] = useState(false);
  const [claimedReward, setClaimedReward] = useState<DailyLoginBonus | null>(
    null
  );

  useEffect(() => {
    fetchDailyLoginData();
  }, []);

  const fetchDailyLoginData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/daily-login");
      const data = await response.json();

      if (data.success) {
        setBonuses(data.bonuses);
        setStats(data.stats);
      } else {
        setError(data.error || "Error loading daily login data");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const claimDailyBonus = async (bonusId: string) => {
    try {
      setClaiming(bonusId);
      const response = await fetch("/api/daily-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bonusId }),
      });

      const data = await response.json();

      if (data.success) {
        const claimedBonus = bonuses.find((b) => b.id === bonusId);
        if (claimedBonus) {
          setClaimedReward(claimedBonus);
          setShowClaimAnimation(true);

          setTimeout(() => {
            setShowClaimAnimation(false);
            setClaimedReward(null);
          }, 3000);
        }

        await fetchDailyLoginData(); // Refresh data
      } else {
        alert(data.error || "Error claiming bonus");
      }
    } catch (err) {
      alert("Connection error");
    } finally {
      setClaiming(null);
    }
  };

  const getDayProgress = () => {
    if (!stats) return 0;
    return Math.min((stats.currentStreak / 7) * 100, 100);
  };

  const getTimeUntilReset = () => {
    if (!stats) return null;

    const now = new Date();
    const reset = new Date(stats.nextResetDate);
    const diff = reset.getTime() - now.getTime();

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  const timeUntilReset = getTimeUntilReset();

  if (loading) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-gray-200"></div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <Gift className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Error</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchDailyLoginData}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Data Not Found
          </h3>
          <p className="text-gray-600">
            Your daily login data could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 rounded-xl bg-white p-6 shadow-lg ${className}`}>
      {/* Claim Animation Overlay */}
      <AnimatePresence>
        {showClaimAnimation && claimedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="mx-4 max-w-md rounded-xl bg-white p-8 text-center shadow-2xl"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"
              >
                <Gift className="h-8 w-8 text-white" />
              </motion.div>

              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Bonus Alındı!
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Diamond className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">
                    +{claimedReward.diamonds} Diamond
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">
                    +{claimedReward.experience} XP
                  </span>
                </div>
                {claimedReward.cardPacks > 0 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">
                      +{claimedReward.cardPacks} Kart Paketi
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Günlük Giriş Bonusu
        </h2>
        <div className="flex items-center space-x-2 text-orange-600">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">7 Günlük Döngü</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <Flame className="mx-auto mb-2 h-6 w-6 text-orange-600" />
          <div className="text-lg font-bold text-orange-700">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-orange-600">Mevcut Streak</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <Trophy className="mx-auto mb-2 h-6 w-6 text-blue-600" />
          <div className="text-lg font-bold text-blue-700">
            {stats.longestStreak}
          </div>
          <div className="text-sm text-blue-600">En Uzun Streak</div>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <Calendar className="mx-auto mb-2 h-6 w-6 text-green-600" />
          <div className="text-lg font-bold text-green-700">
            {stats.totalDaysLoggedIn}
          </div>
          <div className="text-sm text-green-600">Toplam Gün</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 text-center">
          <Gift className="mx-auto mb-2 h-6 w-6 text-purple-600" />
          <div className="text-lg font-bold text-purple-700">
            {stats.totalRewardsClaimed}
          </div>
          <div className="text-sm text-purple-600">Alınan Ödül</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Döngü İlerlemesi
          </span>
          <span className="text-sm text-gray-600">
            {stats.currentStreak}/7 gün
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${getDayProgress()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {timeUntilReset && (
          <div className="mt-2 flex items-center justify-center text-sm text-gray-600">
            <Clock className="mr-1 h-4 w-4" />
            Sıfırlanma: {timeUntilReset.hours}s {timeUntilReset.minutes}d
          </div>
        )}
      </div>

      {/* Daily Bonuses Grid */}
      <div className="grid grid-cols-7 gap-3">
        {bonuses.map((bonus) => (
          <motion.div
            key={bonus.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: bonus.day * 0.1 }}
            className={`relative rounded-lg border-2 p-3 transition-all ${
              bonus.isClaimed
                ? "border-green-300 bg-green-50"
                : bonus.isClaimable
                  ? "cursor-pointer border-orange-300 bg-orange-50 hover:border-orange-400"
                  : bonus.isCurrentDay
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
            }`}
            onClick={() => {
              if (bonus.isClaimable && !bonus.isClaimed && !claiming) {
                claimDailyBonus(bonus.id);
              }
            }}
          >
            {/* Day Number */}
            <div className="mb-2 text-center">
              <div
                className={`text-lg font-bold ${
                  bonus.isClaimed
                    ? "text-green-700"
                    : bonus.isClaimable
                      ? "text-orange-700"
                      : bonus.isCurrentDay
                        ? "text-blue-700"
                        : "text-gray-500"
                }`}
              >
                {bonus.day}
              </div>
              <div className="text-xs text-gray-600">Gün</div>
            </div>

            {/* Rewards */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-center space-x-1">
                <Diamond className="h-3 w-3 text-amber-600" />
                <span>{bonus.diamonds}</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-3 w-3 text-blue-600" />
                <span>{bonus.experience}</span>
              </div>
              {bonus.cardPacks > 0 && (
                <div className="flex items-center justify-center space-x-1">
                  <Package className="h-3 w-3 text-purple-600" />
                  <span>{bonus.cardPacks}</span>
                </div>
              )}
            </div>

            {/* Special Reward Badge */}
            {bonus.specialReward && (
              <div className="absolute -right-1 -top-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            )}

            {/* Status Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {bonus.isClaimed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500"
                >
                  <CheckCircle className="h-5 w-5 text-white" />
                </motion.div>
              )}

              {!bonus.isClaimable && !bonus.isClaimed && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400">
                  <Lock className="h-4 w-4 text-white" />
                </div>
              )}

              {claiming === bonus.id && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Claimable Pulse Animation */}
            {bonus.isClaimable && !bonus.isClaimed && !claiming && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-lg border-2 border-orange-400 opacity-50"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Special Rewards Info */}
      <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
        <h3 className="mb-2 flex items-center font-semibold text-gray-900">
          <Sparkles className="mr-2 h-5 w-5 text-yellow-600" />
          Özel Ödüller
        </h3>
        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
              3
            </div>
            <span>Bonus kart paketi</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
              5
            </div>
            <span>2x XP bonusu (1 gün)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              7
            </div>
            <span>Özel achievement rozeti</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={fetchDailyLoginData}
          className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Yenile</span>
        </button>

        {stats.canClaimToday && !stats.todayClaimed && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-2 font-medium text-white"
          >
            Bugünün bonusunu al!
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DailyLoginDashboard;
