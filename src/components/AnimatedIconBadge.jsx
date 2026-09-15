import React from 'react';

/**
 * Wraps a card's icon with a small spinning dashed ring + soft pulse glow —
 * a tiny "live network" diagram used consistently on every option/feature
 * card across the site (services, why-us, industries, careers...).
 * Pure CSS animation (see .icon-badge-ring / .icon-badge-pulse in
 * index.css) — no JS loop, so it's essentially free to repeat dozens of
 * times on one page, and it already turns off under prefers-reduced-motion.
 */
const AnimatedIconBadge = ({ children, color = '#00AEEF', size = 'md', className = '' }) => {
  const dims = size === 'sm' ? 'w-11 h-11' : size === 'lg' ? 'w-16 h-16' : 'w-14 h-14';

  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${dims} ${className}`}>
      {/* Slow-spinning dashed ring */}
      <span
        className="icon-badge-ring absolute inset-0 rounded-full"
        style={{ border: `1.5px dashed ${color}80` }}
        aria-hidden="true"
      />
      {/* Soft pulsing glow */}
      <span
        className="icon-badge-pulse absolute inset-1 rounded-full blur-[6px]"
        style={{ backgroundColor: `${color}33` }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center justify-center w-full h-full">{children}</span>
    </span>
  );
};

export default AnimatedIconBadge;
