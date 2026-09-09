import { useEffect } from 'react';

const SESSION_FLAG = 'orian-visit-logged';

// Fires once per browser tab session (guarded by sessionStorage, not just a
// ref, so a refresh doesn't re-count but a genuinely new visit later does).
export default function useTrackVisit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(SESSION_FLAG)) return;

    window.sessionStorage.setItem(SESSION_FLAG, '1');

    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {
      // Tracking is best-effort — a failed beacon should never surface to the visitor.
    });
  }, []);
}
