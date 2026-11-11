import React from 'react';
import SectionHead from './SectionHead';
import { useLang } from '../../context/LangContext';

/** Native <details> accordion (works without JS) plus FAQPage structured data. */
export const FaqList = ({ faqs }) => (
  <div className="o2-faq">
    {faqs.map((f) => (
      <details key={f.q}>
        <summary>{f.q}</summary>
        <p>{f.a}</p>
      </details>
    ))}
  </div>
);

const FaqSection = ({ faqs }) => {
  const { t } = useLang();
  return (
    <section className="o2 o2-sec" id="faq" data-section="faq">
      <div className="o2-wrap">
        <SectionHead eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
};

export default FaqSection;
