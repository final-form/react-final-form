import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Manually defined globals to avoid issues with the 'globals' package
const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  console: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
  HTMLInputElement: "readonly",
  HTMLElement: "readonly",
};
const nodeGlobals = {
  process: "readonly",
  require: "readonly",
  module: "readonly",
  exports: "writable",
  __dirname: "readonly",
  __filename: "readonly",
  global: "readonly",
  console: "readonly",
};
const jestGlobals = {
  jest: "readonly",
  describe: "readonly",
  it: "readonly",
  expect: "readonly",
  afterEach: "readonly",
  beforeEach: "readonly",
  test: "readonly",
  beforeAll: "readonly",
  afterAll: "readonly",
};

export default [
  // Base config for all JS/TS files (can be overridden)
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "*.min.js",
      "examples/**",
    ],
  },
  js.configs.recommended, // Apply ESLint recommended rules globally (respecting ignores)

  // Configuration for TypeScript files in src/
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json", // Project-aware linting for src files
      },
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        ...jestGlobals,
        es2021: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "jsx-a11y/href-no-hash": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "react/no-children-prop": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-undef": "off", // TypeScript handles this for .ts/.tsx
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Configuration for TypeScript test files in typescript/ (for dtslint, no project parsing)
  {
    files: ["typescript/**/*.ts", "typescript/**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }, // Allow JSX in .tsx test files
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        ...jestGlobals,
        es2021: true,
      }, // General globals for TS test files
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      // Add other plugins if relevant for these test files, e.g., react if they use React
    },
    rules: {
      // Lighter ruleset for .d.ts test files or general TS syntax checking
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "no-undef": "off", // Disable no-undef for TypeScript files
    },
  },

  // Configuration for JavaScript files (e.g., .js test files in src/, config files)
  {
    files: ["**/*.js", "**/*.jsx"],
    ignores: ["examples/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        ...jestGlobals,
        es2021: true,
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      "no-undef": "error",
      "react/jsx-uses-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Enforce _ prefix for unused vars in JS files
    },
  },

  // Configuration for .mjs files (ES modules in Node.js environment)
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...nodeGlobals,
      },
    },
    rules: {
      "no-undef": "error",
    },
  },

  // Specific overrides for ALL test files (JS and TS)
  {
    files: ["**/*.test.js", "**/*.test.jsx", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
