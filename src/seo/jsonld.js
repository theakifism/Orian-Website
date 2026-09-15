import { SITE_URL, SITE_NAME, CONTACT, buildUrl } from './siteConfig';

/**
 * Organization schema — meant for the homepage only. Search engines use
 * this for the knowledge-panel style info (logo, name, contact) and to
 * disambiguate the brand in results.
 */
export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-full.png`,
  description:
    'Bulk SMS, voice API, DLT registration and WhatsApp Business API provider connecting enterprises to 1,200+ carrier routes across 180+ countries.',
  address: {
    '@type': 'PostalAddress',
    ...CONTACT.address,
  },
  contactPoint: CONTACT.phones.map((phone) => ({
    '@type': 'ContactPoint',
    telephone: phone,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  })),
  email: CONTACT.emails[0],
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
