import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import RouteProgressBar from './RouteProgressBar';
import AnnouncementBanner from './AnnouncementBanner';
import FloatingActions from './o2/FloatingActions';
import { initAutoTracking } from '../utils/analytics';
import { prefetchRoute } from '../utils/routePrefetch';

/**
 * Shared page chrome: announcement bar, fixed nav, footer, floating mobile
 * actions. Rendered once as a layout route so the nav never remounts between
 * page navigations. Dark only (the <html> element carries the `dark` class).
 */
const Layout = () => {
  const location = useLocation();

  const prefetchLink = (event) => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || !event.currentTarget.contains(anchor)) return;
    if (event.type === 'pointerover' && anchor.contains(event.relatedTarget)) return;

    try {
      const url = new URL(anchor.href, window.location.href);
      if (url.origin === window.location.origin) prefetchRoute(url.pathname);
    } catch {
      // Invalid or non-standard hrefs are left to the browser's normal behavior.
    }
  };

  React.useEffect(() => initAutoTracking(), []);

  return (
    <div
      className="o2 min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[#00AEEF] selection:text-black overflow-x-clip"
      onPointerOver={prefetchLink}
      onPointerDown={prefetchLink}
      onFocusCapture={prefetchLink}
    >
      <ScrollToTop />
      <RouteProgressBar />
      <AnnouncementBanner />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main key={location.pathname} className="page-enter">
          <Outlet />
        </main>
        <Footer />
      </div>

      <FloatingActions />
    </div>
  );
};

export default Layout;
