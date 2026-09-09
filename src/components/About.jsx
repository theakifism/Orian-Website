import React from 'react';
import { Link } from 'react-router-dom';
import { industries } from '../data/industries';

/**
 * `variant="preview"` (home page) shows a shorter story and a handful of
 * sector chips, pointing to /about and /industries for the rest.
 * `variant="full"` (the /about page) shows the complete story and every
 * sector chip, each linking to its own /industries/:slug page.
 */
const About = ({ variant = 'full' }) => {
  const shownIndustries = variant === 'preview' ? industries.slice(0, 10) : industries;

  return (
    <section id="about" className="scroll-mt-24 relative py-24 bg-transparent overflow-hidden">
      {/* Background Motion Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">

        {/* Left Column: Story */}
        <div className="space-y-6">
          <span className="text-xs font-mono tracking-widest text-[#E8A23D] uppercase">About Us</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight">
            Orian <span className="bg-gradient-to-r from-[#00AEEF] via-purple-500 to-[#E8A23D] bg-clip-text text-transparent">Teleservices</span>
          </h2>
          <p className="text-[var(--text-soft)] text-base leading-relaxed">
            In a world of growing technology, communication plays a vital role in helping businesses spread their footprint globally.
          </p>
          <p className="text-[var(--text-dim)] text-sm leading-relaxed">
            Orian Tele Services Private Limited was established by veterans of the messaging industry with more than 15 years of experience handling OTT, Enterprise, and Aggregator clients globally.
          </p>
          <div className="p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl shadow-2xl hover:border-[#00AEEF]/50 hover:shadow-[0_0_30px_rgba(0,174,239,0.2)] transition-all duration-300">
            <p className="text-[var(--text-soft)] text-sm leading-relaxed">
              With messaging, voice, and digital media, we aim to provide a one-stop solution for what emerging SMEs and MSMEs need today. We're connected to more than 1,200 operators across 180 countries — with scalable, user-friendly solutions that let our clients serve their customers efficiently.
            </p>
          </div>
          {variant === 'preview' && (
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00AEEF] hover:text-[#E8A23D] transition-colors"
            >
              Read our full story &rarr;
            </Link>
          )}
        </div>

        {/* Right Column: Dynamic Interactive Sectors */}
        <div className="space-y-6">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">Sectors We Serve</span>
            <Link
              to="/industries"
              className="text-xs font-semibold text-[var(--text-faint)] hover:text-[#00AEEF] transition-colors"
            >
              View all industries &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {shownIndustries.map((sector) => (
              <Link
                to={`/industries/${sector.slug}`}
                key={sector.slug}
                className={`px-4 py-2 bg-[var(--overlay)] border border-[var(--border)] text-[var(--text-soft)] text-xs font-medium font-mono rounded-full cursor-pointer transform hover:-translate-y-1 hover:scale-110 transition-all duration-300 ${sector.hover}`}
              >
                {sector.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
