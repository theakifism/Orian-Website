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
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { SITE_URL } from '../src/seo/siteConfig.js';
import { guideModified } from '../src/seo/lastmod.js';
// Same lists the site renders (src/content/build-data.js), so a service /
// use case / guide added to src/data is in the sitemap after the next build.
import { buildData } from '../src/content/build-data.js';

const services = buildData('services');
const industries = buildData('industries');
const whyUsData = buildData('whyUs');
const useCases = buildData('useCases');
const guides = buildData('guides');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const staticPaths = [
  '/',
  '/about',
  '/services',
  '/industries',
  '/why-us',
  '/careers',
  '/contact',
  '/bulk-sms-service-nagpur',
  '/assistant',
  '/help-center',
  '/resources',
  '/use-cases',
  '/compliance',
  '/developers',
  // '/status' is noindex until it shows real monitoring data (see src/pages/StatusPage.jsx)
  '/privacy',
  '/terms',
];

const dynamicPaths = [
  ...services.map((s) => `/services/${s.slug}`),
  ...industries.map((i) => `/industries/${i.slug}`),
  ...whyUsData.map((w) => `/why-us/${w.slug}`),
  ...useCases.map((u) => `/use-cases/${u.slug}`),
  ...guides.map((g) => `/resources/${g.slug}`),
];

const allPaths = [...staticPaths, ...dynamicPaths];

// ---- lastmod -------------------------------------------------------------------------
// Never the build date. Sources, in order:
//   1. guides: `modified` (or `date`) from src/data/guides.js, the same value the Article
//      JSON-LD uses for dateModified (src/seo/lastmod.js)
//   2. everything else: commit date of the source files that produce the page
//      (`git log -1 --format=%cs -- <files>`)
//   3. otherwise the <lastmod> element is omitted
// Shallow clones (Vercel's default) report misleading commit dates, so git is skipped there.
const root = path.join(__dirname, '..');
const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
};
const gitUsable = git(['rev-parse', '--is-inside-work-tree']) === 'true' && git(['rev-parse', '--is-shallow-repository']) !== 'true';
const gitDate = (files) => {
  if (!gitUsable) return undefined;
  const existing = files.filter((f) => existsSync(path.join(root, f)));
  if (!existing.length) return undefined;
  return git(['log', '-1', '--format=%cs', '--', ...existing]) || undefined;
};

const PAGE_FILES = {
  '/': ['src/pages/Home.jsx', 'src/data/homeCopy.js'],
  '/about': ['src/pages/AboutPage.jsx'],
  '/services': ['src/pages/ServicesPage.jsx', 'src/data/services.js'],
  '/industries': ['src/pages/IndustriesPage.jsx', 'src/data/industries.js'],
  '/why-us': ['src/pages/WhyUsPage.jsx', 'src/data/whyUs.js'],
  '/careers': ['src/pages/CareersPage.jsx'],
  '/contact': ['src/pages/ContactPage.jsx'],
  '/bulk-sms-service-nagpur': ['src/pages/NagpurPage.jsx'],
  '/assistant': ['src/pages/AssistantPage.jsx'],
  '/help-center': ['src/pages/HelpCenterPage.jsx', 'src/data/faqs.js'],
  '/resources': ['src/pages/ResourcesPage.jsx', 'src/data/guides.js'],
  '/use-cases': ['src/pages/UseCasesPage.jsx', 'src/data/useCases.js'],
  '/compliance': ['src/pages/CompliancePage.jsx'],
  '/developers': ['src/pages/DevelopersPage.jsx'],
  '/status': ['src/pages/StatusPage.jsx'],
  '/privacy': ['src/pages/PrivacyPage.jsx'],
  '/terms': ['src/pages/TermsPage.jsx'],
};
const DETAIL_FILES = {
  services: ['src/pages/ServiceDetailPage.jsx', 'src/data/services.js'],
  industries: ['src/pages/IndustryDetailPage.jsx', 'src/data/industries.js'],
  'why-us': ['src/pages/WhyUsDetailPage.jsx', 'src/data/whyUs.js'],
  'use-cases': ['src/pages/UseCaseDetailPage.jsx', 'src/data/useCases.js'],
};

const guideBySlug = new Map(guides.map((g) => [g.slug, g]));
const lastmodFor = (p) => {
  const [section, slug] = p.split('/').filter(Boolean);
  if (section === 'resources' && slug) return guideModified(guideBySlug.get(slug) || {});
  if (slug && DETAIL_FILES[section]) return gitDate(DETAIL_FILES[section]);
  return gitDate(PAGE_FILES[p] || []);
};

// <priority> is ignored by Google, so it is not emitted.
const urlEntries = allPaths
  .map((p) => {
    const loc = `${SITE_URL}${p === '/' ? '/' : p}`;
    const lastmod = lastmodFor(p);
    return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
await writeFile(outPath, xml, 'utf-8');

// robots.txt is written from the same SITE_URL so the Sitemap line can never point at another domain.
// /admin is NOT disallowed: it carries noindex (meta tag + X-Robots-Tag header), and Google can only
// see a noindex on pages it is allowed to crawl. /api/ stays blocked.
const robots = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
await writeFile(path.join(__dirname, '..', 'public', 'robots.txt'), robots, 'utf-8');
console.log(`sitemap.xml written with ${allPaths.length} URLs -> ${outPath}`);
