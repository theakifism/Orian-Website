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

    // Treat phones the same as prefers-reduced-motion: a full-page
    // requestAnimationFrame loop doing O(n²) link checks every frame is
    // the single biggest source of scroll jank on low-end mobile GPUs,
    // and it's purely decorative. Draw one static frame instead.
    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 768px)').matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;
    let isVisible = true;

    const makeParticles = () => {
      const area = width * height;
      const targetCount = Math.round((area / 10000) * density);
      const count = Math.max(24, Math.min(targetCount, 110));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
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
      // Draw a single static frame and stop — respects the user's setting
      // while still showing the network instead of an empty background.
      step();
      cancelAnimationFrame(animationFrameId);
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
