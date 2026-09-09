import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollFXProvider } from './context/ScrollFXContext';
import Layout from './components/Layout';
import Preloader from './components/Preloader';
import useTrackVisit from './hooks/useTrackVisit';

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

const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminRoute = lazy(() => import('./admin/AdminRoute'));

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-dim)] text-sm">
    Loading…
  </div>
);

/**
 * Everything that isn't the admin console: the preloader splash, visit
 * tracking, and the full page tree under the shared `Layout`. Kept as its
 * own component (rather than inline in App) so the preloader/visit-tracking
 * effects only ever run for the public marketing site, never for /admin.
 */
function SiteShell() {
  useTrackVisit();

  // 'loading' -> shows the preloader | 'exiting' -> preloader fades out
  // | 'done' -> preloader is unmounted and the site is fully interactive.
  const [loadPhase, setLoadPhase] = useState('loading');

  useEffect(() => {
    const minDisplay = 1800; // ms — lets the "A" mark animation actually play out
    const start = Date.now();

    const beginExit = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(minDisplay - elapsed, 0);
      window.setTimeout(() => setLoadPhase('exiting'), remaining);
    };

    if (document.readyState === 'complete') {
      beginExit();
    } else {
      window.addEventListener('load', beginExit);
      return () => window.removeEventListener('load', beginExit);
    }
  }, []);

  useEffect(() => {
    if (loadPhase !== 'exiting') return undefined;
    const timer = window.setTimeout(() => setLoadPhase('done'), 700);
    return () => window.clearTimeout(timer);
  }, [loadPhase]);

  useEffect(() => {
    document.body.style.overflow = loadPhase === 'done' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loadPhase]);

  return (
    <>
      {loadPhase !== 'done' && <Preloader exiting={loadPhase === 'exiting'} />}

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />

          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/:slug" element={<IndustryDetailPage />} />

          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/why-us/:slug" element={<WhyUsDetailPage />} />

          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/assistant" element={<AssistantPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollFXProvider>
        <Routes>
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminRoute />
              </Suspense>
            }
          />
          <Route path="/*" element={<SiteShell />} />
        </Routes>
      </ScrollFXProvider>
    </BrowserRouter>
  );
}

export default App;
