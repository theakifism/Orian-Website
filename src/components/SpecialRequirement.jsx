import React, { useEffect, useRef, useState } from 'react';
import { requirementTypes as defaultRequirementTypes } from '../content/defaults/SpecialRequirement.js';
import { useData } from '../content';
import { track } from '../utils/analytics';

const initialForm = {
  name: '',
  email: '',
  contact: '',
  company: '',
  location: '',
  requirementType: defaultRequirementTypes[0],
  message: '',
  consent: false,
};

// Public site key for Cloudflare Turnstile (free anti-spam widget). Safe to
// expose: only the TURNSTILE_SECRET_KEY (verified server-side) is secret.
// Leave VITE_TURNSTILE_SITE_KEY unset to disable the widget entirely.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

/**
 * The real requirement form: validates, then POSTs to /api/special-requirement
 * (unchanged backend call, same payload, same Turnstile handling).
 *
 *  - default: a full section with its own heading (used on the Contact page)
 *  - `embedded`: just the form card, for the bottom row on the home page
 *
 * Restyled for the new design: no confetti, no glow, no watermark behind the
 * fields; the success state is a plain confirmation.
 */
const SpecialRequirement = ({ embedded = false, initialRequirementType = defaultRequirementTypes[0], initialMessage = '', submitLabel = 'Submit request', source = 'contact' }) => {
  const configuredTypes = useData('SpecialRequirement.requirementTypes', defaultRequirementTypes);
  const requirementTypes = configuredTypes.includes(initialRequirementType)
    ? configuredTypes
    : [initialRequirementType, ...configuredTypes];
  const [form, setForm] = useState(() => ({ ...initialForm, requirementType: initialRequirementType, message: initialMessage }));
  // If the admin removed/renamed the option that was selected, fall back to the first one
  // so the dropdown and the submitted value never disagree.
  const requirementType = requirementTypes.includes(form.requirementType) ? form.requirementType : (requirementTypes[0] || '');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Lazily loads Cloudflare's Turnstile script only on pages that render the form.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
    if (!form.consent) next.consent = 'Please accept to be contacted before submitting.';
    if (TURNSTILE_SITE_KEY && !turnstileToken) next.turnstile = 'Please complete the verification check.';
    return next;
  };

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const first = Object.keys(validationErrors)[0];
      document.getElementById(`sr-${first === 'requirementType' ? 'type' : first}`)?.focus();
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/special-requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, requirementType, turnstileToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'Request failed');
      }

      setStatus('success');
      track('lead_form_submitted', { source, requirementType });
      setForm({ ...initialForm, requirementType: initialRequirementType, message: initialMessage });
      resetTurnstile();
    } catch (err) {
      console.error('Special requirement submission failed:', err);
      setStatus('error');
      resetTurnstile();
    }
  };

  const fieldProps = (name) => ({
    id: `sr-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    ...(errors[name] ? { 'aria-invalid': true, 'aria-describedby': `sr-${name}-err` } : {}),
  });
  const Err = ({ name }) => (errors[name] ? <p className="o2-err" id={`sr-${name}-err`}>{errors[name]}</p> : null);

  const card = (
    <div className="o2-form-card o2-reqform" data-section="special-requirement">
      {status === 'success' ? (
        <div className="o2-ready" role="status">
          <span className="o2-tag solid">Sent</span>
          <h3>Request received.</h3>
          <p>Thanks for reaching out. Our team will review your requirement and get back to you shortly.</p>
          <div className="acts">
            <button type="button" className="o2-btn o2-btn-ghost" onClick={() => setStatus('idle')}>Send another request</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="o2-fields">
            <div className="o2-field">
              <label htmlFor="sr-name">Full name</label>
              <input {...fieldProps('name')} type="text" autoComplete="name" />
              <Err name="name" />
            </div>
            <div className="o2-field">
              <label htmlFor="sr-company">Company (optional)</label>
              <input {...fieldProps('company')} type="text" autoComplete="organization" />
            </div>
            <div className="o2-field">
              <label htmlFor="sr-email">Email</label>
              <input {...fieldProps('email')} type="email" autoComplete="email" placeholder="you@company.com" />
              <Err name="email" />
            </div>
            <div className="o2-field">
              <label htmlFor="sr-contact">Contact number</label>
              <input {...fieldProps('contact')} type="tel" autoComplete="tel" placeholder="+91 00000 00000" />
              <Err name="contact" />
            </div>
            <div className="o2-field">
              <label htmlFor="sr-location">Location</label>
              <input {...fieldProps('location')} type="text" autoComplete="address-level2" placeholder="City, country" />
            </div>
            <div className="o2-field">
              <label htmlFor="sr-type">Requirement type</label>
              <select id="sr-type" name="requirementType" value={requirementType} onChange={handleChange}>
                {requirementTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
              </select>
            </div>
            <div className="o2-field full">
              <label htmlFor="sr-message">Tell us about your requirement</label>
              <textarea {...fieldProps('message')} rows={4} placeholder="Volume, timelines, integrations, or anything else our team should know." />
              <Err name="message" />
            </div>
          </div>

          <label htmlFor="sr-consent" className="o2-check">
            <input id="sr-consent" name="consent" type="checkbox" checked={form.consent} onChange={handleChange} {...(errors.consent ? { 'aria-invalid': true } : {})} />
            <span>I agree to be contacted by Orian&apos;s team about my requirement and acknowledge Orian&apos;s privacy policy.</span>
          </label>
          {errors.consent && <p className="o2-err">{errors.consent}</p>}

          {TURNSTILE_SITE_KEY && (
            <div style={{ marginTop: '1rem' }}>
              <div ref={turnstileRef} style={turnstileReady ? undefined : { minHeight: 65 }} />
              {errors.turnstile && <p className="o2-err">{errors.turnstile}</p>}
            </div>
          )}

          {status === 'error' && (
            <p className="o2-err" role="alert" style={{ marginTop: '1rem' }}>
              Something went wrong sending your request. Please try again.
            </p>
          )}

          <div className="o2-form-foot">
            <p className="o2-note">Our team will review your request and follow up using the contact details you provide.</p>
            <button type="submit" disabled={status === 'submitting'} className="o2-btn o2-btn-primary" data-track="special_requirement_submit">
              {status === 'submitting' ? 'Sending...' : submitLabel}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (embedded) return card;

  return (
    <section id="special-requirement" className="o2 o2-sec" data-section="special-requirement">
      <div className="o2-wrap" style={{ maxWidth: '56rem' }}>
        <div className="o2-sec-head is-center">
          <span className="o2-eyebrow"><i />Tell us what you need</span>
          <h2 className="o2-h2">Have a special requirement?</h2>
          <p className="o2-lead">Custom routing, higher throughput, a bespoke integration. Share the details and our team will get back to you.</p>
        </div>
        {card}
      </div>
    </section>
  );
};

export default SpecialRequirement;
