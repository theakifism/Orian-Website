// Lightweight, dependency-free User-Agent parser. It doesn't try to be
// exhaustive (that's what ua-parser-js is for) — it just extracts the three
// things the admin dashboard shows: a friendly device name, browser, and OS.
// Kept server-side only (api/_lib), so it never touches the marketing bundle.

const DEVICE_PATTERNS = [
  [/iPhone/i, 'iPhone'],
  [/iPad/i, 'iPad'],
  [/Macintosh/i, 'Mac'],
  [/Android.*Mobile/i, 'Android phone'],
  [/Android/i, 'Android tablet'],
  [/Windows Phone/i, 'Windows phone'],
  [/Windows/i, 'Windows PC'],
  [/Linux/i, 'Linux PC'],
  [/CrOS/i, 'Chromebook'],
];

const BROWSER_PATTERNS = [
  [/Edg\/([\d.]+)/, 'Edge'],
  [/OPR\/([\d.]+)/, 'Opera'],
  [/Chrome\/([\d.]+)/, 'Chrome'],
  [/CriOS\/([\d.]+)/, 'Chrome'],
  [/FxiOS\/([\d.]+)/, 'Firefox'],
  [/Firefox\/([\d.]+)/, 'Firefox'],
  [/Version\/([\d.]+).*Safari/, 'Safari'],
  [/Safari\/([\d.]+)/, 'Safari'],
];

const OS_PATTERNS = [
  [/iPhone OS ([\d_]+)/, (m) => `iOS ${m[1].replace(/_/g, '.')}`],
  [/CPU OS ([\d_]+)/, (m) => `iOS ${m[1].replace(/_/g, '.')}`],
  [/Android ([\d.]+)/, (m) => `Android ${m[1]}`],
  [/Windows NT 10\.0/, () => 'Windows 10/11'],
  [/Windows NT ([\d.]+)/, (m) => `Windows ${m[1]}`],
  [/Mac OS X ([\d_]+)/, (m) => `macOS ${m[1].replace(/_/g, '.')}`],
  [/CrOS/, () => 'ChromeOS'],
  [/Linux/, () => 'Linux'],
];

function firstMatch(patterns, ua, wantVersion) {
  for (const [regex, nameOrFn] of patterns) {
    const m = ua.match(regex);
    if (m) {
      if (typeof nameOrFn === 'function') return nameOrFn(m);
      if (wantVersion && m[1]) return `${nameOrFn} ${m[1].split('.')[0]}`;
      return nameOrFn;
    }
  }
  return null;
}

// Returns { device, browser, os } — any field may be null if the UA is
// missing, unusual, or belongs to a bot/crawler.
export function parseUserAgent(userAgent) {
  const ua = userAgent || '';
  if (!ua) return { device: null, browser: null, os: null };

  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit/i.test(ua)) {
    return { device: 'Bot / crawler', browser: null, os: null };
  }

  return {
    device: firstMatch(DEVICE_PATTERNS, ua, false),
    browser: firstMatch(BROWSER_PATTERNS, ua, true),
    os: firstMatch(OS_PATTERNS, ua, false),
  };
}
