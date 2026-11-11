import React from 'react';
import { Link } from 'react-router-dom';
import SectionHead from './SectionHead';
import { FaqList } from './FaqSection';
import { Arrow } from './Icons';
import { useUI } from '../../context/UIContext';
import { PHONE_PRIMARY, PHONE_PRIMARY_DISPLAY } from '../../config/site';
import { homeFaqs } from '../../data/faqs';
import {
  homeFeatures, apiSection, comparison, whyOrian, finalCta,
} from '../../data/homeCopy';

/** Core platform features: one H2, four H3 cards. */
export const FeaturesSection = () => (
  <section className="o2 o2-sec" id="platform" data-section="features">
    <div className="o2-wrap">
      <SectionHead eyebrow={homeFeatures.eyebrow} title={homeFeatures.title} lead={homeFeatures.lead} />
      <div className="o2-cards">
        {homeFeatures.items.map((f) => (
          <article key={f.h} className="o2-card">
            <h3>{f.h}</h3>
            <p>{f.p}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/** API onboarding entry point; contact the team for documentation and credentials. */
export const ApiSection = () => (
    <section className="o2 o2-sec is-alt" id="api" data-section="api-walkthrough">
      <div className="o2-wrap">
        <SectionHead eyebrow={apiSection.eyebrow} title={apiSection.title} lead={apiSection.lead} />
        <p className="o2-cta-line">
          <Link to="/developers" className="o2-btn o2-btn-primary" data-track="api_onboarding">Ask about API access <Arrow /></Link>
          <Link to="/contact" className="o2-btn o2-btn-ghost" data-track="api_contact">Contact the team</Link>
        </p>
      </div>
    </section>
);

/** Transactional vs promotional comparison table. */
export const ComparisonSection = () => (
  <section className="o2 o2-sec" id="sms-types" data-section="comparison">
    <div className="o2-wrap">
      <SectionHead eyebrow={comparison.eyebrow} title={comparison.title} lead={comparison.lead} />
      <div className="o2-table-wrap" role="region" aria-label="Transactional vs promotional SMS" tabIndex={0}>
        <table className="o2-table">
          <thead>
            <tr>
              <th scope="col"><span className="o2-sr">Feature</span></th>
              {comparison.cols.map((c) => <th key={c} scope="col">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map(([label, a, b]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{a}</td>
                <td>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

/** Why Orian Teleservices vs traditional aggregators. */
export const WhyOrianSection = () => (
  <section className="o2 o2-sec is-alt" id="why-orian" data-section="differentiators">
    <div className="o2-wrap">
      <SectionHead eyebrow={whyOrian.eyebrow} title={whyOrian.title} />
      <div className="o2-cards">
        {whyOrian.items.map((f) => (
          <article key={f.h} className="o2-card">
            <h3>{f.h}</h3>
            <p>{f.p}</p>
          </article>
        ))}
      </div>
      <p className="o2-cta-line">
        <Link to="/why-us" className="o2-btn o2-btn-ghost" data-track="why_orian_link">See why teams choose Orian <Arrow /></Link>
      </p>
    </div>
  </section>
);

/** Four-question FAQ. The matching FAQPage JSON-LD is emitted in Home.jsx. */
export const HomeFaqSection = () => (
  <section className="o2 o2-sec" id="faq" data-section="faq">
    <div className="o2-wrap">
      <SectionHead eyebrow="FAQ" title="Bulk SMS questions, answered" />
      <FaqList faqs={homeFaqs} />
    </div>
  </section>
);

/** Closing call to action. */
export const FinalCtaSection = () => {
  const { openLead } = useUI();
  return (
    <section className="o2 o2-sec is-alt o2-final" data-section="final-cta">
      <div className="o2-wrap">
        <SectionHead title={finalCta.title} lead={finalCta.lead} center />
        <p className="o2-cta-line is-center">
          <Link to="/developers" className="o2-btn o2-btn-primary" data-track="final_api_access">Ask about API access <Arrow /></Link>
          <button type="button" className="o2-btn o2-btn-ghost" onClick={() => openLead('final_cta')} data-track="final_talk">Talk to a messaging expert</button>
          <a className="o2-btn o2-btn-ghost" href={`tel:${PHONE_PRIMARY}`} data-track="final_call">Call {PHONE_PRIMARY_DISPLAY}</a>
        </p>
      </div>
    </section>
  );
};
        
