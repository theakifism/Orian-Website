// Run with: npm run generate-sitemap (also runs automatically before
// `npm run build`, see package.json). Writes public/sitemap.xml so it's
// picked up by Vite's static public-dir copy during the SSG build.
//
// Every real, indexable public route is listed here explicitly or derived
// from the same data files src/routes.jsx uses for getStaticPaths, so the
// sitemap can't silently drift out of sync with the actual site. The
// /admin* routes are intentionally excluded — they're disallowed in
// robots.txt and shouldn't be indexed.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { SITE_URL } from '../src/seo/siteConfig.js';
import { services } from '../src/data/services.js';
import { industries } from '../src/data/industries.js';
import { whyUsData } from '../src/data/whyUs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const staticPaths = [
  '/',
  '/about',
  '/services',
  '/industries',
  '/why-us',
  '/careers',
  '/contact',
  '/assistant',
];

const dynamicPaths = [
  ...services.map((s) => `/services/${s.slug}`),
  ...industries.map((i) => `/industries/${i.slug}`),
  ...whyUsData.map((w) => `/why-us/${w.slug}`),
];

const allPaths = [...staticPaths, ...dynamicPaths];

const today = new Date().toISOString().slice(0, 10);

const urlEntries = allPaths
  .map((p) => {
    const loc = `${SITE_URL}${p === '/' ? '/' : p}`;
    const priority = p === '/' ? '1.0' : p.split('/').filter(Boolean).length === 1 ? '0.8' : '0.6';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
await writeFile(outPath, xml, 'utf-8');

console.log(`sitemap.xml written with ${allPaths.length} URLs -> ${outPath}`);
