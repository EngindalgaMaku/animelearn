"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RefreshCw,
  Home,
  Palette,
  Users,
  Gamepad2,
  DollarSign,
  Globe,
  Mail,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

interface SiteSetting {
  id?: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  category: string;
  label: string;
}

const settingCategories = [
  {
    id: "general",
    name: "General Settings",
    icon: Settings,
    color: "text-blue-600",
    description: "Basic site configuration"
  },
  {
    id: "homepage",
    name: "Homepage",
    icon: Home,
    color: "text-green-600",
    description: "Landing page content and features"
  },
  {
    id: "branding",
    name: "Branding",
    icon: Palette,
    color: "text-purple-600",
    description: "Colors, logos, and visual identity"
  },
  {
    id: "user",
    name: "User System",
    icon: Users,
    color: "text-orange-600",
    description: "Registration, authentication, and user features"
  },
  {
    id: "arena",
    name: "Code Arena",
    icon: Gamepad2,
    color: "text-indigo-600",
    description: "Learning activities and challenges"
  },
  {
    id: "economy",
    name: "Economy",
    icon: DollarSign,
    color: "text-yellow-600",
    description: "Diamonds, rewards, and pricing"
  },
  {
    id: "social",
    name: "Social & Contact",
    icon: Mail,
    color: "text-pink-600",
    description: "Social links and contact information"
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    color: "text-red-600",
    description: "Security policies and limits"
  },
  {
    id: "performance",
    name: "Performance",
    icon: Zap,
    color: "text-cyan-600",
    description: "Caching, optimization, and limits"
  },
];

