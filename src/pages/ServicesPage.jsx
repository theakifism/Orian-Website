import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import Services from '../components/Services';
import Interactive3DNetwork from '../components/Interactive3DNetwork';

const ServicesPage = () => {
  return (
    <>
      <Seo title={pageMeta.services.title} description={pageMeta.services.description} path={pageMeta.services.path} />
      <PageHeader
        eyebrow="Our Offerings"
        title="Four channels,"
        gradientWord="one enterprise suite."
        subtitle="Bulk SMS, voice, DLT compliance and WhatsApp Business API — built and supported by the same team, on the same carrier-grade network."
        breadcrumbs={[{ label: 'Services' }]}
      />

      <section className="relative pb-4 bg-transparent overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Interactive3DNetwork
            size={280}
            className="mx-auto"
            legend={[
              { label: 'SMS & OTP', color: '#00AEEF' },
              { label: 'Voice & IVR', color: '#A855F7' },
              { label: 'WhatsApp API', color: '#E8A23D' },
            ]}
          />
        </div>
      </section>

      <Services variant="full" />
    </>
  );
};

export default ServicesPage;
