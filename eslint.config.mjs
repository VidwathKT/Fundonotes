import globals from "globals";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";

const config = [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    ...js.configs.recommended,
    rules: {
      ...js.configs.recommended.rules,
      "no-console": ["warn", { allow: ["warn", "error"] }], // Warn for console logs, but allow console.warn and console.error
      "no-unused-vars": ["error", { args: "none", varsIgnorePattern: "^_" }], // Error on unused variables,ignor _
      "no-multiple-empty-lines": ["error", { max: 1 }], //avoids many empty lines
      "semi": ["error", "always"], // Enforce ;
      "no-trailing-spaces": "error", //trailing whitespace error
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { args: "none", varsIgnorePattern: "^_" }],
      "@typescript-eslint/semi": ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-trailing-spaces": "error",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-trailing-spaces": "error",
      "semi": ["error", "always"],
    },
  },
];

export default config;
