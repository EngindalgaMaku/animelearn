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
  BookOpen,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-12 lg:px-8">
        {/* Main Footer Content - Mobile First Responsive Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section - Full width on mobile, spans across on tablet */}
          <div className="space-y-3 sm:col-span-2 sm:space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 sm:h-10 sm:w-10">
                <Code className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg font-bold sm:text-xl">Zumenzu</h3>
            </div>
            <p className="max-w-md text-sm text-gray-300">
              Learn Python programming while collecting exclusive cards! The
              most fun way to learn coding through gamification.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <Link
                href="https://github.com"
                className="-m-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                target="_blank"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="-m-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                target="_blank"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:info@zumenzu.com"
                className="-m-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Learning Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base font-semibold text-white sm:text-lg">
              Learning
            </h4>
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/wiki"
                className="-mx-2 flex items-center space-x-2 rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <BookOpen className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <span>Learning Wiki</span>
              </Link>
              <Link
                href="/blog"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Python Blog
              </Link>
              <Link
                href="/code-arena-v2"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Code Arena
              </Link>
              <Link
                href="/quests"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Daily Quests
              </Link>
              <Link
                href="/code-editor"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Code Editor
              </Link>
              <Link
                href="/badges"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Badge Collection
              </Link>
            </div>
          </div>

          {/* Collection Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base font-semibold text-white sm:text-lg">
              Collection
            </h4>
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/shop"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Card Shop
              </Link>
              <Link
                href="/my-cards"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                My Cards
              </Link>
              <Link
                href="/profile"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="-mx-2 block rounded px-2 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Stats & Community */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base font-semibold text-white sm:text-lg">
              Community
            </h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 p-1 text-sm">
                <Users className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <span className="text-gray-300">1,234+ Students</span>
              </div>
              <div className="flex items-center space-x-2 p-1 text-sm">
                <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                <span className="text-gray-300">567+ Card Types</span>
              </div>
              <div className="flex items-center space-x-2 p-1 text-sm">
                <Trophy className="h-4 w-4 flex-shrink-0 text-purple-400" />
                <span className="text-gray-300">89+ Badges</span>
              </div>
              <div className="flex items-center space-x-2 p-1 text-sm">
                <Diamond className="h-4 w-4 flex-shrink-0 text-green-400" />
                <span className="text-gray-300">1M+ Diamonds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile Optimized */}
        <div className="mt-8 border-t border-gray-700 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* Copyright and Links */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <p className="text-center text-xs text-gray-400 sm:text-sm">
                © {new Date().getFullYear()} Zumenzu. All rights reserved.
              </p>

              {/* Legal Links - Better mobile spacing */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                <Link
                  href="/privacy"
                  className="rounded px-2 py-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/terms"
                  className="rounded px-2 py-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Terms of Service
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/contact"
                  className="rounded px-2 py-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Contact
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/wiki"
                  className="rounded px-2 py-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Wiki
                </Link>
              </div>
            </div>

            {/* Made with Love */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 sm:text-sm">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-400 sm:h-4 sm:w-4" />
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
