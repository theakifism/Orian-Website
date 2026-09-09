import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ParticleNetworkBG from './ParticleNetworkBG';
import ScrollEdgeBlur from './ScrollEdgeBlur';
import ScrollToTop from './ScrollToTop';
import RouteProgressBar from './RouteProgressBar';
import useTheme from '../hooks/useTheme';

/**
 * Shared page chrome: the animated background, the fixed nav, the
 * scroll-edge blur vignette, and the footer. Used as a React Router layout
 * route (rendered once, with <Outlet/> swapping in the matched page) so the
 * background canvas and nav never remount/flicker between page navigations
 * -- only the page content underneath changes.
 */
const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent text-[var(--text)] font-sans selection:bg-[#00AEEF] selection:text-black overflow-x-hidden">
      <ScrollToTop />
      <RouteProgressBar />

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <ParticleNetworkBG />
      </div>

      <ScrollEdgeBlur />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav theme={theme} onToggleTheme={toggleTheme} />
        <main key={location.pathname} className="page-enter">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;