import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { useCollection } from '../content';
import { Arrow } from '../components/o2/Icons';
import PageContent from '../components/PageContent';

const fmt = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const ResourcesPage = () => {
  const guides = useCollection('guides');
  return (
  <>
    <Seo title={pageMeta.resources.title} description={pageMeta.resources.description} path={pageMeta.resources.path} />
    <PageHeader
      eyebrow="Resources"
      title="Practical guides."
      subtitle="Short, plain guides on sending SMS well in India."
      breadcrumbs={[{ label: 'Resources' }]}
    />
    <section className="o2 o2-sec" style={{ paddingTop: '3rem' }}>
      <div className="o2-wrap">
        <div className="o2-rows">
          {guides.map((g) => (
            <Link key={g.slug} to={`/resources/${g.slug}`} className="o2-row-link" data-track="guide_row" data-track-label={g.slug}>
              <span className="n">{g.category}</span>
              <div>
                <h2>{g.title}</h2>
                <p>{g.summary} <span style={{ color: 'var(--o-text-3)' }}>{fmt(g.date)} / {g.read}</span></p>
              </div>
              <Arrow />
            </Link>
          ))}
        </div>
      </div>
    </section>
  <PageContent id="resources" />
    </>
  );
};

export default ResourcesPage;
