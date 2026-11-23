import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { useUI } from '../context/UIContext';
import { Arrow } from '../components/o2/Icons';
import PageContent from '../components/PageContent';

const DevelopersPage = () => {
  const { openLead } = useUI();
  return (
  <>
    <Seo title={pageMeta.developers.title} description={pageMeta.developers.description} path={pageMeta.developers.path} />
    <PageHeader
      eyebrow="Developers"
      title="Discuss your messaging integration."
      subtitle="Build with Orian’s messaging API, review delivery reports, and test integrations in the sandbox."
      breadcrumbs={[{ label: 'Developers' }]}
    />

    <section className="o2 o2-sec" id="api-access" data-section="api-access">
      <div className="o2-wrap">
        <div className="o2-two">
          <div className="o2-sec-head" style={{ marginBottom: 0 }}>
            <span className="o2-eyebrow"><i />Integration enquiry</span>
            <h2 className="o2-h2">Tell us what you’re building.</h2>
            <p className="o2-lead">Request API credentials and technical documentation from our team. Sandbox access and onboarding timing depend on your account, documents and applicable approvals.</p>
          </div>
          <div className="o2-card o2-developer-enquiry">
            <span className="o2-t-kicker">API access</span>
            <h3>Need credentials or integration guidance?</h3>
            <p>Tell us about your platform and intended messaging workflow. Our team can guide you through API access, documentation and onboarding requirements.</p>
            <button type="button" className="o2-btn o2-btn-primary" onClick={() => openLead('developers', { requirementType: 'Custom / Enterprise Solution', initialMessage: 'I would like API credentials and technical documentation for my messaging integration.' })}>Request integration support <Arrow /></button>
          </div>
        </div>
      </div>
    </section>

    <section className="o2 o2-sec is-alt" data-section="developer-integration-guide">
      <div className="o2-wrap">
        <article className="o2-prose" style={{ maxWidth: '48rem' }}>
          <h2>Plan your messaging integration.</h2>
          <p>Before connecting an application, decide which messages you need to send, where recipient data comes from and how your system should respond to delivery updates. This helps our team understand the account, API access and setup guidance your project needs.</p>
          <h3>What to include in your enquiry</h3>
          <p>Tell us whether you are planning OTP, transactional or promotional SMS, the approximate sending volume, your preferred integration approach and your expected timeline. For India SMS traffic, share the status of your entity, sender ID and template registration so the team can advise on the relevant onboarding steps.</p>
          <p>Do not send API secrets, passwords or personal recipient data through the enquiry form. Our team can explain the appropriate channel for credentials and technical materials after reviewing your request.</p>
        </article>
      </div>
    </section>

    <PageContent id="developers" />
  </>
  );
};

export default DevelopersPage;
