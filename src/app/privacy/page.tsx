"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Mail,
  Settings,
  AlertTriangle,
  CheckCircle,
  Cookie,
  Smartphone,
  Globe,
  Sparkles,
  Trophy,
  Star,
} from "lucide-react";
import { DiamondCounter } from "@/components/gamification/diamond-counter";

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  reward: string;
  content: React.ReactNode;
}

export default function PrivacyPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const [diamonds, setDiamonds] = useState(1350);

  const handleSectionClick = (sectionId: string) => {
    if (!readSections.has(sectionId)) {
      setReadSections((prev) => new Set([...prev, sectionId]));
      setDiamonds((prev) => prev + 10);
    }
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const privacySections: PrivacySection[] = [
    {
      id: "data-collection",
      title: "Data Collection",
      icon: <Database className="h-6 w-6" />,
      gradient: "from-blue-500 to-cyan-500",
      reward: "+10 💎",
      content: (
        <div className="space-y-4">
          <p>
            We collect the following types of information to provide you with
            the best learning experience:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="font-semibold text-blue-900">
                Account Information
              </h4>
              <ul className="mt-2 text-sm text-blue-800">
                <li>• Username and email address</li>
                <li>• Profile picture and display name</li>
                <li>• Learning preferences and goals</li>
              </ul>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <h4 className="font-semibold text-green-900">Learning Data</h4>
              <ul className="mt-2 text-sm text-green-800">
                <li>• Lesson progress and completion</li>
                <li>• Quiz scores and attempts</li>
                <li>• Code submissions and projects</li>
              </ul>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <h4 className="font-semibold text-purple-900">
                Gamification Data
              </h4>
              <ul className="mt-2 text-sm text-purple-800">
                <li>• Achievement unlocks and badges</li>
                <li>• Diamond balance and transactions</li>
                <li>• Card collection and trading</li>
              </ul>
            </div>
            <div className="rounded-lg bg-orange-50 p-4">
              <h4 className="font-semibold text-orange-900">Usage Analytics</h4>
              <ul className="mt-2 text-sm text-orange-800">
                <li>• Time spent on platform</li>
                <li>• Feature usage patterns</li>
                <li>• Device and browser information</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "data-usage",
      title: "How We Use Your Data",
      icon: <Settings className="h-6 w-6" />,
      gradient: "from-green-500 to-emerald-500",
      reward: "+10 💎",
      content: (
        <div className="space-y-4">
          <p>
            Your data helps us create a personalized and engaging learning
            experience:
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 p-4">
              <Trophy className="mt-1 h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">
                  Personalized Learning
                </h4>
                <p className="text-sm text-green-800">
                  Adapt lessons to your skill level and learning pace
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 p-4">
              <Star className="mt-1 h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">
                  Progress Tracking
                </h4>
                <p className="text-sm text-blue-800">
                  Monitor your achievements and recommend next steps
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-4">
              <Sparkles className="mt-1 h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-semibold text-purple-900">
                  Gamification Features
                </h4>
                <p className="text-sm text-purple-800">
                  Power achievements, leaderboards, and rewards
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 p-4">
              <Settings className="mt-1 h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-900">
                  Platform Improvement
                </h4>
                <p className="text-sm text-orange-800">
                  Enhance features and fix bugs based on usage patterns
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "data-sharing",
      title: "Data Sharing & Third Parties",
      icon: <Users className="h-6 w-6" />,
      gradient: "from-purple-500 to-pink-500",
      reward: "+10 💎",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-300 bg-green-100 p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">
                We Never Sell Your Data
              </h4>
            </div>
            <p className="mt-2 text-sm text-green-800">
              Your personal information is never sold to advertisers or third
              parties.
            </p>
          </div>
          <p>We only share data in these limited circumstances:</p>
          <div className="space-y-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-semibold text-gray-900">
                🔧 Service Providers
              </h4>
              <p className="text-sm text-gray-700">
                Cloud hosting, email services, and analytics tools that help us
                operate the platform
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-semibold text-gray-900">
                ⚖️ Legal Requirements
              </h4>
              <p className="text-sm text-gray-700">
                When required by law, court order, or to protect our users'
                safety
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-semibold text-gray-900">
                🤝 Community Features
              </h4>
              <p className="text-sm text-gray-700">
                Public profiles, leaderboards, and shared code submissions (with
                your consent)
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "data-security",
      title: "Data Security & Protection",
      icon: <Lock className="h-6 w-6" />,
      gradient: "from-red-500 to-orange-500",
      reward: "+15 💎",
      content: (
        <div className="space-y-4">
          <p>
            We implement industry-standard security measures to protect your
            data:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="flex items-center font-semibold text-red-900">
                <Lock className="mr-2 h-4 w-4" />
                Encryption
              </h4>
              <p className="mt-2 text-sm text-red-800">
                All data is encrypted in transit and at rest using AES-256
                encryption
              </p>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h4 className="flex items-center font-semibold text-orange-900">
                <Shield className="mr-2 h-4 w-4" />
                Access Control
              </h4>
              <p className="mt-2 text-sm text-orange-800">
                Strict access controls and regular security audits
              </p>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h4 className="flex items-center font-semibold text-yellow-900">
                <Database className="mr-2 h-4 w-4" />
                Secure Storage
              </h4>
              <p className="mt-2 text-sm text-yellow-800">
                Data stored in secure, compliant cloud infrastructure
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="flex items-center font-semibold text-green-900">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Incident Response
              </h4>
              <p className="mt-2 text-sm text-green-800">
                24/7 monitoring and rapid incident response protocols
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "user-rights",
      title: "Your Privacy Rights",
      icon: <Eye className="h-6 w-6" />,
      gradient: "from-indigo-500 to-purple-500",
      reward: "+15 💎",
      content: (
        <div className="space-y-4">
          <p>
            You have full control over your personal data. Here are your rights:
          </p>
          <div className="space-y-3">
            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <h4 className="flex items-center font-semibold">
                <Eye className="mr-2 h-4 w-4" />
                Access Your Data
              </h4>
              <p className="mt-1 text-sm text-blue-100">
                Request a copy of all personal data we have about you
              </p>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <h4 className="flex items-center font-semibold">
                <Settings className="mr-2 h-4 w-4" />
                Update Information
              </h4>
              <p className="mt-1 text-sm text-green-100">
                Correct or update any inaccurate personal information
              </p>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
              <h4 className="flex items-center font-semibold">
                <Lock className="mr-2 h-4 w-4" />
                Data Portability
              </h4>
              <p className="mt-1 text-sm text-purple-100">
                Export your data in a machine-readable format
              </p>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
              <h4 className="flex items-center font-semibold">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Account
              </h4>
              <p className="mt-1 text-sm text-red-100">
                Request complete deletion of your account and data
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-sm text-indigo-800">
              <strong>How to exercise your rights:</strong> Contact us at
              privacy@animecard.dev or use the privacy settings in your account
              dashboard.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Cookie className="h-6 w-6" />,
      gradient: "from-yellow-500 to-orange-500",
      reward: "+10 💎",
      content: (
        <div className="space-y-4">
          <p>
            We use cookies and similar technologies to enhance your experience:
          </p>
          <div className="space-y-3">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h4 className="font-semibold text-yellow-900">
                🍪 Essential Cookies
              </h4>
              <p className="mt-1 text-sm text-yellow-800">
                Required for login, security, and basic functionality
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="font-semibold text-blue-900">
                📊 Analytics Cookies
              </h4>
              <p className="mt-1 text-sm text-blue-800">
                Help us understand how you use the platform (can be disabled)
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="font-semibold text-green-900">
                ⚙️ Preference Cookies
              </h4>
              <p className="mt-1 text-sm text-green-800">
                Remember your settings and personalization choices
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-700">
              You can manage cookie preferences in your browser settings or
              through our cookie consent banner.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const completionPercentage = Math.round(
    (readSections.size / privacySections.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 flex items-center justify-center">
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <div className="ml-4">
              <DiamondCounter count={diamonds} animated size="lg" />
            </div>
          </div>

          <motion.h1
            className="mb-4 text-5xl font-bold text-gray-900"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className="mb-6 text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Learn how we protect your data and earn rewards! 🛡️
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto max-w-md"
          >
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Reading Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Read all sections to earn maximum rewards!
            </p>
          </motion.div>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-sm"
            >
              <motion.div
                className={`cursor-pointer bg-gradient-to-r ${section.gradient} p-6 text-white`}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSectionClick(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-white/20 p-3">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{section.title}</h3>
                      <p className="text-sm opacity-90">
                        Click to read and earn diamonds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {readSections.has(section.id) ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Read</span>
                      </div>
                    ) : (
                      <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
                        {section.reward}
                      </div>
                    )}
                    <motion.div
                      animate={{
                        rotate: expandedSection === section.id ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-white"
                    >
                      ↓
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 text-gray-700">{section.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mb-4 text-6xl"
          >
            🔒
          </motion.div>
          <h3 className="mb-4 text-2xl font-bold">Privacy Questions?</h3>
          <p className="mb-6 text-lg opacity-90">
            Contact our privacy team anytime for questions or concerns
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white/20 p-4">
              <Mail className="mx-auto mb-2 h-6 w-6" />
              <div className="font-bold">privacy@animecard.dev</div>
              <div className="text-sm opacity-75">Privacy Questions</div>
            </div>
            <div className="rounded-lg bg-white/20 p-4">
              <Settings className="mx-auto mb-2 h-6 w-6" />
              <div className="font-bold">Account Settings</div>
              <div className="text-sm opacity-75">Manage Privacy</div>
            </div>
            <div className="rounded-lg bg-white/20 p-4">
              <Globe className="mx-auto mb-2 h-6 w-6" />
              <div className="font-bold">Legal Compliance</div>
              <div className="text-sm opacity-75">GDPR & CCPA</div>
            </div>
          </div>
          <div className="mt-6 text-sm opacity-75">
            Last updated: August 4, 2024 • Effective immediately
          </div>
        </motion.div>
      </div>
    </div>
  );
}
