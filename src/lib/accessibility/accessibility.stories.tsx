import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  useFormAccessibility,
  useKeyboardNavigation,
  useScreenReader,
  useFocusManagement,
  useColorPreferences,
  useTextScaling,
} from "./hooks";
import {
  SkipLinks,
  ScreenReaderOnly,
  LiveRegion,
  AccessibleButton,
  AccessibleField,
  HighContrastToggle,
  TextSizeControls,
  KeyboardShortcutsHelp,
  AccessibleModal,
  AccessibleProgress,
  FocusTrap,
} from "./components";

const meta: Meta = {
  title: "Accessibility/System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Accessibility system with WCAG 2.1 AA compliance features, screen reader support, and keyboard navigation for the anime Python learning platform.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Accessibility Overview
export const AccessibilityOverview: Story = {
  render: () => {
    const AccessibilityDemo = () => {
      const [isHighContrast, setIsHighContrast] = useState(false);
      const [isReducedMotion, setIsReducedMotion] = useState(false);
      const [fontSize, setFontSize] = useState(100);
      const colorPreferences = useColorPreferences();
      const { textScale, increaseTextSize, decreaseTextSize, resetTextSize } =
        useTextScaling();

      const toggleHighContrast = () => {
        setIsHighContrast(!isHighContrast);
        document.documentElement.classList.toggle("high-contrast");
      };

      const toggleReducedMotion = () => {
        setIsReducedMotion(!isReducedMotion);
        document.documentElement.classList.toggle("reduce-motion");
      };

      const increaseFontSize = () => {
        setFontSize((prev) => Math.min(prev + 10, 200));
      };

      const decreaseFontSize = () => {
        setFontSize((prev) => Math.max(prev - 10, 80));
      };

      return (
        <div
          className={`p-8 ${
            isHighContrast ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-3xl font-bold mb-8">Accessibility Features</h2>

          <div className="space-y-8">
            {/* Accessibility Controls */}
            <div
              className={`p-6 rounded-lg border ${
                isHighContrast
                  ? "bg-gray-900 border-white"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">
                Accessibility Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">High Contrast Mode</h4>
                    <button
                      onClick={toggleHighContrast}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isHighContrast
                          ? "bg-white text-black border-2 border-white"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                      aria-pressed={isHighContrast}
                      aria-describedby="high-contrast-description"
                    >
                      {isHighContrast ? "Disable" : "Enable"} High Contrast
                    </button>
                    <div
                      id="high-contrast-description"
                      className="text-sm mt-1 opacity-75"
                    >
                      Improves visibility for users with visual impairments
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Reduced Motion</h4>
                    <button
                      onClick={toggleReducedMotion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      aria-pressed={isReducedMotion}
                      aria-describedby="reduced-motion-description"
                    >
                      {isReducedMotion ? "Enable" : "Disable"} Animations
                    </button>
                    <div
                      id="reduced-motion-description"
                      className="text-sm mt-1 opacity-75"
                    >
                      Reduces motion for users with vestibular disorders
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Font Size: {fontSize}%</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={decreaseFontSize}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        aria-label="Decrease font size"
                      >
                        A-
                      </button>
                      <button
                        onClick={increaseFontSize}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        aria-label="Increase font size"
                      >
                        A+
                      </button>
                    </div>
                    <div className="text-sm mt-1 opacity-75">
                      Adjusts text size for better readability
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">System Preferences</h4>
                    <div className="text-sm space-y-1 opacity-75">
                      <div>
                        High Contrast:{" "}
                        {colorPreferences.highContrast ? "On" : "Off"}
                      </div>
                      <div>
                        Reduced Motion:{" "}
                        {colorPreferences.reducedMotion ? "On" : "Off"}
                      </div>
                      <div>
                        Dark Mode: {colorPreferences.darkMode ? "On" : "Off"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WCAG Compliance Features */}
            <div
              className={`border p-6 rounded-lg ${
                isHighContrast
                  ? "bg-gray-900 border-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">
                WCAG 2.1 AA Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="font-medium">Color Contrast</h5>
                      <p className="text-sm opacity-75">
                        4.5:1 ratio for normal text, 3:1 for large text
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="font-medium">Keyboard Navigation</h5>
                      <p className="text-sm opacity-75">
                        All interactive elements accessible via keyboard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="font-medium">Focus Management</h5>
                      <p className="text-sm opacity-75">
                        Clear focus indicators and logical tab order
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="font-medium">Screen Reader Support</h5>
                      <p className="text-sm opacity-75">
                        Semantic HTML and ARIA labels
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="font-medium">Alternative Text</h5>
                      <p className="text-sm opacity-75">
                        Descriptive alt text for images
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="font-medium">Error Identification</h5>
                      <p className="text-sm opacity-75">
                        Clear error messages and suggestions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Content */}
            <div
              className={`p-6 rounded-lg border ${
                isHighContrast ? "bg-gray-900 border-white" : "border-gray-200"
              }`}
              style={{ fontSize: `${fontSize}%` }}
            >
              <h3 className="text-xl font-semibold mb-4">Sample Content</h3>
              <p className="mb-4 opacity-75">
                This content demonstrates how the accessibility features work.
                The font size adjusts based on your preference, and the contrast
                mode ensures better visibility.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-100 p-4 rounded-lg">
                  <h4 className="font-bold text-indigo-800">Python Basics</h4>
                  <p className="text-sm text-indigo-600">
                    Learn fundamental concepts
                  </p>
                </div>
                <div className="bg-pink-100 p-4 rounded-lg">
                  <h4 className="font-bold text-pink-800">Anime Cards</h4>
                  <p className="text-sm text-pink-600">
                    Collect your favorites
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800">Achievements</h4>
                  <p className="text-sm text-green-600">Track your progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return <AccessibilityDemo />;
  },
};

// Keyboard Navigation
export const KeyboardNavigation: Story = {
  render: () => {
    const KeyboardDemo = () => {
      const [currentFocus, setCurrentFocus] = useState(0);
      const isKeyboardUser = useKeyboardNavigation();

      const menuItems = [
        { label: "Dashboard", icon: "🏠", href: "/dashboard" },
        { label: "Learn Python", icon: "📚", href: "/learn" },
        { label: "Anime Cards", icon: "💎", href: "/cards" },
        { label: "Achievements", icon: "🏆", href: "/achievements" },
        { label: "Profile", icon: "👤", href: "/profile" },
      ];

      const handleKeyDown = (e: React.KeyboardEvent, maxItems: number) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setCurrentFocus((prev) => (prev + 1) % maxItems);
            break;
          case "ArrowUp":
            e.preventDefault();
            setCurrentFocus((prev) => (prev - 1 + maxItems) % maxItems);
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            // Handle activation
            break;
        }
      };

      return (
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Keyboard Navigation</h2>
            <p className="text-gray-600">
              Use Tab to navigate, Enter/Space to activate, Arrow keys for menu
              navigation, and Escape to close dialogs. Keyboard user detected:{" "}
              {isKeyboardUser ? "Yes" : "No"}
            </p>
          </div>

          <SkipLinks />

          <div className="space-y-8">
            {/* Navigation Menu */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Navigation Menu</h3>
              <nav
                role="navigation"
                aria-label="Main navigation"
                onKeyDown={(e) => handleKeyDown(e, menuItems.length)}
              >
                <ul className="space-y-2" role="menubar">
                  {menuItems.map((item, index) => (
                    <li key={item.label} role="none">
                      <a
                        href={item.href}
                        role="menuitem"
                        tabIndex={index === currentFocus ? 0 : -1}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isKeyboardUser
                            ? "focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            : "hover:bg-gray-100"
                        }`}
                        onFocus={() => setCurrentFocus(index)}
                      >
                        <span className="text-2xl" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Interactive Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Accessible Form</h3>
              <form className="space-y-4">
                <AccessibleField
                  label="Username"
                  name="username"
                  required
                  description="Must be at least 3 characters long"
                />

                <AccessibleField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  description="We'll never share your email with anyone else"
                />

                <fieldset className="border border-gray-300 rounded-lg p-4">
                  <legend className="text-sm font-medium text-gray-700 px-2">
                    Preferred Learning Style
                  </legend>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="learning-style"
                        value="visual"
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm">Visual Learning</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="learning-style"
                        value="hands-on"
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm">Hands-on Practice</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="learning-style"
                        value="reading"
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm">Reading & Theory</span>
                    </label>
                  </div>
                </fieldset>

                <div className="flex gap-4">
                  <AccessibleButton variant="primary">
                    Save Preferences
                  </AccessibleButton>
                  <AccessibleButton variant="outline">Cancel</AccessibleButton>
                </div>
              </form>
            </div>

            {/* Main Content Area */}
            <main
              id="main-content"
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Main Content</h3>
              <p className="text-gray-700 mb-4">
                This is the main content area that users can skip to using the
                skip link. All interactive elements maintain proper focus order
                and have appropriate ARIA labels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleButton
                  variant="primary"
                  className="p-4 text-left h-auto"
                >
                  <div>
                    <h4 className="font-medium">Start Learning</h4>
                    <p className="text-sm opacity-90">
                      Begin your Python journey
                    </p>
                  </div>
                </AccessibleButton>
                <AccessibleButton
                  variant="secondary"
                  className="p-4 text-left h-auto"
                >
                  <div>
                    <h4 className="font-medium">View Collection</h4>
                    <p className="text-sm opacity-90">
                      Browse your anime cards
                    </p>
                  </div>
                </AccessibleButton>
              </div>
            </main>
          </div>
        </div>
      );
    };

    return <KeyboardDemo />;
  },
};

// Screen Reader Support
export const ScreenReaderSupport: Story = {
  render: () => {
    const [announcements, setAnnouncements] = useState<string[]>([]);
    const [currentAnnouncement, setCurrentAnnouncement] = useState("");
    const { announce } = useScreenReader();

    const addAnnouncement = (message: string) => {
      announce(message);
      setCurrentAnnouncement(message);
      setAnnouncements((prev) => [...prev, message]);
    };

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Screen Reader Support</h2>

        <div className="space-y-8">
          {/* Live Announcements */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Live Announcements</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <AccessibleButton
                  onClick={() =>
                    addAnnouncement("Level up! You reached Level 5 in Python.")
                  }
                  variant="primary"
                >
                  Simulate Level Up
                </AccessibleButton>
                <AccessibleButton
                  onClick={() =>
                    addAnnouncement(
                      "New anime card unlocked: Sakura from Naruto!"
                    )
                  }
                  variant="secondary"
                >
                  Unlock Card
                </AccessibleButton>
                <AccessibleButton
                  onClick={() =>
                    addAnnouncement(
                      "Exercise completed successfully. Great job!"
                    )
                  }
                  variant="outline"
                >
                  Complete Exercise
                </AccessibleButton>
              </div>

              <LiveRegion
                announcement={currentAnnouncement}
                priority="polite"
              />

              {announcements.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Recent Announcements:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {announcements.slice(-3).map((announcement, index) => (
                      <li key={index}>• {announcement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ARIA Examples */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              ARIA Labels and Descriptions
            </h3>

            <div className="space-y-6">
              {/* Progress Indicator */}
              <div>
                <h4 className="font-medium mb-2">Progress Indicator</h4>
                <AccessibleProgress
                  value={75}
                  label="Python course progress"
                  showValue
                />
                <ScreenReaderOnly>Progress: 75% complete</ScreenReaderOnly>
              </div>

              {/* Interactive Cards */}
              <div>
                <h4 className="font-medium mb-2">Interactive Cards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Naruto anime card, rarity: legendary, click to view details"
                    className="bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-xl text-white cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
                  >
                    <div className="text-4xl mb-2" aria-hidden="true">
                      🦊
                    </div>
                    <h5 className="font-bold text-lg">Naruto Uzumaki</h5>
                    <p className="text-sm opacity-90">Legendary Card</p>
                    <ScreenReaderOnly>
                      Naruto Uzumaki legendary anime card. Press Enter or Space
                      to view card details.
                    </ScreenReaderOnly>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Sakura anime card, rarity: rare, click to view details"
                    className="bg-gradient-to-br from-pink-400 to-purple-500 p-6 rounded-xl text-white cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all"
                  >
                    <div className="text-4xl mb-2" aria-hidden="true">
                      🌸
                    </div>
                    <h5 className="font-bold text-lg">Sakura Haruno</h5>
                    <p className="text-sm opacity-90">Rare Card</p>
                    <ScreenReaderOnly>
                      Sakura Haruno rare anime card. Press Enter or Space to
                      view card details.
                    </ScreenReaderOnly>
                  </div>
                </div>
              </div>

              {/* Complex Widget */}
              <div>
                <h4 className="font-medium mb-2">Complex Interactive Widget</h4>
                <div
                  role="tablist"
                  aria-label="Learning sections"
                  className="border border-gray-300 rounded-lg overflow-hidden"
                >
                  <div className="flex bg-gray-50">
                    <button
                      role="tab"
                      aria-selected="true"
                      aria-controls="basics-panel"
                      id="basics-tab"
                      className="flex-1 px-4 py-3 text-sm font-medium text-left bg-white border-b-2 border-indigo-500 text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Python Basics
                    </button>
                    <button
                      role="tab"
                      aria-selected="false"
                      aria-controls="advanced-panel"
                      id="advanced-tab"
                      className="flex-1 px-4 py-3 text-sm font-medium text-left text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Advanced Topics
                    </button>
                  </div>
                  <div
                    role="tabpanel"
                    id="basics-panel"
                    aria-labelledby="basics-tab"
                    className="p-4"
                  >
                    <h5 className="font-medium mb-2">Python Fundamentals</h5>
                    <p className="text-sm text-gray-600">
                      Learn variables, data types, functions, and control
                      structures. Perfect for beginners starting their Python
                      journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Focus Management */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Focus Management</h3>
            <FocusTrap>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Focus management ensures that keyboard users can navigate
                  efficiently and screen readers can properly announce content
                  changes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AccessibleButton variant="primary">
                    <div className="text-center">
                      <h5 className="font-medium">Proper Focus Order</h5>
                      <p className="text-sm opacity-90">Logical tab sequence</p>
                    </div>
                  </AccessibleButton>

                  <AccessibleButton variant="secondary">
                    <div className="text-center">
                      <h5 className="font-medium">Visible Focus</h5>
                      <p className="text-sm opacity-90">
                        Clear focus indicators
                      </p>
                    </div>
                  </AccessibleButton>

                  <AccessibleButton variant="outline">
                    <div className="text-center">
                      <h5 className="font-medium">Focus Trapping</h5>
                      <p className="text-sm opacity-90">
                        Modal focus management
                      </p>
                    </div>
                  </AccessibleButton>
                </div>
              </div>
            </FocusTrap>
          </div>
        </div>
      </div>
    );
  },
};

// Accessibility Components
export const AccessibilityComponents: Story = {
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Accessibility Components</h2>

        <div className="space-y-8">
          {/* Control Components */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Accessibility Controls
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">High Contrast Toggle</h4>
                <HighContrastToggle />
              </div>

              <div>
                <h4 className="font-medium mb-2">Text Size Controls</h4>
                <TextSizeControls />
              </div>
            </div>
          </div>

          {/* Interactive Components */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Interactive Components
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Accessible Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <AccessibleButton variant="primary">Primary</AccessibleButton>
                  <AccessibleButton variant="secondary">
                    Secondary
                  </AccessibleButton>
                  <AccessibleButton variant="outline">Outline</AccessibleButton>
                  <AccessibleButton variant="ghost">Ghost</AccessibleButton>
                  <AccessibleButton variant="primary" isLoading>
                    Loading
                  </AccessibleButton>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Progress Indicators</h4>
                <div className="space-y-3">
                  <AccessibleProgress value={25} label="Beginner Progress" />
                  <AccessibleProgress
                    value={75}
                    label="Intermediate Progress"
                  />
                  <AccessibleProgress value={100} label="Advanced Progress" />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Modal Dialog</h4>
                <AccessibleButton
                  onClick={() => setIsModalOpen(true)}
                  variant="primary"
                >
                  Open Modal
                </AccessibleButton>

                <AccessibleModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Accessible Modal"
                >
                  <p className="mb-4">
                    This modal demonstrates proper focus management, ARIA
                    attributes, and keyboard navigation support.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <AccessibleButton
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </AccessibleButton>
                    <AccessibleButton
                      variant="primary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Confirm
                    </AccessibleButton>
                  </div>
                </AccessibleModal>
              </div>
            </div>
          </div>

          {/* Help and Documentation */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Help and Documentation
            </h3>
            <KeyboardShortcutsHelp />
          </div>
        </div>
      </div>
    );
  },
};
