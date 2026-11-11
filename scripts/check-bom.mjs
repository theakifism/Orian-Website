// Fails the build if a source file starts with a UTF-8 BOM. A BOM at the start of index.html
// pushes <title>, meta tags, canonical and JSON-LD out of <head> in the prerendered pages
// (PowerShell's Set-Content / Out-File can add one). Run automatically by `npm run build`.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const EXT = /\.(html|jsx?|mjs|json|css|xml|txt)$/;
const SKIP = new Set(['node_modules', 'dist', '.vercel', '.git']);
const bad = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXT.test(name)) {
      const b = readFileSync(full);
      if (b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) bad.push(full);
    }
  }
};
['index.html', 'src', 'public', 'scripts', 'api'].forEach((p) => {
  try { statSync(p).isDirectory() ? walk(p) : bad.push(...(readFileSync(p)[0] === 0xef ? [p] : [])); } catch { /* optional path */ }
});
if (bad.length) {
  console.error('check-bom: these files start with a UTF-8 BOM. Re-save them as "UTF-8" (no BOM):\n - ' + bad.join('\n - '));
  process.exit(1);
}
console.log('check-bom: no BOM found');
