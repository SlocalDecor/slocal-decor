import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
  build: {
    outDir: "dist",
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, "index.html"),
    //     nested: resolve(__dirname, "nested/index.html"),
    //   },
    // },
  },
});
