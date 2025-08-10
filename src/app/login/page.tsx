"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Sparkles,
  Eye,
  EyeOff,
  Trophy,
  Target,
  Star,
  Zap,
  Diamond,
  Crown,
  Gift,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { signIn, getSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        usernameOrEmail: username,
        password: password,
        redirect: false,
      });

      if (result?.ok) {
        // Force page reload to ensure proper session initialization
        window.location.href = "/dashboard";
      } else {
        setError(result?.error || "Sign in failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      setError("Google sign in failed");
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Gaming Icons */}
        <motion.div
          className="absolute left-10 top-20 text-yellow-400 opacity-20"
          animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Trophy className="h-12 w-12" />
        </motion.div>
        <motion.div
          className="absolute right-20 top-40 text-blue-400 opacity-20"
          animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          <Target className="h-16 w-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-green-400 opacity-20"
          animate={{ y: [-15, 15, -15], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        >
          <Star className="h-10 w-10" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-purple-400 opacity-20"
          animate={{ y: [20, -20, 20], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, delay: 0.5 }}
        >
          <Zap className="h-14 w-14" />
        </motion.div>

        {/* Particle Effects */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-white opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-50, 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full">
        {/* Left Side - Benefits & Gamification Features */}
        <div className="relative z-10 hidden flex-col items-center justify-center p-12 text-white lg:flex lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <div className="mb-8">
              <motion.div
                className="mb-4 flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
                  Level Up Your Coding!
                </h1>
              </motion.div>

              <motion.p
                className="mb-8 text-xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Unlock the full power of our gamified Python learning platform
              </motion.p>
            </div>

            {/* Features List */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                {
                  icon: <Trophy className="h-6 w-6" />,
                  title: "Earn Achievements",
                  description:
                    "Unlock badges and trophies as you master new concepts",
                  color: "from-yellow-400 to-orange-500",
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  title: "Daily Challenges",
                  description:
                    "Complete coding challenges and earn bonus rewards",
                  color: "from-blue-400 to-purple-500",
                },
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "Track Progress",
                  description:
                    "Monitor your learning journey with detailed statistics",
                  color: "from-green-400 to-blue-500",
                },
                {
                  icon: <Diamond className="h-6 w-6" />,
                  title: "Collect Cards",
                  description:
                    "Build your collection with exclusive Python concept cards",
                  color: "from-purple-400 to-pink-500",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "XP & Levels",
                  description:
                    "Gain experience points and level up your programming skills",
                  color: "from-indigo-400 to-purple-500",
                },
                {
                  icon: <Gift className="h-6 w-6" />,
                  title: "Exclusive Rewards",
                  description: "Access premium content and special features",
                  color: "from-pink-400 to-red-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color} flex-shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="relative z-10 flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
          <motion.div
            className="w-full max-w-md space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="text-center">
              <Link
                href="/"
                className="mb-8 inline-flex items-center space-x-3"
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="h-7 w-7 text-white" />
                </motion.div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                  Zumenzu
                </span>
              </Link>

              <motion.h2
                className="mb-2 text-3xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome Back, Coder! 🎮
              </motion.h2>
              <motion.p
                className="text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Continue your epic Python learning journey
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.div
              className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative block w-full appearance-none rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-gray-300 backdrop-blur-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative block w-full appearance-none rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-gray-300 backdrop-blur-sm focus:z-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-300 hover:text-white" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-300 hover:text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="rounded-xl border border-red-400 bg-red-500/20 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-300">
                          Sign In Error
                        </h3>
                        <div className="mt-2 text-sm text-red-200">{error}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Logging into your adventure...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <LogIn className="h-4 w-4" />
                        <span>Start Gaming! 🚀</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Google Sign In */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/10 px-2 text-gray-300 backdrop-blur-sm">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <motion.button
                    onClick={handleGoogleSignIn}
                    className="group relative flex w-full justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Demo Info */}
              <motion.div
                className="mt-6 rounded-xl border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-sm">
                  <h4 className="mb-2 flex items-center space-x-2 font-medium text-white">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Ready to start your journey?</span>
                  </h4>
                  <p className="mb-3 text-gray-300">
                    Join thousands of learners mastering Python through gamified
                    challenges!
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center space-x-2 font-medium text-yellow-400 transition-colors hover:text-yellow-300"
                  >
                    <Award className="h-4 w-4" />
                    <span>Create Free Account →</span>
                  </Link>
                </div>
              </motion.div>

              {/* Mobile Benefits Preview */}
              <motion.div
                className="mt-6 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="mb-3 flex items-center space-x-2 font-medium text-white">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span>What you'll unlock:</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Target className="h-3 w-3 text-blue-400" />
                    <span>Daily Challenges</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Diamond className="h-3 w-3 text-purple-400" />
                    <span>Collect Cards</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Zap className="h-3 w-3 text-yellow-400" />
                    <span>Earn XP</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span>Track Progress</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-gray-400 transition-colors hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
