import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import AnimatedIconBadge from '../components/AnimatedIconBadge';
import Reveal from '../components/Reveal';
import { industries } from '../data/industries';
import { litCardProps } from '../utils/litCard';
import { photoProps } from '../utils/photo';
import PageContent from '../components/PageContent';

const INDUSTRY_ACCENTS = ['#00AEEF', '#00AEEF', '#00AEEF'];
// Same colors as INDUSTRY_ACCENTS, as a translucent glow for the persistent
// lit-card hover (see litCardProps) — kept in sync so every card grid on
// the site shares the exact same hover treatment.
const INDUSTRY_GLOWS = ['rgba(0, 174, 239, 0.35)', 'rgba(168, 85, 247, 0.35)', 'rgba(52, 211, 153, 0.35)'];

// A handful of recognizable sectors, shown first as an alternating
// image-left/text-right, text-left/image-right "zig-zag" — the pattern
// from GoDaddy's careers page team rows — before the full grid of every
// sector below.
const FEATURED_SLUGS = ['banking', 'healthcare-hospitals', 'retail', 'educational-institutes'];

const IndustriesPage = () => {
  const featured = FEATURED_SLUGS
    .map((slug) => industries.find((i) => i.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Seo title={pageMeta.industries.title} description={pageMeta.industries.description} path={pageMeta.industries.path} />
      <PageHeader
        eyebrow="Sectors We Serve"
        title="Messaging tuned for"
        gradientWord="every industry."
        subtitle="Whatever you sell, your customers expect to hear from you instantly. See exactly how banks, hospitals, retailers and 17 other sectors use Orian's SMS, voice and WhatsApp channels to cut response time and win more repeat business."
        breadcrumbs={[{ label: 'Industries' }]}
      />

      {/* Featured sectors — zig-zag rows */}
      <section className="relative pt-4 pb-16 bg-transparent overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 space-y-16 md:space-y-24">
          {featured.map((industry, idx) => {
            const accent = INDUSTRY_ACCENTS[idx % INDUSTRY_ACCENTS.length];
            const reversed = idx % 2 === 1;
            return (
              <Reveal
                as="div"
                key={industry.slug}
                variant="side"
                side={reversed ? 'right' : 'left'}
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center`}
              >
                <div className={reversed ? 'md:order-2' : ''}>
                  <div
                    className="aspect-[4/3] rounded-2xl border border-(--border) overflow-hidden bg-(--surface)"
                  >
                    <img
                      {...photoProps(`industries/${industry.slug}.jpg`, "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
                      alt={`${industry.name} — Orian messaging use case`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Falls back to a plain color panel if the photo
                        // file hasn't been added to src/assets/images/industries/
                        // yet, so a missing file never shows a broken-image
                        // icon on the live site.
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.style.backgroundColor = `${accent}14`;
                      }}
                    />
                  </div>
                </div>
                <div className={reversed ? 'md:order-1' : ''}>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-(--text) tracking-tight mb-3">
                    {industry.name}
                  </h2>
                  <p className="text-(--text-dim) text-sm md:text-base leading-relaxed mb-5">
                    {industry.overview}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {industry.useCases.slice(0, 3).map((uc) => (
                      <li key={uc} className="flex items-start gap-2 text-sm text-(--text-soft)">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                        {uc}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/industries/${industry.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-(--border) rounded-full text-sm font-semibold text-(--text) hover:bg-(--overlay) transition-colors"
                  >
                    Explore {industry.name} &rarr;
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Every sector — full grid */}
      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold text-(--text) mb-6">All sectors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, idx) => {
              const accent = INDUSTRY_ACCENTS[idx % INDUSTRY_ACCENTS.length];
              const glow = INDUSTRY_GLOWS[idx % INDUSTRY_GLOWS.length];
              return (
                <Link
                  key={industry.slug}
                  to={`/industries/${industry.slug}`}
                  {...litCardProps(accent, glow)}
                  className="block h-full p-6 bg-(--surface)/90 border border-(--border) rounded-2xl backdrop-blur-xl transition-all duration-300 group"
                >
                  <AnimatedIconBadge
                    color={accent}
                    size="sm"
                    className="mb-3 transition-transform duration-300 group-hover:scale-110"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                  </AnimatedIconBadge>
                  <h3 className="text-lg font-bold text-(--text) mb-2">{industry.name}</h3>
                  <p className="text-(--text-dim) text-xs leading-relaxed group-hover:text-(--text-soft) transition-colors">
                    {industry.blurb}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-[10px] font-semibold uppercase tracking-wider text-(--text-faint)">
                    View details &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    <PageContent id="industries" />
    </>
  );
};

export default IndustriesPage;
