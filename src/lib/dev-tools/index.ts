/**
 * Development Tools & Utilities Index
 * Comprehensive development environment tools for anime-themed Python learning platform
 */

// Environment utilities
export {
  isDevelopment,
  isProduction,
  isTest,
  getEnvironment,
  getApiUrl,
  getAppVersion,
  createEnvironmentConfig,
} from "./environment";

// Debug utilities
export {
  createDebugger,
  useDebugValue,
  withDebugInfo,
  logPerformance,
  debugComponent,
  createPerformanceLogger,
} from "./debug";

// Mock data utilities
export {
  createMockUser,
  createMockCard,
  createMockProgress,
  createMockAchievement,
  generateMockData,
  mockApiResponse,
} from "./mock-data";

// Development helpers
export {
  useDevMode,
  useHotReload,
  useMockData,
  DevPanel,
  DebugOverlay,
  PerformanceMonitor,
} from "./dev-helpers";

// Build utilities
export {
  getBuildInfo,
  getGitInfo,
  createBuildManifest,
  optimizeBundle,
  analyzeBundleSize,
} from "./build-utils";

// Testing utilities - removed (no active testing setup)
// export {
//   createTestRenderer,
//   mockApiEndpoint,
//   setupTestEnvironment,
//   createTestUser,
//   renderWithProviders,
// } from "./test-utils";

// Code generation utilities
export {
  generateComponent,
  generateStory,
  generateTest,
  generatePage,
  scaffoldFeature,
} from "./generators";

// Configuration utilities
export {
  validateConfig,
  mergeConfigs,
  createConfig,
  loadConfig,
  saveConfig,
} from "./config";

// Development constants
export const DEV_CONSTANTS = {
  HOT_RELOAD_PORT: 3001,
  DEBUG_PORT: 9229,
  STORYBOOK_PORT: 6006,
  TEST_PORT: 3002,

  // API endpoints for development
  DEV_API_BASE: "http://localhost:3000/api",
  STAGING_API_BASE: "https://staging-api.anime-python.dev",
  PROD_API_BASE: "https://api.anime-python.dev",

  // Debug levels
  DEBUG_LEVELS: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4,
  },

  // Performance thresholds
  PERFORMANCE_THRESHOLDS: {
    COMPONENT_RENDER: 16, // 60fps
    API_RESPONSE: 500,
    BUNDLE_SIZE: 1000000, // 1MB
    INITIAL_LOAD: 3000,
  },
} as const;

// Development feature flags
export const DEV_FLAGS = {
  ENABLE_DEBUG_OVERLAY: process.env.NODE_ENV === "development",
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_HOT_RELOAD: process.env.NODE_ENV === "development",
  ENABLE_MOCK_DATA: process.env.NODE_ENV === "development",
  ENABLE_ERROR_BOUNDARY: true,
  ENABLE_ANALYTICS_DEBUG: process.env.NODE_ENV === "development",
} as const;

// Utility types
export type Environment = "development" | "production" | "test" | "staging";
export type DebugLevel = keyof typeof DEV_CONSTANTS.DEBUG_LEVELS;
export type BuildTarget = "web" | "mobile" | "desktop" | "ssr";

// Development configuration interface
export interface DevConfig {
  environment: Environment;
  debug: {
    level: DebugLevel;
    enableOverlay: boolean;
    enablePerformanceMonitoring: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  build: {
    target: BuildTarget;
    sourceMaps: boolean;
    minify: boolean;
    analyze: boolean;
  };
  features: {
    hotReload: boolean;
    mockData: boolean;
    errorBoundary: boolean;
  };
}

// Default development configuration
export const DEFAULT_DEV_CONFIG: DevConfig = {
  environment: "development",
  debug: {
    level: "DEBUG",
    enableOverlay: true,
    enablePerformanceMonitoring: true,
  },
  api: {
    baseUrl: DEV_CONSTANTS.DEV_API_BASE,
    timeout: 5000,
    retries: 3,
  },
  build: {
    target: "web",
    sourceMaps: true,
    minify: false,
    analyze: false,
  },
  features: {
    hotReload: true,
    mockData: true,
    errorBoundary: true,
  },
};
