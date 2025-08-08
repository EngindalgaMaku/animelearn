/**
 * Configuration utilities for development tools
 */

import {
  DEV_FLAGS,
  DEV_CONSTANTS,
  type DevConfig,
  DEFAULT_DEV_CONFIG,
} from "./index";

// Configuration validation interface
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Configuration schema for validation
export interface ConfigSchema {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object" | "array";
    required?: boolean;
    default?: any;
    validation?: (value: any) => boolean;
    description?: string;
  };
}

/**
 * Validate configuration object against schema
 */
export const validateConfig = (
  config: any,
  schema?: ConfigSchema
): ConfigValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Default schema for DevConfig
  const defaultSchema: ConfigSchema = {
    environment: {
      type: "string",
      required: true,
      validation: (value) =>
        ["development", "production", "test", "staging"].includes(value),
      description: "Application environment",
    },
    "debug.level": {
      type: "string",
      required: false,
      default: "DEBUG",
      validation: (value) =>
        ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"].includes(value),
      description: "Debug logging level",
    },
    "debug.enableOverlay": {
      type: "boolean",
      required: false,
      default: true,
      description: "Enable debug overlay in development",
    },
    "api.baseUrl": {
      type: "string",
      required: true,
      validation: (value) => typeof value === "string" && value.length > 0,
      description: "API base URL",
    },
    "api.timeout": {
      type: "number",
      required: false,
      default: 5000,
      validation: (value) => typeof value === "number" && value > 0,
      description: "API request timeout in milliseconds",
    },
  };

  const schemaToUse = schema || defaultSchema;

  // Validate each schema field
  Object.entries(schemaToUse).forEach(([key, fieldSchema]) => {
    const value = getNestedValue(config, key);

    // Check required fields
    if (fieldSchema.required && (value === undefined || value === null)) {
      errors.push(`Required field '${key}' is missing`);
      return;
    }

    // Skip validation if field is not present and not required
    if (value === undefined || value === null) {
      return;
    }

    // Type validation
    if (!validateType(value, fieldSchema.type)) {
      errors.push(
        `Field '${key}' must be of type ${
          fieldSchema.type
        }, got ${typeof value}`
      );
      return;
    }

    // Custom validation
    if (fieldSchema.validation && !fieldSchema.validation(value)) {
      errors.push(
        `Field '${key}' failed validation: ${
          fieldSchema.description || "Invalid value"
        }`
      );
    }
  });

  // Check for unknown fields (warnings)
  const configKeys = getAllKeys(config);
  const schemaKeys = Object.keys(schemaToUse);

  configKeys.forEach((key) => {
    if (!schemaKeys.includes(key)) {
      warnings.push(`Unknown configuration field: '${key}'`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Merge multiple configuration objects
 */
export const mergeConfigs = <T extends Record<string, any>>(
  ...configs: Partial<T>[]
): T => {
  const result = {} as T;

  configs.forEach((config) => {
    if (config) {
      deepMerge(result, config);
    }
  });

  return result;
};

/**
 * Create a new configuration with defaults
 */
export const createConfig = (overrides?: Partial<DevConfig>): DevConfig => {
  return mergeConfigs(DEFAULT_DEV_CONFIG, overrides || {});
};

/**
 * Load configuration from various sources
 */
export const loadConfig = (sources?: {
  env?: boolean;
  localStorage?: boolean;
  file?: string;
}): DevConfig => {
  const { env = true, localStorage = true, file } = sources || {};
  let config = { ...DEFAULT_DEV_CONFIG };

  // Load from environment variables
  if (env) {
    const envConfig = loadFromEnvironment();
    config = mergeConfigs(config, envConfig);
  }

  // Load from localStorage
  if (localStorage && typeof window !== "undefined") {
    const storageConfig = loadFromStorage();
    config = mergeConfigs(config, storageConfig);
  }

  // Load from file (in Node.js environment)
  if (file && typeof require !== "undefined") {
    try {
      const fileConfig = loadFromFile(file);
      config = mergeConfigs(config, fileConfig);
    } catch (error) {
      console.warn(`Failed to load config from file: ${file}`, error);
    }
  }

  return config;
};

/**
 * Save configuration to storage
 */
export const saveConfig = (
  config: DevConfig,
  targets?: {
    localStorage?: boolean;
    file?: string;
  }
): void => {
  const { localStorage = true, file } = targets || {};

  // Save to localStorage
  if (localStorage && typeof window !== "undefined") {
    saveToStorage(config);
  }

  // Save to file (in Node.js environment)
  if (file && typeof require !== "undefined") {
    try {
      saveToFile(config, file);
    } catch (error) {
      console.warn(`Failed to save config to file: ${file}`, error);
    }
  }
};

// Helper functions
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;

  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    return current[key];
  }, obj);

  target[lastKey] = value;
};

const getAllKeys = (obj: any, prefix = ""): string[] => {
  const keys: string[] = [];

  Object.keys(obj).forEach((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);

    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    }
  });

  return keys;
};

