import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { ScrollFXProvider } from './context/ScrollFXContext';
import { LangProvider } from './context/LangContext';
import { UIProvider } from './context/UIContext';
import Layout from './components/Layout';
import SiteShell from './components/SiteShell';
import { ContentProvider } from './content';
import { buildData } from './content/build-data';

import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';



// Route-level code splitting: each public page is its own chunk, loaded when the route is
// visited. vite-react-ssg resolves lazy routes at build time, so every page is still
// prerendered to full HTML. Home stays eager because it is the usual entry point.
const page = (loader) => ({
  lazy: async () => ({ Component: (await loader()).default }),
});

const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminRoute = lazy(() => import('./admin/AdminRoute'));

// Keeps the admin panel out of search results (robots.txt also blocks /admin).
const NoIndex = () => (
  <Head>
    <title>Admin | Orian Teleservices</title>
    <meta name="robots" content="noindex, nofollow, noarchive" />
  </Head>
);

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-(--bg) text-(--text-dim) text-sm">
    Loading…
  </div>
);

// Wraps the whole app the same way the old App.jsx's <BrowserRouter> +
// <ScrollFXProvider> did. vite-react-ssg supplies the router itself
// (BrowserRouter on the client, a static router at build time) — this is
// just the provider tree that used to sit inside it. Per-page <title>/meta/
// JSON-LD is handled by src/seo/Seo.jsx via vite-react-ssg's own <Head>
// component, which needs no extra provider here.
const RootLayout = () => (
  <ScrollFXProvider>
    <LangProvider>
      <UIProvider>
        <ContentProvider>
          <Outlet />
        </ContentProvider>
      </UIProvider>
    </LangProvider>
  </ScrollFXProvider>
);

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'admin/login',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <NoIndex />
            <AdminLogin />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <NoIndex />
            <AdminRoute />
          </Suspense>
        ),
      },
      {
        // Everything below this is the public site: visit-tracking shell,
        // then the shared Layout chrome (nav/footer), then page content.
        element: <SiteShell />,
        children: [
          {
            element: <Layout />,
            children: [
              { index: true, element: <Home /> },
              { path: 'about', ...page(() => import('./pages/AboutPage')) },

              { path: 'services', ...page(() => import('./pages/ServicesPage')) },
              {
                path: 'services/:slug',
                ...page(() => import('./pages/ServiceDetailPage')),
                // Tells vite-react-ssg which concrete URLs to prerender for
                // this dynamic route — one static HTML file per service.
                getStaticPaths: () => buildData('services').map((s) => `services/${s.slug}`),
              },

              { path: 'industries', ...page(() => import('./pages/IndustriesPage')) },
              {
                path: 'industries/:slug',
                ...page(() => import('./pages/IndustryDetailPage')),
                getStaticPaths: () => buildData('industries').map((i) => `industries/${i.slug}`),
              },

              { path: 'why-us', ...page(() => import('./pages/WhyUsPage')) },
              {
                path: 'why-us/:slug',
                ...page(() => import('./pages/WhyUsDetailPage')),
                getStaticPaths: () => buildData('whyUs').map((w) => `why-us/${w.slug}`),
              },

              { path: 'use-cases', ...page(() => import('./pages/UseCasesPage')) },
              {
                path: 'use-cases/:slug',
                ...page(() => import('./pages/UseCaseDetailPage')),
                getStaticPaths: () => buildData('useCases').map((u) => `use-cases/${u.slug}`),
              },
              { path: 'compliance', ...page(() => import('./pages/CompliancePage')) },
              { path: 'developers', ...page(() => import('./pages/DevelopersPage')) },
              { path: 'status', ...page(() => import('./pages/StatusPage')) },
              {
                path: 'resources/:slug',
                ...page(() => import('./pages/GuidePage')),
                getStaticPaths: () => buildData('guides').map((g) => `resources/${g.slug}`),
              },
              { path: 'careers', ...page(() => import('./pages/CareersPage')) },
              { path: 'contact', ...page(() => import('./pages/ContactPage')) },
              { path: 'bulk-sms-service-nagpur', ...page(() => import('./pages/NagpurPage')) },
              { path: 'assistant', ...page(() => import('./pages/AssistantPage')) },
              { path: 'help-center', ...page(() => import('./pages/HelpCenterPage')) },
              { path: 'resources', ...page(() => import('./pages/ResourcesPage')) },
              { path: 'privacy', ...page(() => import('./pages/PrivacyPage')) },
              { path: 'terms', ...page(() => import('./pages/TermsPage')) },

              { path: '404', element: <NotFoundPage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
];
