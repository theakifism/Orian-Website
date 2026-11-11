import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Banner used at the top of every inner page: breadcrumb, eyebrow, headline,
 * optional subtitle. `gradientWord` is kept for the legacy call sites but is now
 * rendered as plain headline text (no gradient, no glow).
 */
const PageHeader = ({ eyebrow, title, gradientWord, subtitle, breadcrumbs = [], children }) => (
  <section className="o2 o2-pagehero">
    <div className="o2-wrap">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="o2-crumbs">
          <Link to="/">Home</Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx}>
              <span aria-hidden="true">/ </span>
              {crumb.href ? <Link to={crumb.href}>{crumb.label}</Link> : <span style={{ color: 'var(--o-text-2)' }}>{crumb.label}</span>}
            </span>
          ))}
        </nav>
      )}
      {eyebrow && <span className="o2-eyebrow" style={{ marginBottom: '1.2rem' }}><i />{eyebrow}</span>}
      <h1 className="o2-h1">{title}{gradientWord ? ` ${gradientWord}` : ''}</h1>
      {subtitle && <p className="o2-lead">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default PageHeader;
