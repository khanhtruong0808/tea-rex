/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  test: {
    includeSource: ["src/**/*.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: "src/tests/setup.ts",
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
