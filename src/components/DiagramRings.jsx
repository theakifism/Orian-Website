import React from 'react';

/**
 * Shared "topic diagram" shell used by IndustryIllustrations and
 * WhyUsIllustrations: a glass panel with two continuously counter-rotating
 * rings (.diagram-ring-a / -b, defined in index.css) around a glowing,
 * gently bobbing (.diagram-float) icon badge in the accent colour passed
 * in. Keeping the frame in one place means every topic diagram shares the
 * exact same motion and proportions — only the icon and colour change.
 */
const DiagramRings = ({ color = '#00AEEF', accent = '#00AEEF', icon }) => (
  <div className="relative w-full h-full aspect-square" aria-hidden="true">
    <div className="absolute inset-0 rounded-[28px] bg-linear-to-br from-[var(--surface)]/90 to-[var(--surface-alt)]/60 border border-[var(--border)]" />

    <div className="absolute inset-[8%]">
      {/* Outer ring */}
      <div className="absolute inset-0 diagram-ring-a">
        <svg viewBox="0 0 280 280" className="w-full h-full">
          <circle cx="140" cy="140" r="126" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="2" />
          <circle cx="256" cy="196" r="5" fill={accent} />
        </svg>
      </div>

      {/* Middle dashed ring, counter-rotating */}
      <div className="absolute inset-[13%] diagram-ring-b">
        <svg viewBox="0 0 216 216" className="w-full h-full">
          <circle
            cx="108" cy="108" r="96"
            fill="none" stroke={color} strokeOpacity="0.55" strokeWidth="2"
            strokeDasharray="2 12" strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Ambient glow behind the icon */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-[36px] diagram-pulse"
        style={{ backgroundColor: `${color}55` }}
      />

      {/* Icon badge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34%] h-[34%] flex items-center justify-center rounded-2xl border diagram-float"
        style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default DiagramRings;
