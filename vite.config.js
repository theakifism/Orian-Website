import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import photos from './scripts/photos-plugin.mjs'


// Renders search-engine verification tags only when a real value is configured, so a
// placeholder can never ship. Set VITE_GOOGLE_SITE_VERIFICATION (Search Console) in the
// host's environment variables; unset means no tag at all.
const verificationTags = (mode) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const tags = []
  const add = (name, value) => {
    const v = (value || '').trim()
    if (v && !/^REPLACE_WITH/i.test(v)) tags.push({ tag: 'meta', attrs: { name, content: v }, injectTo: 'head-prepend' })
  }
  add('google-site-verification', env.VITE_GOOGLE_SITE_VERIFICATION)
  // Ahrefs Webmaster Tools. Kept because the site was already verified with this code.
  add('ahrefs-site-verification', env.VITE_AHREFS_SITE_VERIFICATION ?? '878977a1dc6c3225fa61028d6c854a0b6693a311a1b81e820efcf771b3cc6590')
  return tags
}
const siteVerification = () => ({
  name: 'site-verification-tags',
  transformIndexHtml: { order: 'post', handler: (_html, ctx) => verificationTags(ctx.server?.config.mode ?? process.env.NODE_ENV ?? 'production') },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), photos(), siteVerification()],
  build: {
    // No source maps in production, so visitors cannot open your original source files.
    sourcemap: false,
    // Emit classic (min-width: 960px) media queries. The default output uses the newer range syntax
    // (width >= 960px), which Safari older than 16.4 ignores, so older Macs never got the desktop layout.
    cssTarget: ['chrome87', 'safari14', 'firefox78', 'edge88'],
    rollupOptions: {
      output: {
        // Random, content-hashed names with no folder or readable name: photos become
        // /assets/Dk3x9aQ.jpg instead of /images/industries/banking.jpg, and code chunks no
        // longer say AdminRoute / LeadDialog / etc. (Names change only when the file changes,
        // so browser caching keeps working.)
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]',
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  // Used by `vite-react-ssg build` (see package.json's "build" script).
  // Doesn't affect `vite`/`vite preview`, which ignore this key.
  ssgOptions: {
    // 'defer' (not 'async'): the generated <script type="module"> tag sits
    // in <body> *before* <div id="root">. A plain `async` module script can
    // execute as soon as it's downloaded, before the parser reaches
    // <div id="root"> below it -- that's what caused the intermittent
    // "[vite-react-ssg] Root container not found" console warning (app
    // never mounts, page stays stuck on the preloader). 'defer' guarantees
    // the script only runs after the whole document has been parsed.
    script: 'defer',
    // 'none' (default) avoids re-formatting the generated HTML, which
    // vite-react-ssg warns can otherwise cause hydration mismatches.
    formatting: 'none',
  },
})