import { useEffect, useState } from 'react';

// How often an already-authenticated tab re-checks /api/admin/me. This is
// what makes "signed out because another device logged in" actually show up
// while someone is sitting on the dashboard, instead of only on next page
// load -- requireAdmin() (api/_lib/auth.js) starts rejecting the old
// device's token the moment a second device logs in; this poll is just how
// the open tab notices.
const RECHECK_MS = 2 * 60 * 1000;

const SIGNED_OUT_REASON_KEY = 'orian_admin_signed_out_reason';

// status: 'checking' | 'authenticated' | 'unauthenticated'
export default function useAdminAuth() {
  const [status, setStatus] = useState('checking');
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const check = (isInitial) => {
      fetch('/api/admin/me', { credentials: 'same-origin' })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Not authenticated');
          }
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
          setAdmin(data.admin);
          setStatus('authenticated');
        })
        .catch((err) => {
          if (cancelled) return;
          // Only worth explaining on the login screen if this was a
          // surprise -- i.e. a previously-authenticated tab suddenly
          // losing its session, not the very first check on page load.
          if (!isInitial && (err.message === 'session_superseded' || err.message === 'account_locked')) {
            try {
              sessionStorage.setItem(SIGNED_OUT_REASON_KEY, err.message);
            } catch {
              // sessionStorage can throw in some locked-down browser modes;
              // losing the explanatory message isn't worth failing sign-out over.
            }
          }
          setStatus('unauthenticated');
        });
    };

    check(true);
    const interval = setInterval(() => check(false), RECHECK_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { status, admin };
}
