import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Fires one visit beacon per page actually viewed — including client-side
// route changes, not just the first page of a tab session — so "Top pages"
// in the admin panel reflects everywhere people go, not just where they
// landed. A ref (not sessionStorage) guards against StrictMode/re-render
// double-firing the SAME path; navigating to a different path always logs.
export default function useTrackVisit() {
  const location = useLocation();
  const lastLogged = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = location.pathname;
    if (lastLogged.current === path) return;
    lastLogged.current = path;

    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {
      // Tracking is best-effort — a failed beacon should never surface to the visitor.
    });
  }, [location.pathname]);
}
