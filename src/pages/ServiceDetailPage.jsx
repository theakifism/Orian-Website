import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Accordion from '../components/Accordion';
import Seo from '../seo/Seo';
import { serviceMeta } from '../seo/pageMeta';
import { serviceSchema, faqSchema } from '../seo/jsonld';
import { getServiceBySlug, services } from '../data/services';
import { industries } from '../data/industries';
import { GatewayIcon, WaveformIcon, ShieldCheckIcon, ChatIcon, CheckCircleIcon } from '../components/CardIcons';

const iconMap = {
  gateway: GatewayIcon,
  waveform: WaveformIcon,
  shield: ShieldCheckIcon,
  chat: ChatIcon,
};

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = iconMap[service.icon] || GatewayIcon;
  const relatedIndustries = industries.filter((i) => i.services.includes(service.slug)).slice(0, 4);
  const otherServices = services.filter((s) => s.slug !== service.slug);

  // Falls back to auto-generated copy if this slug isn't in the
  // hand-tuned serviceMeta map yet (e.g. a newly added service).
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
        eyebrow="Service"
        title={service.title}
        subtitle={service.tagline}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]}
        glowClass="bg-[#00AEEF]/10"
      />

      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-8">
            {/* Overview card */}
            <div className={`p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl transition-all duration-300 ${service.borderHover}`}>
              <span className={`inline-flex w-11 h-11 items-center justify-center rounded-xl mb-5 ${service.tagColor}`}>
                <Icon className="w-6 h-6" />
              </span>
              <p className="text-[var(--text-soft)] text-sm md:text-base leading-relaxed">{service.overview}</p>

              <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-[var(--border)]">
                {service.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-lg md:text-2xl font-extrabold font-mono" style={{ color: service.accentColor }}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] md:text-xs text-[var(--text-faint)] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-[var(--text)] mb-5">What's included</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 p-4 bg-[var(--overlay)] border border-[var(--border)] rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = service.accentColor; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
                  >
                    <span className="shrink-0 mt-0.5" style={{ color: service.accentColor }}>
                      <CheckCircleIcon className="w-5 h-5" />
                    </span>
                    <span className="text-xs md:text-sm text-[var(--text-soft)] leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-[var(--text)] mb-6">How it works</h2>
              <div className="space-y-6">
                {service.howItWorks.map((step, idx) => (
                  <div key={step.title} className="flex gap-4">
                    <div
                      className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold font-mono border"
                      style={{ borderColor: `${service.accentColor}66`, color: service.accentColor, backgroundColor: `${service.accentColor}1A` }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text)] mb-1">{step.title}</h3>
                      <p className="text-xs md:text-sm text-[var(--text-dim)] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-[var(--text)] mb-2">Frequently asked</h2>
              <Accordion items={service.faqs} accentColor={service.accentColor} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl text-center">
              <p className="text-sm text-[var(--text-dim)] mb-4">Ready to set up {service.title.toLowerCase()}?</p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#E8A23D] transition-colors"
              >
                Talk to our team &rarr;
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 mt-3 bg-[var(--overlay)] border border-[var(--border)] text-[var(--text-soft)] font-semibold rounded-xl text-sm hover:bg-[var(--overlay-strong)] transition-colors"
              >
                Ask the AI assistant
              </Link>
            </div>

            {relatedIndustries.length > 0 && (
              <div className="p-6 bg-[var(--surface)]/70 border border-[var(--border)] rounded-2xl">
                <span className="text-xs font-mono tracking-widest text-[var(--text-faint)] uppercase">Popular in</span>
                <div className="flex flex-wrap gap-2 mt-3">
                  {relatedIndustries.map((ind) => (
                    <Link
                      key={ind.slug}
                      to={`/industries/${ind.slug}`}
                      className={`px-3 py-1.5 border border-[var(--border)] rounded-full text-xs font-mono text-[var(--text-soft)] transition-all duration-300 hover:-translate-y-0.5 ${ind.hover}`}
                    >
                      {ind.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-[var(--surface)]/70 border border-[var(--border)] rounded-2xl">
              <span className="text-xs font-mono tracking-widest text-[var(--text-faint)] uppercase">Other Services</span>
              <div className="flex flex-col gap-2 mt-3">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="text-sm text-[var(--text-soft)] hover:text-[#00AEEF] transition-colors"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
