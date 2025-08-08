"use client";

import React from "react";
import GamificationHub from "@/components/gamification/gamification-hub";

export default function GamificationDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Gamification Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to Anime Card Manager's comprehensive gamification system!
            Track your streaks, complete daily quizzes, open card packs
            and explore much more to enhance your learning experience.
          </p>
        </div>

        {/* Main Gamification Hub */}
        <GamificationHub className="w-full" />

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Streak System</h3>
                <p className="text-sm text-gray-600">Daily streaks and milestones</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Daily activity tracking</li>
              <li>• Milestone rewards (3, 7, 14, 30 days)</li>
              <li>• Multiple streak categories</li>
              <li>• Progress indicators</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Daily Mini Quiz</h3>
                <p className="text-sm text-gray-600">Daily 5-question tests</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 60-second time limit</li>
              <li>• Real-time scoring</li>
              <li>• Detailed explanations</li>
              <li>• XP and Diamond rewards</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Card Pack Opening</h3>
                <p className="text-sm text-gray-600">Animated card opening</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 3D flip animations</li>
              <li>• Rarity-based distribution</li>
              <li>• Collection system</li>
              <li>• Special effects</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">XP Events</h3>
                <p className="text-sm text-gray-600">Bonus XP events</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 2x-3x XP multipliers</li>
              <li>• Time-limited events</li>
              <li>• Participant tracking</li>
              <li>• Special rewards</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Daily Login</h3>
                <p className="text-sm text-gray-600">7-day cycle bonuses</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Daily login rewards</li>
              <li>• Increasing bonus amounts</li>
              <li>• Special milestone days</li>
              <li>• Reset countdown</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Detailed statistics</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Level progression system</li>
              <li>• Diamond economy</li>
              <li>• Daily quest tracking</li>
              <li>• Achievement system</li>
            </ul>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🛠️ System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Frontend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Next.js 13+ App Router</li>
                <li>✅ TypeScript Full Type Safety</li>
                <li>✅ Framer Motion Animations</li>
                <li>✅ Tailwind CSS Responsive Design</li>
                <li>✅ Real-time State Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Backend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Prisma ORM with PostgreSQL</li>
                <li>✅ JWT Authentication</li>
                <li>✅ RESTful API Design</li>
                <li>✅ Database Transactions</li>
                <li>✅ Error Handling & Validation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔌 Available API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3">
              <code className="text-blue-600 font-mono">/api/gamification/overview</code>
              <p className="text-gray-600 mt-1">General statistics</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="text-blue-600 font-mono">/api/daily-mini-quiz</code>
              <p className="text-gray-600 mt-1">Daily quiz system</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="text-blue-600 font-mono">/api/user-streak</code>
              <p className="text-gray-600 mt-1">Streak tracking system</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="text-blue-600 font-mono">/api/card-packs</code>
              <p className="text-gray-600 mt-1">Card pack system</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="text-blue-600 font-mono">/api/xp-events</code>
              <p className="text-gray-600 mt-1">XP event management</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="text-blue-600 font-mono">/api/daily-login</code>
              <p className="text-gray-600 mt-1">Login bonus system</p>
            </div>
          </div>
        </div>

        {/* Navigation Help */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            This gamification system is production-ready and ready to use!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📊 Go to Dashboard
            </a>
            <a
              href="/learn"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📚 Go to Lessons
            </a>
            <a
              href="/my-cards"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🎴 Go to My Cards
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
