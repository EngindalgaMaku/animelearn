"use client";

import { Gamepad2, Trophy, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Interactive Code Arena",
    description: "Practice Python with real-time challenges, instant feedback, and multiplayer competitions. Master concepts through hands-on coding.",
    stats: "50+ challenges",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Collect anime cards, earn XP, unlock achievements, and climb leaderboards while mastering Python fundamentals.",
    stats: "200+ rewards",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor your learning journey with detailed analytics, skill assessments, and personalized recommendations.",
    stats: "Real-time insights",
    gradient: "from-emerald-500 to-teal-600"
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to master Python
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform combines the best of gamification, interactive learning, and progress tracking.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:shadow-xl hover:shadow-gray-200/50"
              >
                {/* Icon */}
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats Badge */}
                <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {feature.stats}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}