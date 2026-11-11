import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { useLang } from '../context/LangContext';
import { PLATFORM_DELIVERY_RATE, PLATFORM_UPTIME } from '../data/homeCopy';
import { PHONE_PRIMARY, PHONE_PRIMARY_DISPLAY, EMAIL_SUPPORT } from '../config/site';

const StatusPage = () => {
  const { t } = useLang();
  return (
    <>
      <Seo title={pageMeta.status.title} description={pageMeta.status.description} path={pageMeta.status.path} noindex />
      <PageHeader
        eyebrow="Service information"
        title="Platform metrics"
        subtitle="Reported uptime and message delivery rate."
        breadcrumbs={[{ label: 'Status' }]}
      >
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1.6rem' }}>
          <span className="o2-status-stat">{t('status.uptime')} <b>{PLATFORM_UPTIME}%</b></span>
          <span className="o2-status-stat">{t('status.delivery')} <b>{PLATFORM_DELIVERY_RATE}%</b></span>
        </div>
      </PageHeader>

      <section className="o2 o2-sec" data-section="status-contact">
        <div className="o2-wrap" style={{ maxWidth: '52rem' }}>
          <div className="o2-card">
            <h2>Need help with a service issue?</h2>
            <p>Contact the support team for help with a current delivery or service question.</p>
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
