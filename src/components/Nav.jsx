import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCollection } from '../content';
import { useLang } from '../context/LangContext';
import { useUI } from '../context/UIContext';
import { LANGS } from '../i18n/translations';
import { Burger, Chevron, Close } from './o2/Icons';

const Nav = () => {
  const { t, lang, setLang } = useLang();
  const services = useCollection('services');
  const { openLead, openCommand } = useUI();
  const loc = useLocation();
  const [mobile, setMobile] = useState(false);
  // The full logo is only revealed on hover (flip card). Load it once the page is idle so it never
  // competes with first paint or becomes a hidden LCP candidate.
  const [backLogoReady, setBackLogoReady] = useState(false);
  useEffect(() => {
    const ready = () => setBackLogoReady(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(ready, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(ready, 3000);
    return () => clearTimeout(id);
  }, []);
  const [dd, setDd] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const ddRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => { setMobile(false); setDd(false); setLangOpen(false); }, [loc.pathname]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDd(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') { setDd(false); setLangOpen(false); setMobile(false); } };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);

  const links = [
    { to: '/use-cases', label: t('nav.useCases') },
    { to: '/developers', label: t('nav.developers') },
    { to: '/compliance', label: t('nav.compliance') },
    { to: '/industries', label: t('nav.industries') },
    { to: '/about', label: t('nav.about') },
  ];

  return (
    <>
    <header className="o2 o2-nav">
      <div className="o2-wrap o2-nav-in">
        {/* Logo flip: one 3D card, the Orian mark on the front and the full wordmark on the
            back. It turns on hover or keyboard focus (and on tap on touch screens). */}
        <Link to="/" className="o2-logo" aria-label="Orian Teleservices home">
          <span className="o2-flip" aria-hidden="true">
            <span className="o2-flip-face">
              <img src="/logo-icon.webp" alt="" width="56" height="42" decoding="async" />
            </span>
            <span className="o2-flip-face o2-flip-back">
              {backLogoReady && <img src="/logo-full.webp" alt="" width="132" height="45" decoding="async" />}
            </span>
          </span>
        </Link>

        <nav className="o2-links" aria-label="Main">
          <div className="o2-dd-wrap" ref={ddRef}>
            <button type="button" className="o2-link" aria-expanded={dd} aria-haspopup="true" aria-controls="o2-svc-menu" onClick={() => setDd((v) => !v)}>
              {t('nav.services')} <Chevron />
            </button>
            <div id="o2-svc-menu" className="o2-dd" data-open={dd}>
              {services.map((s, i) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className={i === 0 ? 'is-primary' : ''} tabIndex={dd ? 0 : -1} onClick={() => setDd(false)}>
                  <b>{s.title}</b>
                  <span>{s.tagline}</span>
                </Link>
              ))}
              <Link to="/services" tabIndex={dd ? 0 : -1} onClick={() => setDd(false)} style={{ gridColumn: '1 / -1' }}>
                <b>All services</b>
              </Link>
            </div>
          </div>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="o2-link">{l.label}</NavLink>
          ))}
        </nav>

        <div className="o2-nav-tools">
          <button type="button" className="o2-link o2-link-ai o2-hide-md" onClick={openCommand} aria-label={t('nav.askAi')} data-track="nav_ask_ai">
            {t('nav.askAi')}
          </button>

          <div className="o2-lang o2-hide-md" ref={langRef}>
            <button type="button" className="o2-link" aria-expanded={langOpen} aria-haspopup="true" aria-label={t('lang.label')} onClick={() => setLangOpen((v) => !v)}>
              {LANGS.find((l) => l.code === lang)?.short} <Chevron />
            </button>
            {langOpen && (
              <div className="o2-lang-list" role="menu">
                {LANGS.map((l) => (
                  <button key={l.code} type="button" role="menuitemradio" aria-checked={lang === l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}>
                    {l.label}
                  </button>
                ))}
                <p>{t('lang.review')}</p>
              </div>
            )}
          </div>

          <button type="button" className="o2-btn o2-btn-primary o2-hide-md" onClick={() => openLead('nav')} data-track="nav_talk_to_us">{t('nav.talk')}</button>

          <button type="button" className="o2-burger" aria-label="Menu" aria-expanded={mobile} aria-controls="o2-mobile" onClick={() => setMobile((v) => !v)}>
            {mobile ? <Close width="18" height="18" /> : <Burger width="18" height="18" />}
          </button>
        </div>
      </div>

    </header>

      <div id="o2-mobile" className="o2 o2-mobile" data-open={mobile} aria-hidden={!mobile} inert={!mobile}>
        <small>{t('nav.services')}</small>
        {services.map((s) => (
          <Link key={s.slug} to={`/services/${s.slug}`} className="sub" tabIndex={mobile ? 0 : -1}>{s.title}</Link>
        ))}
        <small>Explore</small>
        {links.map((l) => (<Link key={l.to} to={l.to} tabIndex={mobile ? 0 : -1}>{l.label}</Link>))}
        <Link to="/contact" tabIndex={mobile ? 0 : -1}>{t('nav.contact')}</Link>
        <small>{t('lang.label')}</small>
        <div className="o2-seg" role="group" aria-label={t('lang.label')}>
          {LANGS.map((l) => (
            <button key={l.code} type="button" aria-pressed={lang === l.code} onClick={() => setLang(l.code)}>{l.label}</button>
          ))}
        </div>
        <div className="o2-mobile-cta">
          <button type="button" className="o2-btn o2-btn-primary" onClick={() => { setMobile(false); openLead('nav-mobile'); }}>{t('nav.talk')}</button>
        </div>
      </div>
    </>
  );
};

export default Nav;
