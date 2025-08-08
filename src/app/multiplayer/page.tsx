"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MultiplayerBattleInterface from "@/components/battle/MultiplayerBattleInterface";
import { 
  Users, 
  Crown, 
  Trophy, 
  Star, 
  Flame, 
  Shield,
  Zap,
  Target,
  ArrowLeft,
  Globe,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function MultiplayerPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading Multiplayer Arena...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Multiplayer Arena Access</h1>
          <p className="text-gray-300 mb-6">
            You need to be logged in to challenge other players in real-time battles.
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
          <div className="max-w-5xl w-full text-center">
            
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
              <div className="inline-flex items-center px-6 py-3 bg-green-500/20 backdrop-blur-sm rounded-full text-green-300 font-semibold mb-6">
                <Globe className="h-5 w-5 mr-2" />
                Real-time Multiplayer Combat
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="block text-white">Multiplayer</span>
                <span className="block bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Battle Arena
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Challenge players worldwide in real-time strategic battles. 
                Climb the ranks, prove your mastery, and become a legend!
              </p>

              {/* User Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">Bronze III</div>
                  <div className="text-sm text-gray-400">Current Rank</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">127</div>
                  <div className="text-sm text-gray-400">Victories</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">1,847</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">7</div>
                  <div className="text-sm text-gray-400">Win Streak</div>
                </div>
              </div>
            </div>

            {/* Game Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Ranked Matches</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Climb the competitive ladder and earn prestigious ranks through skill-based matchmaking.
                </p>
                <div className="text-yellow-400 text-sm font-semibold">
                  🏆 Seasonal Rewards • 📈 MMR System
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Quick Play</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Jump into fast-paced casual matches. Perfect for practicing new strategies and having fun.
                </p>
                <div className="text-blue-400 text-sm font-semibold">
                  ⚡ Fast Queue • 🎮 Casual Fun
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Private Rooms</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Create custom rooms to battle friends or set up tournaments with specific rules.
                </p>
                <div className="text-purple-400 text-sm font-semibold">
                  👥 Friend Battles • 🎪 Custom Rules
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-4">🌐 Global Competition</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Real-time battles with players worldwide
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Anti-cheat protection and fair play
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Spectator mode and replay system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Regional servers for low latency
                  </li>
                </ul>
              </div>

              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-4">⚡ Advanced Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
                    Smart matchmaking algorithm
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
                    In-game chat and emotes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
                    Tournament and league system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
                    Cross-platform compatibility
                  </li>
                </ul>
              </div>
            </div>

            {/* Start Battle Button */}
            <div className="space-y-4">
              <button
                onClick={() => setGameStarted(true)}
                className="group relative inline-flex items-center px-12 py-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white text-xl font-bold rounded-2xl hover:from-green-600 hover:via-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <Users className="h-6 w-6 mr-3" />
                Enter Multiplayer Arena
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <p className="text-sm text-gray-400">
                🌍 10,847 players online • ⚔️ 3,291 battles in progress • 🏆 Season 3 active
              </p>
            </div>

            {/* Server Status */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/50">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-sm font-medium">EU-West: Online</span>
                </div>
                <div className="text-xs text-green-200 mt-1">Ping: 23ms</div>
              </div>
              
              <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/50">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-sm font-medium">US-East: Online</span>
                </div>
                <div className="text-xs text-green-200 mt-1">Ping: 67ms</div>
              </div>
              
              <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-500/50">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-300 text-sm font-medium">Asia: Maintenance</span>
                </div>
                <div className="text-xs text-yellow-200 mt-1">ETA: 2h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <MultiplayerBattleInterface />
    </div>
  );
}