const validateType = (value: any, expectedType: string): boolean => {
  switch (expectedType) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "boolean":
      return typeof value === "boolean";
    case "object":
      return (
        typeof value === "object" && value !== null && !Array.isArray(value)
      );
    case "array":
      return Array.isArray(value);
    default:
      return false;
  }
};

const deepMerge = (target: any, source: any): any => {
  Object.keys(source).forEach((key) => {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });

  return target;
};

// Environment loading
const loadFromEnvironment = (): Partial<DevConfig> => {
  const envConfig: any = {};

  // Map environment variables to config
  const envMappings = {
    NODE_ENV: "environment",
    DEBUG_LEVEL: "debug.level",
    API_BASE_URL: "api.baseUrl",
    API_TIMEOUT: "api.timeout",
    ENABLE_DEBUG_OVERLAY: "debug.enableOverlay",
    ENABLE_PERFORMANCE_MONITORING: "debug.enablePerformanceMonitoring",
  };

  Object.entries(envMappings).forEach(([envVar, configPath]) => {
    const value = process.env[envVar];
    if (value !== undefined) {
      let parsedValue: any = value;

      // Parse boolean values
      if (value === "true") parsedValue = true;
      if (value === "false") parsedValue = false;

      // Parse numeric values
      if (/^\d+$/.test(value)) {
        parsedValue = parseInt(value, 10);
      }

      setNestedValue(envConfig, configPath, parsedValue);
    }
  });

  return envConfig;
};

// localStorage handling
const STORAGE_KEY = "anime-learn-dev-config";

const loadFromStorage = (): Partial<DevConfig> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("Failed to load config from localStorage:", error);
    return {};
  }
};

const saveToStorage = (config: DevConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn("Failed to save config to localStorage:", error);
  }
};

// File handling (Node.js only)
const loadFromFile = (filePath: string): Partial<DevConfig> => {
  if (typeof require === "undefined") {
    throw new Error("File loading not supported in browser environment");
  }

  const fs = require("fs");
  const path = require("path");

  const fullPath = path.resolve(filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Config file not found: ${fullPath}`);
  }

  const content = fs.readFileSync(fullPath, "utf8");

  if (filePath.endsWith(".json")) {
    return JSON.parse(content);
  } else if (filePath.endsWith(".js")) {
    // Simple require for JS config files
    delete require.cache[fullPath];
    return require(fullPath);
  } else {
    throw new Error(`Unsupported config file format: ${filePath}`);
  }
};

const saveToFile = (config: DevConfig, filePath: string): void => {
  if (typeof require === "undefined") {
    throw new Error("File saving not supported in browser environment");
  }

  const fs = require("fs");
  const path = require("path");

  const fullPath = path.resolve(filePath);
  const dir = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (filePath.endsWith(".json")) {
    fs.writeFileSync(fullPath, JSON.stringify(config, null, 2));
  } else if (filePath.endsWith(".js")) {
    const content = `module.exports = ${JSON.stringify(config, null, 2)};`;
    fs.writeFileSync(fullPath, content);
  } else {
    throw new Error(`Unsupported config file format: ${filePath}`);
  }
};

// Configuration presets
export const CONFIG_PRESETS = {
  development: (): DevConfig => ({
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
  }),

  production: (): DevConfig => ({
    environment: "production",
    debug: {
      level: "ERROR",
      enableOverlay: false,
      enablePerformanceMonitoring: false,
    },
    api: {
      baseUrl: DEV_CONSTANTS.PROD_API_BASE,
      timeout: 10000,
      retries: 2,
    },
    build: {
      target: "web",
      sourceMaps: false,
      minify: true,
      analyze: true,
    },
    features: {
      hotReload: false,
      mockData: false,
      errorBoundary: true,
    },
  }),

  testing: (): DevConfig => ({
    environment: "test",
    debug: {
      level: "WARN",
      enableOverlay: false,
      enablePerformanceMonitoring: false,
    },
    api: {
      baseUrl: "http://localhost:3002/api",
      timeout: 3000,
      retries: 1,
    },
    build: {
      target: "web",
      sourceMaps: true,
      minify: false,
      analyze: false,
    },
    features: {
      hotReload: false,
      mockData: true,
      errorBoundary: false,
    },
  }),
} as const;

// Export config utilities
export const configUtils = {
  validateConfig,
  mergeConfigs,
  createConfig,
  loadConfig,
  saveConfig,
  presets: CONFIG_PRESETS,
};
