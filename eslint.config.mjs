// eslint.config.mjs
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
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
    },
  },
]);
