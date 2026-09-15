import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  // Used by `vite-react-ssg build` (see package.json's "build" script).
  // Doesn't affect `vite`/`vite preview`, which ignore this key.
  ssgOptions: {
    script: 'async',
    // 'none' (default) avoids re-formatting the generated HTML, which
    // vite-react-ssg warns can otherwise cause hydration mismatches.
    formatting: 'none',
  },
})