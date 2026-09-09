import React from 'react';
import PageHeader from '../components/PageHeader';
import WhyUs from '../components/WhyUs';

const WhyUsPage = () => {
  return (
    <>
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
