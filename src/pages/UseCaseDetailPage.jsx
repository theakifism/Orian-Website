import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { faqSchema } from '../seo/jsonld';
import { useCollection, useContentReady, findBySlug } from '../content';
import { FaqList } from '../components/o2/FaqSection';
import ImageSlot from '../components/o2/ImageSlot';
import { useUI } from '../context/UIContext';
import { Arrow } from '../components/o2/Icons';
import { renderInline } from '../utils/inlineLinks';
import { getServiceBySlug } from '../data/services';
import { guides as allGuides } from '../data/guides';
import { useCaseDetail } from '../data/useCases.detail';

const UseCaseDetailPage = () => {
  const { slug } = useParams();
  const { openLead } = useUI();
  const useCases = useCollection('useCases');
  const ready = useContentReady();
  const uBase = findBySlug(useCases, slug);
  const u = uBase && { ...uBase, ...useCaseDetail[uBase.slug] };
  if (!u) return ready ? <Navigate to="/use-cases" replace /> : null;
  const others = useCases.filter((x) => x.slug !== u.slug);
  const svcs = (u.services || []).map(getServiceBySlug).filter(Boolean);
  const reads = (u.guides || []).map((g) => allGuides.find((x) => x.slug === g)).filter(Boolean);

  return (
    <>
      <Seo
        title={u.metaTitle}
        description={u.metaDescription}
        path={`/use-cases/${u.slug}`}
        jsonLd={faqSchema(u.faqs)}
      />
      <PageHeader
        eyebrow="Use case"
        title={u.title}
        subtitle={u.short}
        breadcrumbs={[{ label: 'Use cases', href: '/use-cases' }, { label: u.title }]}
      >
        <div className="o2-cta-row" style={{ marginTop: '2rem' }}>
          <button type="button" className="o2-btn o2-btn-primary" onClick={() => openLead(`usecase-${u.slug}`)} data-track="usecase_talk_to_us">Talk to us <Arrow /></button>
          <Link to="/developers" className="o2-btn o2-btn-ghost">Discuss integration</Link>
        </div>
      </PageHeader>

      <section className="o2 o2-sec" data-section="usecase-body">
        <div className="o2-wrap">
          <div className="o2-two">
            <div>
              <p className="o2-prose" style={{ fontSize: '1.15rem' }}>{u.intro}</p>
              <ul className="o2-list" style={{ marginTop: '1.6rem' }}>{u.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
            <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
              {(svcs.length > 0 || reads.length > 0) && (
                <div className="o2-card">
                  {svcs.length > 0 && (<>
                    <span className="o2-t-kicker">Services behind this use case</span>
                    <ul className="o2-list" style={{ marginTop: '0.9rem' }}>
                      {svcs.map((sv) => (<li key={sv.slug}><Link to={`/services/${sv.slug}`} style={{ color: 'var(--o-text-2)' }}>{sv.title}</Link></li>))}
                    </ul>
                  </>)}
                  {reads.length > 0 && (<>
                    <span className="o2-t-kicker" style={{ display: 'block', marginTop: '1.2rem' }}>Read next</span>
                    <ul className="o2-list" style={{ marginTop: '0.9rem' }}>
                      {reads.map((g) => (<li key={g.slug}><Link to={`/resources/${g.slug}`} style={{ color: 'var(--o-text-2)' }}>{g.title}</Link></li>))}
                    </ul>
                  </>)}
                </div>
              )}
              <ImageSlot name={u.image} alt={u.title} />
            </div>
          </div>
        </div>
      </section>

      {u.sections?.length > 0 && (
        <section className="o2 o2-sec" data-section="usecase-detail">
          <div className="o2-wrap">
            <article className="o2-prose" style={{ maxWidth: '46rem' }}>
              {u.sections.map((sec) => (
                <React.Fragment key={sec.title}>
                  <h2>{sec.title}</h2>
                  {sec.p && <p>{renderInline(sec.p)}</p>}
                  {sec.ul && <ul>{sec.ul.map((x) => <li key={x}>{x}</li>)}</ul>}
                </React.Fragment>
              ))}
            </article>
          </div>
        </section>
      )}

      <section className="o2 o2-sec is-alt" data-section="usecase-steps">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />Setup</span><h2 className="o2-h2">Three steps to send.</h2></div>
          <div className="o2-stepper cols-3">{u.steps.map((s) => (<div key={s.title}><h3>{s.title}</h3><p>{s.desc}</p></div>))}</div>
        </div>
      </section>

      <section className="o2 o2-sec" data-section="usecase-faq">
        <div className="o2-wrap">
          <div className="o2-two">
            <div>
              <div className="o2-sec-head" style={{ marginBottom: '1.5rem' }}><span className="o2-eyebrow"><i />FAQ</span><h2 className="o2-h2">Questions.</h2></div>
              <FaqList faqs={u.faqs} />
            </div>
            <div className="o2-card" style={{ alignSelf: 'start' }}>
              <span className="o2-t-kicker">More use cases</span>
              <ul className="o2-list" style={{ marginTop: '1rem' }}>
                {others.map((o) => (<li key={o.slug}><Link to={`/use-cases/${o.slug}`} style={{ color: 'var(--o-text-2)' }}>{o.title}</Link></li>))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UseCaseDetailPage;
