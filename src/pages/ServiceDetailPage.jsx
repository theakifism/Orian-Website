import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { serviceMeta } from '../seo/pageMeta';
import { serviceSchema, faqSchema } from '../seo/jsonld';
import { useCollection, useContentReady, findBySlug } from '../content';
import { FaqList } from '../components/o2/FaqSection';
import { useUI } from '../context/UIContext';
import { Arrow } from '../components/o2/Icons';
import { guides as allGuides } from '../data/guides';
import { renderInline } from '../utils/inlineLinks';
import { useCases as allUseCases } from '../data/useCases';
import { serviceDetail } from '../data/services.detail';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { openLead, openCommand } = useUI();
  const services = useCollection('services');
  const industries = useCollection('industries');
  const ready = useContentReady();
  const serviceBase = findBySlug(services, slug);
  const service = serviceBase && { ...serviceBase, ...serviceDetail[serviceBase.slug] };

  if (!service) return ready ? <Navigate to="/services" replace /> : null;

  const related = industries.filter((i) => i.services.includes(service.slug)).slice(0, 4);
  const others = services.filter((s) => s.slug !== service.slug);
  const relatedGuides = allGuides.filter((g) => (g.services || []).includes(service.slug));
  const relatedUseCases = allUseCases.filter((u) => (u.services || []).includes(service.slug));
  const meta = serviceMeta[service.slug] || {
    title: `${service.title} | Orian Teleservices`.slice(0, 60),
    description: service.desc,
  };

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        path={`/services/${service.slug}`}
        jsonLd={[serviceSchema(service), faqSchema(service.faqs)]}
      />
      <PageHeader
        eyebrow={service.slug === 'bulk-sms-otp-gateways' ? 'Primary service' : 'Service'}
        title={service.title}
        subtitle={service.tagline}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]}
      >
        <div className="o2-cta-row" style={{ marginTop: '2rem' }}>
          <button type="button" className="o2-btn o2-btn-primary" onClick={() => openLead(`service-${service.slug}`)} data-track="service_talk_to_us">Talk to us <Arrow /></button>
          <button type="button" className="o2-btn o2-btn-ghost" onClick={openCommand}>Ask the AI assistant</button>
        </div>
      </PageHeader>

      <section className="o2 o2-sec" data-section="service-overview">
        <div className="o2-wrap">
          <div className="o2-two">
            <div>
              <span className="o2-eyebrow"><i />Overview</span>
              <p className="o2-prose" style={{ marginTop: '1.2rem', fontSize: '1.15rem' }}>{service.overview}</p>
              <dl className="o2-meter" style={{ marginTop: '2rem', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                {service.stats.map((st) => (
                  <div key={st.label}>
                    <dt>{st.label}</dt>
                    <dd className="is-text" style={{ fontSize: '1rem', paddingTop: '0.1rem' }}>{st.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <span className="o2-eyebrow"><i />What is included</span>
              <ul className="o2-list" style={{ marginTop: '1.2rem' }}>
                {service.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {service.sections?.length > 0 && (
        <section className="o2 o2-sec" data-section="service-detail">
          <div className="o2-wrap">
            <article className="o2-prose" style={{ maxWidth: '46rem' }}>
              {service.sections.map((sec) => (
                <React.Fragment key={sec.title}>
                  <h2>{sec.title}</h2>
                  {sec.p && <p>{renderInline(sec.p)}</p>}
                </React.Fragment>
              ))}
            </article>
          </div>
        </section>
      )}

      <section className="o2 o2-sec is-alt" data-section="service-steps">
        <div className="o2-wrap">
          <div className="o2-sec-head"><span className="o2-eyebrow"><i />How it works</span><h2 className="o2-h2">From first call to live.</h2></div>
          <div className="o2-stepper cols-4">
            {service.howItWorks.map((s) => (<div key={s.title}><h3>{s.title}</h3><p>{s.desc}</p></div>))}
          </div>
        </div>
      </section>

      <section className="o2 o2-sec" data-section="service-faq">
        <div className="o2-wrap">
          <div className="o2-two">
            <div>
              <div className="o2-sec-head" style={{ marginBottom: '1.5rem' }}><span className="o2-eyebrow"><i />FAQ</span><h2 className="o2-h2">Frequently asked.</h2></div>
              <FaqList faqs={service.faqs} />
            </div>
            <div style={{ display: 'grid', gap: '1.5rem', alignContent: 'start' }}>
              {related.length > 0 && (
                <div className="o2-card">
                  <span className="o2-t-kicker">Popular in</span>
                  <div className="o2-chiprow" style={{ marginTop: '1rem' }}>
                    {related.map((i) => <Link key={i.slug} to={`/industries/${i.slug}`} className="o2-chip" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>{i.name}</Link>)}
                  </div>
                </div>
              )}
              {relatedUseCases.length > 0 && (
                <div className="o2-card">
                  <span className="o2-t-kicker">Use cases</span>
                  <ul className="o2-list" style={{ marginTop: '1rem' }}>
                    {relatedUseCases.map((u) => (<li key={u.slug}><Link to={`/use-cases/${u.slug}`} style={{ color: 'var(--o-text-2)' }}>{u.title}</Link></li>))}
                  </ul>
                </div>
              )}
              {relatedGuides.length > 0 && (
                <div className="o2-card">
                  <span className="o2-t-kicker">Guides</span>
                  <ul className="o2-list" style={{ marginTop: '1rem' }}>
                    {relatedGuides.map((g) => (<li key={g.slug}><Link to={`/resources/${g.slug}`} style={{ color: 'var(--o-text-2)' }}>{g.title}</Link></li>))}
                  </ul>
                </div>
              )}
              <div className="o2-card">
                <span className="o2-t-kicker">Other services</span>
                <ul className="o2-list" style={{ marginTop: '1rem' }}>
                  {others.map((s) => (<li key={s.slug}><Link to={`/services/${s.slug}`} style={{ color: 'var(--o-text-2)' }}>{s.title}</Link></li>))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
