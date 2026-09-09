import React, { useRef } from 'react';

/**
 * Compact, professional "network status" visual — concentric rotating
 * rings around the brand mark, contained inside a glass card with a
 * live-status header/footer. Meant to sit inside a layout column (e.g.
 * the hero's right side), not sprawled across the whole background.
 * Has a subtle mouse-driven 3D tilt for depth.
 */
const OrbitDiagram = ({ className = '' }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1200px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg) translateZ(0)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Ambient colour glow behind the card, for depth */}
      <div className="absolute -inset-5 bg-linear-to-br from-[#00AEEF]/30 via-purple-500/20 to-[#E8A23D]/25 rounded-[2rem] blur-2xl opacity-70" />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="orbit-diagram relative bg-[var(--surface-alt)]/85 border border-[var(--border-strong)] rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out will-change-transform"
      >
        {/* Header strip */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-[var(--border)] font-mono text-xs">
          <span className="text-[var(--text-dim)]">orian-network</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 orbit-live-dot" />
            LIVE
          </span>
        </div>

        {/* Orbit rings — this is the one animation left running on mobile,
            so it uses its own dedicated classes (defined in index.css)
            instead of the shared animate-* utilities that get switched
            off globally on small screens. */}
        <div className="relative w-full aspect-square max-w-[300px] sm:max-w-[340px] mx-auto py-3" aria-hidden="true">
          {/* Outer ring */}
          <div className="absolute inset-0 orbit-ring-outer">
            <svg viewBox="0 0 320 320" className="w-full h-full">
              <circle cx="160" cy="160" r="148" fill="none" stroke="#A855F7" strokeOpacity="0.55" strokeWidth="2" />
              <circle cx="288" cy="222" r="6" fill="#C084FC" />
            </svg>
          </div>

          {/* Middle dashed ring, counter-rotating */}
          <div className="absolute inset-[12%] orbit-ring-middle">
            <svg viewBox="0 0 250 250" className="w-full h-full">
              <circle
                cx="125" cy="125" r="112"
                fill="none" stroke="#00AEEF" strokeOpacity="0.55" strokeWidth="2"
                strokeDasharray="2 12" strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Inner dotted ring, faster spin */}
          <div className="absolute inset-[26%] orbit-ring-inner">
            <svg viewBox="0 0 190 190" className="w-full h-full">
              <circle
                cx="95" cy="95" r="82"
                fill="none" stroke="#E8A23D" strokeOpacity="0.6" strokeWidth="3"
                strokeDasharray="0.5 11" strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Ambient glow behind the mark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#00AEEF]/25 blur-[45px] orbit-glow-pulse" />

          {/* Center brand mark — icon only, no card/border behind it */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center orbit-icon-float">
            <img src="/logo-icon.png" alt="Orian" className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)]" />
          </div>
        </div>

        {/* Footer status bar */}
        <div className="mt-3 p-3 bg-black/5 dark:bg-black/40 border border-[var(--border)] rounded-xl flex items-center justify-between text-[11px] sm:text-xs font-mono text-[var(--text-dim)]">
          <span>1,200+ routes &middot; 180+ countries</span>
          <span className="text-[#00AEEF] font-semibold">99.98% success</span>
        </div>
      </div>
    </div>
  );
};

export default OrbitDiagram;
