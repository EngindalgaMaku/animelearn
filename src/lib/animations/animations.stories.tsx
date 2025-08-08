import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  fadeVariants,
  slideVariants,
  scaleVariants,
  staggerVariants,
  staggerChildVariants,
  specialEffects,
  microInteractions,
  pageTransitions,
  transitions,
} from "./presets";

const meta: Meta = {
  title: "Animations/System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Animation system with Framer Motion presets, micro-interactions, and transitions for the anime Python learning platform.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Animation Presets Showcase
export const AnimationPresets: Story = {
  render: () => {
    const [triggerKey, setTriggerKey] = useState(0);

    const restartAnimations = () => {
      setTriggerKey((prev) => prev + 1);
    };

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Animation Presets</h2>
          <button
            onClick={restartAnimations}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Restart Animations
          </button>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          key={triggerKey}
        >
          {/* Fade In */}
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-indigo-600">Fade In</h3>
            <p className="text-gray-600 text-sm">
              Smooth opacity transition from 0 to 1 with gentle easing.
            </p>
            <div className="mt-4 bg-indigo-50 p-3 rounded text-xs font-mono">
              fadeVariants
            </div>
          </motion.div>

          {/* Slide In from Left */}
          <motion.div
            variants={slideVariants.fromLeft}
            initial="hidden"
            animate="visible"
            transition={transitions.animeSpring}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-pink-600">
              Slide In Left
            </h3>
            <p className="text-gray-600 text-sm">
              Slides in from the left side with smooth easing.
            </p>
            <div className="mt-4 bg-pink-50 p-3 rounded text-xs font-mono">
              slideVariants.fromLeft
            </div>
          </motion.div>

          {/* Slide In from Right */}
          <motion.div
            variants={slideVariants.fromRight}
            initial="hidden"
            animate="visible"
            transition={transitions.animeSpring}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-purple-600">
              Slide In Right
            </h3>
            <p className="text-gray-600 text-sm">
              Slides in from the right side with smooth easing.
            </p>
            <div className="mt-4 bg-purple-50 p-3 rounded text-xs font-mono">
              slideVariants.fromRight
            </div>
          </motion.div>

          {/* Slide In from Top */}
          <motion.div
            variants={slideVariants.fromTop}
            initial="hidden"
            animate="visible"
            transition={transitions.animeSpring}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">
              Slide In Up
            </h3>
            <p className="text-gray-600 text-sm">
              Slides in from the top with smooth easing.
            </p>
            <div className="mt-4 bg-green-50 p-3 rounded text-xs font-mono">
              slideVariants.fromTop
            </div>
          </motion.div>

          {/* Slide In from Bottom */}
          <motion.div
            variants={slideVariants.fromBottom}
            initial="hidden"
            animate="visible"
            transition={transitions.animeSpring}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-yellow-600">
              Slide In Down
            </h3>
            <p className="text-gray-600 text-sm">
              Slides in from the bottom with smooth easing.
            </p>
            <div className="mt-4 bg-yellow-50 p-3 rounded text-xs font-mono">
              slideVariants.fromBottom
            </div>
          </motion.div>

          {/* Scale In */}
          <motion.div
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-red-600">Scale In</h3>
            <p className="text-gray-600 text-sm">
              Scales up from small to normal size with spring animation.
            </p>
            <div className="mt-4 bg-red-50 p-3 rounded text-xs font-mono">
              scaleVariants
            </div>
          </motion.div>

          {/* Magical Appear */}
          <motion.div
            variants={specialEffects.magicalAppear}
            initial="hidden"
            animate="visible"
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-teal-600">
              Magical Appear
            </h3>
            <p className="text-gray-600 text-sm">
              Magical entrance with rotation and scale effect.
            </p>
            <div className="mt-4 bg-teal-50 p-3 rounded text-xs font-mono">
              specialEffects.magicalAppear
            </div>
          </motion.div>
        </div>
      </div>
    );
  },
};

