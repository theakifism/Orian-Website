import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { useCollection, useContentReady, findBySlug } from '../content';
import { SITE_NAME, SITE_URL } from '../seo/siteConfig';
import { guideModified } from '../seo/lastmod';
import { Arrow } from '../components/o2/Icons';
import { renderInline } from '../utils/inlineLinks';
import { getServiceBySlug } from '../data/services';
import { guideDetail } from '../data/guides.detail';

/** Blog / guide template: article body from data/guides.js, Article JSON-LD, related guides. */
const GuidePage = () => {
  const { slug } = useParams();
  const guides = useCollection('guides');
  const ready = useContentReady();
  const gBase = findBySlug(guides, slug);
  const g = gBase && { ...gBase, ...guideDetail[gBase.slug] };
  if (!g) return ready ? <Navigate to="/resources" replace /> : null;
  // Related guides first (same category, then shared services), so internal links point to the most relevant pages.
  const score = (x) => (x.category === g.category ? 2 : 0) + (x.services || []).filter((sv) => (g.services || []).includes(sv)).length;
  const more = guides.filter((x) => x.slug !== g.slug).sort((x, y) => score(y) - score(x));
  const svcs = (g.services || []).map(getServiceBySlug).filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.metaDescription,
    datePublished: g.date,
    dateModified: guideModified(g),
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/resources/${g.slug}`,
  };

  return (
    <>
      <Seo title={g.metaTitle} description={g.metaDescription} path={`/resources/${g.slug}`} type="article" jsonLd={schema} />
      <PageHeader
        eyebrow={g.category}
        title={g.title}
        subtitle={`${g.read}`}
        breadcrumbs={[{ label: 'Resources', href: '/resources' }, { label: g.category }]}
      />
      <section className="o2 o2-sec" style={{ paddingTop: '3rem' }}>
        <div className="o2-wrap">
          <article className="o2-prose">
            {g.body.map((b, i) => {
              if (b.h) return <h2 key={i}>{b.h}</h2>;
              if (b.ul) return <ul key={i}>{b.ul.map((x) => <li key={x}>{renderInline(x)}</li>)}</ul>;
              return <p key={i}>{renderInline(b.p)}</p>;
            })}
          </article>
          {svcs.length > 0 && (
            <div className="o2-prose" style={{ marginTop: '2.5rem' }}>
              <h2>Related services</h2>
              <ul>
                {svcs.map((sv) => (<li key={sv.slug}><Link to={`/services/${sv.slug}`}>{sv.title}</Link>: {sv.desc}</li>))}
              </ul>
            </div>
          )}
          {more.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <span className="o2-t-kicker">More guides</span>
              <div className="o2-rows" style={{ marginTop: '1rem' }}>
                {more.map((m) => (
                  <Link key={m.slug} to={`/resources/${m.slug}`} className="o2-row-link">
                    <span className="n">{m.category}</span>
                    <div><h3 style={{ fontSize: '1.2rem' }}>{m.title}</h3></div>
                    <Arrow />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default GuidePage;
