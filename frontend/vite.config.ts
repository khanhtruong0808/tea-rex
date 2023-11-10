/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    includeSource: ["src/**/*.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: "src/__tests__/setup.ts",
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
