import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// Below this width we treat the device as "mobile" and turn off scroll/hover
// driven motion (3D reveals, tilt, floating/spinning background effects).
// Kept in one place so every consumer agrees on the same breakpoint.
const MOBILE_BREAKPOINT = 768;

const getReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
};

const ScrollFXContext = createContext({
  direction: 'down',
  atTop: true,
  atBottom: false,
  reduceMotion: false,
});

export const useScrollFX = () => useContext(ScrollFXContext);

export const ScrollFXProvider = ({ children }) => {
  const [state, setState] = useState({
    direction: 'down',
    atTop: true,
    atBottom: false,
    reduceMotion: getReduceMotion(),
  });

  // Mutable, non-reactive scroll position. Nothing outside this provider
  // needs the raw pixel value on every frame -- only direction/atTop/atBottom
  // ever change the UI -- so keeping it in a ref (instead of state) means we
  // don't re-render every Reveal/TiltCard/etc. on the page on every single
  // scroll tick, which was the main source of scroll jank.
  const lastY = useRef(0);
  const ticking = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const EDGE = 24; // px tolerance for "at top/bottom"

    const measure = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const viewport = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const prev = stateRef.current;
      const direction = y > lastY.current ? 'down' : y < lastY.current ? 'up' : prev.direction;
      const atTop = y <= EDGE;
      const atBottom = y + viewport >= docHeight - EDGE;

      lastY.current = y;
      ticking.current = false;

      if (prev.direction === direction && prev.atTop === atTop && prev.atBottom === atBottom) {
        return;
      }

      setState((current) => ({ ...current, direction, atTop, atBottom }));

      // Expose as CSS custom props too, handy for pure-CSS tweaks.
      document.documentElement.dataset.scrollDir = direction;
      document.documentElement.dataset.atTop = String(atTop);
      document.documentElement.dataset.atBottom = String(atBottom);
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const applyMotionPref = () => {
      setState((current) => {
        const next = mql.matches;
        if (current.reduceMotion === next) return current;
        return { ...current, reduceMotion: next };
      });
    };

    applyMotionPref();

    // Safari < 14 only supports addListener/removeListener.
    if (mql.addEventListener) {
      mql.addEventListener('change', applyMotionPref);
      return () => mql.removeEventListener('change', applyMotionPref);
    }
    mql.addListener(applyMotionPref);
    return () => mql.removeListener(applyMotionPref);
  }, []);

  return <ScrollFXContext.Provider value={state}>{children}</ScrollFXContext.Provider>;
};

export default ScrollFXContext;
