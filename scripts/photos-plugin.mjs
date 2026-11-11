// Vite plugin: exposes every photo in src/assets/images as a lookup table.
//
//   import photos from 'virtual:photos';   // { 'industries/banking.jpg': '/assets/Dk3x9aQ.jpg', ... }
//
// It writes ordinary `import x from '/src/assets/images/...'` statements, so the build
// treats each photo like any other asset (content-hashed, de-duplicated, and renamed by
// output.assetFileNames in vite.config.js). The table's keys start at the photos folder
// ('industries/banking.jpg'), so the folder's location is never written into the bundle.
//
// (import.meta.glob would do the same job, but it writes the full source path of every
// photo into the JavaScript as its keys, and its `base` option mis-names assets in the
// static-site build.)
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const VIRTUAL = 'virtual:photos';
const RESOLVED = `\0${VIRTUAL}`;
const IS_PHOTO = /\.(jpe?g|png|webp|avif)$/i;

export default function photosPlugin({ dir = 'src/assets/images' } = {}) {
  let root = process.cwd();
  const photosDir = () => path.resolve(root, dir);
  const walk = (d) =>
    readdirSync(d).flatMap((name) => {
      const p = path.join(d, name);
      if (statSync(p).isDirectory()) return walk(p);
      return IS_PHOTO.test(name) ? [p] : [];
    });

  return {
    name: 'orian-photos',
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null;
    },
    load(id) {
      if (id !== RESOLVED) return null;
      const base = photosDir();
      const files = walk(base).sort();
      const toPosix = (p) => p.split(path.sep).join('/');
      const present = new Set(files.map((f) => toPosix(path.relative(base, f))));
      const manifestPath = path.resolve(root, 'scripts/image-manifest.json');
      const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
      const imports = files.map((f, i) => `import p${i} from ${JSON.stringify(`/${toPosix(path.relative(root, f))}`)};`);
      const idx = new Map(files.map((f, i) => [toPosix(path.relative(base, f)), i]));
      const urlEntries = [];
      const setEntries = [];
      for (const [key, i] of idx) {
        urlEntries.push(`  ${JSON.stringify(key)}: p${i},`);
        // Photos were converted to WebP: keep the old .jpg/.png names working as aliases so no
        // data file or component had to change.
        const aliases = /\.webp$/i.test(key) && !/-sm\.webp$/i.test(key)
          ? ['.jpg', '.jpeg', '.png'].map((e) => key.replace(/\.webp$/i, e)).filter((k) => !present.has(k))
          : [];
        for (const a of aliases) urlEntries.push(`  ${JSON.stringify(a)}: p${i},`);
        const m = manifest[key];
        if (m) {
          const smKey = key.replace(/\.webp$/i, '-sm.webp');
          const sm = idx.get(smKey);
          const srcSet = m.sm && sm !== undefined ? `\`\${p${sm}} ${m.sm}w, \${p${i}} ${m.w}w\`` : 'undefined';
          const entry = `{ src: p${i}, srcSet: ${srcSet}, width: ${m.w}, height: ${m.h} }`;
          for (const k of [key, ...aliases]) setEntries.push(`  ${JSON.stringify(k)}: ${entry},`);
        }
      }
      return `${imports.join('\n')}\nexport default {\n${urlEntries.join('\n')}\n};\nexport const photoSets = {\n${setEntries.join('\n')}\n};\n`;
    },
    // Dev server: adding or removing a photo refreshes the table.
    configureServer(server) {
      const refresh = (file) => {
        if (!file.startsWith(photosDir()) || !IS_PHOTO.test(file)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
  };
}
