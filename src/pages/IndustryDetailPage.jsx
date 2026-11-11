import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { buildIndustryMeta } from '../seo/dynamicMeta';
import { getIndustryBySlug, industries } from '../data/industries';
import { getServiceBySlug } from '../data/services';
import { CheckCircleIcon } from '../components/CardIcons';
import { litCardProps } from '../utils/litCard';
import { photoProps } from '../utils/photo';
import { faqSchema } from '../seo/jsonld';
import { guides } from '../data/guides';
import { industryDetail } from '../data/industries.detail';

const IndustryDetailPage = () => {
  const { slug } = useParams();
  const industryBase = getIndustryBySlug(slug);
  const industry = industryBase && { ...industryBase, ...industryDetail[industryBase.slug] };

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  const related = industries.filter((i) => i.slug !== industry.slug).slice(0, 3);
  const meta = buildIndustryMeta(industry);
  const relatedGuides = (industry.guides || []).map((g) => guides.find((x) => x.slug === g)).filter(Boolean);
  const card = 'p-8 bg-(--surface)/90 border border-(--border) rounded-2xl backdrop-blur-xl';

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={`/industries/${industry.slug}`} jsonLd={industry.faqs?.length ? faqSchema(industry.faqs) : undefined} />
      <PageHeader
        eyebrow="Industry"
        title={industry.name}
        subtitle={industry.overview}
        breadcrumbs={[{ label: 'Industries', href: '/industries' }, { label: industry.name }]}
      />

      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">
            {/* Real photo banner — src/assets/images/industries/<slug>.jpg,
                one per industry (all 20, not just the 4 featured on the
                Industries page zig-zag). Falls back to a plain panel if
                the file hasn't been added yet. */}
            <div className="aspect-21/9 rounded-2xl border border-(--border) overflow-hidden bg-(--surface)">
              <img
                {...photoProps(`industries/${industry.slug}.jpg`, "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
                alt={`${industry.name} — Orian messaging use case`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.style.backgroundColor = 'var(--overlay)';
                }}
              />
            </div>

            <div className="p-8 bg-(--surface)/90 border border-(--border) rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-(--text) mb-5">How Orian helps in {industry.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {industry.useCases.map((useCase) => (
                  <div
                    key={useCase}
                    className="flex items-start gap-3 p-4 bg-(--overlay) border border-(--border) rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    {...litCardProps('#00AEEF', 'rgba(0, 174, 239, 0.35)', { tilt: false })}
                  >
                    <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5 text-[#00AEEF]" />
                    <span className="text-xs md:text-sm text-(--text-soft) leading-snug">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            {industry.overviewMore && (
              <div className={`${card} space-y-4`}>
                <h2 className="text-xl font-bold text-(--text)">Messaging in {industry.name}: what to plan for</h2>
                {industry.overviewMore.map((para) => (
                  <p key={para.slice(0, 40)} className="text-sm text-(--text-soft) leading-relaxed">{para}</p>
                ))}
              </div>
            )}

            {industry.scenarios && (
              <div className={card}>
                <h2 className="text-xl font-bold text-(--text) mb-5">Where {industry.name} teams use SMS and voice</h2>
                <div className="space-y-5">
                  {industry.scenarios.map((sc) => (
                    <div key={sc.title}>
                      <h3 className="text-base font-semibold text-(--text) mb-1">{sc.title}</h3>
                      <p className="text-sm text-(--text-soft) leading-relaxed">{sc.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {industry.compliance && (
              <div className={card}>
                <h2 className="text-xl font-bold text-(--text) mb-3">{industry.compliance.title}</h2>
                <p className="text-sm text-(--text-soft) leading-relaxed mb-4">{industry.compliance.intro}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-(--text-soft) leading-relaxed">
                  {industry.compliance.notes.map((n) => <li key={n.slice(0, 40)}>{n}</li>)}
                </ul>
              </div>
            )}

            {industry.serviceLinks && (
              <div className={card}>
                <h2 className="text-xl font-bold text-(--text) mb-3">Services that fit {industry.name}</h2>
                <ul className="space-y-2 text-sm text-(--text-soft) leading-relaxed">
                  {industry.serviceLinks.map((l) => (
                    <li key={l.slug}>
                      {l.lead}{' '}
                      <Link to={`/services/${l.slug}`} className="text-[#00AEEF] hover:text-[#35C1F4] underline underline-offset-2">{l.anchor}</Link>
                      {l.tail}
                    </li>
                  ))}
                </ul>
                {relatedGuides.length > 0 && (
                  <p className="text-sm text-(--text-soft) leading-relaxed mt-4">
                    Further reading:{' '}
                    {relatedGuides.map((g, i) => (
                      <React.Fragment key={g.slug}>
                        {i > 0 && ' · '}
                        <Link to={`/resources/${g.slug}`} className="text-[#00AEEF] hover:text-[#35C1F4] underline underline-offset-2">{g.title}</Link>
                      </React.Fragment>
                    ))}
                  </p>
                )}
              </div>
            )}

            {industry.faqs && (
              <div className={card}>
                <h2 className="text-xl font-bold text-(--text) mb-5">{industry.name} messaging: common questions</h2>
                <div className="space-y-5">
                  {industry.faqs.map((f) => (
                    <div key={f.q}>
                      <h3 className="text-base font-semibold text-(--text) mb-1">{f.q}</h3>
                      <p className="text-sm text-(--text-soft) leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-(--surface)/70 border border-(--border) rounded-2xl">
              <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">Recommended Services</span>
              <div className="flex flex-wrap gap-3 mt-4">
                {industry.services.map((serviceSlug) => {
                  const service = getServiceBySlug(serviceSlug);
                  if (!service) return null;
                  return (
                    <Link
                      key={serviceSlug}
                      to={`/services/${serviceSlug}`}
                      className={`px-4 py-2 border rounded-full text-xs font-medium font-mono transition-all duration-300 hover:-translate-y-0.5 ${service.borderHover} border-(--border) text-(--text-soft)`}
                    >
                      {service.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-6 bg-(--surface)/90 border border-(--border) rounded-2xl text-center">
              <p className="text-sm text-(--text-dim) mb-4">Have a requirement specific to {industry.name.toLowerCase()}?</p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#35C1F4] transition-colors"
              >
                Talk to our team &rarr;
              </Link>
            </div>

            <div className="p-6 bg-(--surface)/70 border border-(--border) rounded-2xl">
              <span className="text-xs font-mono tracking-widest text-(--text-faint) uppercase">Other Industries</span>
              <div className="flex flex-col gap-2 mt-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/industries/${r.slug}`}
                    className="text-sm text-(--text-soft) hover:text-[#00AEEF] transition-colors"
                  >
                    {r.name}
                  </Link>
                ))}
                <Link to="/industries" className="text-sm text-[#00AEEF] hover:text-[#35C1F4] transition-colors mt-1">
                  View all industries &rarr;
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
};

export default IndustryDetailPage;
