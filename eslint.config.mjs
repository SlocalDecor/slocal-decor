// eslint.config.mjs
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["node_modules", "dist", "build"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      "react/prop-types": "off",
    },
  },
]);
