import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta, whyUsCountWord } from '../seo/pageMeta';
import WhyUs from '../components/WhyUs';
import PageContent from '../components/PageContent';

const WhyUsPage = () => {
  return (
    <>
      <Seo title={pageMeta.whyUs.title} description={pageMeta.whyUs.description} path={pageMeta.whyUs.path} />
      <PageHeader
        eyebrow="Why Orian"
        title={`${whyUsCountWord} reasons enterprises`}
        gradientWord="stay with Orian."
        subtitle="Review support, onboarding, security and delivery topics, then ask our team what applies to your account."
        breadcrumbs={[{ label: 'Why Us' }]}
      />
      <WhyUs variant="full" />
    <PageContent id="whyUs" />
    </>
  );
};

export default WhyUsPage;
