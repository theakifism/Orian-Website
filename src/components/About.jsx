import React from 'react';
import { Link } from 'react-router-dom';
import { litCardProps } from '../utils/litCard';
import { T, useCollection } from '../content';

/**
 * `variant="preview"` (home page) shows a shorter story and a handful of
 * sector chips, pointing to /about and /industries for the rest.
 * `variant="full"` (the /about page) shows the complete story and every
 * sector chip, each linking to its own /industries/:slug page.
 */
const About = ({ variant = 'full' }) => {
  const industries = useCollection('industries');
  const shownIndustries = variant === 'preview' ? industries.slice(0, 10) : industries;

  return (
    <section id="about" className="scroll-mt-24 relative py-24 bg-transparent overflow-hidden">
      {/* Background Motion Glow */}

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">

        {/* Left Column: Story */}
        <div className="space-y-6">
          <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase"><T k="About.1" d={"About Us"} /></span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight">
            <T k="About.2" d={"Orian "} /><span className="text-[#00AEEF]"><T k="About.3" d={"Teleservices"} /></span>
          </h2>
          <p className="text-[var(--text-soft)] text-base leading-relaxed">
            <T k="About.4" d={"In a world of growing technology, communication plays a vital role in helping businesses spread their footprint globally."} />
          </p>
          <p className="text-[var(--text-dim)] text-sm leading-relaxed">
            <T k="About.5" d={"Orian Teleservices provides business messaging and related communication services. Contact our team to discuss current offerings and service arrangements."} />
          </p>
          <div
            className="p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-300"
            {...litCardProps('#00AEEF', 'rgba(0, 174, 239, 0.35)', { tilt: false })}
          >
            <p className="text-[var(--text-soft)] text-sm leading-relaxed">
              <T k="About.6" d={"Explore messaging, voice and related services for your business. Available features, integrations and service arrangements depend on your requirements."} />
            </p>
          </div>
          {variant === 'preview' && (
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00AEEF] hover:text-[#35C1F4] transition-colors"
            >
              <T k="About.7" d={"Read our full story →"} />
            </Link>
          )}
        </div>

        {/* Right Column: Dynamic Interactive Sectors */}
        <div className="space-y-6">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase"><T k="About.8" d={"Sectors We Serve"} /></span>
            <Link
              to="/industries"
              className="text-xs font-semibold text-[var(--text-faint)] hover:text-[#00AEEF] transition-colors"
            >
              <T k="About.9" d={"View all industries →"} />
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
