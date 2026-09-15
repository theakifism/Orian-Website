import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import About from '../components/About';
import Interactive3DNetwork from '../components/Interactive3DNetwork';

const milestones = [
  { year: '15+ yrs', label: 'Combined industry experience across founders' },
  { year: '1,200+', label: 'Direct operator routes connected' },
  { year: '180+', label: 'Countries reachable today' },
  { year: '99.99%', label: 'Uptime SLA maintained' },
];

const AboutPage = () => {
  return (
    <>
      <Seo title={pageMeta.about.title} description={pageMeta.about.description} path={pageMeta.about.path} />
      <PageHeader
        eyebrow="About Orian"
        title="Built by messaging"
        gradientWord="industry veterans."
        subtitle="Fifteen-plus years of handling OTT, enterprise and aggregator traffic, distilled into one platform — SMS, voice and WhatsApp, all from a single dashboard."
        breadcrumbs={[{ label: 'About' }]}
      />

      <About variant="full" />

      <section className="relative py-20 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <Interactive3DNetwork size={300} className="mx-auto" />
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">By The Numbers</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] tracking-tight mt-2">
                What fifteen years builds
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {milestones.map((m) => (
                <div
                  key={m.label}
                  className="p-5 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl hover:border-[#00AEEF]/50 hover:shadow-[0_0_25px_rgba(0,174,239,0.2)] transition-all duration-300"
                >
                  <div className="text-2xl md:text-3xl font-extrabold font-mono text-[#00AEEF]">{m.year}</div>
                  <div className="text-xs text-[var(--text-faint)] mt-1 leading-snug">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
