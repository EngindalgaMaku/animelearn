import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./theme-provider";
import { ThemeToggle, AnimatedThemeToggle } from "./theme-toggle";
import {
  useThemePreference,
  useSystemTheme,
  useThemeAccessibility,
} from "./theme-hooks";
import { themeColors, themeGradients } from "./theme-colors";

const meta: Meta = {
  title: "Theme/System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete theme system with light/dark mode support, theme toggles, and accessibility features for the anime Python learning platform.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="system" enableSystem>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Theme Overview
export const ThemeOverview: Story = {
  render: () => {
    const ThemeDemo = () => {
      const { theme, resolvedTheme, setTheme } = useTheme();
      const { isDark, isLight, toggleTheme } = useThemePreference();
      const { systemTheme, isSupported } = useSystemTheme();
      const { prefersReducedMotion, prefersHighContrast } =
        useThemeAccessibility();

      return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Theme System Overview</h2>
                <div className="flex items-center gap-4">
                  <ThemeToggle variant="compact" showLabel={false} />
                  <AnimatedThemeToggle />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Theme Status */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-semibold mb-4">Current Theme</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Selected:
                      </span>
                      <span className="font-medium capitalize">{theme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Resolved:
                      </span>
                      <span className="font-medium capitalize">
                        {resolvedTheme}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        System:
                      </span>
                      <span className="font-medium capitalize">
                        {systemTheme}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        System Support:
                      </span>
                      <span className="font-medium">
                        {isSupported ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accessibility Status */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Reduced Motion:
                      </span>
                      <span className="font-medium">
                        {prefersReducedMotion ? "On" : "Off"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        High Contrast:
                      </span>
                      <span className="font-medium">
                        {prefersHighContrast ? "On" : "Off"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Dark Mode:
                      </span>
                      <span className="font-medium">
                        {isDark ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Light Mode:
                      </span>
                      <span className="font-medium">
                        {isLight ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setTheme("light")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      ☀️ Light Mode
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      🌙 Dark Mode
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      💻 System
                    </button>
                    <button
                      onClick={toggleTheme}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      🔄 Toggle Theme
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme Demo Content */}
              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Theme-Aware Components
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card Examples */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">Learning Goals</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Track your Python learning progress with adaptive
                        theming.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-white text-xl">💎</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">Anime Cards</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Collect beautiful anime characters that adapt to your
                        theme.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-white text-xl">🏆</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">Achievements</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Unlock badges and rewards with consistent visual
                        styling.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Elements */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Interactive Elements
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                        Primary Button
                      </button>
                      <button className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg font-medium transition-colors">
                        Secondary Button
                      </button>
                      <button className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg font-medium transition-colors">
                        Outline Button
                      </button>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Python Progress</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-200">
                          Success Message
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          Theme adapts notification colors automatically
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return <ThemeDemo />;
  },
};

// Theme Toggle Components
export const ThemeToggles: Story = {
  render: () => (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Theme Toggle Components</h2>

        <div className="space-y-12">
          {/* Default Toggle */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Default Theme Toggle</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Complete theme selector with light, dark, and system options
            </p>
            <ThemeToggle variant="default" showLabel />
          </div>

          {/* Compact Toggle */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Compact Theme Toggle</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Simple icon-only toggle for light/dark mode switching
            </p>
            <ThemeToggle variant="compact" />
          </div>

          {/* Dropdown Toggle */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4">
              Dropdown Theme Toggle
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Space-efficient dropdown selector for all theme options
            </p>
            <ThemeToggle variant="dropdown" />
          </div>

          {/* Animated Toggle */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4">
              Animated Theme Toggle
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Beautiful animated toggle with smooth icon transitions
            </p>
            <AnimatedThemeToggle />
          </div>

          {/* Multiple Toggles */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4">
              Multiple Toggle Variants
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Different styles working together in the same interface
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <ThemeToggle variant="compact" />
              <ThemeToggle variant="dropdown" />
              <AnimatedThemeToggle />
              <ThemeToggle variant="default" showLabel={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Color Palette Showcase
export const ColorPalettes: Story = {
  render: () => {
    const { resolvedTheme } = useTheme();
    const colors = themeColors[resolvedTheme as keyof typeof themeColors];
    const gradients =
      themeGradients[resolvedTheme as keyof typeof themeGradients];

    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Theme Color Palettes</h2>
            <div className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              Current: {resolvedTheme}
            </div>
          </div>

          <div className="space-y-12">
            {/* Background Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Background Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(colors.background).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg mb-2 border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-sm font-medium capitalize">{name}</div>
                    <div className="text-xs text-slate-500">{color}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Text Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(colors.text).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg mb-2 border border-slate-300 dark:border-slate-600 flex items-center justify-center"
                      style={{ backgroundColor: colors.background.primary }}
                    >
                      <span style={{ color }} className="font-medium">
                        Aa
                      </span>
                    </div>
                    <div className="text-sm font-medium capitalize">{name}</div>
                    <div className="text-xs text-slate-500">{color}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anime Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Anime Theme Colors</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {Object.entries(colors.anime).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg mb-2 shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-sm font-medium capitalize">{name}</div>
                    <div className="text-xs text-slate-500">{color}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rarity Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Card Rarity Colors</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {Object.entries(colors.rarity).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg mb-2 shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <span className="text-white font-bold text-lg">★</span>
                    </div>
                    <div className="text-sm font-medium capitalize">{name}</div>
                    <div className="text-xs text-slate-500">{color}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradients */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Theme Gradients</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Primary Gradients</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(gradients)
                      .filter(([key]) => !key.includes("anime"))
                      .map(([name, gradient]) => (
                        <div key={name} className="text-center">
                          <div
                            className={`w-full h-20 rounded-lg mb-2 ${gradient}`}
                          />
                          <div className="text-sm font-medium capitalize">
                            {name}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Anime Gradients</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {Object.entries(gradients.anime).map(([name, gradient]) => (
                      <div key={name} className="text-center">
                        <div
                          className={`w-full h-20 rounded-lg mb-2 ${gradient}`}
                        />
                        <div className="text-sm font-medium capitalize">
                          {name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Dark Mode Showcase
export const DarkModeShowcase: Story = {
  render: () => {
    const { resolvedTheme, setTheme } = useTheme();

    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Dark Mode Showcase</h2>
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Toggle to {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dashboard Preview */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4">
                Dashboard Components
              </h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Daily Progress</h4>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Today
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">85%</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        8 of 10 exercises completed
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "80%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                  <h4 className="font-medium mb-3">Recent Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🏆</span>
                      </div>
                      <span className="text-sm">Python Basics Mastery</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⭐</span>
                      </div>
                      <span className="text-sm">First Rare Card Unlocked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor Preview */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Code Editor</h3>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm font-medium">main.py</div>
                </div>
                <div className="p-4 font-mono text-sm">
                  <div className="space-y-1">
                    <div>
                      <span className="text-purple-600 dark:text-purple-400">
                        def
                      </span>{" "}
                      <span className="text-blue-600 dark:text-blue-400">
                        greet_anime_character
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        (
                      </span>
                      <span className="text-orange-600 dark:text-orange-400">
                        name
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        ):
                      </span>
                    </div>
                    <div className="ml-4">
                      <span className="text-green-600 dark:text-green-400">
                        &quot;Greet an anime character&quot;
                      </span>
                    </div>
                    <div className="ml-4">
                      <span className="text-purple-600 dark:text-purple-400">
                        return
                      </span>{" "}
                      <span className="text-green-600 dark:text-green-400">
                        f&quot;Hello,{" "}
                      </span>
                      <span className="text-orange-600 dark:text-orange-400">
                      {"Character"}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                      -san!&quot;
                      </span>
                    </div>
                    <div></div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        # Test the function
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">
                        print
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        (
                      </span>
                      <span className="text-blue-600 dark:text-blue-400">
                        greet_anime_character
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        (
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        &quot;Naruto&quot;
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        ))
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Comparison */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Theme Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Light Mode Preview */}
              <div className="border-2 border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-white text-slate-900 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg">☀️ Light Mode</h4>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-sm font-medium text-slate-900">
                        Clean & Bright
                      </div>
                      <div className="text-xs text-slate-600">
                        Perfect for daytime learning
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-indigo-100 p-2 rounded text-center text-indigo-800 text-xs">
                        Primary
                      </div>
                      <div className="flex-1 bg-pink-100 p-2 rounded text-center text-pink-800 text-xs">
                        Accent
                      </div>
                      <div className="flex-1 bg-green-100 p-2 rounded text-center text-green-800 text-xs">
                        Success
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark Mode Preview */}
              <div className="border-2 border-slate-600 rounded-xl overflow-hidden">
                <div className="bg-slate-900 text-slate-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg">🌙 Dark Mode</h4>
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <div className="text-sm font-medium text-slate-100">
                        Easy on Eyes
                      </div>
                      <div className="text-xs text-slate-400">
                        Great for night-time coding
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-indigo-900 p-2 rounded text-center text-indigo-300 text-xs">
                        Primary
                      </div>
                      <div className="flex-1 bg-pink-900 p-2 rounded text-center text-pink-300 text-xs">
                        Accent
                      </div>
                      <div className="flex-1 bg-green-900 p-2 rounded text-center text-green-300 text-xs">
                        Success
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
