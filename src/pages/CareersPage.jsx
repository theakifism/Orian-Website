import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import Careers from '../components/Careers';

const values = [
  { title: 'Remote-first', desc: 'Our team operates across cities — what matters is the work, not the seat you sit in.' },
  { title: 'Telecom depth', desc: 'You\u2019ll work alongside people who\u2019ve built carrier routing for 15+ years, not generalists guessing at it.' },
  { title: 'Ship fast', desc: 'Small team, real ownership — features go from idea to production in days, not quarters.' },
];

const CareersPage = () => {
  return (
    <>
      <Seo title={pageMeta.careers.title} description={pageMeta.careers.description} path={pageMeta.careers.path} />
      <PageHeader
        eyebrow="Careers & Culture"
        title="Help us build the"
        gradientWord="next carrier backbone."
        subtitle="No open roles today, but we're actively scouting for telecom routing, cloud infrastructure and AI engineering talent for what's next."
        breadcrumbs={[{ label: 'Careers' }]}
        glowClass="bg-purple-500/10"
      />

      <section className="relative pb-4 bg-transparent overflow-hidden">
        {/* Visually hidden — keeps the h1 -> h2 -> h3 heading order intact
            without changing the page's visual design (the section doesn't
            need a visible heading of its own above the value cards). */}
        <h2 className="sr-only">Life at Orian Teleservices</h2>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl hover:border-[#00AEEF]/40 hover:shadow-[0_0_25px_rgba(0,174,239,0.2)] transition-all duration-300"
            >
              <h3 className="text-base font-bold text-[var(--text)] mb-2">{v.title}</h3>
              <p className="text-xs md:text-sm text-[var(--text-dim)] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Careers />
    </>
  );
};

export default CareersPage;
