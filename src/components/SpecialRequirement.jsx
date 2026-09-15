import React, { useEffect, useMemo, useRef, useState } from 'react';

const requirementTypes = [
  'Bulk SMS & OTP Gateway',
  'Voice SMS & IVR',
  'DLT Assistance & Compliance',
  'WhatsApp Business API',
  'Custom / Enterprise Solution',
  'Other',
];

// Brand palette pulled from the Orian "A" mark, used for the confetti burst.
const CONFETTI_COLORS = ['#00AEEF', '#E8A23D', '#a855f7', '#34d399', '#ec4899', '#facc15', '#f97316'];

const initialForm = {
  name: '',
  email: '',
  contact: '',
  company: '',
  requirementType: requirementTypes[0],
  message: '',
};

// Public site key for Cloudflare Turnstile (free anti-spam widget). Safe to
// expose — only the TURNSTILE_SECRET_KEY (verified server-side) is secret.
// Leave VITE_TURNSTILE_SITE_KEY unset to disable the widget entirely.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const SpecialRequirement = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Lazily loads Cloudflare's Turnstile script (invisible/managed widget)
  // only on the page that needs it, so the rest of the marketing bundle
  // stays untouched. Renders once the script is ready, resets the token on
  // expiry so a stale token can never slip through.
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
      setTurnstileReady(true);
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

  // Regenerates a fresh randomized confetti burst every time the form
  // transitions into the success state.
  const confettiPieces = useMemo(() => {
    if (status !== 'success') return [];
    const count = 24;
    return Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
      const distance = 90 + Math.random() * 90;
      const isCircle = Math.random() > 0.4;
      return {
        id: i,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        rot: Math.random() * 540 - 270,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: 0.15 + Math.random() * 0.18,
        size: 6 + Math.random() * 7,
        radius: isCircle ? '50%' : '2px',
      };
    });
  }, [status]);

  // A separate, bigger burst that rains down across the whole screen for a
  // proper "big deal" celebration moment, not just inside the card.
  const confettiRain = useMemo(() => {
    if (status !== 'success') return [];
    const count = 60;
    return Array.from({ length: count }).map((_, i) => {
      const isCircle = Math.random() > 0.45;
      return {
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.9,
        duration: 2.4 + Math.random() * 1.6,
        size: 6 + Math.random() * 8,
        rot: Math.random() * 720 - 360,
        radius: isCircle ? '50%' : '2px',
      };
    });
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.contact.trim()) next.contact = 'Please enter a contact number.';
    if (!form.message.trim()) next.message = 'Tell us a bit about your requirement.';
    if (TURNSTILE_SITE_KEY && !turnstileToken) next.turnstile = 'Please complete the verification check.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');

    try {
      const res = await fetch('/api/special-requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'Request failed');
      }

      setStatus('success');
      setForm(initialForm);
      setTurnstileToken('');
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (err) {
      console.error('Special requirement submission failed:', err);
      setStatus('error');
      setTurnstileToken('');
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  };

  const inputClasses =
    'w-full bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[#00AEEF] transition-colors';

  const labelClasses =
    'text-xs font-mono text-[var(--text-faint)] block mb-2 uppercase tracking-wider';

  return (
    <section id="special-requirement" className="relative py-24 bg-transparent overflow-hidden">
      {/* Ambient glow to match the rest of the site's card sections */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">Tell Us What You Need</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-(--text) tracking-tight mt-2">
            Have a <span className="bg-linear-to-r from-[#00AEEF] to-purple-500 bg-clip-text text-transparent">Special Requirement?</span>
          </h2>
          <p className="text-(--text-dim) text-sm md:text-base max-w-xl mx-auto mt-4">
            Custom routing, higher throughput, a bespoke integration — whatever it is, share the details and our team will get back to you.
          </p>
        </div>

        <div className={`relative overflow-hidden bg-(--surface)/35 border rounded-2xl p-6 md:p-10 shadow-[0_25px_70px_-20px_rgba(0,174,239,0.25)] backdrop-blur-2xl transition-colors duration-500 ${status === 'success' ? 'celebrate-border border-emerald-400/40' : 'border-(--border)'}`}>
          {/* Orian "A" mark, watermarked centered behind the form content */}
          <img
            src="/logo-icon.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[26rem] md:h-[26rem] object-contain opacity-[0.28] z-0"
          />

          {status === 'success' ? (
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-12 gap-4">
              {/* Full-screen confetti rain for a genuinely big celebration moment */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
                {confettiRain.map((p) => (
                  <span
                    key={p.id}
                    className="confetti-rain-piece absolute"
                    style={{
                      left: `${p.left}vw`,
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      borderRadius: p.radius,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`,
                      '--rot': `${p.rot}deg`,
                    }}
                  />
                ))}
              </div>

              {/* Soft radial flash burst behind everything */}
              <span className="tick-flash absolute left-1/2 top-20 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full pointer-events-none" />

              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Confetti burst in brand colors */}
                {confettiPieces.map((p) => (
                  <span
                    key={p.id}
                    className="confetti-piece absolute"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      borderRadius: p.radius,
                      animationDelay: `${p.delay}s`,
                      '--tx': `${p.tx}px`,
                      '--ty': `${p.ty}px`,
                      '--rot': `${p.rot}deg`,
                    }}
                  />
                ))}

                {/* Layered triple ripple rings */}
                <span className="tick-ripple absolute inset-0 rounded-full border-2 border-emerald-400/50" />
                <span className="tick-ripple tick-ripple-2 absolute inset-0 rounded-full border-2 border-[#00AEEF]/40" />
                <span className="tick-ripple tick-ripple-3 absolute inset-0 rounded-full border-2 border-purple-400/30" />

                {/* Icon circle, pops in then draws the glowing gradient check */}
                <div className="tick-pop tick-glow relative w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <svg className="w-11 h-11" viewBox="0 0 52 52" fill="none">
                    <defs>
                      <linearGradient id="tick-gradient" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#00AEEF" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#E8A23D" />
                      </linearGradient>
                    </defs>
                    <circle
                      className="tick-circle"
                      cx="26"
                      cy="26"
                      r="23"
                      stroke="url(#tick-gradient)"
                      strokeWidth="2.5"
                    />
                    <path
                      className="tick-check"
                      d="M15 27.5l7.2 7.2L37 19"
                      stroke="url(#tick-gradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Floating sparkles around the icon */}
                <span className="sparkle sparkle-1">✨</span>
                <span className="sparkle sparkle-2">✨</span>
                <span className="sparkle sparkle-3">✨</span>
              </div>

              <h3 className="tick-fade-1 shimmer-text text-3xl md:text-4xl font-extrabold tracking-tight">
                Request received! 🎉
              </h3>
              <p className="tick-fade-2 text-(--text-dim) text-sm md:text-base max-w-sm">
                Thanks for reaching out — our team will review your requirement and get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="tick-fade-3 mt-2 text-sm text-[#00AEEF] hover:text-[#E8A23D] font-semibold transition-colors"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="sr-name" className={labelClasses}>Full Name</label>
                  <input
                    id="sr-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Orian"
                    className={inputClasses}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
                </div>

                {/* Company (optional) */}
                <div>
                  <label htmlFor="sr-company" className={labelClasses}>Company <span className="normal-case text-(--text-faint)">(optional)</span></label>
                  <input
                    id="sr-company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className={inputClasses}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="sr-email" className={labelClasses}>Email</label>
                  <input
                    id="sr-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={inputClasses}
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="sr-contact" className={labelClasses}>Contact Number</label>
                  <input
                    id="sr-contact"
                    name="contact"
                    type="tel"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className={inputClasses}
                  />
                  {errors.contact && <p className="text-xs text-red-400 mt-1.5">{errors.contact}</p>}
                </div>

                {/* Requirement Type */}
                <div className="md:col-span-2">
                  <label htmlFor="sr-type" className={labelClasses}>Requirement Type</label>
                  <select
                    id="sr-type"
                    name="requirementType"
                    value={form.requirementType}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    {requirementTypes.map((type) => (
                      <option key={type} value={type} className="bg-(--surface) text-(--text)">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Requirement / Message */}
                <div className="md:col-span-2">
                  <label htmlFor="sr-message" className={labelClasses}>Tell us about your requirement</label>
                  <textarea
                    id="sr-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe volume, timelines, integrations, or anything else our team should know..."
                    className={`${inputClasses} resize-none`}
                  />
                  {errors.message && <p className="text-xs text-red-400 mt-1.5">{errors.message}</p>}
                </div>
              </div>

              {TURNSTILE_SITE_KEY && (
                <div className="mt-6 flex flex-col items-center">
                  <div ref={turnstileRef} className={turnstileReady ? '' : 'h-[65px]'} />
                  {errors.turnstile && <p className="text-xs text-red-400 mt-1.5">{errors.turnstile}</p>}
                </div>
              )}

              {status === 'error' && (
                <p className="text-sm text-red-400 mt-4">
                  Something went wrong sending your request. Please try again.
                </p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <p className="text-xs text-(--text-faint)text-center sm:text-left">
                  We typically respond within 24 hours.
                </p>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#E8A23D] text-black font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(0,174,239,0.3)] hover:shadow-[0_0_20px_rgba(232,162,61,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SpecialRequirement;
