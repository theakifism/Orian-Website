import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Consistent banner used at the top of every inner page (i.e. everything
 * that isn't the home page): breadcrumb trail, eyebrow label, big gradient
 * heading, optional subtitle — all sitting on the same ambient glow used
 * across the rest of the site so no page looks like it belongs to a
 * different product.
 */
const PageHeader = ({ eyebrow, title, gradientWord, subtitle, breadcrumbs = [], glowClass = 'bg-[#00AEEF]/10' }) => {
  return (
    <section className="relative pt-40 pb-16 bg-transparent overflow-hidden">
      <div className={`absolute top-10 left-10 w-96 h-96 ${glowClass} rounded-full blur-3xl pointer-events-none animate-pulse`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center flex-wrap gap-1.5 text-xs font-mono text-[var(--text-faint)]">
            <Link to="/" className="hover:text-[#00AEEF] transition-colors">Home</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span className="opacity-50">/</span>
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-[#00AEEF] transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-[var(--text-soft)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <span className="text-xs font-mono tracking-widest text-[#E8A23D] uppercase">{eyebrow}</span>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text)] tracking-tight mt-2 max-w-3xl">
          {title}{' '}
          {gradientWord && (
            <span className="bg-gradient-to-r from-[#00AEEF] via-purple-400 to-[#E8A23D] bg-clip-text text-transparent">
              {gradientWord}
            </span>
          )}
        </h1>
        {subtitle && (
          <p className="text-[var(--text-dim)] text-base md:text-lg leading-relaxed max-w-2xl mt-5">{subtitle}</p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
