// Analytics hooks, heatmap-ready. No vendor is bundled: every event is
//  1. pushed to window.dataLayer (Google Tag Manager style),
//  2. dispatched as a DOM CustomEvent 'orian:track' so any tool (Plausible,
//     PostHog, Clarity, Hotjar, GA4) can subscribe from the page or from a tag manager.
//
// Markup convention: add data-track="cta_talk_to_us" (and optional
// data-track-label, data-track-section) to any element and a click is sent
// automatically by initAutoTracking(). Scroll depth (25/50/75/100) is sent too.

export function track(event, props = {}) {
  if (typeof window === 'undefined') return;
  const payload = { event, path: window.location.pathname, ts: Date.now(), ...props };
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('orian:track', { detail: payload }));
  } catch {
    // tracking must never break the page
  }
}

let started = false;
export function initAutoTracking() {
  if (typeof window === 'undefined' || started) return () => {};
  started = true;

  const onClick = (e) => {
    const el = e.target.closest?.('[data-track]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    track(el.getAttribute('data-track'), {
      label: el.getAttribute('data-track-label') || (el.textContent || '').trim().slice(0, 60),
      section: el.closest('[data-section]')?.getAttribute('data-section') || undefined,
      // click position inside the viewport helps click-map style heatmaps
      x: Math.round(e.clientX),
      y: Math.round(e.clientY + window.scrollY),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
    });
  };

  const seen = new Set();
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      [25, 50, 75, 100].forEach((mark) => {
        const key = `${window.location.pathname}:${mark}`;
        if (pct >= mark - 1 && !seen.has(key)) {
          seen.add(key);
          track('scroll_depth', { depth: mark });
        }
      });
    });
  };

  document.addEventListener('click', onClick, { capture: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    document.removeEventListener('click', onClick, { capture: true });
    window.removeEventListener('scroll', onScroll);
    started = false;
  };
}
