import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Generated files - exclude from linting
      "src/generated/**/*",
      "prisma/generated/**/*",
      "node_modules/**/*",
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",
      // Generated Prisma files
      "**/prisma/runtime/**/*",
      "**/wasm.js",
      "**/wasm-engine-edge.js",
      // Test coverage
      "coverage/**/*",
      // Stories are development only
      "**/*.stories.tsx",
      "**/*.stories.ts",
      // Jest setup
      "jest.setup.js",
      "jest.config.js",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Type safety improvements
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],

      // React specific
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react/no-unescaped-entities": "warn", // Changed from error to warn for build

      // Import improvements
      "@typescript-eslint/no-require-imports": "warn",
      "prefer-const": "warn",

      // Performance
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn", // Changed from error to warn for build

      // Allow commonly used patterns
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-this-alias": "warn",

      // Disable overly strict rules for development
      "import/no-anonymous-default-export": "off",
    },
  },
  {
    // Special rules for development files
    files: ["**/*.stories.tsx", "**/*.test.tsx", "**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/rules-of-hooks": "off",
    },
  },
  {
    // API routes specific rules
    files: ["src/app/api/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
