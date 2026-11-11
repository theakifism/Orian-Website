import { useCallback, useEffect, useRef, useState } from 'react';
import { Arrow, Close } from './o2/Icons';

const DISMISSED_KEY = 'orian-dismissed-announcement';
const OPEN_DELAY_MS = 900; // let the page paint first, then bring the popup in
const EXIT_MS = 220;

/**
 * The popup itself. Used by the live site (<AnnouncementBanner />) and by the
 * admin panel's "Preview popup" button, so what you preview is what visitors get.
 *
 * Accessible modal: labelled dialog, Esc / backdrop / Continue close it, focus
 * moves to the Continue button and is trapped, page scroll is locked, and focus
 * returns to where it was. The looping animations are switched off for people
 * who prefer reduced motion (see .o2-pop in styles/o2-site.css).
 */
export const AnnouncementDialog = ({ announcement, onClose }) => {
  const ref = useRef(null);
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing((already) => {
      if (!already) window.setTimeout(onClose, EXIT_MS);
      return true;
    });
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement;
    const node = ref.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.querySelector('[data-autofocus]')?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll('button:not([disabled])'));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!node.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [close]);

  return (
    <div
      className={`o2 o2-scrim o2-pop-scrim${closing ? ' is-closing' : ''}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        ref={ref}
        className="o2-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="o2-pop-kicker"
        aria-describedby="o2-pop-msg"
      >
        <button type="button" className="o2-x o2-pop-x" onClick={close} aria-label="Close announcement">
          <Close width="14" height="14" />
        </button>

        <div className="o2-pop-inner">
          <div className="o2-pop-orb" aria-hidden="true">
            <span className="o2-pop-ring" />
            <span className="o2-pop-ring is-late" />
            <span className="o2-pop-emoji">{announcement.emoji || '📣'}</span>
          </div>

          <p id="o2-pop-kicker" className="o2-eyebrow o2-pop-kicker"><i /> Announcement</p>
          <p id="o2-pop-msg" className="o2-pop-msg">{announcement.message}</p>

          <button type="button" className="o2-btn o2-btn-primary o2-pop-cta" onClick={close} data-autofocus>
            Continue <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Site-wide announcement popup. Reads /api/announcement (managed from the admin
 * panel), opens once per announcement after the page has loaded, and stays
 * dismissed for that announcement once the visitor continues. Renders nothing
 * when there is no active announcement.
 */
const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer;
    fetch('/api/announcement')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.announcement) return;
        let dismissed = null;
        try { dismissed = window.localStorage.getItem(DISMISSED_KEY); } catch { /* ignore */ }
        if (dismissed === data.announcement.id) return;
        setAnnouncement(data.announcement);
        timer = window.setTimeout(() => { if (!cancelled) setOpen(true); }, OPEN_DELAY_MS);
      })
      .catch(() => {
        // No announcement is not an error worth surfacing to visitors.
      });
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    if (announcement) {
      try { window.localStorage.setItem(DISMISSED_KEY, announcement.id); } catch { /* ignore */ }
    }
  }, [announcement]);

  if (!open || !announcement) return null;
  return <AnnouncementDialog announcement={announcement} onClose={dismiss} />;
};

export default AnnouncementBanner;
