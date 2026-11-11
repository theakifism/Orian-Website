import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { faqSchema } from '../seo/jsonld';
import { FaqList } from '../components/o2/FaqSection';
import { useUI } from '../context/UIContext';
import { Arrow } from '../components/o2/Icons';
import DocumentsSection from '../components/DocumentsSection';

// General DLT guidance. Operator review times can vary.
const topics = [
  { id: 'dlt', title: 'DLT registration', body: 'In India, businesses that send SMS register on the Distributed Ledger Technology (DLT) platform run by the telecom operators, under TRAI rules. Registration creates your entity record, which every sender ID and template is later linked to.', points: ['Registered as an entity (the principal entity)', 'Business documents are submitted for verification', 'The entity ID is used when you send messages'] },
  { id: 'sender-ids', title: 'Sender IDs (headers)', body: 'A sender ID, also called a header, is the short name recipients see instead of a phone number. It is registered against your entity and has to be approved before it can be used.', points: ['Short alphabetic headers shown on the handset', 'Chosen to reflect your brand and message type', 'Each header is linked to your entity'] },
  { id: 'templates', title: 'Message templates', body: 'Each type of message you send has a registered template. Fixed text stays the same and the parts that change, such as a code or a name, are marked as variables. Messages that do not match a registered template are not delivered.', points: ['Separate templates for OTP, transactional and promotional use', 'Variables for codes, names, amounts and dates', 'A rejected template can be edited and resubmitted'] },
  { id: 'consent', title: 'Consent', body: 'Promotional messages should only go to people who agreed to receive them. Consent is recorded and checked, and people must be able to opt out.', points: ['Opt-in captured and stored per number', 'Opt-out honoured for future sends', 'Consent records kept so you can show them if asked'] },
];
const steps = [
  { title: 'Share your documents', desc: 'We tell you which business documents are needed for your type of entity.' },
  { title: 'Register the entity', desc: 'We help you complete DLT entity registration, which usually takes 2–3 business days.' },
  { title: 'Register sender IDs', desc: 'Headers are submitted and linked to your entity.' },
  { title: 'Register templates', desc: 'Each message type is written as a template; correctly submitted templates are typically reviewed in 24–48 hours.' },
  { title: 'Set up consent', desc: 'For promotional sending, consent capture and opt-out are put in place.' },
  { title: 'Test and go live', desc: 'Approved headers and templates are mapped to your account and tested.' },
];
const faqs = [
  { q: 'Do I have to register to send SMS in India?', a: 'Yes. Businesses register their entity, sender IDs and templates on the DLT platform before sending commercial SMS.' },
  { q: 'What happens if a template is rejected?', a: 'It is reviewed, corrected and resubmitted. Our team helps with the wording.' },
  { q: 'Does registration cover Voice and WhatsApp?', a: 'DLT applies to SMS. WhatsApp has its own business verification and template approval, which we also help with.' },
];

const CompliancePage = () => {
  const { openLead } = useUI();
  return (
    <>
      <Seo title={pageMeta.compliance.title} description={pageMeta.compliance.description} path={pageMeta.compliance.path} jsonLd={faqSchema(faqs)} />
      <PageHeader
        eyebrow="Compliance centre"
        title="DLT registration, step by step."
        subtitle="Entity, sender IDs, templates and consent: what each one is, and how onboarding with Orian works."
        breadcrumbs={[{ label: 'Compliance' }]}
      >
        <div className="o2-cta-row" style={{ marginTop: '2rem' }}>
          <button type="button" className="o2-btn o2-btn-primary" onClick={() => openLead('compliance')} data-track="compliance_talk_to_us">Start registration <Arrow /></button>
        </div>
        <p className="o2-note" style={{ marginTop: '1.2rem' }}>Review times depend on complete documents and operator approval. Our team keeps you updated through the process.</p>
      </PageHeader>

      <section className="o2 o2-sec" data-section="compliance-topics">
        <div className="o2-wrap">
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))' }}>
            {topics.map((t) => (
              <article key={t.id} id={t.id} className="o2-card scroll-mt-24">
                <h2>{t.title}</h2>
                <p>{t.body}</p>
                <ul className="o2-list" style={{ marginTop: '1.1rem' }}>{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="o2 o2-sec is-alt" id="onboarding" data-section="compliance-onboarding">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />Onboarding guide</span><h2 className="o2-h2">Six steps from signup to sending.</h2></div>
          <div className="o2-stepper cols-3">{steps.map((s) => (<div key={s.title}><h3>{s.title}</h3><p>{s.desc}</p></div>))}</div>
        </div>
      </section>

      <section className="o2 o2-sec" data-section="compliance-faq">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />FAQ</span><h2 className="o2-h2">Common questions.</h2></div>
          <FaqList faqs={faqs} />
          <p style={{ marginTop: '2rem' }}><Link to="/services/dlt-compliance" className="o2-btn o2-btn-ghost">About our DLT service <Arrow /></Link></p>
        </div>
      </section>

      {/* Files uploaded in the admin panel (rate cards, compliance documents). Hidden when there are none. */}
      <DocumentsSection />
    </>
  );
};

export default CompliancePage;
