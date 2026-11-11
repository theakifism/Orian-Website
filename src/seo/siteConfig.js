// Single source of truth for SEO-related site facts. Change SITE_URL once
// you know the real production domain and every canonical URL, sitemap
// entry, and Open Graph tag picks it up automatically.
//
// IMPORTANT: replace SITE_URL below with the real production domain
// (e.g. the Vercel domain or a custom domain) before deploying.
export const SITE_URL = 'https://www.orianteleservices.com';

export const SITE_NAME = 'Orian Teleservices';

export const DEFAULT_TITLE = 'Orian Teleservices | Bulk SMS Service Provider in India';
export const DEFAULT_DESCRIPTION =
  "Orian Teleservices is a bulk SMS service provider in India: DLT-compliant bulk SMS, OTP SMS API, voice API and WhatsApp Business API with delivery reports.";

// Used as the fallback og:image / twitter:image for any page that doesn't
// set its own. Absolute URL required by the OG/Twitter spec. 1200x630 (the
// size social platforms expect) with the wordmark centered on the brand
// background -- raw logo-full.png is 794x269 (~2.95:1), far off the
// ~1.91:1 ratio platforms expect, so it was getting cropped oddly in link
// previews.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const CONTACT = {
  phones: ['+919552556786', '+919552501029', '+919850087786'],
  emails: ['orianteleservices@gmail.com', 'support@orian.in'],
  address: {
    streetAddress: 'Plot no 2, Kgn Nagar, near St Joseph School, Godhni',
    addressLocality: 'Nagpur',
    addressRegion: 'Maharashtra',
    postalCode: '441123',
    addressCountry: 'IN',
  },
};

// Official profile URLs for Organization.sameAs. TODO(content): fill in the real URLs.
// Empty strings are ignored and the sameAs property is omitted entirely when none are set,
// so no URL is ever invented.
export const SOCIAL_PROFILES = {
  linkedin: '',
  x: '',
  facebook: '',
  youtube: '',
};
export const socialProfileUrls = () =>
  Object.values(SOCIAL_PROFILES).filter((u) => typeof u === 'string' && /^https:\/\//.test(u.trim()));

// Office opening hours for the LocalBusiness node, as schema.org OpeningHoursSpecification
// objects, e.g. [{ dayOfWeek: ['Monday','Tuesday'], opens: '10:00', closes: '18:00' }].
// Contact hours are not published, so contact-point hours are omitted.
// anywhere, so none are emitted until you supply them.
export const OFFICE_HOURS = null;

export const buildUrl = (path = '/') => {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${SITE_URL}${clean || '/'}`;
};

export const LOCALE = 'en_IN';
export const OG_IMAGE_ALT = 'Orian Teleservices: bulk SMS service provider and OTP API in India';

// Friendly names used for the automatic BreadcrumbList schema.
export const SECTION_LABELS = {
  services: 'Services',
  industries: 'Industries',
  'why-us': 'Why Us',
  'use-cases': 'Use Cases',
  resources: 'Resources',
};

// Section-specific social preview images (public/og/<key>.png, made by scripts/generate-og.mjs).
// First path segment -> image key. Anything not listed falls back to DEFAULT_OG_IMAGE.
const OG_SECTIONS = {
  services: 'services',
  industries: 'industries',
  'use-cases': 'use-cases',
  'why-us': 'why-us',
  resources: 'resources',
  'help-center': 'resources',
  developers: 'developers',
  compliance: 'compliance',
  about: 'about',
  'bulk-sms-service-nagpur': 'local',
};
export const ogImageFor = (path = '/') => {
  const key = OG_SECTIONS[String(path).split('/').filter(Boolean)[0]];
  return key ? `${SITE_URL}/og/${key}.png` : DEFAULT_OG_IMAGE;
};
