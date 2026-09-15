// Single source of truth for SEO-related site facts. Change SITE_URL once
// you know the real production domain and every canonical URL, sitemap
// entry, and Open Graph tag picks it up automatically.
//
// IMPORTANT: replace SITE_URL below with the real production domain
// (e.g. the Vercel domain or a custom domain) before deploying.
export const SITE_URL = 'https://www.orianteleservices.com';

export const SITE_NAME = 'Orian Teleservices';

export const DEFAULT_TITLE = 'Orian Teleservices | Bulk SMS, Voice & WhatsApp API';
export const DEFAULT_DESCRIPTION =
  "Orian Teleservices is a bulk SMS provider and API platform offering voice API, WhatsApp Business API and DLT registration across 1,200+ carrier routes.";

// Used as the fallback og:image / twitter:image for any page that doesn't
// set its own. Absolute URL required by the OG/Twitter spec.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-full.png`;

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

export const buildUrl = (path = '/') => {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${SITE_URL}${clean || '/'}`;
};
