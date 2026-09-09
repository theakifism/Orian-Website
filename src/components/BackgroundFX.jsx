import React from 'react';

/**
 * Persistent, full-page animated background.
 * Sits fixed behind every section (z-[-1]) so the same rotating rings and
 * floating glows stay visible as the page scrolls — same idea as the
 * ambient circle animation on resicode.com, restyled for Orian's palette
 * and made to respond to the light/dark theme automatically via CSS vars.
 */
const BackgroundFX = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[var(--bg)] transition-colors duration-500">
      {/* Base grid, very faint */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.5]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '3.5rem 3.5rem',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 20%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 20%, #000 30%, transparent 100%)',
        }}
      />

      {/* Large rotating concentric ring cluster, top-right — the "circle" motif */}
      <div className="absolute -top-40 -right-64 w-[900px] h-[900px] opacity-40 dark:opacity-60">
        <svg viewBox="0 0 900 900" className="w-full h-full animate-spin-slow">
          <circle cx="450" cy="450" r="420" fill="none" stroke="#00AEEF" strokeOpacity="0.18" strokeWidth="1" />
          <circle cx="450" cy="450" r="340" fill="none" stroke="#A855F7" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="4 10" />
          <circle cx="450" cy="450" r="260" fill="none" stroke="#00AEEF" strokeOpacity="0.22" strokeWidth="1" />
        </svg>
      </div>

      {/* Counter-rotating ring cluster, lower-left */}
      <div className="absolute -bottom-56 -left-56 w-[720px] h-[720px] opacity-30 dark:opacity-50">
        <svg viewBox="0 0 720 720" className="w-full h-full animate-spin-slow-reverse">
          <circle cx="360" cy="360" r="330" fill="none" stroke="#E8A23D" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="2 12" />
          <circle cx="360" cy="360" r="240" fill="none" stroke="#00AEEF" strokeOpacity="0.14" strokeWidth="1" />
          <circle cx="360" cy="360" r="150" fill="none" stroke="#A855F7" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 9" />
        </svg>
      </div>

      {/* Soft ambient color glows drifting behind everything */}
      <div className="absolute top-[10%] left-[15%] w-[420px] h-[420px] rounded-full bg-[#00AEEF]/[0.10] blur-[110px] animate-float-glow-1" />
      <div className="absolute bottom-[8%] right-[12%] w-[460px] h-[460px] rounded-full bg-purple-500/[0.10] blur-[120px] animate-float-glow-2" />
      <div className="absolute top-[45%] left-[50%] w-[360px] h-[360px] rounded-full bg-[#E8A23D]/[0.06] blur-[100px] animate-drift" />

      {/* Subtle vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_0%,var(--bg)_85%)]" />
    </div>
  );
};

export default BackgroundFX;
