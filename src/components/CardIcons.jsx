import React from 'react';

/**
 * Small hand-drawn line-icon set used in place of the old "01/02/03" number
 * badges on card headings across the site. Each icon is a plain inline SVG
 * (no external icon library needed) that inherits its color from the parent
 * via `currentColor`, so it drops straight into the existing colored badge
 * containers.
 */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

// Two connected nodes — used for gateway / routing services.
export const GatewayIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <rect x="2.4" y="9" width="6" height="6" rx="1.3" />
    <rect x="15.6" y="9" width="6" height="6" rx="1.3" />
    <path d="M8.4 12h7.2" />
    <path d="M13.2 9.6 15.6 12l-2.4 2.4" />
    <circle cx="5.4" cy="4.4" r="1" fill="currentColor" stroke="none" />
    <path d="M5.4 5.4V9" />
    <circle cx="18.6" cy="19.6" r="1" fill="currentColor" stroke="none" />
    <path d="M18.6 18.6V15" />
  </svg>
);

// Shield with a check — used for compliance / regulatory / security.
export const ShieldCheckIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M12 3.2 18.8 6v5.2c0 4.6-2.9 7.6-6.8 9.1-3.9-1.5-6.8-4.5-6.8-9.1V6z" />
    <path d="M8.8 12.2l2.1 2.1 4.3-4.6" />
  </svg>
);

// Audio bars — used for voice / calling services.
export const WaveformIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M3.5 12h1.2" />
    <path d="M7.3 8v8" />
    <path d="M11.1 4.5v15" />
    <path d="M14.9 7v10" />
    <path d="M18.7 9.5v5" />
    <path d="M21.3 12h.1" />
  </svg>
);

// Chat bubble — used for messaging / API services.
export const ChatIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M4.5 6.2A2.2 2.2 0 0 1 6.7 4h10.6a2.2 2.2 0 0 1 2.2 2.2v6.4a2.2 2.2 0 0 1-2.2 2.2H9.4l-3.9 3.4v-3.4H6.7a2.2 2.2 0 0 1-2.2-2.2z" />
  </svg>
);

// Headset — used for support.
export const HeadsetIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M4.5 13.5v-1.7a7.5 7.5 0 0 1 15 0v1.7" />
    <rect x="3" y="13" width="3.6" height="5.6" rx="1.3" />
    <rect x="17.4" y="13" width="3.6" height="5.6" rx="1.3" />
    <path d="M19.5 18.6a3.6 3.6 0 0 1-3.6 3H14" />
  </svg>
);

// Price tag — used for pricing / guarantees.
export const TagIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M12.3 3.5 19.8 11a2 2 0 0 1 0 2.8l-6 6a2 2 0 0 1-2.8 0L3.5 12.3a2 2 0 0 1-.5-1.3V5.6A2.1 2.1 0 0 1 5.1 3.5h5.9c.5 0 1 .2 1.3.5z" />
    <circle cx="7.8" cy="7.8" r="1.15" fill="currentColor" stroke="none" />
  </svg>
);

// Bolt — used for speed / instant setup.
export const BoltIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M13.2 2.4 4.6 13.6h5.7l-.9 8 8.8-11.4h-5.9z" />
  </svg>
);

// Broadcast tower — used for network / carrier reach.
export const TowerIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M12 21V9.5" />
    <path d="M8.6 9 12 4.4 15.4 9" />
    <path d="M6 12.6a8.5 8.5 0 0 1 12 0" />
    <path d="M3.4 9.7a12.5 12.5 0 0 1 17.2 0" />
  </svg>
);

// Upward trend line — used for delivery speed / performance.
export const TrendUpIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <path d="M3 16.5 9.5 10l3.8 3.8L21 5.5" />
    <path d="M15 5.5h6v6" />
  </svg>
);

// Check in a circle — used for feature / use-case cards in place of a
// plain bullet, so lists read as a scannable grid instead of a text block.
export const CheckCircleIcon = ({ className = 'w-6 h-6' }) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.2 12.3l2.4 2.4 5-5.4" />
  </svg>
);

// Chevron — used as the expand/collapse indicator on accordions.
export const ChevronIcon = ({ className = 'w-5 h-5' }) => (
  <svg {...base} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
