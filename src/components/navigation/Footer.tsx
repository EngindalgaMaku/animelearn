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
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Zumenzu</h3>
            </div>
            <p className="text-sm text-gray-300">
              Learn Python programming while collecting exclusive cards! The most
              fun way to learn coding through gamification.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com"
                className="text-gray-400 transition-colors hover:text-white"
                target="_blank"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-400 transition-colors hover:text-white"
                target="_blank"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:info@zumenzu.com"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Learning Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Learning</h4>
            <div className="space-y-2">
              <Link
                href="/code-arena"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                Code Arena
              </Link>
              <Link
                href="/quests"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                Daily Quests
              </Link>
              <Link
                href="/code-editor"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                Code Editor
              </Link>
              <Link
                href="/badges"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                Badge Collection
              </Link>
            </div>
          </div>

          {/* Collection Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Collection</h4>
            <div className="space-y-2">
              <Link
                href="/shop"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                Card Shop
              </Link>
              <Link
                href="/my-cards"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                My Cards
              </Link>
              <Link
                href="/profile"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                Profil
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-gray-300 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Stats & Community */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Community</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">1,234+ Students</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">567+ Card Types</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Trophy className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">89+ Badges</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Diamond className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">1M+ Diamonds Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
              <p className="text-sm text-gray-400">
                © 2024 Zumenzu. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <Link
                  href="/privacy"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
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
