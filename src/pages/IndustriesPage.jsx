import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import TiltCard from '../components/TiltCard';
import { industries } from '../data/industries';

const IndustriesPage = () => {
  return (
    <>
      <PageHeader
        eyebrow="Sectors We Serve"
        title="Messaging tuned for"
        gradientWord="every industry."
        subtitle="Twenty sectors, one platform. Tap any industry to see exactly how banks, hospitals, retailers and more put Orian's SMS, voice and WhatsApp channels to work."
        breadcrumbs={[{ label: 'Industries' }]}
      />

      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, idx) => (
              <TiltCard key={industry.slug} delay={(idx % 6) * 60}>
                <Link
                  to={`/industries/${industry.slug}`}
                  className={`block h-full p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl transition-all duration-300 group ${industry.hover}`}
                >
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">{industry.name}</h3>
                  <p className="text-[var(--text-dim)] text-xs leading-relaxed group-hover:text-[var(--text-soft)] transition-colors">
                    {industry.blurb}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                    View details &rarr;
                  </span>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default IndustriesPage;
