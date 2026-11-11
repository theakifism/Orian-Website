import React from 'react';
import { Link } from 'react-router-dom';
import HeroPhone from './o2/HeroPhone';
import { useLang } from '../context/LangContext';
import { useUI } from '../context/UIContext';
import { Arrow, Tick } from './o2/Icons';
import { HOME_METRICS } from '../data/homeCopy';

const Hero = () => {
  const { t } = useLang();
  const { openLead } = useUI();

  return (
    <section id="home" className="o2 o2-hero scroll-mt-24" data-section="hero">
      <div className="o2-wrap">
        <div className="o2-hero-grid">
          <div className="o2-hero-copy">
            <span className="o2-pill o2-in" style={{ '--d': '0ms' }}>
              <b>Bulk SMS</b>
              {t('hero.pill')}
            </span>

            <h1 className="o2-h1 o2-in" style={{ '--d': '70ms' }}>
              {t('hero.title')}
            </h1>

            <p className="o2-lead o2-in" style={{ '--d': '140ms' }}>
              {t('hero.lead')}
            </p>

            <div className="o2-cta-row o2-in" style={{ '--d': '210ms' }}>
              <button type="button" className="o2-btn o2-btn-primary" onClick={() => openLead('hero')} data-track="hero_talk_to_us">
                {t('hero.cta1')}
                <Arrow />
              </button>
              <Link to="/developers" className="o2-btn o2-btn-ghost" data-track="hero_sandbox">
                {t('hero.cta2')}
              </Link>
            </div>

            <dl className="o2-trust o2-in" style={{ '--d': '250ms' }}>
              {HOME_METRICS.map((m) => (
                <div key={m.label}><dt>{m.value}</dt><dd>{m.label}</dd></div>
              ))}
            </dl>

            <ul className="o2-facts o2-in" style={{ '--d': '280ms' }}>
              <li><Tick />{t('hero.f1')}</li>
              <li><Tick />{t('hero.f2')}</li>
              <li><Tick />{t('hero.f3')}</li>
            </ul>

            <p className="o2-secondary-line o2-in" style={{ '--d': '320ms' }}>
              {t('hero.also')} <Link to="/services/voice-sms-ivr">Voice and IVR</Link>, <Link to="/services/whatsapp-business-api">WhatsApp API</Link>.
            </p>

            <p className="o2-sr">
              Illustration: a phone receiving a one-time-password text message, with a delivery report showing queued, sent and delivered.
            </p>
          </div>

          <HeroPhone />
        </div>
      </div>
    </section>
  );
};

export default Hero;
