import { AlertTriangle, Loader2 } from 'lucide-react';

// ---------- layout primitives (match the public site's cards) ----------
export const Card = ({ className = '', children, ...rest }) => (
  <div className={`rounded-3xl border border-[var(--o-line)] bg-[var(--o-surface)] ${className}`} {...rest}>
    {children}
  </div>
);

export const PageHead = ({ eyebrow, title, children }) => (
  <div className="ad-head">
    <div className="min-w-0">
      {eyebrow && <p className="o2-eyebrow"><i /> {eyebrow}</p>}
      <h1 className="ad-title">{title}</h1>
    </div>
    {children && <div className="ad-head-actions">{children}</div>}
  </div>
);

export const Empty = ({ children }) => <p className="text-sm text-[var(--o-text-3)] py-6 text-center">{children}</p>;

export const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-[var(--o-text-3)]">
    <Loader2 size={16} className="animate-spin" /> {label}
  </div>
);

export const MigrationNotice = ({ message }) => (
  <div className="flex gap-3 rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4 text-sm mb-5" role="alert">
    <AlertTriangle size={18} className="shrink-0 text-pink-400 mt-0.5" />
    <div>
      <p className="font-semibold text-[var(--o-text)]">One database update is needed</p>
      <p className="text-[var(--o-text-2)] mt-0.5">
        {message || 'Run db/008_admin_toolkit.sql in the Supabase SQL editor, then refresh this page.'}
      </p>
    </div>
  </div>
);

export const Segmented = ({ value, onChange, options, label }) => (
  <div role="tablist" aria-label={label} className="ad-seg">
    {options.map((o) => (
      <button
        key={o.key}
        type="button"
        role="tab"
        aria-selected={value === o.key}
        onClick={() => onChange(o.key)}
        className={value === o.key ? 'is-on' : ''}
      >
        {o.icon && <o.icon size={14} />} {o.label}
      </button>
    ))}
  </div>
);
