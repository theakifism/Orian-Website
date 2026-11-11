// Post-build step: make the compiled CSS work in older Safari (14 / 15.0-15.3), which does not
// understand @layer (Tailwind v4 wraps all its utilities in layers) or modern colour functions.
//  1. flatten @layer blocks into normal rules (keeps the same cascade order)
//  2. let lightningcss lower oklch()/color-mix()/etc. to plain colours for Safari 14
//  3. give the rewritten stylesheet a NEW file name (hash of its final content) and update every
//     page that links it. Vite names the file from the CSS *before* this step, so without a rename the
//     processed file keeps the old name, and /assets/* is cached for a year (vercel.json), so browsers
//     that already hold the old file would never download the fixed one.
// Modern browsers are unaffected: the output is equivalent, just without the newer syntax.
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import postcss from 'postcss'
import cascadeLayers from '@csstools/postcss-cascade-layers'
import { transform } from 'lightningcss'

const root = 'dist'
const dir = join(root, 'assets')
const targets = { safari: (14 << 16) | (0 << 8), chrome: 87 << 16, firefox: 78 << 16, edge: 88 << 16 }
const renames = []
let done = 0
for (const f of readdirSync(dir).filter((n) => n.endsWith('.css'))) {
  const p = join(dir, f)
  const src = readFileSync(p, 'utf8')
  if (!src.includes('@layer')) continue
  const flat = await postcss([cascadeLayers()]).process(src, { from: undefined })
  const out = transform({ filename: f, code: Buffer.from(flat.css), minify: true, targets })
  const hash = createHash('sha256').update(out.code).digest('base64url').replace(/[^A-Za-z0-9]/g, '').slice(0, 8)
  const next = `${hash}.css`
  if (next === f) {
    writeFileSync(p, out.code)
  } else {
    writeFileSync(join(dir, next), out.code)
    rmSync(p)
    renames.push([f, next])
  }
  done++
}

// Point every page / script that mentioned the old file name at the new one.
const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
let patched = 0
if (renames.length) {
  for (const file of walk(root).filter((x) => /\.(html|js|json|css|xml|txt|webmanifest)$/.test(x))) {
    let text = readFileSync(file, 'utf8')
    let changed = false
    for (const [from, to] of renames) {
      if (text.includes(from)) {
        text = text.split(from).join(to)
        changed = true
      }
    }
    if (changed) {
      writeFileSync(file, text)
      patched++
    }
  }
}
console.log(`legacy-css: processed ${done} stylesheet(s)${renames.length ? `, renamed ${renames.map(([a, b]) => `${a} -> ${b}`).join(', ')}, updated ${patched} file(s)` : ''}`)
