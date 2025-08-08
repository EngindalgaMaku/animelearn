"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Send,
  Star,
  Trophy,
  MessageCircle,
  Clock,
  Globe,
  Github,
  Twitter,
  Instagram,
  CheckCircle,
  Gift,
} from "lucide-react";
import { DiamondCounter } from "@/components/gamification/diamond-counter";
import { AchievementCelebration } from "@/components/gamification/achievement-celebration";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "diamond" | "xp" | "badge" | "level" | "streak" | "special";
  value?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [diamonds, setDiamonds] = useState(1250);

  const achievement: Achievement = {
    id: "first-contact",
    title: "Communication Initiator!",
    description: "You sent your first message and connected with the community",
    icon: "📧",
    type: "diamond",
    value: 50,
    rarity: "rare",
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);
    setDiamonds((prev) => prev + 50);

    // Show achievement after a short delay
    setTimeout(() => {
      setShowAchievement(true);
    }, 1000);

    // Reset form
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const contactCards = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email",
      value: "contact@animecard.dev",
      description: "We answer your questions 24/7",
      gradient: "from-blue-400 to-blue-600",
      reward: "+10 💎",
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Phone",
      value: "+90 532 123 45 67",
      description: "Monday-Friday 09:00-18:00",
      gradient: "from-green-400 to-green-600",
      reward: "+15 💎",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Address",
      value: "Istanbul, Turkey",
      description: "Meet us at our headquarters",
      gradient: "from-purple-400 to-purple-600",
      reward: "+25 💎",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Discord",
      value: "AnimeCard Community",
      description: "Live chat with community",
      gradient: "from-indigo-400 to-indigo-600",
      reward: "+30 💎",
    },
  ];

  const socialLinks = [
    { icon: <Github className="h-6 w-6" />, label: "GitHub", href: "#" },
    { icon: <Twitter className="h-6 w-6" />, label: "Twitter", href: "#" },
    { icon: <Instagram className="h-6 w-6" />, label: "Instagram", href: "#" },
    { icon: <Globe className="h-6 w-6" />, label: "Website", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 px-4 py-12">
      {/* Achievement Celebration */}
      <AchievementCelebration
        achievement={achievement}
        isVisible={showAchievement}
        onComplete={() => setShowAchievement(false)}
      />

      <div className="mx-auto max-w-7xl">
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
              <Sparkles className="h-8 w-8 text-white" />
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
            Get In Touch
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Share your questions and earn special rewards! 🎁
          </motion.p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Send Message
                </h2>
                <p className="text-gray-600">Earn +50 💎 for each message!</p>
              </div>
            </div>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="mb-6 rounded-lg border border-green-300 bg-green-100 p-4"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">
                        Your message has been sent! 🎉
                      </p>
                      <p className="text-sm text-green-600">
                        +50 💎 added to your account
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="Your Full Name"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="email@example.com"
                  />
                </motion.div>
              </div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Subject of your message"
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Write your message here..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>Send Message & Earn 50 💎</span>
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contact Information
                  </h2>
                  <p className="text-gray-600">
                    Click each channel, earn rewards!
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {contactCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`cursor-pointer rounded-xl bg-gradient-to-r ${card.gradient} p-6 text-white shadow-lg transition-all hover:shadow-xl`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-lg bg-white/20 p-3">
                          {card.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{card.title}</h3>
                          <p className="text-sm opacity-90">{card.value}</p>
                          <p className="text-xs opacity-75">
                            {card.description}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                        {card.reward}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white shadow-xl"
            >
              <div className="mb-6 flex items-center space-x-4">
                <div className="rounded-lg bg-white/20 p-3">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Social Media</h3>
                  <p className="text-sm opacity-90">
                    Follow us, meet the community!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center space-x-2 rounded-lg bg-white/20 p-4 transition-all hover:bg-white/30"
                  >
                    {social.icon}
                    <span className="text-sm font-medium">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Office Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 09:00 - 18:00
                  </p>
                  <p className="text-gray-600">Weekend: 10:00 - 16:00</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Achievement Info */}
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
            🎮
          </motion.div>
          <h3 className="mb-2 text-2xl font-bold">Contact Rewards System</h3>
          <p className="mb-4 text-lg opacity-90">
            Earn special rewards for each interaction and climb the leaderboard!
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white/20 p-4">
              <Gift className="mx-auto mb-2 h-8 w-8" />
              <div className="font-bold">Send Message</div>
              <div className="text-sm opacity-75">+50 💎</div>
            </div>
            <div className="rounded-lg bg-white/20 p-4">
              <Star className="mx-auto mb-2 h-8 w-8" />
              <div className="font-bold">Social Follow</div>
              <div className="text-sm opacity-75">+25 💎</div>
            </div>
            <div className="rounded-lg bg-white/20 p-4">
              <Trophy className="mx-auto mb-2 h-8 w-8" />
              <div className="font-bold">Communication Master</div>
              <div className="text-sm opacity-75">Special Badge</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
