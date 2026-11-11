import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useTrackVisit from '../hooks/useTrackVisit';
import TypingPreloader from './TypingPreloader';

/**
 * Wraps every public-facing route (everything under Layout): shows the
 * branded typing preloader on first paint, and fires the visit-tracking
 * beacon. Content is already static-rendered (vite-react-ssg), so the
 * preloader is a short, fixed-duration branded beat, not a real wait.
 */
const SiteShell = () => {
  useTrackVisit();

  // The public site is dark-only. The admin area has its own light/dark
  // toggle that can remove this class during a client-side session, so
  // re-assert it whenever a public route mounts.
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <TypingPreloader />
      <Outlet />
    </>
  );
};

export default SiteShell;
