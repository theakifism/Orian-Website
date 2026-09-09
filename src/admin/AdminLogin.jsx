import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Same public site key + widget-loading pattern already used on the public
// Special Requirement form (see src/components/SpecialRequirement.jsx) --
// reusing one Cloudflare Turnstile site key across multiple forms on the
// same site is normal and expected, no second key needed. Leaving
// VITE_TURNSTILE_SITE_KEY unset disables the widget (and the server skips
// verification too, see api/_lib/turnstile.js), so this never blocks
// sign-in for a site that hasn't set Turnstile up yet.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  // Lazy initializer (not an effect) so this reads sessionStorage exactly
  // once, synchronously, before first paint -- shows a one-time explanation
  // if we landed here because a background session check found the account
  // signed in elsewhere or locked (see useAdminAuth.js). Without this,
  // getting bounced to the login page with a generic empty form is
  // confusing.
  const [error, setError] = useState(() => {
    let reason;
    try {
      reason = sessionStorage.getItem('orian_admin_signed_out_reason');
      if (reason) sessionStorage.removeItem('orian_admin_signed_out_reason');
    } catch {
      reason = null;
    }
    if (reason === 'session_superseded') return 'You were signed out because this account signed in on another device.';
    if (reason === 'account_locked') return 'This account is temporarily locked after repeated failed attempts.';
    return '';
  });
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return undefined;
    }

    const existing = document.getElementById('cf-turnstile-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        renderWidget();
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the verification check.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || 'Login failed.');
        // A stale/used token can't be resubmitted -- reset the widget so the
        // employee can retry without a confusing "verification failed" loop.
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
        setTurnstileToken('');
        return;
      }
      navigate('/admin', { replace: true });
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4 overflow-hidden">
      {/* Ambient brand-colored glow, matching the marketing site's aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AEEF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-8 shadow-[0_25px_70px_-20px_rgba(0,174,239,0.25)]"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo-full.png"
            alt="Orian"
            className="h-10 w-auto object-contain mb-4"
          />
          <h1 className="text-xl font-bold mb-1">Orian admin</h1>
          <p className="text-sm text-[var(--text-dim)]">Employee sign-in only.</p>
        </div>

        <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoFocus
          className="w-full mb-4 bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00AEEF]"
        />

        <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00AEEF]"
        />

        {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className="mb-6 flex justify-center" />}

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#00AEEF] hover:bg-[#E8A23D] text-black font-semibold py-3 rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(0,174,239,0.3)] hover:shadow-[0_0_20px_rgba(232,162,61,0.6)] disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
