"use client";

import React from "react";
import {
  colors,
  typography,
  typographyPresets,
  spacing,
  lightTheme,
  darkTheme,
  createTheme,
  type Theme,
} from "@/lib/design-system";

export default function DesignSystemDemo() {
  const [isDark, setIsDark] = React.useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div
      className="min-h-screen p-8 transition-colors duration-300"
      style={{
        backgroundColor: theme.colors.system.background.primary,
        color: theme.colors.system.text.primary,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-bold" style={typographyPresets.display.large}>
            🎨 Design System Demo
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: theme.colors.primary[500],
              color: "white",
            }}
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Color Palette */}
        <section className="mb-16">
          <h2
            className="mb-8 font-semibold"
            style={typographyPresets.heading.h2}
          >
            🎨 Color Palette
          </h2>

          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Primary Colors</h3>
            <div className="grid grid-cols-11 gap-2">
              {Object.entries(colors.primary).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 shadow-sm"
                    style={{ backgroundColor: value }}
                  />
                  <div className="text-xs">{key}</div>
                  <div className="text-xs opacity-70">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Secondary Colors</h3>
            <div className="grid grid-cols-11 gap-2">
              {Object.entries(colors.secondary).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 shadow-sm"
                    style={{ backgroundColor: value }}
                  />
                  <div className="text-xs">{key}</div>
                  <div className="text-xs opacity-70">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Semantic Colors</h3>
            <div className="grid grid-cols-4 gap-4">
              {["success", "warning", "error", "info"].map((semantic) => (
                <div key={semantic} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 shadow-sm"
                    style={{ backgroundColor: (colors as any)[semantic][500] }}
                  />
                  <div className="text-sm font-medium capitalize">
                    {semantic}
                  </div>
                  <div className="text-xs opacity-70">
                    {(colors as any)[semantic][500]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradients */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Anime Gradients</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(colors.gradients).map(([name, gradient]) => (
                <div key={name} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 shadow-sm"
                    style={{ background: gradient }}
                  />
                  <div className="text-sm font-medium capitalize">{name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rarity Colors */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Card Rarity Colors</h3>
            <div className="grid grid-cols-6 gap-4">
              {Object.entries(colors.rarity).map(([rarity, config]) => (
                <div key={rarity} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 shadow-sm border-2"
                    style={{
                      background: config.bg,
                      borderColor: config.border,
                    }}
                  />
                  <div className="text-sm font-medium capitalize">{rarity}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2
            className="mb-8 font-semibold"
            style={typographyPresets.heading.h2}
          >
            📝 Typography
          </h2>

          {/* Display Text */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Display Text</h3>
            <div className="space-y-4">
              <div style={typographyPresets.display.large}>
                Display Large - Hero Sections
              </div>
              <div style={typographyPresets.display.medium}>
                Display Medium - Major Headings
              </div>
              <div style={typographyPresets.display.small}>
                Display Small - Section Headers
              </div>
            </div>
          </div>

          {/* Headings */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Headings</h3>
            <div className="space-y-4">
              <h1 style={typographyPresets.heading.h1}>
                Heading 1 - Main Page Title
              </h1>
              <h2 style={typographyPresets.heading.h2}>
                Heading 2 - Section Title
              </h2>
              <h3 style={typographyPresets.heading.h3}>
                Heading 3 - Subsection Title
              </h3>
              <h4 style={typographyPresets.heading.h4}>
                Heading 4 - Component Title
              </h4>
              <h5 style={typographyPresets.heading.h5}>
                Heading 5 - Small Section
              </h5>
              <h6 style={typographyPresets.heading.h6}>Heading 6 - Labels</h6>
            </div>
          </div>

          {/* Body Text */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Body Text</h3>
            <div className="space-y-4">
              <p style={typographyPresets.body.large}>
                Body Large - This is large body text used for important content
                and introductory paragraphs. It provides excellent readability
                for key information.
              </p>
              <p style={typographyPresets.body.medium}>
                Body Medium - This is the standard body text used throughout the
                application. It strikes a good balance between readability and
                space efficiency.
              </p>
              <p style={typographyPresets.body.small}>
                Body Small - This is small body text used for secondary
                information, captions, and supplementary content.
              </p>
            </div>
          </div>

          {/* Code Text */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Code Text</h3>
            <div className="space-y-4">
              <pre
                style={typographyPresets.code.large}
                className="bg-gray-100 p-4 rounded"
              >
                {`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`}
              </pre>
              <code
                style={typographyPresets.code.medium}
                className="bg-gray-100 px-2 py-1 rounded"
              >
                print("Hello, World!")
              </code>
              <code
                style={typographyPresets.code.small}
                className="bg-gray-100 px-1 rounded"
              >
                variable_name
              </code>
            </div>
          </div>

          {/* Gamification Typography */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Gamification Text</h3>
            <div className="space-y-4">
              <div style={typographyPresets.gamification.achievement}>
                🏆 ACHIEVEMENT UNLOCKED!
              </div>
              <div style={typographyPresets.gamification.level}>Level 42</div>
              <div style={typographyPresets.gamification.stats}>1,337 XP</div>
              <div style={typographyPresets.gamification.badge}>EPIC</div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-16">
          <h2
            className="mb-8 font-semibold"
            style={typographyPresets.heading.h2}
          >
            📏 Spacing System
          </h2>

          {/* Spacing Scale */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Spacing Scale</h3>
            <div className="space-y-2">
              {Object.entries(spacing.scale)
                .slice(0, 15)
                .map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-mono">{key}</div>
                    <div className="w-20 text-sm font-mono text-gray-600">
                      {value}
                    </div>
                    <div className="bg-blue-500 h-4" style={{ width: value }} />
                  </div>
                ))}
            </div>
          </div>

          {/* Semantic Spacing */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">
              Semantic Spacing Examples
            </h3>

            {/* Component Spacing */}
            <div className="mb-6">
              <h4 className="mb-3 font-medium">Component Spacing</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(spacing.semantic.component).map(
                  ([size, value]) => (
                    <div
                      key={size}
                      className="border border-gray-300 rounded"
                      style={{ padding: value }}
                    >
                      <div className="bg-gray-200 rounded text-center text-sm">
                        {size} ({value})
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Stack Spacing */}
            <div className="mb-6">
              <h4 className="mb-3 font-medium">Stack Spacing</h4>
              <div className="grid grid-cols-3 gap-8">
                {Object.entries(spacing.semantic.stack)
                  .slice(0, 3)
                  .map(([size, value]) => (
                    <div key={size}>
                      <div className="text-sm font-medium mb-2">
                        {size} ({value})
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: value,
                        }}
                      >
                        <div className="bg-gray-200 p-2 rounded text-sm">
                          Item 1
                        </div>
                        <div className="bg-gray-200 p-2 rounded text-sm">
                          Item 2
                        </div>
                        <div className="bg-gray-200 p-2 rounded text-sm">
                          Item 3
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Shadows & Elevation */}
        <section className="mb-16">
          <h2
            className="mb-8 font-semibold"
            style={typographyPresets.heading.h2}
          >
            🔲 Shadows & Elevation
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {Object.entries(lightTheme.shadows.elevation).map(
              ([level, shadow]) => (
                <div
                  key={level}
                  className="p-6 rounded-lg bg-white text-center"
                  style={{ boxShadow: shadow }}
                >
                  <div className="font-medium">Elevation {level}</div>
                  <div className="text-sm text-gray-600 mt-2">{shadow}</div>
                </div>
              )
            )}
          </div>

          {/* Glow Effects */}
          <div className="mt-8">
            <h3 className="mb-4 font-medium text-lg">Glow Effects</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(lightTheme.shadows.glow).map(
                ([color, shadow]) => (
                  <div
                    key={color}
                    className="p-4 rounded-lg text-center text-white font-medium"
                    style={{
                      backgroundColor: (colors as any)[color]
                        ? (colors as any)[color][500]
                        : colors.primary[500],
                      boxShadow: shadow,
                    }}
                  >
                    {color}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section className="mb-16">
          <h2
            className="mb-8 font-semibold"
            style={typographyPresets.heading.h2}
          >
            🔘 Border Radius
          </h2>

          <div className="grid grid-cols-5 gap-4">
            {Object.entries(lightTheme.borderRadius)
              .slice(0, 10)
              .map(([size, radius]) => (
                <div key={size} className="text-center">
                  <div
                    className="w-16 h-16 bg-blue-500 mx-auto mb-2"
                    style={{ borderRadius: radius }}
                  />
                  <div className="text-sm font-medium">{size}</div>
                  <div className="text-xs text-gray-600">{radius}</div>
                </div>
              ))}
          </div>
        </section>

        {/* Component Previews */}
        <section className="mb-16">
          <h2
            className="mb-8 font-semibold"
            style={typographyPresets.heading.h2}
          >
            🧩 Component Previews
          </h2>

          {/* Buttons */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-4 py-2 rounded transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: theme.colors.primary[500],
                  color: "white",
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded border-2 transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: theme.colors.primary[500],
                  color: theme.colors.primary[500],
                  backgroundColor: "transparent",
                }}
              >
                Secondary Button
              </button>
              <button
                className="px-4 py-2 rounded transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: theme.colors.success[500],
                  color: "white",
                }}
              >
                Success Button
              </button>
              <button
                className="px-4 py-2 rounded transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: theme.colors.error[500],
                  color: "white",
                }}
              >
                Error Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-lg">Cards</h3>
            <div className="grid grid-cols-3 gap-6">
              <div
                className="p-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: theme.colors.system.surface.elevated,
                  boxShadow: theme.shadows.card.default,
                }}
              >
                <h4 className="font-semibold mb-2">Card Title</h4>
                <p className="text-sm opacity-70">
                  This is a sample card component with some content.
                </p>
              </div>
              <div
                className="p-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: theme.colors.system.surface.elevated,
                  boxShadow: theme.shadows.card.default,
                }}
              >
                <h4 className="font-semibold mb-2">Another Card</h4>
                <p className="text-sm opacity-70">
                  Cards adapt to the current theme automatically.
                </p>
              </div>
              <div
                className="p-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: theme.colors.system.surface.elevated,
                  boxShadow: theme.shadows.card.default,
                }}
              >
                <h4 className="font-semibold mb-2">Third Card</h4>
                <p className="text-sm opacity-70">
                  Consistent spacing and styling across all components.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
