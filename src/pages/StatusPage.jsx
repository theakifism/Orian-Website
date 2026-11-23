import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { PHONE_PRIMARY, PHONE_PRIMARY_DISPLAY, EMAIL_SUPPORT } from '../config/site';

const StatusPage = () => {
  return (
    <>
      <Seo title={pageMeta.status.title} description={pageMeta.status.description} path={pageMeta.status.path} noindex />
      <PageHeader
        eyebrow="Service information"
        title="Service information"
        subtitle="Understand delivery reporting and how to get help with a service issue."
        breadcrumbs={[{ label: 'Status' }]}
      />

      <section className="o2 o2-sec" data-section="status-contact">
        <div className="o2-wrap" style={{ maxWidth: '52rem' }}>
          <div className="o2-card">
            <h2>Need help with a service issue?</h2>
            <p>Delivery reports show the status returned by the messaging route. Delivery can depend on message setup, operator networks and handset availability; a report does not confirm that a person read the message. Contact support with your message reference and send time so the team can investigate.</p>
            <p className="o2-cta-line">
              <a className="o2-btn o2-btn-primary" href={`tel:${PHONE_PRIMARY}`}>Call {PHONE_PRIMARY_DISPLAY}</a>
              <a className="o2-btn o2-btn-ghost" href={`mailto:${EMAIL_SUPPORT}`}>Email support</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default StatusPage;
