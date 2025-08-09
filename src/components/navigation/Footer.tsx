"use client";

import Link from "next/link";
import {
  Heart,
  Code,
  Star,
  Users,
  Trophy,
  Diamond,
  Github,
  Twitter,
  Mail,
  ExternalLink,
  FileText,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-12 lg:px-8">
        {/* Main Footer Content - Mobile First Responsive Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section - Full width on mobile, spans across on tablet */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Zumenzu</h3>
            </div>
            <p className="text-sm text-gray-300 max-w-md">
              Learn Python programming while collecting exclusive cards! The most
              fun way to learn coding through gamification.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <Link
                href="https://github.com"
                className="text-gray-400 transition-colors hover:text-white p-2 -m-2 rounded-lg hover:bg-white/10"
                target="_blank"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-400 transition-colors hover:text-white p-2 -m-2 rounded-lg hover:bg-white/10"
                target="_blank"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:info@zumenzu.com"
                className="text-gray-400 transition-colors hover:text-white p-2 -m-2 rounded-lg hover:bg-white/10"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Learning Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Learning</h4>
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/blog"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Python Blog
              </Link>
              <Link
                href="/code-arena"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Code Arena
              </Link>
              <Link
                href="/quests"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Daily Quests
              </Link>
              <Link
                href="/code-editor"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Code Editor
              </Link>
              <Link
                href="/badges"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Badge Collection
              </Link>
            </div>
          </div>

          {/* Collection Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Collection</h4>
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/shop"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Card Shop
              </Link>
              <Link
                href="/my-cards"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                My Cards
              </Link>
              <Link
                href="/profile"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-gray-300 transition-colors hover:text-white py-1 rounded hover:bg-white/5 px-2 -mx-2"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Stats & Community */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Community</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 text-sm p-1">
                <Users className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">1,234+ Students</span>
              </div>
              <div className="flex items-center space-x-2 text-sm p-1">
                <Star className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-300">567+ Card Types</span>
              </div>
              <div className="flex items-center space-x-2 text-sm p-1">
                <Trophy className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-300">89+ Badges</span>
              </div>
              <div className="flex items-center space-x-2 text-sm p-1">
                <Diamond className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">1M+ Diamonds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile Optimized */}
        <div className="mt-8 sm:mt-12 border-t border-gray-700 pt-6 sm:pt-8">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* Copyright and Links */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-gray-400 text-center">
                © 2024 Zumenzu. All rights reserved.
              </p>
              
              {/* Legal Links - Better mobile spacing */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                <Link
                  href="/privacy"
                  className="text-gray-400 transition-colors hover:text-white px-2 py-1 rounded hover:bg-white/5"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/terms"
                  className="text-gray-400 transition-colors hover:text-white px-2 py-1 rounded hover:bg-white/5"
                >
                  Terms of Service
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/contact"
                  className="text-gray-400 transition-colors hover:text-white px-2 py-1 rounded hover:bg-white/5"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Made with Love */}
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
              <span>for Python & Card collectors</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      </div>
    </footer>
  );
}
