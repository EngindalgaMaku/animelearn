/**
 * Environment utilities for development tools
 */

export type Environment = "development" | "production" | "test" | "staging";

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === "test";
};

export const getEnvironment = (): Environment => {
  const env = process.env.NODE_ENV as Environment;
  return env || "development";
};

export const getApiUrl = (): string => {
  const env = getEnvironment();

  switch (env) {
    case "production":
      return "https://api.anime-python.dev";
    case "staging":
      return "https://staging-api.anime-python.dev";
    case "test":
      return "http://localhost:3002/api";
    default:
      return "http://localhost:3000/api";
  }
};

export const getAppVersion = (): string => {
  return process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
};

export const createEnvironmentConfig = () => {
  return {
    environment: getEnvironment(),
    isDev: isDevelopment(),
    isProd: isProduction(),
    isTest: isTest(),
    apiUrl: getApiUrl(),
    version: getAppVersion(),
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    commitHash: process.env.COMMIT_HASH || "unknown",
  };
};
