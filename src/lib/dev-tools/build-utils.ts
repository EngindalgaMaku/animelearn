/**
 * Build utilities for development and production
 */

import { getEnvironment, getAppVersion } from "./environment";

// Build information interface
export interface BuildInfo {
  version: string;
  environment: string;
  buildTime: string;
  commitHash: string;
  nodeVersion: string;
  buildId: string;
}

// Git information interface
export interface GitInfo {
  branch: string;
  commit: string;
  author: string;
  date: string;
  message: string;
  isDirty: boolean;
}

// Bundle analysis interface
export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: number;
  }>;
  assets: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

// Build manifest interface
export interface BuildManifest {
  build: BuildInfo;
  git: GitInfo;
  dependencies: Record<string, string>;
  performance: {
    buildTime: number;
    bundleSize: number;
  };
}

/**
 * Get current build information
 */
export const getBuildInfo = (): BuildInfo => {
  return {
    version: getAppVersion(),
    environment: getEnvironment(),
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    commitHash: process.env.COMMIT_HASH || "unknown",
    nodeVersion: process.version || "unknown",
    buildId: process.env.BUILD_ID || generateBuildId(),
  };
};

/**
 * Generate a unique build ID
 */
const generateBuildId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${random}`;
};

/**
 * Get Git information (mock implementation)
 */
export const getGitInfo = (): GitInfo => {
  return {
    branch: process.env.GIT_BRANCH || "main",
    commit: process.env.GIT_COMMIT || "unknown",
    author: process.env.GIT_AUTHOR || "unknown",
    date: process.env.GIT_DATE || new Date().toISOString(),
    message: process.env.GIT_MESSAGE || "Build commit",
    isDirty: process.env.GIT_DIRTY === "true",
  };
};

/**
 * Create a comprehensive build manifest
 */
export const createBuildManifest = async (): Promise<BuildManifest> => {
  const buildStart = Date.now();

  // Get package.json dependencies (simplified)
  const dependencies: Record<string, string> = {
    react: "^18.0.0",
    next: "^14.0.0",
    typescript: "^5.0.0",
    // Add more dependencies as needed
  };

  const buildTime = Date.now() - buildStart;

  return {
    build: getBuildInfo(),
    git: getGitInfo(),
    dependencies,
    performance: {
      buildTime,
      bundleSize: await estimateBundleSize(),
    },
  };
};

/**
 * Estimate bundle size (simplified implementation)
 */
const estimateBundleSize = async (): Promise<number> => {
  // This is a simplified estimation
  // In a real implementation, you would use webpack-bundle-analyzer or similar tools

  const baseSize = 500000; // 500KB base
  const dependencyCount = Object.keys({}).length; // Would be actual dependencies
  const estimatedSize = baseSize + dependencyCount * 10000; // 10KB per dependency

  return estimatedSize;
};

/**
 * Optimize bundle configuration
 */
export const optimizeBundle = () => {
  const optimizations = {
    splitChunks: {
      chunks: "all" as const,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all" as const,
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all" as const,
          enforce: true,
        },
      },
    },
    minimizer: [
      // TerserPlugin configuration
      {
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === "production",
            drop_debugger: true,
            pure_funcs: ["console.log", "console.info", "console.debug"],
          },
          mangle: {
            safari10: true,
          },
          output: {
            comments: false,
            ascii_only: true,
          },
        },
      },
    ],
    usedExports: true,
    sideEffects: false,
  };

  return optimizations;
};

/**
 * Analyze bundle size and composition
 */
export const analyzeBundleSize = async (): Promise<BundleAnalysis> => {
  // Mock implementation - in reality this would use webpack-bundle-analyzer
  const mockAnalysis: BundleAnalysis = {
    totalSize: 1500000, // 1.5MB
    gzippedSize: 450000, // 450KB
    chunks: [
      {
        name: "main",
        size: 800000,
        modules: 150,
      },
      {
        name: "vendor",
        size: 500000,
        modules: 50,
      },
      {
        name: "common",
        size: 200000,
        modules: 25,
      },
    ],
    assets: [
      {
        name: "main.js",
        size: 800000,
        type: "javascript",
      },
      {
        name: "vendor.js",
        size: 500000,
        type: "javascript",
      },
      {
        name: "styles.css",
        size: 100000,
        type: "stylesheet",
      },
      {
        name: "images",
        size: 100000,
        type: "assets",
      },
    ],
  };

  return mockAnalysis;
};

/**
 * Generate build report
 */
export const generateBuildReport = async (): Promise<string> => {
  const manifest = await createBuildManifest();
  const analysis = await analyzeBundleSize();

  const report = `
# Build Report

## Build Information
- Version: ${manifest.build.version}
- Environment: ${manifest.build.environment}
- Build Time: ${manifest.build.buildTime}
- Build ID: ${manifest.build.buildId}
- Node Version: ${manifest.build.nodeVersion}

## Git Information
- Branch: ${manifest.git.branch}
- Commit: ${manifest.git.commit}
- Author: ${manifest.git.author}
- Date: ${manifest.git.date}
- Message: ${manifest.git.message}
- Is Dirty: ${manifest.git.isDirty}

## Performance
- Build Duration: ${manifest.performance.buildTime}ms
- Bundle Size: ${formatBytes(manifest.performance.bundleSize)}
- Gzipped Size: ${formatBytes(analysis.gzippedSize)}

## Bundle Analysis
### Chunks
${analysis.chunks
  .map(
    (chunk) =>
      `- ${chunk.name}: ${formatBytes(chunk.size)} (${chunk.modules} modules)`
  )
  .join("\n")}

### Assets
${analysis.assets
  .map((asset) => `- ${asset.name}: ${formatBytes(asset.size)} (${asset.type})`)
  .join("\n")}

## Dependencies
${Object.entries(manifest.dependencies)
  .map(([name, version]) => `- ${name}: ${version}`)
  .join("\n")}
`;

  return report.trim();
};

/**
 * Format bytes to human readable format
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Validate build configuration
 */
export const validateBuildConfig = (
  config: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for required fields
  if (!config.entry) {
    errors.push("Entry point is required");
  }

  if (!config.output) {
    errors.push("Output configuration is required");
  }

  // Check for performance issues
  if (
    config.devtool === "source-map" &&
    process.env.NODE_ENV === "production"
  ) {
    errors.push("Source maps should not be enabled in production");
  }

  // Check for optimization settings
  if (process.env.NODE_ENV === "production" && !config.optimization?.minimize) {
    errors.push("Minification should be enabled in production");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Build performance metrics
 */
export class BuildMetrics {
  private startTime: number = 0;
  private metrics: Record<string, number> = {};

  start() {
    this.startTime = Date.now();
  }

  mark(label: string) {
    this.metrics[label] = Date.now() - this.startTime;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getReport(): string {
    const total = Date.now() - this.startTime;
    let report = `Build completed in ${total}ms\n\n`;

    for (const [label, time] of Object.entries(this.metrics)) {
      const percentage = ((time / total) * 100).toFixed(1);
      report += `${label}: ${time}ms (${percentage}%)\n`;
    }

    return report;
  }
}

/**
 * Development server utilities
 */
export const devServerUtils = {
  getOptimalPort: (defaultPort: number = 3000): number => {
    // In a real implementation, this would check for available ports
    return process.env.PORT ? parseInt(process.env.PORT) : defaultPort;
  },

  getHotReloadConfig: () => ({
    hot: true,
    liveReload: true,
    watchFiles: ["src/**/*"],
    overlay: {
      warnings: false,
      errors: true,
    },
  }),

  getProxyConfig: () => ({
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
      secure: false,
    },
  }),
};
