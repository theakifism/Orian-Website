import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ScrollFXProvider } from './context/ScrollFXContext';
import Layout from './components/Layout';
import SiteShell from './components/SiteShell';

import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import IndustriesPage from './pages/IndustriesPage';
import IndustryDetailPage from './pages/IndustryDetailPage';
import WhyUsPage from './pages/WhyUsPage';
import WhyUsDetailPage from './pages/WhyUsDetailPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import AssistantPage from './pages/AssistantPage';
import NotFoundPage from './pages/NotFoundPage';

import { services } from './data/services';
import { industries } from './data/industries';
import { whyUsData } from './data/whyUs';

const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminRoute = lazy(() => import('./admin/AdminRoute'));

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-dim)] text-sm">
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
    <Outlet />
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
            <AdminLogin />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminRoute />
          </Suspense>
        ),
      },
      {
        // Everything below this is the public site: same Preloader +
        // visit-tracking shell as before, then the shared Layout chrome
        // (nav/footer/background), then the actual page content.
        element: <SiteShell />,
        children: [
          {
            element: <Layout />,
            children: [
              { index: true, element: <Home /> },
              { path: 'about', element: <AboutPage /> },

              { path: 'services', element: <ServicesPage /> },
              {
                path: 'services/:slug',
                element: <ServiceDetailPage />,
                // Tells vite-react-ssg which concrete URLs to prerender for
                // this dynamic route — one static HTML file per service.
                getStaticPaths: () => services.map((s) => `services/${s.slug}`),
              },

              { path: 'industries', element: <IndustriesPage /> },
              {
                path: 'industries/:slug',
                element: <IndustryDetailPage />,
                getStaticPaths: () => industries.map((i) => `industries/${i.slug}`),
              },

              { path: 'why-us', element: <WhyUsPage /> },
              {
                path: 'why-us/:slug',
                element: <WhyUsDetailPage />,
                getStaticPaths: () => whyUsData.map((w) => `why-us/${w.slug}`),
              },

              { path: 'careers', element: <CareersPage /> },
              { path: 'contact', element: <ContactPage /> },
              { path: 'assistant', element: <AssistantPage /> },

              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
];
