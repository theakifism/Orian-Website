import React, { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

// Never cut an emoji / surrogate pair in half.
const safeSlice = (s, n) => {
  if (n >= s.length) return s;
  const c = s.charCodeAt(n - 1);
  return c >= 0xd800 && c <= 0xdbff ? s.slice(0, n + 1) : s.slice(0, n);
};

/**
 * Typewriter for streamed answers.
 *
 * The server may deliver text in a few large chunks (or all at once). Instead
 * of printing chunks as they land, the visible length chases the received
 * length at an adaptive speed: a steady base pace, accelerating smoothly when
 * the backlog is large so it never lags far behind, and easing back to the
 * base pace as it catches up. Output therefore looks evenly typed whatever the
 * chunking.
 *
 *  - blinking caret + soft glow while text is still arriving or being typed
 *  - both settle away once the stream is `done` AND everything is revealed
 *  - `animate={false}` or prefers-reduced-motion shows text immediately
 */
const TypewriterText = ({ text, done, animate = true, onProgress }) => {
  const reduce = useReducedMotion();
  const instant = !animate || reduce;
  const [shown, setShown] = useState(instant ? text.length : 0);
  const pos = useRef(instant ? text.length : 0);
  const progressRef = useRef(onProgress);

  useEffect(() => {
    progressRef.current = onProgress;
  });

  useEffect(() => {
    const len = text.length;
    if (instant) {
      pos.current = len;
      progressRef.current?.();
      return undefined;
    }
    if (pos.current >= len) return undefined;

    let raf = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      const backlog = len - pos.current;
      const cps = Math.min(420, 38 + backlog * 0.85); // chars per second
      pos.current = Math.min(len, pos.current + (cps * dt) / 1000);
      setShown(Math.floor(pos.current));
      progressRef.current?.();
      if (pos.current < len) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, instant]);

  const visible = instant ? text.length : Math.min(shown, text.length);
  const active = !done || visible < text.length;

  return (
    <span className={`o2-tw${active ? ' is-live' : ''}`}>
      {safeSlice(text, visible)}
      {active && <span className="o2-caret" aria-hidden="true" />}
    </span>
  );
};

export default TypewriterText;
