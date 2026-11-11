// Single source for the site's list content (services, industries, why-us,
// use cases, guides). Plain JS with no JSX or browser APIs, so it can be
// imported by the React app, by routes.jsx (getStaticPaths) and by the
// Node-only scripts/generate-sitemap.mjs at build time.
import { services } from '../data/services.js';
import { industries } from '../data/industries.js';
import { whyUsData } from '../data/whyUs.js';
import { useCases } from '../data/useCases.js';
import { guides } from '../data/guides.js';

const COLLECTIONS = { services, industries, whyUs: whyUsData, useCases, guides };

/** buildData('services') -> the array that ships in src/data. */
export function buildData(name) {
  return COLLECTIONS[name] ?? [];
}
