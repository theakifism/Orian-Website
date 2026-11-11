import { SITE_URL, SITE_NAME, CONTACT, OFFICE_HOURS, buildUrl, socialProfileUrls, SECTION_LABELS } from './siteConfig';

/**
 * Organization schema — meant for the homepage only. Search engines use
 * this for the knowledge-panel style info (logo, name, contact) and to
 * disambiguate the brand in results.
 */
const ALL_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// The helpline is available 24/7.
const supportContactPoints = (contact) =>
  contact.phones.map((phone) => ({
    '@type': 'ContactPoint',
    telephone: phone,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
    hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ALL_WEEK, opens: '00:00', closes: '23:59' },
  }));

export const organizationSchema = (contact = CONTACT) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ['Orian', 'Orian Teleservices Bulk SMS'],
  url: SITE_URL,
  logo: `${SITE_URL}/logo-full.png`,
  description:
    'Bulk SMS, voice, DLT assistance and WhatsApp Business messaging services for businesses.',
  address: {
    '@type': 'PostalAddress',
    ...contact.address,
  },
  contactPoint: supportContactPoints(contact),
  email: contact.emails[0],
  ...(socialProfileUrls().length ? { sameAs: socialProfileUrls() } : {}),
  areaServed: { '@type': 'Country', name: 'India' },
  knowsAbout: ['Bulk SMS', 'OTP SMS API', 'DLT registration', 'Voice API and IVR', 'WhatsApp Business API'],
});

/**
 * LocalBusiness node for the Nagpur office (ProfessionalService is a schema.org LocalBusiness
 * subtype). No geo coordinates, ratings or price range are emitted: none are published.
 * Office opening hours are only emitted once OFFICE_HOURS is set in siteConfig.js.
 */
export const localBusinessSchema = (contact = CONTACT) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#localbusiness`,
  name: `${SITE_NAME}, Nagpur`,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  logo: `${SITE_URL}/logo-full.png`,
  telephone: contact.phones[0],
  email: contact.emails[0],
  address: { '@type': 'PostalAddress', ...contact.address },
  areaServed: { '@type': 'Country', name: 'India' },
  contactPoint: supportContactPoints(contact),
  ...(OFFICE_HOURS ? { openingHoursSpecification: OFFICE_HOURS.map((h) => ({ '@type': 'OpeningHoursSpecification', ...h })) } : {}),
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
});

/**
 * Service schema for an individual /services/:slug page.
 */
export const serviceSchema = (service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.title,
  description: service.overview || service.desc,
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  url: buildUrl(`/services/${service.slug}`),
  serviceType: service.title,
});

/**
 * FAQPage schema built from a service's real Q&A accordion content.
 * Only pass this in for pages that actually render that FAQ content —
 * structured data must match visible page content.
 */
export const faqSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
});

/**
 * WebSite schema (homepage only). Tells Google the site name and its
 * preferred name, which helps brand searches such as "orian".
 */
export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: 'Orian',
  inLanguage: 'en-IN',
  publisher: { '@id': `${SITE_URL}/#organization` },
});

/**
 * BreadcrumbList built automatically from the route path, so every
 * page gets breadcrumb rich results without per-page code.
 * Home > Section > Page   (or Home > Page for top-level routes).
 */
export const breadcrumbSchema = (path = '/', title = '') => {
  const segments = path.split('/').filter(Boolean);
  if (!segments.length) return null;
  const shortTitle = String(title).split(' | ')[0].trim() || segments[segments.length - 1];
  const items = [{ name: 'Home', url: buildUrl('/') }];
  if (segments.length > 1) {
    items.push({
      name: SECTION_LABELS[segments[0]] || segments[0],
      url: buildUrl(`/${segments[0]}`),
    });
  }
  items.push({ name: shortTitle, url: buildUrl(path) });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
};
