import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import RouteProgressBar from './RouteProgressBar';
import AnnouncementBanner from './AnnouncementBanner';
import FloatingActions from './o2/FloatingActions';
import LeadSection from './o2/LeadSection';
import { initAutoTracking } from '../utils/analytics';

// The bottom "Tell us what you send" form only appears on sales / product
// pages (and their sub-pages). It is hidden everywhere else: Home and
// Contact already have their own form, and Careers, Privacy, Terms, Status,
// Help Center, the assistant and the 404 page have no reason to show it.
const LEAD_FORM_PATHS = [
  '/about',
  '/services',
  '/industries',
  '/why-us',
  '/use-cases',
  '/compliance',
  '/developers',
  '/resources',
];

const showLeadForm = (pathname) => {
  const p = pathname.replace(/\/+$/, '') || '/';
  return LEAD_FORM_PATHS.some((base) => p === base || p.startsWith(`${base}/`));
};

/**
 * Shared page chrome: announcement bar, fixed nav, footer, floating mobile
 * actions. Rendered once as a layout route so the nav never remounts between
 * page navigations. Dark only (the <html> element carries the `dark` class).
 */
const Layout = () => {
  const location = useLocation();

  React.useEffect(() => initAutoTracking(), []);

  return (
    <div className="o2 min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[#00AEEF] selection:text-black overflow-x-clip">
      <ScrollToTop />
      <RouteProgressBar />
      <AnnouncementBanner />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main key={location.pathname} className="page-enter">
          <Outlet />
        </main>
        {showLeadForm(location.pathname) && <LeadSection />}
        <Footer />
      </div>

      <FloatingActions />
    </div>
  );
};

export default Layout;