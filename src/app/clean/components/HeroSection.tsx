"use client";

import Link from "next/link";
import { ArrowRight, Monitor, Brain, Code, Sparkles } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.02]"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10">
            <Sparkles className="mr-2 h-4 w-4" />
            Join 5,000+ developers learning Python
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Master Python Through
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Interactive Challenges
            </span>
          </h1>

          {/* Subtext */}
          <p className="mb-10 text-lg leading-8 text-gray-600 sm:text-xl">
            Join thousands of developers learning Python with our gamified
            platform. Collect cards, earn badges, and build real skills through
            hands-on coding challenges.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={isAuthenticated ? "/dashboard" : "/code-arena"}
              className="group flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto"
            >
              {isAuthenticated ? "Go to Dashboard" : "Preview Code Arena"}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={isAuthenticated ? "/code-arena" : "/quiz-arena"}
              className="group flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 sm:w-auto"
            >
              {isAuthenticated ? (
                <Monitor className="mr-2 h-5 w-5" />
              ) : (
                <Brain className="mr-2 h-5 w-5" />
              )}
              {isAuthenticated ? "Enter Code Arena" : "Preview Quiz Arena"}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              50+ Challenges
            </div>
            <div className="flex items-center">
              <span className="mr-2">🏆</span>
              200+ Rewards
            </div>
            <div className="flex items-center">
              <span className="mr-2">⚡</span>
              Instant Feedback
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
