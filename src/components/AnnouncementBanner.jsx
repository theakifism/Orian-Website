import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'orian-dismissed-announcement';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/announcement')
      .then((res) => res.json())
      .then((data) => {
        if (!data.announcement) return;
        const dismissedId = window.localStorage.getItem(DISMISSED_KEY);
        if (dismissedId === data.announcement.id) return;
        setAnnouncement(data.announcement);
        setVisible(true);
      })
      .catch(() => {
        // No announcement is not an error worth surfacing to visitors.
      });
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (announcement) {
      window.localStorage.setItem(DISMISSED_KEY, announcement.id);
    }
  };

  if (!visible || !announcement) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] max-w-[92vw] sm:max-w-md w-full px-4"
    >
      <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-ambient)] px-4 py-3 backdrop-blur-md">
        {announcement.emoji && <span className="text-xl shrink-0">{announcement.emoji}</span>}
        <p className="text-sm text-[var(--text)] flex-1">{announcement.message}</p>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="text-[var(--text-faint)] hover:text-[var(--text)] transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
