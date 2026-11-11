import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../../content';
import useDepthTier from '../../hooks/useDepthTier';
import useTiltLight from '../../hooks/useTiltLight';
import SectionHead from './SectionHead';
import { useLang } from '../../context/LangContext';
import { Arrow } from './Icons';

// One small animated detail per tile (CSS only, see o2-site.css).
const Detail = ({ slug }) => {
  switch (slug) {
    case 'bulk-sms-otp-gateways':
      return (
        <div className="d-bubbles" aria-hidden="true">
          <div>482915 is your verification code.<em>Delivered</em></div>
          <div>Your order #10482 has shipped.<em>Delivered</em></div>
          <div>Rs 4,500.00 debited from A/c XX1234.<em>Delivered</em></div>
        </div>
      );
    case 'voice-sms-ivr':
      return <div className="d-wave" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ '--i': i, height: `${35 + ((i * 37) % 65)}%` }} />)}</div>;
    case 'whatsapp-business-api':
      return (
        <div className="d-wa" aria-hidden="true">
          <div className="b">Your appointment is confirmed.</div>
          <div className="t"><i /><i /><i /></div>
        </div>
      );
    case 'social-media-handling':
      return <div className="d-posts" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--i': i }} />)}</div>;
    case 'it-solutions':
      return (
        <div className="d-term" aria-hidden="true">
          <span>$ deploy --env production</span>
          <span>build complete <b>ok</b></span>
          <span>health check <b>ok</b></span>
        </div>
      );
    default:
      return null;
  }
};

const Tile = ({ s, className, kicker, primary = false, H = 'h3', children }) => {
  const ref = useRef(null);
  const [tier] = useDepthTier();
  useTiltLight(ref, { enabled: tier === 'full', max: 3.5 });
  return (
    <Link ref={ref} to={`/services/${s.slug}`} className={`o2-tile ${className}`} data-track="service_tile" data-track-label={s.slug}>
      <span className={`o2-t-kicker${primary ? ' is-primary' : ''}`}>{kicker}</span>
      <H>{s.title}</H>
      <p>{s.tagline}</p>
      {children}
      <span className="go">Learn more <Arrow /></span>
    </Link>
  );
};

/**
 * Bento layout: bulk SMS is the large primary tile; Voice, WhatsApp, Social
 * Media and IT Solutions are four tiles of identical size; DLT sits in a wide
 * strip because it is part of every SMS setup.
 */
const BentoServices = ({ showHead = true }) => {
  const { t } = useLang();
  const services = useCollection('services');
  const by = (slug) => services.find((x) => x.slug === slug);
  const sms = by('bulk-sms-otp-gateways');
  const dlt = by('dlt-compliance');
  const small = ['voice-sms-ivr', 'whatsapp-business-api', 'social-media-handling', 'it-solutions'].map(by).filter(Boolean);

  return (
    <section className="o2 o2-sec" id="services" data-section="services-bento">
      <div className="o2-wrap">
        {showHead && <SectionHead eyebrow={t('svc.eyebrow')} title={t('svc.title')} lead={t('svc.lead')} />}

        <div className="o2-bento">
          <Tile s={sms} H={showHead ? 'h3' : 'h2'} className="o2-t-main" kicker="Primary service" primary>
            <div className="o2-chiprow">
              <span>OTP</span><span>Transactional</span><span>Promotional</span><span>Delivery reports</span>
            </div>
            <div className="o2-demo-slot"><Detail slug={sms.slug} /></div>
          </Tile>

          {small.map((s, i) => (
            <Tile key={s.slug} s={s} H={showHead ? 'h3' : 'h2'} className="o2-t-sm" kicker={['Messaging', 'Messaging', 'Growth', 'Technology'][i]}>
              <div className="o2-demo-slot"><Detail slug={s.slug} /></div>
            </Tile>
          ))}

          <Link to={`/services/${dlt.slug}`} className="o2-tile o2-t-wide" data-track="service_tile" data-track-label={dlt.slug}>
            <div className="grow">
              <span className="o2-t-kicker">Included with every SMS setup</span>
              {showHead ? <h3>{dlt.title}</h3> : <h2>{dlt.title}</h2>}
              <p>{dlt.tagline}</p>
            </div>
            <div className="d-steps" aria-hidden="true">
              {['Entity', 'Sender ID', 'Templates', 'Consent'].map((n, i) => (
                <div key={n}><i style={{ '--i': i }} />{n}</div>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BentoServices;
