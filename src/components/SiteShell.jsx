import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Preloader from './Preloader';
import useTrackVisit from '../hooks/useTrackVisit';

/**
 * Wraps every public-facing route (everything under Layout): drives the
 * first-load preloader animation and fires the visit-tracking beacon.
 * Unchanged in behavior from the previous inline version in App.jsx — only
 * moved out so it can sit as a layout route in the route-config that
 * vite-react-ssg needs (see src/routes.jsx).
 */
const SiteShell = () => {
  useTrackVisit();

  const [loadPhase, setLoadPhase] = useState('loading');

  useEffect(() => {
    const minDisplay = 1800;
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
      <Outlet />
    </>
  );
};

export default SiteShell;
