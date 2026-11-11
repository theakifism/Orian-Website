import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import BentoServices from '../components/o2/BentoServices';
import FlowDiagram from '../components/o2/FlowDiagram';
import { useLang } from '../context/LangContext';
import PageContent from '../components/PageContent';

const ServicesPage = () => {
  const { t } = useLang();
  return (
    <>
      <Seo title={pageMeta.services.title} description={pageMeta.services.description} path={pageMeta.services.path} />
      <PageHeader
        eyebrow={t('svc.eyebrow')}
        title={t('svc.title')}
        subtitle={t('svc.lead')}
        breadcrumbs={[{ label: 'Services' }]}
      />
      <BentoServices showHead={false} />
      <FlowDiagram />
    <PageContent id="services" />
    </>
  );
};

export default ServicesPage;
