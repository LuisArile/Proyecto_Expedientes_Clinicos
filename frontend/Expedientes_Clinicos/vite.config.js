import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    react(),
    tailwindcss(),
  ],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js"
  }

})
