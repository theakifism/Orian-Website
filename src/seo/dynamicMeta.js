import { SITE_NAME } from './siteConfig';

// Hand-written metadata lives on each data entry (metaTitle / metaDescription in
// src/data/industries.js and whyUs.js). The fallbacks below are only a safety net for
// an entry added without metadata; they never truncate with an ellipsis.
export const buildIndustryMeta = (industry) => ({
  title: industry.metaTitle || `${industry.name} Bulk SMS API | ${SITE_NAME}`,
  description:
    industry.metaDescription ||
    `${industry.blurb} Talk to ${SITE_NAME} about bulk SMS, voice API and WhatsApp API for ${industry.name}.`,
});

export const buildWhyUsMeta = (reason) => ({
  title: reason.metaTitle || `${reason.title} | ${SITE_NAME}`,
  description:
    reason.metaDescription ||
    `${reason.desc} See why businesses choose ${SITE_NAME} for bulk SMS, voice API and WhatsApp API.`,
});
