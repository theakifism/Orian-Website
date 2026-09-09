import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A slim gradient bar across the very top of the viewport that sweeps in
 * on every route change (skipped on first load). On a client-rendered SPA
 * there's no real network request to show progress for, but the visual
 * cue is what makes navigation *read* as "a new page just loaded" instead
 * of "something on this page changed."
 */
const RouteProgressBar = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    setVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setVisible(false), 480);
    return () => window.clearTimeout(hideTimer.current);
  }, [location.pathname]);

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 h-[3px] z-[60] bg-linear-to-r from-[#00AEEF] via-purple-400 to-[#E8A23D] ${
        visible ? 'route-bar-run' : 'w-0 opacity-0'
      }`}
    />
  );
};

export default RouteProgressBar;
