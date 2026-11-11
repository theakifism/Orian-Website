// One-off / repeatable: converts JPG/PNG photos under src/assets/images to WebP.
//   node scripts/optimize-images.mjs
// For each source photo it writes <name>.webp (max 1600px wide) and, for photos wider than
// 900px, <name>-sm.webp (720px wide) for srcset. Original files are moved to
// assets-original/images/ (outside src, so never bundled). Sizes go in scripts/image-manifest.json.
import { readdirSync, statSync, mkdirSync, renameSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'src/assets/images';
const BACKUP = 'assets-original/images';
const MANIFEST = 'scripts/image-manifest.json';
const FULL_MAX = 1600, SM = 720, Q = 74;

const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = path.join(d, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
let before = 0, after = 0;

for (const f of walk(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const rel = path.relative(SRC, f).split(path.sep).join('/');
  const base = f.replace(/\.(jpe?g|png)$/i, '');
  const img = sharp(f);
  const { width, height } = await img.metadata();
  const w = Math.min(width, FULL_MAX);
  const h = Math.round((height * w) / width);
  await img.clone().resize({ width: w }).webp({ quality: Q, effort: 5 }).toFile(`${base}.webp`);
  const key = rel.replace(/\.(jpe?g|png)$/i, '.webp');
  manifest[key] = { w, h };
  if (width > 900) {
    await img.clone().resize({ width: SM }).webp({ quality: Q, effort: 5 }).toFile(`${base}-sm.webp`);
    manifest[key].sm = SM;
  }
  before += statSync(f).size;
  after += statSync(`${base}.webp`).size;
  const dest = path.join(BACKUP, rel);
  mkdirSync(path.dirname(dest), { recursive: true });
  renameSync(f, dest);
}
// Already-WebP photos (no source jpg/png): record their size too
for (const f of walk(SRC)) {
  if (!/\.webp$/i.test(f) || /-sm\.webp$/i.test(f)) continue;
  const rel = path.relative(SRC, f).split(path.sep).join('/');
  if (manifest[rel]) continue;
  const { width, height } = await sharp(f).metadata();
  manifest[rel] = { w: width, h: height };
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
console.log(`converted: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB (full-size variants only)`);
