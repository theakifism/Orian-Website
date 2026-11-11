import React from 'react';
import LeadForm from './LeadForm';
import { useLang } from '../../context/LangContext';
import { whatsappLink, PHONE_PRIMARY, PHONE_PRIMARY_DISPLAY } from '../../config/site';

/** Contact form shown at the bottom of every page (name, phone, use case, volume). */
const LeadSection = () => {
  const { t } = useLang();
  return (
    <section className="o2 o2-sec o2-lead-sec" id="contact-form" data-section="lead-form">
      <div className="o2-wrap">
        <div className="o2-two">
          <div className="o2-sec-head" style={{ marginBottom: 0 }}>
            <span className="o2-eyebrow"><i />{t('form.eyebrow')}</span>
            <h2 className="o2-h2">{t('form.title')}</h2>
            <p className="o2-lead">{t('form.lead')}</p>
            <p className="o2-note">
              Prefer to talk now? <a href={`tel:${PHONE_PRIMARY}`} style={{ color: 'var(--o-text-2)' }}>{PHONE_PRIMARY_DISPLAY}</a>
              {' '}or <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--o-text-2)' }}>WhatsApp</a>.
            </p>
          </div>
          <LeadForm source="page-bottom" idPrefix="bot" />
        </div>
      </div>
    </section>
  );
};

export default LeadSection;
