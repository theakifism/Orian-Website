import { SITE_NAME } from './siteConfig';

const clamp = (str, max) => (str.length <= max ? str : `${str.slice(0, max - 1).trimEnd()}…`);

/**
 * Builds a unique title/description for an /industries/:slug page from the
 * industry's own data (name + blurb). There are 24 industries, so these are
 * generated rather than hand-written — still unique per page and grounded
 * in real page content, just not hand-tuned to an exact character count
 * the way the primary keyword pages (home/services/service-detail) are.
 */
export const buildIndustryMeta = (industry) => {
  const title = clamp(`${industry.name} Bulk SMS & WhatsApp API | ${SITE_NAME}`, 60);
  const description = clamp(
    `${industry.blurb} ${SITE_NAME} delivers bulk SMS, voice API and WhatsApp API built for ${industry.name.toLowerCase()} businesses across India.`,
    160,
  );
  return { title, description };
};

/**
 * Same idea for /why-us/:slug pages, built from the reason's title + desc.
 */
export const buildWhyUsMeta = (reason) => {
  const title = clamp(`${reason.title} | Why Choose ${SITE_NAME}`, 60);
  const description = clamp(`${reason.desc} See why enterprises trust ${SITE_NAME} for bulk SMS, voice API and WhatsApp API delivery.`, 160);
  return { title, description };
};
