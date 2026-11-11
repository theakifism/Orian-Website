// Run after `npm run build`: node scripts/verify-seo.mjs
// Checks every public page in dist/ and exits non-zero on any failure.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const SKIP = [/^admin(\/|\.html$)/, /^404\.html$/, /^api\//];
const TITLE_RANGE = [30, 60];
const DESC_RANGE = [120, 160];

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'assets') continue;
      walk(p, out);
    } else if (name.endsWith('.html')) out.push(p);
  }
  return out;
};

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

const pages = walk(DIST)
  .map((f) => path.relative(DIST, f).split(path.sep).join('/'))
  .filter((rel) => !SKIP.some((re) => re.test(rel)))
  .sort();

const failures = [];
const noindexPages = new Set();
const fail = (page, msg) => failures.push(`${page}: ${msg}`);
const titles = new Map();
const descs = new Map();
const h1Seen = new Map();
const MIN_MAIN_WORDS = 300;
const rows = [];

for (const rel of pages) {
  const html = readFileSync(path.join(DIST, rel), 'utf8');
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) { noindexPages.add(rel); continue; }
  if (!/^<!DOCTYPE html>/i.test(html)) fail(rel, 'does not start with <!DOCTYPE html> (BOM or whitespace?)');
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyStart = html.search(/<body[\s>]/i);
  const head = headMatch ? headMatch[1] : '';
  const body = bodyStart >= 0 ? html.slice(bodyStart) : '';
  if (!head.trim()) fail(rel, '<head> is empty');

  const need = {
    title: /<title[^>]*>[\s\S]*?<\/title>/i,
    'meta description': /<meta[^>]+name="description"/i,
    canonical: /<link[^>]+rel="canonical"/i,
    'og:title': /<meta[^>]+property="og:title"/i,
    'og:description': /<meta[^>]+property="og:description"/i,
    'og:image': /<meta[^>]+property="og:image"/i,
    'og:url': /<meta[^>]+property="og:url"/i,
    'twitter:card': /<meta[^>]+name="twitter:card"/i,
    'twitter:title': /<meta[^>]+name="twitter:title"/i,
    'json-ld': /<script[^>]+type="application\/ld\+json"/i,
    viewport: /<meta[^>]+name="viewport"/i,
    charset: /<meta[^>]+charset=/i,
    manifest: /<link[^>]+rel="manifest"/i,
    icon: /<link[^>]+rel="(?:shortcut )?icon"/i,
  };
  for (const [name, re] of Object.entries(need)) {
    if (!re.test(head)) fail(rel, `${name} missing from <head>`);
    if (re.test(body) && !/json-ld/.test(name)) fail(rel, `${name} found inside <body>`);
  }
  if (/<script[^>]+application\/ld\+json/i.test(body)) fail(rel, 'JSON-LD found inside <body>');

  const title = decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]).trim();
  const desc = decode((head.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || [, ''])[1]).trim();
  const canonical = decode((head.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i) || [, ''])[1]);

  if (title.includes('…') || desc.includes('…')) fail(rel, 'title/description contains "…"');
  if (title.length < TITLE_RANGE[0] || title.length > TITLE_RANGE[1])
    fail(rel, `title length ${title.length} outside ${TITLE_RANGE.join('-')}: "${title}"`);
  if (desc.length < DESC_RANGE[0] || desc.length > DESC_RANGE[1])
    fail(rel, `description length ${desc.length} outside ${DESC_RANGE.join('-')}`);
  if (!/[.!?]$/.test(desc)) fail(rel, 'description is not a complete sentence (no terminal punctuation)');
  if (titles.has(title)) fail(rel, `duplicate title also on ${titles.get(title)}`);
  else titles.set(title, rel);
  if (descs.has(desc)) fail(rel, `duplicate description also on ${descs.get(desc)}`);
  else descs.set(desc, rel);
  if (!canonical.startsWith('https://www.orianteleservices.com')) fail(rel, `bad canonical "${canonical}"`);
  if (/REPLACE_WITH/i.test(html)) fail(rel, 'placeholder text (REPLACE_WITH…) shipped');
  if (/Sample layout|to be confirmed|>To confirm<|to be supplied|Client logo|Testimonial text|PE ID to be|empty slots|Front-end only|Connect this page to your real|REPLACE_WITH|lorem ipsum/i.test(html)) fail(rel, 'draft/placeholder wording is visible in an indexable page');
  if (/TODO\((content|review)\)/i.test(html)) fail(rel, 'TODO(content)/TODO(review) marker is visible in the output');
  // every internal link must resolve to a built page (or a file in dist/public)
  for (const m of body.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/gi)) {
    const href = decodeURIComponent(m[1]);
    const clean = href.replace(/\/$/, '') || '/';
    const candidates = clean === '/' ? ['index.html'] : [`${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`, clean.slice(1)];
    if (!candidates.some((c) => existsSync(path.join(DIST, c)) && statSync(path.join(DIST, c)).isFile())) fail(rel, `broken internal link ${href}`);
  }

  const h1s = (body.match(/<h1[\s>]/gi) || []).length;
  if (h1s !== 1) fail(rel, `expected exactly 1 <h1>, found ${h1s}`);
  let prev = 0;
  for (const m of body.matchAll(/<h([1-6])[\s>]/gi)) {
    const lvl = Number(m[1]);
    if (prev && lvl > prev + 1) { fail(rel, `heading level skipped: h${prev} -> h${lvl}`); break; }
    prev = lvl;
  }

  const mainHtml = (body.match(/<main[\s\S]*?<\/main>/i) || [body])[0].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const mainWords = mainHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (mainWords < MIN_MAIN_WORDS && !/\/(privacy|terms)\.html$|^(privacy|terms)\.html$/.test(rel)) fail(rel, `thin page: only ${mainWords} words of main content (minimum ${MIN_MAIN_WORDS})`);
  const h1Text = decode(((body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1]).replace(/<[^>]+>/g, '')).trim().toLowerCase();
  if (h1Seen.has(h1Text)) fail(rel, `duplicate H1 also on ${h1Seen.get(h1Text)}`); else h1Seen.set(h1Text, rel);
  const types = [];
  for (const m of head.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const json = JSON.parse(decode(m[1]));
      const nodes = Array.isArray(json) ? json : json['@graph'] || [json];
      nodes.forEach((n) => {
        const t = [].concat(n['@type']).join('/');
        types.push(t);
        if ('aggregateRating' in n || 'review' in n) fail(rel, `${t}: aggregateRating/review must not be present without real review data`);
        if (t === 'Organization' && 'sameAs' in n && (!Array.isArray(n.sameAs) || !n.sameAs.length || n.sameAs.some((u) => !/^https:\/\//.test(u))))
          fail(rel, 'Organization.sameAs is empty or contains a non-https URL (omit the property instead)');
        if (t === 'Article') {
          if (!/^\d{4}-\d{2}-\d{2}/.test(n.dateModified || '')) fail(rel, 'Article is missing dateModified');
          if (!/^\d{4}-\d{2}-\d{2}/.test(n.datePublished || '')) fail(rel, 'Article is missing datePublished');
        }
        if (/LocalBusiness|ProfessionalService/.test(t)) {
          if (!n.address || !n.address.addressLocality) fail(rel, `${t}: missing address`);
          if (n.geo) fail(rel, `${t}: geo must not be invented`);
        }
        if (t === 'FAQPage') {
          const norm = (x) => decode(String(x)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const visible = norm(body.replace(/<script[\s\S]*?<\/script>/gi, ''));
          for (const q of n.mainEntity || []) {
            if (!visible.includes(norm(q.name))) fail(rel, `FAQPage question not found in visible text: "${q.name.slice(0, 60)}"`);
            if (!visible.includes(norm(q.acceptedAnswer?.text))) fail(rel, `FAQPage answer not found in visible text for: "${q.name.slice(0, 60)}"`);
          }
        }
      });
    } catch (e) {
      fail(rel, `JSON-LD does not parse: ${e.message}`);
    }
  }

  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const missingAlt = imgs.filter((t) => !/\balt=/.test(t)).length;
  const text = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  const h1 = decode(((body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1]).replace(/<[^>]+>/g, '')).trim();
  rows.push({ page: rel, title: `${title} (${title.length})`, desc: `(${desc.length})`, canonical, h1, words, types: [...new Set(types)].join(', '), imgs: `${imgs.length}/${missingAlt}` });
}

if (process.argv.includes('--table')) {
  console.log('| page | title (len) | desc len | canonical | H1 | words | JSON-LD | imgs / missing alt |');
  console.log('|---|---|---|---|---|---|---|---|');
  const esc = (v) => String(v).replace(/\|/g, '\\|');
  for (const r of rows) console.log(`| ${esc(r.page)} | ${esc(r.title)} | ${esc(r.desc)} | ${esc(r.canonical)} | ${esc(r.h1)} | ${r.words} | ${r.types} | ${r.imgs} |`);
}

// ---- 404 page ----
if (existsSync(path.join(DIST, '404.html'))) {
  const h = readFileSync(path.join(DIST, '404.html'), 'utf8');
  if (!/^<!DOCTYPE html>/i.test(h)) fail('404.html', 'missing doctype');
  if (!/<meta[^>]+name="robots"[^>]+content="noindex/i.test(h)) fail('404.html', 'missing robots noindex');
  if (!/<a\b[^>]*href="\/services/i.test(h)) fail('404.html', 'does not link to key pages');
} else fail('404.html', 'not generated');

// ---- sitemap ----
if (existsSync(path.join(DIST, 'sitemap.xml'))) {
  const xml = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  const today = new Date().toISOString().slice(0, 10);
  if (locs.some((l) => /\/admin/.test(l))) fail('sitemap.xml', 'contains /admin URLs');
  if (/<priority>/.test(xml)) fail('sitemap.xml', 'contains <priority>');
  if (lastmods.length > 1 && new Set(lastmods).size === 1 && lastmods[0] === today) fail('sitemap.xml', 'every lastmod is the build date');
  for (const l of locs) {
    const p = new URL(l).pathname;
    const rel = p === '/' ? 'index.html' : `${p.slice(1)}.html`;
    if (!existsSync(path.join(DIST, rel)) && !existsSync(path.join(DIST, p.slice(1), 'index.html'))) fail('sitemap.xml', `${l} has no page in dist`);
  }
  for (const rel of pages.filter((r) => !noindexPages.has(r))) {
    const p = rel === 'index.html' ? '/' : `/${rel.replace(/\.html$/, '')}`;
    if (!locs.includes(`https://www.orianteleservices.com${p === '/' ? '/' : p}`)) fail('sitemap.xml', `public page ${p} missing from sitemap`);
  }
} else fail('sitemap.xml', 'not found in dist');

for (const rel of noindexPages) {
  const p = rel === 'index.html' ? '/' : `/${rel.replace(/\.html$/, '')}`;
  if (existsSync(path.join(DIST, 'sitemap.xml')) && readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8').includes(`${p}</loc>`)) fail(rel, 'noindex page is listed in the sitemap');
}
console.log(`verify-seo: checked ${pages.length - noindexPages.size} indexable pages (${noindexPages.size} noindex page(s) excluded: ${[...noindexPages].join(', ') || 'none'})`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  failures.forEach((f) => console.error(' - ' + f));
  process.exit(1);
}
console.log('verify-seo: all checks passed');
