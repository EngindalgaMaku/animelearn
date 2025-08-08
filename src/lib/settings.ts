import { db } from "./db";

// Cache for settings to avoid repeated DB calls
let settingsCache: Map<string, string> = new Map();
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Default fallback values
const DEFAULT_SETTINGS: Record<string, string> = {
  // General
  site_name: "Zumenzu",
  site_description: "Learn Python programming with interactive card games and coding challenges",
  site_keywords: "Python, programming, learning, cards, games, education",
  site_language: "en",
  timezone: "Europe/Istanbul",
  
  // Homepage
  hero_title: "Master Python Programming with Interactive Card Games",
  hero_subtitle: "Join thousands of developers learning Python through our unique card-based learning system",
  hero_cta_text: "Start Learning Now",
  features_enabled: "true",
  testimonials_enabled: "true",
  stats_enabled: "true",
  
  // Branding
  primary_color: "#EF4444",
  secondary_color: "#F97316",
  logo_url: "/logo.png",
  favicon_url: "/favicon.ico",
  brand_font: "Inter",
  
  // User System
  registration_enabled: "true",
  email_verification_required: "false",
  default_diamonds: "100",
  daily_diamond_bonus: "25",
  level_up_diamonds: "50",
  max_login_streak: "30",
  
  // Arena
  arena_enabled: "true",
  arena_daily_limit: "10",
  arena_base_reward: "10",
  arena_xp_multiplier: "1.5",
  arena_unlock_system: "true",
  
  // Economy
  diamond_pack_enabled: "true",
  card_price_min: "10",
  card_price_max: "5000",
  shop_daily_refresh: "true",
  currency_symbol: "💎",
  
  // Social
  contact_email: "admin@zumenzu.com",
  support_email: "support@zumenzu.com",
  twitter_url: "",
  discord_url: "",
  github_url: "",
  
  // Security
  rate_limit_enabled: "true",
  max_api_requests_per_minute: "60",
  session_timeout: "24",
  password_min_length: "8",
  
  // Performance
  cache_enabled: "true",
  cache_duration: "300",
  max_file_size: "10",
  pagination_limit: "20",
};

/**
 * Load all settings from database with caching
 */
async function loadSettings(): Promise<Map<string, string>> {
  const now = Date.now();
  
  // Return cached settings if not expired
  if (settingsCache.size > 0 && now < cacheExpiry) {
    return settingsCache;
  }

  try {
    const settings = await db.settings.findMany();
    const settingsMap = new Map<string, string>();
    
    // Load database settings
    settings.forEach(setting => {
      settingsMap.set(setting.key, setting.value);
    });
    
    // Fill in any missing settings with defaults
    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
      if (!settingsMap.has(key)) {
        settingsMap.set(key, value);
      }
    });
    
    // Update cache
    settingsCache = settingsMap;
    cacheExpiry = now + CACHE_DURATION;
    
    return settingsMap;
  } catch (error) {
    console.error("Failed to load settings from database:", error);
    
    // Return defaults if database fails
    const defaultMap = new Map<string, string>();
    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
      defaultMap.set(key, value);
    });
    
    return defaultMap;
  }
}

/**
 * Get a specific setting value
 */
export async function getSetting(key: string): Promise<string> {
  const settings = await loadSettings();
  return settings.get(key) || DEFAULT_SETTINGS[key] || "";
}

/**
 * Get multiple settings at once
 */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const settings = await loadSettings();
  const result: Record<string, string> = {};
  
  keys.forEach(key => {
    result[key] = settings.get(key) || DEFAULT_SETTINGS[key] || "";
  });
  
  return result;
}

/**
 * Get all settings
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  const settings = await loadSettings();
  const result: Record<string, string> = {};
  
  settings.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * Get setting as boolean
 */
export async function getSettingBool(key: string): Promise<boolean> {
  const value = await getSetting(key);
  return value.toLowerCase() === "true";
}

/**
 * Get setting as number
 */
export async function getSettingNumber(key: string): Promise<number> {
  const value = await getSetting(key);
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Clear settings cache (call this after updating settings)
 */
export function clearSettingsCache(): void {
  settingsCache.clear();
  cacheExpiry = 0;
}

/**
 * Client-side settings hook for React components
 */
export function useSettings() {
  // This is a simple implementation - in a real app you might want to use SWR or React Query
  return {
    getSetting: async (key: string) => {
      const response = await fetch(`/api/settings/${key}`);
      if (response.ok) {
        const data = await response.json();
        return data.value || DEFAULT_SETTINGS[key] || "";
      }
      return DEFAULT_SETTINGS[key] || "";
    },
    getSettings: async (keys: string[]) => {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      // Return defaults if API fails
      const result: Record<string, string> = {};
      keys.forEach(key => {
        result[key] = DEFAULT_SETTINGS[key] || "";
      });
      return result;
    },
  };
}

/**
 * Type-safe setting getters for common settings
 */
export const SettingsService = {
  // Site info
  getSiteName: () => getSetting("site_name"),
  getSiteDescription: () => getSetting("site_description"),
  
  // Branding
  getPrimaryColor: () => getSetting("primary_color"),
  getSecondaryColor: () => getSetting("secondary_color"),
  
  // User system
  getDefaultDiamonds: () => getSettingNumber("default_diamonds"),
  getDailyDiamondBonus: () => getSettingNumber("daily_diamond_bonus"),
  isRegistrationEnabled: () => getSettingBool("registration_enabled"),
  
  // Economy
  getCardPriceMin: () => getSettingNumber("card_price_min"),
  getCardPriceMax: () => getSettingNumber("card_price_max"),
  getCurrencySymbol: () => getSetting("currency_symbol"),
  
  // Arena
  isArenaEnabled: () => getSettingBool("arena_enabled"),
  getArenaDailyLimit: () => getSettingNumber("arena_daily_limit"),
  getArenaBaseReward: () => getSettingNumber("arena_base_reward"),
  getArenaXpMultiplier: () => getSettingNumber("arena_xp_multiplier"),
  
  // Performance
  getPaginationLimit: () => getSettingNumber("pagination_limit"),
  getMaxFileSize: () => getSettingNumber("max_file_size"),
  isCacheEnabled: () => getSettingBool("cache_enabled"),
  
  // Security
  getMaxApiRequestsPerMinute: () => getSettingNumber("max_api_requests_per_minute"),
  getPasswordMinLength: () => getSettingNumber("password_min_length"),
  
  // Contact
  getContactEmail: () => getSetting("contact_email"),
  getSupportEmail: () => getSetting("support_email"),
} as const;
