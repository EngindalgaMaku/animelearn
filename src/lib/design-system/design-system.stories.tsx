import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design System/Overview",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete design system overview showcasing colors, typography, spacing, and theme configuration for the anime Python learning platform.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Color Palette
export const ColorPalette: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Color Palette</h2>

      <div className="space-y-8">
        {/* Primary Colors */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Primary Colors (Indigo)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "50", value: "#f0f4ff" },
              { name: "100", value: "#e0e7ff" },
              { name: "300", value: "#a5b4fc" },
              { name: "500", value: "#6366f1" },
              { name: "700", value: "#4338ca" },
              { name: "900", value: "#312e81" },
            ].map(({ name, value }) => (
              <div key={name} className="text-center">
                <div
                  className="w-20 h-20 rounded-lg mb-2 shadow-md"
                  style={{ backgroundColor: value }}
                />
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Secondary Colors (Pink)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "50", value: "#fdf2f8" },
              { name: "100", value: "#fce7f3" },
              { name: "300", value: "#f9a8d4" },
              { name: "500", value: "#ec4899" },
              { name: "700", value: "#be185d" },
              { name: "900", value: "#831843" },
            ].map(({ name, value }) => (
              <div key={name} className="text-center">
                <div
                  className="w-20 h-20 rounded-lg mb-2 shadow-md"
                  style={{ backgroundColor: value }}
                />
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Accent Colors */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Accent Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Gold", value: "#f59e0b" },
              { name: "Teal", value: "#14b8a6" },
              { name: "Success", value: "#22c55e" },
              { name: "Warning", value: "#f59e0b" },
              { name: "Error", value: "#ef4444" },
              { name: "Info", value: "#3b82f6" },
            ].map(({ name, value }) => (
              <div key={name} className="text-center">
                <div
                  className="w-20 h-20 rounded-lg mb-2 shadow-md"
                  style={{ backgroundColor: value }}
                />
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradients */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Anime-Inspired Gradients
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Sakura",
                gradient:
                  "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 50%, #ec4899 100%)",
              },
              {
                name: "Ocean",
                gradient:
                  "linear-gradient(135deg, #e0f2fe 0%, #0891b2 50%, #0e7490 100%)",
              },
              {
                name: "Sunset",
                gradient:
                  "linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #d97706 100%)",
              },
              {
                name: "Forest",
                gradient:
                  "linear-gradient(135deg, #dcfce7 0%, #22c55e 50%, #15803d 100%)",
              },
              {
                name: "Nebula",
                gradient:
                  "linear-gradient(135deg, #e0e7ff 0%, #6366f1 50%, #4338ca 100%)",
              },
              {
                name: "Fire",
                gradient:
                  "linear-gradient(135deg, #fee2e2 0%, #ef4444 50%, #dc2626 100%)",
              },
            ].map(({ name, gradient }) => (
              <div key={name} className="text-center">
                <div
                  className="h-20 rounded-lg mb-2 shadow-md"
                  style={{ background: gradient }}
                />
                <div className="text-sm font-medium">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

// Typography
export const Typography: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Typography</h2>

      <div className="space-y-8">
        {/* Font Families */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Font Families</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Sans-serif (Default)
              </div>
              <div className="text-2xl font-sans">
                The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
              </div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Monospace (Code)
              </div>
              <div className="text-2xl font-mono">
                The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-xs text-gray-500 mt-1">
                JetBrains Mono, Fira Code, Monaco, Consolas, monospace
              </div>
            </div>
          </div>
        </div>

        {/* Font Sizes */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Font Sizes</h3>
          <div className="space-y-4">
            {[
              { name: "xs", size: "0.75rem", example: "Extra small text" },
              { name: "sm", size: "0.875rem", example: "Small text" },
              { name: "base", size: "1rem", example: "Base text size" },
              { name: "lg", size: "1.125rem", example: "Large text" },
              { name: "xl", size: "1.25rem", example: "Extra large text" },
              { name: "2xl", size: "1.5rem", example: "Heading text" },
              { name: "3xl", size: "1.875rem", example: "Large heading" },
              { name: "4xl", size: "2.25rem", example: "Very large heading" },
            ].map(({ name, size, example }) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-600">
                  {name}
                </div>
                <div style={{ fontSize: size }}>{example}</div>
                <div className="text-xs text-gray-500">{size}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Font Weights */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Font Weights</h3>
          <div className="space-y-2">
            {[
              { name: "light", weight: 300, text: "Light weight text" },
              { name: "normal", weight: 400, text: "Normal weight text" },
              { name: "medium", weight: 500, text: "Medium weight text" },
              { name: "semibold", weight: 600, text: "Semibold weight text" },
              { name: "bold", weight: 700, text: "Bold weight text" },
              {
                name: "extrabold",
                weight: 800,
                text: "Extra bold weight text",
              },
            ].map(({ name, weight, text }) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-600">{name}</div>
                <div className="text-xl" style={{ fontWeight: weight }}>
                  {text}
                </div>
                <div className="text-xs text-gray-500">{weight}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

// Spacing
export const Spacing: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Spacing System</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Spacing Scale</h3>
          <div className="space-y-4">
            {[
              { name: "xs", value: "0.5rem", pixels: "8px" },
              { name: "sm", value: "0.75rem", pixels: "12px" },
              { name: "md", value: "1rem", pixels: "16px" },
              { name: "lg", value: "1.5rem", pixels: "24px" },
              { name: "xl", value: "2rem", pixels: "32px" },
              { name: "2xl", value: "3rem", pixels: "48px" },
              { name: "3xl", value: "4rem", pixels: "64px" },
            ].map(({ name, value, pixels }) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {name}
                </div>
                <div className="bg-purple-200 h-4" style={{ width: value }} />
                <div className="text-sm text-gray-500">
                  {value} ({pixels})
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Padding Examples</h4>
              {["xs", "sm", "md", "lg", "xl"].map((size) => (
                <div key={size} className="border rounded">
                  <div
                    className={`bg-blue-100 border-2 border-dashed border-blue-300 text-center text-sm p-${size}`}
                  >
                    Padding {size}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Margin Examples</h4>
              {["xs", "sm", "md", "lg", "xl"].map((size) => (
                <div key={size} className="border rounded p-2">
                  <div
                    className={`bg-green-100 border-2 border-dashed border-green-300 text-center text-sm p-2 m-${size}`}
                  >
                    Margin {size}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interactive Components Preview
export const ComponentsPreview: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Components Preview</h2>

      <div className="space-y-8">
        {/* Buttons */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
              Secondary Button
            </button>
            <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
              Outline Button
            </button>
            <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Ghost Button
            </button>
          </div>
        </div>

        {/* Cards */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Card Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h4 className="font-bold text-lg mb-2">Basic Card</h4>
              <p className="text-gray-600">
                Simple card with border and shadow
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <h4 className="font-bold text-lg mb-2">Gradient Card</h4>
              <p className="opacity-90">Colorful gradient background</p>
            </div>

            <div className="bg-white border-2 border-yellow-400 rounded-xl p-6 shadow-lg">
              <h4 className="font-bold text-lg mb-2">Highlighted Card</h4>
              <p className="text-gray-600">Card with colored border accent</p>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Progress Indicators</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Level Progress</span>
                <span>850 / 1000 XP</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Badges & Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              Level 5
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
              Achievement
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              150 💎
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Completed
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Beginner
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
};
