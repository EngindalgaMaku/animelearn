"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BattleInterface from "@/components/battle/BattleInterface";
import { 
  Swords, 
  Crown, 
  Trophy, 
  Star, 
  Flame, 
  Shield,
  Zap,
  Target,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function BattlePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading Elements of Legends...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Battle Arena Access</h1>
          <p className="text-gray-300 mb-6">
            You need to be logged in to access Elements of Legends card battle arena.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            Login to Battle
          </Link>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full text-center">
            
            {/* Back Button */}
            <div className="absolute top-6 left-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>

            {/* Hero Section */}
            <div className="mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-300 font-semibold mb-6">
                <Flame className="h-5 w-5 mr-2" />
                World-Class Card Battle System
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="block text-white">Elements of</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  Legends
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Master the power of 7 mystical elements in epic card battles. 
                Strategic depth meets stunning visuals in this revolutionary TCG experience.
              </p>

              {/* User Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">Lv.{user?.level}</div>
                  <div className="text-sm text-gray-400">Battle Rank</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{user?.experience}</div>
                  <div className="text-sm text-gray-400">Total XP</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Wins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
              </div>
            </div>

            {/* Game Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Swords className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Epic Battles</h3>
                <p className="text-gray-300 text-sm">
                  Engage in strategic card battles with deep mechanics and multiple victory conditions.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Flame className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">7 Elements</h3>
                <p className="text-gray-300 text-sm">
                  Master Fire, Water, Earth, Air, Light, Shadow, and Neutral elements with unique synergies.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">AI Opponents</h3>
                <p className="text-gray-300 text-sm">
                  Battle against 6 difficulty levels with unique AI personalities and strategies.
                </p>
              </div>
            </div>

            {/* Start Battle Button */}
            <div className="space-y-4">
              <button
                onClick={() => setGameStarted(true)}
                className="group relative inline-flex items-center px-12 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-xl font-bold rounded-2xl hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <Zap className="h-6 w-6 mr-3" />
                Enter Battle Arena
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <p className="text-sm text-gray-400">
                🃏 Collect cards • ⚔️ Strategic battles • 🏆 Climb rankings • 🎮 Pure fun
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <BattleInterface />
    </div>
  );
}