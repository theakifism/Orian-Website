import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { useCollection } from '../content';
import { Arrow } from '../components/o2/Icons';
import PageContent from '../components/PageContent';

const UseCasesPage = () => {
  const useCases = useCollection('useCases');
  return (
  <>
    <Seo title={pageMeta.useCases.title} description={pageMeta.useCases.description} path={pageMeta.useCases.path} />
    <PageHeader
      eyebrow="Use cases"
      title="What teams send with Orian."
      subtitle="Four kinds of message cover most business texting. Each one has its own template, route and rules."
      breadcrumbs={[{ label: 'Use cases' }]}
    />
    <section className="o2 o2-sec" style={{ paddingTop: '3rem' }}>
      <div className="o2-wrap">
        <div className="o2-rows">
          {useCases.map((u, i) => (
            <Link key={u.slug} to={`/use-cases/${u.slug}`} className="o2-row-link" data-track="use_case_row" data-track-label={u.slug}>
              <span className="n">0{i + 1}</span>
              <div><h2>{u.title}</h2><p>{u.short}</p></div>
              <Arrow />
            </Link>
          ))}
        </div>
      </div>
    </section>
  <PageContent id="useCases" />
    </>
  );
};

export default UseCasesPage;
