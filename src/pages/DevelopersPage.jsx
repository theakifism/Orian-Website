import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import SpecialRequirement from '../components/SpecialRequirement';
import PageContent from '../components/PageContent';

const DevelopersPage = () => (
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
            <p className="o2-lead">Request API credentials and technical documentation from our team. Sandbox keys are usually issued within minutes of signup; most clients reach a first live send in under 48 hours after their documents arrive, subject to DLT approvals.</p>
          </div>
          <SpecialRequirement
            embedded
            initialRequirementType="Custom / Enterprise Solution"
            initialMessage="I would like API credentials and technical documentation for my messaging integration."
            submitLabel="Send integration enquiry"
            source="developers"
          />
        </div>
      </div>
    </section>

    <PageContent id="developers" />
  </>
);

export default DevelopersPage;
