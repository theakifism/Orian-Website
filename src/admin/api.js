import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// GET helper for the admin API. Sends the session cookie, returns to the login
// page if the session ended, and flags the "run the migration" case.
//
// `loading` is derived (the data on screen belongs to a different url than the
// one requested), so changing the url shows the spinner without any
// synchronous state update inside the effect.
export function useApi(url, { enabled = true } = {}) {
  const navigate = useNavigate();
  const [nonce, setNonce] = useState(0); // bumped by reload() to fetch the same url again
  const [state, setState] = useState({ key: '', data: null, error: '', migration: false });
  const key = `${nonce}|${url}`;

  useEffect(() => {
    if (!enabled || !url) return undefined;
    let cancelled = false;
    (async () => {
      let next;
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (res.status === 401 || res.status === 423) {
          if (!cancelled) navigate('/admin/login', { replace: true });
          return;
        }
        const json = await res.json().catch(() => ({}));
        if (res.status === 503 && json.error === 'migration_required') {
          next = { key, data: null, error: '', migration: json.message || true };
        } else if (!res.ok) {
          next = { key, data: null, error: json.error || 'Something went wrong. Please try again.', migration: false };
        } else {
          next = { key, data: json, error: '', migration: Boolean(json.migrationRequired) };
        }
      } catch {
        next = { key, data: null, error: 'Could not reach the server.', migration: false };
      }
      if (!cancelled) setState(next);
    })();
    return () => { cancelled = true; };
  }, [key, url, enabled, navigate]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const loading = enabled && state.key !== key;
  // While a new request is in flight the previous result stays on screen (no flash of empty).
  return { data: state.data, error: loading ? '' : state.error, loading, migration: state.migration, reload };
}

// POST/PATCH/DELETE helper. Resolves to { ok, data, error }.
export async function sendJson(url, method, body) {
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok ? { ok: true, data } : { ok: false, data, error: data.message || data.error || 'Something went wrong.' };
  } catch {
    return { ok: false, data: {}, error: 'Could not reach the server.' };
  }
}
