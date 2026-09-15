import React, { useEffect, useRef } from 'react';

interface ParticleNetworkBGProps {
  /** Extra classes for the wrapping div (e.g. to layer with z-index). */
  className?: string;
  /** Base RGB used for dots + connecting lines, e.g. "0, 174, 239". */
  colorRgb?: string;
  /** Roughly how many particles per 10,000px² of canvas area. */
  density?: number;
  /** Max distance (px) at which two particles are linked by a line. */
  linkDistance?: number;
  /** Particle drift speed multiplier. */
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Dark-themed, responsive animated particle-network background.
 * Pure <canvas> + requestAnimationFrame — no external animation library
 * required, so it drops into any project without new dependencies.
 *
 * Performance notes:
 * - Canvas is sized in device pixels (devicePixelRatio-aware) but only
 *   as large as its container, so it stays cheap on big monitors.
 * - The link pass is O(n²) but particle count is capped, so it stays
 *   smooth even on low-end devices.
 * - Animation pauses automatically when the tab is hidden and is
 *   skipped entirely for users with prefers-reduced-motion enabled.
 */
const ParticleNetworkBG: React.FC<ParticleNetworkBGProps> = ({
  className = '',
  colorRgb = '0, 174, 239',
  density = 9,
  linkDistance = 140,
  speed = 0.55,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect the user's OS-level motion setting with a single static
    // frame (genuinely no animation). Phones get their own lightweight
    // *animated* path below — not a static frame — because a static
    // frame only ever gets (re)painted once, and mobile browsers fire a
    // `resize` event whenever the address bar collapses/expands on
    // scroll; that resize used to clear the canvas with nothing left to
    // repaint it, which is why the dots were disappearing after a small
    // scroll. A cheap continuous loop sidesteps that entirely.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;
    let isVisible = true;

    // Mobile trims particle count, drops the O(n²) link-line pass and the
    // shadow blur entirely — the three most expensive parts of each frame
    // — so the loop stays cheap enough to run continuously instead of
    // needing to fall back to a single frame.
    const mobileDensity = density * 0.45;
    const mobileMaxCount = 40;
    const mobileSpeed = speed * 0.6;

    const makeParticles = () => {
      const area = width * height;
      const effectiveDensity = isMobile ? mobileDensity : density;
      const targetCount = Math.round((area / 10000) * effectiveDensity);
      const count = isMobile
        ? Math.max(14, Math.min(targetCount, mobileMaxCount))
        : Math.max(24, Math.min(targetCount, 110));
      const effectiveSpeed = isMobile ? mobileSpeed : speed;

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * effectiveSpeed,
        vy: (Math.random() - 0.5) * effectiveSpeed,
        r: Math.random() * 2 + 1.3,
      }));
    };

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
      // A resize (including the address-bar-driven ones on mobile) wipes
      // the canvas above — repaint immediately so reduced-motion users
      // never end up staring at a blank background until the next frame.
      if (prefersReducedMotion) drawStaticFrame();
    };

    const drawStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRgb}, 0.9)`;
        ctx.shadowColor = `rgba(${colorRgb}, 0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    // Cheap per-frame draw used on mobile: move + draw dots only, no
    // link-line pass, no per-particle shadow blur.
    const stepMobile = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(stepMobile);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(${colorRgb}, 0.85)`;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(stepMobile);
    };

    const step = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Move + draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRgb}, 1)`;
        ctx.shadowColor = `rgba(${colorRgb}, 0.9)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw links between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < linkDistance) {
            const opacity = (1 - dist / linkDistance) * 0.85;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${colorRgb}, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };

    resize();

    if (prefersReducedMotion) {
      // A single static frame — respects the user's OS setting while still
      // showing the network instead of an empty background. `resize()`
      // above already repaints this on every subsequent resize.
      drawStaticFrame();
    } else if (isMobile) {
      // Minimal continuous drift — present top to bottom on every page,
      // never a single static frame, but far lighter than the desktop
      // version (no link lines, no glow, fewer/slower particles).
      animationFrameId = requestAnimationFrame(stepMobile);
    } else {
      animationFrameId = requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorRgb, density, linkDistance, speed]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none bg-(--bg) ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Soft vignette so foreground text/cards stay readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,transparent_0%,var(--bg)_92%)]" />
    </div> 
  );
};

export default ParticleNetworkBG;