const defaultSettings: SiteSetting[] = [
  // General
  { key: "site_name", value: "Zumenzu", type: "string", category: "general", label: "Site Name", description: "Main site title displayed in header and meta tags" },
  { key: "site_description", value: "Learn Python programming with interactive card games and coding challenges", type: "text", category: "general", label: "Site Description", description: "Meta description for SEO" },
  { key: "site_keywords", value: "Python, programming, learning, cards, games, education", type: "text", category: "general", label: "SEO Keywords", description: "Comma-separated keywords for SEO" },
  { key: "site_language", value: "en", type: "select", category: "general", label: "Default Language", description: "Default site language" },
  { key: "timezone", value: "Europe/Istanbul", type: "string", category: "general", label: "Timezone", description: "Server timezone for date calculations" },
  
  // Homepage
  { key: "hero_title", value: "Master Python Programming with Interactive Card Games", type: "string", category: "homepage", label: "Hero Title", description: "Main headline on homepage" },
  { key: "hero_subtitle", value: "Join thousands of developers learning Python through our unique card-based learning system", type: "text", category: "homepage", label: "Hero Subtitle", description: "Supporting text under main headline" },
  { key: "hero_cta_text", value: "Start Learning Now", type: "string", category: "homepage", label: "Hero CTA Button", description: "Text on the main call-to-action button" },
  { key: "features_enabled", value: "true", type: "boolean", category: "homepage", label: "Show Features Section", description: "Display features section on homepage" },
  { key: "testimonials_enabled", value: "true", type: "boolean", category: "homepage", label: "Show Testimonials", description: "Display testimonials section" },
  { key: "stats_enabled", value: "true", type: "boolean", category: "homepage", label: "Show Statistics", description: "Display statistics counters" },
  
  // Branding
  { key: "primary_color", value: "#EF4444", type: "color", category: "branding", label: "Primary Color", description: "Main brand color used throughout the site" },
  { key: "secondary_color", value: "#F97316", type: "color", category: "branding", label: "Secondary Color", description: "Secondary brand color for accents" },
  { key: "logo_url", value: "/logo.png", type: "string", category: "branding", label: "Logo URL", description: "Path to site logo image" },
  { key: "favicon_url", value: "/favicon.ico", type: "string", category: "branding", label: "Favicon URL", description: "Path to favicon" },
  { key: "brand_font", value: "Inter", type: "string", category: "branding", label: "Brand Font", description: "Primary font family" },
  
  // User System
  { key: "registration_enabled", value: "true", type: "boolean", category: "user", label: "Allow Registration", description: "Enable new user registration" },
  { key: "email_verification_required", value: "false", type: "boolean", category: "user", label: "Email Verification Required", description: "Require email verification for new accounts" },
  { key: "default_diamonds", value: "100", type: "number", category: "user", label: "Starting Diamonds", description: "Diamonds given to new users" },
  { key: "daily_diamond_bonus", value: "25", type: "number", category: "user", label: "Daily Login Bonus", description: "Diamonds for daily login" },
  { key: "level_up_diamonds", value: "50", type: "number", category: "user", label: "Level Up Reward", description: "Diamonds for leveling up" },
  { key: "max_login_streak", value: "30", type: "number", category: "user", label: "Max Login Streak", description: "Maximum login streak days" },
  
  // Arena
  { key: "arena_enabled", value: "true", type: "boolean", category: "arena", label: "Code Arena Enabled", description: "Enable Code Arena learning system" },
  { key: "arena_daily_limit", value: "10", type: "number", category: "arena", label: "Daily Activity Limit", description: "Maximum activities per day per user" },
  { key: "arena_base_reward", value: "10", type: "number", category: "arena", label: "Base Diamond Reward", description: "Base diamonds for completing activities" },
  { key: "arena_xp_multiplier", value: "1.5", type: "number", category: "arena", label: "XP Multiplier", description: "Experience multiplier for arena activities" },
  { key: "arena_unlock_system", value: "true", type: "boolean", category: "arena", label: "Progressive Unlock", description: "Require completing previous activities" },
  
  // Economy
  { key: "diamond_pack_enabled", value: "true", type: "boolean", category: "economy", label: "Diamond Packs Enabled", description: "Enable diamond purchases" },
  { key: "card_price_min", value: "10", type: "number", category: "economy", label: "Minimum Card Price", description: "Minimum diamond price for cards" },
  { key: "card_price_max", value: "5000", type: "number", category: "economy", label: "Maximum Card Price", description: "Maximum diamond price for cards" },
  { key: "shop_daily_refresh", value: "true", type: "boolean", category: "economy", label: "Daily Shop Refresh", description: "Refresh shop items daily" },
  { key: "currency_symbol", value: "💎", type: "string", category: "economy", label: "Currency Symbol", description: "Symbol displayed for diamonds" },
  
  // Social
  { key: "contact_email", value: "admin@zumenzu.com", type: "email", category: "social", label: "Contact Email", description: "Primary contact email address" },
  { key: "support_email", value: "support@zumenzu.com", type: "email", category: "social", label: "Support Email", description: "Support contact email" },
  { key: "twitter_url", value: "", type: "url", category: "social", label: "Twitter URL", description: "Twitter profile link" },
  { key: "discord_url", value: "", type: "url", category: "social", label: "Discord URL", description: "Discord server invite link" },
  { key: "github_url", value: "", type: "url", category: "social", label: "GitHub URL", description: "GitHub organization/profile link" },
  
  // Security
  { key: "rate_limit_enabled", value: "true", type: "boolean", category: "security", label: "Rate Limiting", description: "Enable API rate limiting" },
  { key: "max_api_requests_per_minute", value: "60", type: "number", category: "security", label: "API Requests Per Minute", description: "Maximum API requests per user per minute" },
  { key: "session_timeout", value: "24", type: "number", category: "security", label: "Session Timeout (hours)", description: "User session timeout in hours" },
  { key: "password_min_length", value: "8", type: "number", category: "security", label: "Minimum Password Length", description: "Minimum required password length" },
  
  // Performance
  { key: "cache_enabled", value: "true", type: "boolean", category: "performance", label: "Caching Enabled", description: "Enable response caching" },
  { key: "cache_duration", value: "300", type: "number", category: "performance", label: "Cache Duration (seconds)", description: "Default cache duration" },
  { key: "max_file_size", value: "10", type: "number", category: "performance", label: "Max File Size (MB)", description: "Maximum file upload size" },
  { key: "pagination_limit", value: "20", type: "number", category: "performance", label: "Pagination Limit", description: "Default items per page" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("general");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");
      
      if (response.ok) {
        const data = await response.json();
        
        // Merge existing settings with defaults
        const mergedSettings = defaultSettings.map(defaultSetting => {
          const existingSetting = data.find((s: SiteSetting) => s.key === defaultSetting.key);
          return existingSetting ? { ...defaultSetting, ...existingSetting } : defaultSetting;
        });
        
        setSettings(mergedSettings);
      } else {
        // If API fails, use defaults
        setSettings(defaultSettings);
        showNotification("info", "Using default settings. Save to create database entries.");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      setSettings(defaultSettings);
      showNotification("error", "Failed to load settings. Using defaults.");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        showNotification("success", "Settings saved successfully!");
        await loadSettings(); // Reload to get updated data
      } else {
        const error = await response.text();
        showNotification("error", `Failed to save settings: ${error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      showNotification("error", "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const renderSettingInput = (setting: SiteSetting) => {
    const commonClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors";
    
    switch (setting.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={setting.value === "true"}
              onChange={(e) => updateSetting(setting.key, e.target.checked ? "true" : "false")}
              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">
              {setting.value === "true" ? "Enabled" : "Disabled"}
            </span>
          </div>
        );
      
      case "number":
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className={commonClasses}
            min="0"
          />
        );
      
      case "color":
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={setting.value}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={setting.value}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className={`flex-1 ${commonClasses}`}
              placeholder="#000000"
            />
          </div>
        );
      
      case "text":
        return (
          <textarea
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className={`${commonClasses} min-h-[80px] resize-y`}
            rows={3}
          />
        );
      
      case "select":
        if (setting.key === "site_language") {
          return (
            <select
              value={setting.value}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className={commonClasses}
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          );
        }
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className={commonClasses}
          />
        );
      
      case "email":
        return (
          <input
            type="email"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className={commonClasses}
            placeholder="email@example.com"
          />
        );
      
      case "url":
        return (
          <input
            type="url"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className={commonClasses}
            placeholder="https://example.com"
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className={commonClasses}
          />
        );
    }
  };

  const categorySettings = settings.filter(s => s.category === activeCategory);
  const activeTab = settingCategories.find(c => c.id === activeCategory);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-red-600" />
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
              <p className="mt-2 text-gray-600">
                Manage your site configuration and hardcoded values
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadSettings}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
              >
                <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-pulse' : ''}`} />
                {saving ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-50 border border-green-200" :
          notification.type === "error" ? "bg-red-50 border border-red-200" :
          "bg-blue-50 border border-blue-200"
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
            {notification.type === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
            {notification.type === "info" && <Info className="h-5 w-5 text-blue-600" />}
            <p className={`text-sm font-medium ${
              notification.type === "success" ? "text-green-800" :
              notification.type === "error" ? "text-red-800" :
              "text-blue-800"
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6 space-y-2">
            {settingCategories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              const categoryCount = settings.filter(s => s.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-red-100 to-orange-100 text-red-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${category.color}`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {category.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {categoryCount}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Category Header */}
            {activeTab && (
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <activeTab.icon className={`h-8 w-8 ${activeTab.color}`} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{activeTab.name}</h2>
                    <p className="text-gray-600">{activeTab.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {categorySettings.map((setting) => (
                <div key={setting.key} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="text-xs text-gray-500 mb-3">
                        {setting.description}
                      </p>
                    )}
                  </div>
                  
                  {renderSettingInput(setting)}
                  
                  <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                    <span>Key: {setting.key}</span>
                    <span>•</span>
                    <span>Type: {setting.type}</span>
                  </div>
                </div>
              ))}
            </div>

            {categorySettings.length === 0 && (
              <div className="text-center py-12">
                <Globe className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No settings found</h3>
                <p className="mt-2 text-gray-500">
                  No settings available for this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}