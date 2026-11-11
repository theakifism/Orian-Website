import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { faqSchema, localBusinessSchema } from '../seo/jsonld';
import { CONTACT } from '../seo/siteConfig';
import { FaqList } from '../components/o2/FaqSection';
import { useUI } from '../context/UIContext';
import { Arrow } from '../components/o2/Icons';
import { services } from '../data/services';
import { PHONE_PRIMARY, PHONE_PRIMARY_DISPLAY, EMAIL_SUPPORT } from '../config/site';

// Local-intent page for "bulk SMS service in Nagpur". Only facts already published elsewhere on
// the site are used (office address, service area, contact channels, DLT process). No client
// names, ratings or local statistics are claimed.
// TODO(review): confirm the copy below, and add office opening hours in siteConfig.js (OFFICE_HOURS).
const TITLE = 'Bulk SMS Service in Nagpur | Orian Teleservices';
const DESCRIPTION =
  'Orian Teleservices is a Nagpur bulk SMS provider: DLT-compliant bulk SMS, OTP SMS API, voice API and WhatsApp Business API for businesses across India.';
export const NAGPUR_PATH = '/bulk-sms-service-nagpur';

const a = CONTACT.address;
const faqs = [
  { q: 'Is Orian Teleservices based in Nagpur?', a: `Yes. Our office is at ${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}.` },
  { q: 'Can businesses outside Nagpur use Orian?', a: 'Yes. We serve businesses across India, and international sending is available on request.' },
  { q: 'Do I need DLT registration to send bulk SMS from Nagpur?', a: 'Yes. Any business sending commercial SMS in India registers its entity, sender IDs and templates on the DLT platform, wherever it is based. We help with each step.' },
  { q: 'How do I reach the team?', a: `Call our 24/7 helpline at ${PHONE_PRIMARY_DISPLAY} or email ${EMAIL_SUPPORT}.` },
];
const steps = [
  { title: 'Tell us what you send', desc: 'OTPs, alerts, reminders or campaigns: we match the route and message type to your use.' },
  { title: 'Complete DLT registration', desc: 'Entity, sender IDs and templates are registered with our help.' },
  { title: 'Test and go live', desc: 'Approved headers and templates are mapped to your account and tested before you send.' },
];

const NagpurPage = () => {
  const { openLead } = useUI();
  return (
    <>
      <Seo title={TITLE} description={DESCRIPTION} path={NAGPUR_PATH} jsonLd={[localBusinessSchema(), faqSchema(faqs)]} />
      <PageHeader
        eyebrow="Nagpur, Maharashtra"
        title="Bulk SMS service in Nagpur."
        subtitle="DLT-compliant bulk SMS, OTP API, voice and WhatsApp messaging from a team based in Nagpur, serving businesses across India."
        breadcrumbs={[{ label: 'Bulk SMS in Nagpur' }]}
      >
        <div className="o2-cta-row" style={{ marginTop: '2rem' }}>
          <button type="button" className="o2-btn o2-btn-primary" onClick={() => openLead('nagpur')} data-track="nagpur_talk_to_us">Talk to our Nagpur team <Arrow /></button>
          <a className="o2-btn o2-btn-ghost" href={`tel:${PHONE_PRIMARY}`}>Call {PHONE_PRIMARY_DISPLAY}</a>
        </div>
      </PageHeader>

      <section className="o2 o2-sec" data-section="nagpur-services">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />What we offer</span><h2 className="o2-h2">Messaging services for Nagpur businesses.</h2></div>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))' }}>
            {services.map((s) => (
              <article key={s.slug} className="o2-card">
                <h3><Link to={`/services/${s.slug}`}>{s.title}</Link></h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="o2 o2-sec is-alt" data-section="nagpur-onboarding">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />Getting started</span><h2 className="o2-h2">Three steps from enquiry to sending.</h2></div>
          <div className="o2-stepper cols-3">{steps.map((s) => (<div key={s.title}><h3>{s.title}</h3><p>{s.desc}</p></div>))}</div>
          <p style={{ marginTop: '2rem' }}><Link to="/compliance" className="o2-btn o2-btn-ghost">DLT registration step by step <Arrow /></Link></p>
        </div>
      </section>

      <section className="o2 o2-sec" data-section="nagpur-contact">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />Visit or call</span><h2 className="o2-h2">Our Nagpur office.</h2></div>
          <address className="o2-prose" style={{ fontStyle: 'normal' }}>
            <p>{a.streetAddress}, {a.addressLocality}, {a.addressRegion} {a.postalCode}</p>
            <p><a href={`tel:${PHONE_PRIMARY}`}>{PHONE_PRIMARY_DISPLAY}</a> · <a href={`mailto:${EMAIL_SUPPORT}`}>{EMAIL_SUPPORT}</a></p>
          </address>
        </div>
      </section>

      <section className="o2 o2-sec is-alt" data-section="nagpur-faq">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />FAQ</span><h2 className="o2-h2">Common questions.</h2></div>
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  );
};

export default NagpurPage;
