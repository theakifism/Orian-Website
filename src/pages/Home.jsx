import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { organizationSchema, localBusinessSchema, websiteSchema, faqSchema } from '../seo/jsonld';
import { homeFaqs } from '../data/faqs';
import {
  FeaturesSection, ApiSection, ComparisonSection, WhyOrianSection, HomeFaqSection, FinalCtaSection,
} from '../components/o2/HomeSeoSections';
import Hero from '../components/Hero';
import StatusStrip from '../components/o2/StatusStrip';
import BentoServices from '../components/o2/BentoServices';
import FlowDiagram from '../components/o2/FlowDiagram';
import SectionHead from '../components/o2/SectionHead';
import PeopleSection from '../components/o2/PeopleSection';
import GetInTouch from '../components/o2/GetInTouch';
import { useCases } from '../data/useCases';
import { useLang } from '../context/LangContext';
import { Arrow } from '../components/o2/Icons';
import { photo, photoProps } from '../utils/photo';

const Home = () => {
  const { t } = useLang();

  return (
    <>
      <Seo
        title={pageMeta.home.title}
        description={pageMeta.home.description}
        path={pageMeta.home.path}
        jsonLd={[organizationSchema(), localBusinessSchema(), websiteSchema(), faqSchema(homeFaqs)]}
      />

      <Hero />
      <StatusStrip />
      <FeaturesSection />
      <BentoServices />
      <FlowDiagram />
      <ApiSection />
      <ComparisonSection />
      <WhyOrianSection />

      <PeopleSection />

      <section className="o2 o2-sec" data-section="use-cases">
        <div className="o2-wrap">
          <SectionHead eyebrow={t('use.eyebrow')} title={t('use.title')} />
          <div className="o2-rows">
            {useCases.map((u, i) => (
              <Link key={u.slug} to={`/use-cases/${u.slug}`} className="o2-row-link" data-track="use_case_row" data-track-label={u.slug}>
                <span className="n">0{i + 1}</span>
                <div><h3>{u.title}</h3><p>{u.short}</p></div>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="o2 o2-sec is-alt" data-section="compliance-preview">
        <div className="o2-wrap">
          <div className="o2-two">
            <div>
              <SectionHead eyebrow={t('comp.eyebrow')} title={t('comp.title')} lead={t('comp.lead')} />
              <figure className="o2-photo" style={{ aspectRatio: '16 / 9' }}>
                <img {...photoProps('o2/compliance-desk.webp', "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")} alt="A laptop showing a padlock beside a stack of documents" loading="lazy" decoding="async" />
              </figure>
            </div>
            <div>
              <div className="o2-stepper cols-3" style={{ gridTemplateColumns: '1fr' }}>
                {[
                  ['Entity', 'Your business is registered as an entity on the DLT platform.'],
                  ['Sender IDs and templates', 'Headers and message templates are registered and approved before sending.'],
                  ['Consent', 'Opt-ins are recorded and checked for promotional messages.'],
                ].map(([h, p]) => (<div key={h}><h3>{h}</h3><p>{p}</p></div>))}
              </div>
              <p style={{ marginTop: '1.4rem' }}>
                <Link to="/compliance" className="o2-btn o2-btn-ghost" data-track="compliance_link">Open the compliance centre <Arrow /></Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeFaqSection />
      <FinalCtaSection />
      <GetInTouch />
    </>
  );
};

export default Home;
