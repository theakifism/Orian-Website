// Start downloading a page's lazy chunk when a visitor shows intent to open it.
// The imports mirror the lazy route imports in routes.jsx; the browser shares
// the same module/chunk cache when React Router navigates moments later.
const exactLoaders = {
  '/about': () => import('../pages/AboutPage'),
  '/services': () => import('../pages/ServicesPage'),
  '/industries': () => import('../pages/IndustriesPage'),
  '/why-us': () => import('../pages/WhyUsPage'),
  '/use-cases': () => import('../pages/UseCasesPage'),
  '/compliance': () => import('../pages/CompliancePage'),
  '/developers': () => import('../pages/DevelopersPage'),
  '/status': () => import('../pages/StatusPage'),
  '/resources': () => import('../pages/ResourcesPage'),
  '/careers': () => import('../pages/CareersPage'),
  '/contact': () => import('../pages/ContactPage'),
  '/bulk-sms-service-nagpur': () => import('../pages/NagpurPage'),
  '/assistant': () => import('../pages/AssistantPage'),
  '/help-center': () => import('../pages/HelpCenterPage'),
  '/privacy': () => import('../pages/PrivacyPage'),
  '/terms': () => import('../pages/TermsPage'),
};

const detailLoaders = [
  ['/services/', () => import('../pages/ServiceDetailPage')],
  ['/industries/', () => import('../pages/IndustryDetailPage')],
  ['/why-us/', () => import('../pages/WhyUsDetailPage')],
  ['/use-cases/', () => import('../pages/UseCaseDetailPage')],
  ['/resources/', () => import('../pages/GuidePage')],
];

const pending = new Map();

export function prefetchRoute(pathname) {
  if (typeof pathname !== 'string' || (typeof navigator !== 'undefined' && navigator.connection?.saveData)) return;

  const path = pathname.replace(/\/+$/, '') || '/';
  const exact = exactLoaders[path];
  const detail = exact ? null : detailLoaders.find(([prefix]) => path.startsWith(prefix));
  const key = exact ? path : detail?.[0];
  const loader = exact || detail?.[1];
  if (!loader || pending.has(key)) return;

  const request = loader().catch(() => {
    // A speculative request should never surface an unhandled rejection.
    pending.delete(key);
  });
  pending.set(key, request);
}