// Interactive Animations
export const InteractiveAnimations: Story = {
  render: () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Interactive Animations</h2>

        <div className="space-y-8">
          {/* Card Hover Effects */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Card Hover Effects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={microInteractions.card}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-br from-indigo-400 to-purple-500 p-6 rounded-xl text-white cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                  🎯
                </div>
                <h4 className="font-bold text-lg mb-2">Hover Card</h4>
                <p className="text-sm opacity-90">
                  Hover to see the lift and scale effect
                </p>
              </motion.div>

              <motion.div
                variants={microInteractions.card}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-br from-pink-400 to-red-500 p-6 rounded-xl text-white cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                  💎
                </div>
                <h4 className="font-bold text-lg mb-2">Anime Card</h4>
                <p className="text-sm opacity-90">
                  Interactive card with smooth transitions
                </p>
              </motion.div>

              <motion.div
                variants={microInteractions.card}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-br from-green-400 to-teal-500 p-6 rounded-xl text-white cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                  📚
                </div>
                <h4 className="font-bold text-lg mb-2">Learning Card</h4>
                <p className="text-sm opacity-90">
                  Responsive hover animations
                </p>
              </motion.div>
            </div>
          </div>

          {/* Button Press Effects */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Button Press Effects</h3>
            <div className="flex flex-wrap gap-4">
              <motion.button
                variants={microInteractions.button}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium"
              >
                Primary Button
              </motion.button>

              <motion.button
                variants={microInteractions.button}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-medium"
              >
                Secondary Button
              </motion.button>

              <motion.button
                variants={microInteractions.buttonSubtle}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50"
              >
                Outline Button
              </motion.button>

              <motion.button
                variants={microInteractions.button}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium"
              >
                Gradient Button
              </motion.button>
            </div>
          </div>

          {/* Special Effects */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Special Effects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Power Up Effect */}
              <motion.div
                variants={specialEffects.powerUp}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl text-white text-center"
              >
                <div className="text-4xl mb-2">⚡</div>
                <h4 className="font-bold text-lg mb-2">Power Up</h4>
                <p className="text-sm opacity-90">Power-up animation effect</p>
              </motion.div>

              {/* Floating Effect */}
              <motion.div
                variants={specialEffects.float}
                animate="animate"
                className="bg-gradient-to-br from-blue-400 to-cyan-500 p-6 rounded-xl text-white text-center"
              >
                <div className="text-4xl mb-2">🎈</div>
                <h4 className="font-bold text-lg mb-2">Floating</h4>
                <p className="text-sm opacity-90">Continuous floating motion</p>
              </motion.div>

              {/* Pulse Effect */}
              <motion.div
                variants={specialEffects.pulse}
                animate="animate"
                className="bg-gradient-to-br from-purple-400 to-pink-500 p-6 rounded-xl text-white text-center"
              >
                <div className="text-4xl mb-2">💓</div>
                <h4 className="font-bold text-lg mb-2">Pulse</h4>
                <p className="text-sm opacity-90">Rhythmic pulse animation</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Stagger Animations
export const StaggerAnimations: Story = {
  render: () => {
    const [triggerKey, setTriggerKey] = useState(0);

    const restartStagger = () => {
      setTriggerKey((prev) => prev + 1);
    };

    const items = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Stagger Animations</h2>
          <button
            onClick={restartStagger}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Restart Stagger
          </button>
        </div>

        <div className="space-y-8">
          {/* List Stagger */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              List Stagger Animation
            </h3>
            <motion.div
              key={`list-${triggerKey}`}
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item}
                  variants={staggerChildVariants}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{item}</h4>
                    <p className="text-sm text-gray-500">
                      Staggered list item animation
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Grid Stagger */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Grid Stagger Animation
            </h3>
            <motion.div
              key={`grid-${triggerKey}`}
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item}
                  variants={staggerChildVariants}
                  className="bg-gradient-to-br from-pink-400 to-purple-500 p-6 rounded-xl text-white text-center"
                >
                  <div className="text-2xl mb-2">
                    {["🎯", "💎", "📚", "🏆", "⭐", "🎨", "🚀", "✨"][index]}
                  </div>
                  <h4 className="font-bold">{item}</h4>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  },
};

// Page Transitions
export const PageTransitions: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState<keyof typeof pages>("home");

    const pages = {
      home: {
        title: "Dashboard",
        icon: "🏠",
        color: "from-indigo-400 to-purple-500",
        content:
          "Welcome to your learning dashboard! Track your progress and discover new anime cards.",
      },
      learn: {
        title: "Learn Python",
        icon: "📚",
        color: "from-green-400 to-teal-500",
        content:
          "Interactive Python lessons with anime-themed examples and exercises.",
      },
      cards: {
        title: "Anime Cards",
        icon: "💎",
        color: "from-pink-400 to-red-500",
        content:
          "Collect and manage your anime card collection. Discover rare characters!",
      },
      profile: {
        title: "Profile",
        icon: "👤",
        color: "from-yellow-400 to-orange-500",
        content:
          "View your achievements, level progress, and customize your profile.",
      },
    } as const;

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Page Transitions</h2>

        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(pages).map(([key, page]) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key as keyof typeof pages)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === key
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page.icon} {page.title}
              </button>
            ))}
          </div>

          {/* Page Content with Transition */}
          <motion.div
            key={currentPage}
            initial={pageTransitions.fade.initial}
            animate={pageTransitions.fade.animate}
            exit={pageTransitions.fade.exit}
            transition={pageTransitions.fade.transition}
            className={`bg-gradient-to-br ${pages[currentPage].color} p-8 rounded-xl text-white min-h-[300px] flex flex-col justify-center`}
          >
            <motion.div
              variants={scaleVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <div className="text-6xl mb-4">{pages[currentPage].icon}</div>
              <h3 className="text-3xl font-bold mb-4">
                {pages[currentPage].title}
              </h3>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                {pages[currentPage].content}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  },
};

// Modal and Tooltip Animations
export const ModalTooltipAnimations: Story = {
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const modalVariants = {
      hidden: {
        opacity: 0,
        scale: 0.8,
        y: -50,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: transitions.animeSpring,
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: transitions.snap,
      },
    };

    const tooltipVariants = {
      hidden: {
        opacity: 0,
        scale: 0.8,
        y: 10,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: transitions.snap,
      },
    };

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Modal & Tooltip Animations</h2>

        <div className="space-y-8">
          {/* Modal Demo */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Modal Animation</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Open Modal
            </button>

            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white p-8 rounded-xl max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="text-2xl font-bold mb-4">Animated Modal</h4>
                  <p className="text-gray-600 mb-6">
                    This modal slides in from the top with a smooth animation
                    and backdrop fade.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Tooltip Demo */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tooltip Animation</h3>
            <div className="relative inline-block">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
              >
                Hover for Tooltip
              </button>

              {showTooltip && (
                <motion.div
                  variants={tooltipVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
                >
                  This is an animated tooltip!
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
};
