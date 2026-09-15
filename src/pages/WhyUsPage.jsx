import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import WhyUs from '../components/WhyUs';

const WhyUsPage = () => {
  return (
    <>
      <Seo title={pageMeta.whyUs.title} description={pageMeta.whyUs.description} path={pageMeta.whyUs.path} />
      <PageHeader
        eyebrow="Why Orian"
        title="Six reasons enterprises"
        gradientWord="stay with Orian."
        subtitle="Not just a route list — a support desk, a compliance team and an SLA that's actually held to. Tap any card for the full detail."
        breadcrumbs={[{ label: 'Why Us' }]}
      />
      <WhyUs variant="full" />
    </>
  );
};

export default WhyUsPage;
