import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { buildIndustryMeta } from '../seo/dynamicMeta';
import { getIndustryBySlug, industries } from '../data/industries';
import { getServiceBySlug } from '../data/services';
import { CheckCircleIcon } from '../components/CardIcons';

const IndustryDetailPage = () => {
  const { slug } = useParams();
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  const related = industries.filter((i) => i.slug !== industry.slug).slice(0, 3);
  const meta = buildIndustryMeta(industry);

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={`/industries/${industry.slug}`} />
      <PageHeader
        eyebrow="Industry"
        title={industry.name}
        subtitle={industry.overview}
        breadcrumbs={[{ label: 'Industries', href: '/industries' }, { label: industry.name }]}
      />

      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-[var(--text)] mb-5">How Orian helps in {industry.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {industry.useCases.map((useCase) => (
                  <div
                    key={useCase}
                    className="flex items-start gap-3 p-4 bg-[var(--overlay)] border border-[var(--border)] rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00AEEF]/60"
                  >
                    <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5 text-[#00AEEF]" />
                    <span className="text-xs md:text-sm text-[var(--text-soft)] leading-snug">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[var(--surface)]/70 border border-[var(--border)] rounded-2xl">
              <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">Recommended Services</span>
              <div className="flex flex-wrap gap-3 mt-4">
                {industry.services.map((serviceSlug) => {
                  const service = getServiceBySlug(serviceSlug);
                  if (!service) return null;
                  return (
                    <Link
                      key={serviceSlug}
                      to={`/services/${serviceSlug}`}
                      className={`px-4 py-2 border rounded-full text-xs font-medium font-mono transition-all duration-300 hover:-translate-y-0.5 ${service.borderHover} border-[var(--border)] text-[var(--text-soft)]`}
                    >
                      {service.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl text-center">
              <p className="text-sm text-[var(--text-dim)] mb-4">Have a requirement specific to {industry.name.toLowerCase()}?</p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#E8A23D] transition-colors"
              >
                Talk to our team &rarr;
              </Link>
            </div>

            <div className="p-6 bg-[var(--surface)]/70 border border-[var(--border)] rounded-2xl">
              <span className="text-xs font-mono tracking-widest text-[var(--text-faint)] uppercase">Other Industries</span>
              <div className="flex flex-col gap-2 mt-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/industries/${r.slug}`}
                    className="text-sm text-[var(--text-soft)] hover:text-[#00AEEF] transition-colors"
                  >
                    {r.name}
                  </Link>
                ))}
                <Link to="/industries" className="text-sm text-[#00AEEF] hover:text-[#E8A23D] transition-colors mt-1">
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
