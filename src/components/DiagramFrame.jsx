import React, { useRef } from 'react';

/**
 * Wraps a page-header topic diagram (IndustryIllustrations, WhyUsIllustrations,
 * the service/about/contact/etc. illustrations in PageIllustrations.jsx) with
 * the same mouse-driven 3D tilt OrbitDiagram uses in the hero, so every inner
 * page's diagram responds to the cursor the same way the homepage one does.
 * Purely presentational — the diagram itself still owns its own continuous
 * motion (the .diagram-ring-* / .diagram-float / .diagram-pulse classes).
 */
const DiagramFrame = ({ children, glow = '#00AEEF', className = '' }) => {
  const ref = useRef(null);

  const tiltTo = (clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const rx = Math.max(-14, Math.min(14, -y / 14));
    const ry = Math.max(-14, Math.min(14, x / 14));
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  const handleTouchMove = (e) => {
    const touch = e.touches && e.touches[0];
    if (touch) tiltTo(touch.clientX, touch.clientY);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Ambient colour glow behind the diagram, matching the diagram's own accent */}
      <div
        className="absolute -inset-6 rounded-[2rem] blur-2xl opacity-60 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glow}55, transparent 70%)` }}
        aria-hidden="true"
      />
      <div
        ref={ref}
        onMouseMove={(e) => tiltTo(e.clientX, e.clientY)}
        onMouseLeave={reset}
        onTouchMove={handleTouchMove}
        onTouchEnd={reset}
        className="diagram-tilt relative w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};

export default DiagramFrame;
