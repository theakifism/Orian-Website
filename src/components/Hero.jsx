import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from './AnimatedCounter';
import OrbitDiagram from './OrbitDiagram';
import { useScrollFX } from '../context/ScrollFXContext';

const punchlines = [
  "⚡ Go live in under 5 minutes with instant route provisioning.",
  "🚀 Deliver 100,000+ messages per second with zero latency.",
  "🌍 Reach customers anywhere across 1,200+ global networks.",
  "🔒 100% TRAI DLT compliant with enterprise-grade security."
];

const Hero = () => {
  const [currentPunchline, setCurrentPunchline] = useState(0);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { reduceMotion } = useScrollFX();

  // Rotating Punchline
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPunchline((prev) => (prev + 1) % punchlines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Devronic Canvas Engine: Dynamic Plasma Orbs + Interactive Glow.
  // Skipped entirely on mobile — a continuous full-width canvas redraw
  // running behind the fold is a heavy, purely decorative cost on phones
  // (and there's no cursor to drive the glow anyway). A single static
  // gradient frame is drawn instead so the hero isn't left blank.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    if (reduceMotion) {
      const resizeStatic = () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        const gradient = ctx.createRadialGradient(
          canvas.width * 0.5, canvas.height * 0.35, 0,
          canvas.width * 0.5, canvas.height * 0.35, Math.max(canvas.width, canvas.height) * 0.6
        );
        gradient.addColorStop(0, 'rgba(0, 174, 239, 0.12)');
        gradient.addColorStop(0.6, 'rgba(147, 51, 234, 0.06)');
        gradient.addColorStop(1, 'rgba(0, 174, 239, 0)');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
      resizeStatic();
      window.addEventListener('resize', resizeStatic);
      return () => window.removeEventListener('resize', resizeStatic);
    }

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Glowing Ambient Nodes
    const nodes = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, vx: 0.4, vy: 0.3, r: 280, color: 'rgba(147, 51, 234, ' },
      { x: canvas.width * 0.7, y: canvas.height * 0.4, vx: -0.3, vy: 0.5, r: 320, color: 'rgba(0, 174, 239, ' },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, vx: 0.5, vy: -0.4, r: 250, color: 'rgba(232, 162, 61, ' }
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Floating Glowing Light Orbs
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r);
        gradient.addColorStop(0, `${node.color}0.35)`);
        gradient.addColorStop(0.5, `${node.color}0.12)`);
        gradient.addColorStop(1, `${node.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Interactive Cursor Glow Spot
      if (mouseRef.current.x > 0) {
        const cursorGlow = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 180
        );
        cursorGlow.addColorStop(0, 'rgba(0, 174, 239, 0.25)');
        cursorGlow.addColorStop(1, 'rgba(0, 174, 239, 0)');

        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reduceMotion]);

  return (
    <section id="home" className="scroll-mt-24 relative min-h-screen pt-32 pb-20 bg-transparent overflow-hidden flex items-center">
      
      {/* Devronic-style Interactive HTML5 Canvas Engine */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Cybernetic Perspective Grid Base */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px), 
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '3.5rem 3.5rem',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 50%, transparent 100%)'
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content Column */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--overlay)] border border-[var(--border)] text-xs font-mono text-[#00AEEF] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00AEEF] animate-ping" />
            100K+ msgs/sec &middot; 1,200+ routes live right now
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text)] leading-tight tracking-tight [text-shadow:0_1px_0_rgba(255,255,255,0.15),0_4px_14px_rgba(0,0,0,0.25)] dark:[text-shadow:0_1px_0_rgba(255,255,255,0.08),0_6px_20px_rgba(0,0,0,0.55)]">
            Launch your first campaign in minutes with <span className="bg-linear-to-r from-[#00AEEF] via-purple-400 to-[#E8A23D] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.35)]">Orian</span>
          </h1>

          {/* Dynamic Punchline */}
          <div className="h-16 flex items-center">
            <p className="text-lg md:text-xl font-medium text-[#00AEEF] bg-[#00AEEF]/10 border-l-4 border-[#00AEEF] px-4 py-3 rounded-r-xl transition-all duration-500 backdrop-blur-sm">
              {punchlines[currentPunchline]}
            </p>
          </div>

          <p className="text-[var(--text-dim)] text-lg leading-relaxed max-w-xl">
            Bulk SMS, Voice Call Blasting, DLT assistance, and WhatsApp Business API built by telecom veterans with 15+ years in the industry — connected to 1,200+ operators across 180 countries.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/assistant"
              className="px-8 py-4 bg-linear-to-r from-[#00AEEF] via-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(0,174,239,0.4)] hover:shadow-[0_0_45px_rgba(0,174,239,0.7)] hover:scale-[1.02] transition-all duration-300 border border-white/20"
            >
              Start a project &rarr;
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 bg-[var(--overlay)] hover:bg-[var(--overlay-strong)] text-[var(--text-soft)] border border-[var(--border)] rounded-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-md"
            >
              Explore Services
            </Link>
          </div>

          {/* Metrics — small 3D blocks */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-8 border-t border-[var(--border)] font-mono">
            <div className="group min-w-0 overflow-hidden p-2.5 sm:p-3 rounded-xl bg-[var(--surface)]/70 border border-[var(--border)] shadow-[0_6px_16px_-8px_rgba(0,174,239,0.0)] hover:shadow-[0_10px_24px_-8px_rgba(0,174,239,0.35)] hover:border-[#00AEEF]/50 hover:-translate-y-1 hover:scale-[1.04] transition-all duration-300">
              <div className="text-lg sm:text-2xl font-bold text-[var(--text)] whitespace-nowrap transition-all duration-300 group-hover:scale-110 group-hover:text-[#00AEEF] inline-block">
                <AnimatedCounter end={1200} suffix="+" />
              </div>
              <div className="text-[10px] sm:text-xs text-[var(--text-faint)]">Carrier Routes</div>
            </div>
            <div className="group min-w-0 overflow-hidden p-2.5 sm:p-3 rounded-xl bg-[var(--surface)]/70 border border-[var(--border)] hover:shadow-[0_10px_24px_-8px_rgba(232,162,61,0.35)] hover:border-[#E8A23D]/50 hover:-translate-y-1 hover:scale-[1.04] transition-all duration-300">
              <div className="text-lg sm:text-2xl font-bold text-[var(--text)] whitespace-nowrap transition-all duration-300 group-hover:scale-110 group-hover:text-[#E8A23D] inline-block">
                <AnimatedCounter end={180} suffix="+" />
              </div>
              <div className="text-[10px] sm:text-xs text-[var(--text-faint)]">Countries Served</div>
            </div>
            <div className="group min-w-0 overflow-hidden p-2.5 sm:p-3 rounded-xl bg-[var(--surface)]/70 border border-[var(--border)] hover:shadow-[0_10px_24px_-8px_rgba(168,85,247,0.35)] hover:border-purple-400/50 hover:-translate-y-1 hover:scale-[1.04] transition-all duration-300">
              <div className="text-lg sm:text-2xl font-bold text-[#00AEEF] whitespace-nowrap transition-all duration-300 group-hover:scale-110 group-hover:text-purple-400 inline-block">
                <AnimatedCounter end={99.99} decimals={2} suffix="%" />
              </div>
              <div className="text-[10px] sm:text-xs text-[var(--text-faint)]">Uptime SLA</div>
            </div>
          </div>
        </div>

        {/* Right Column: contained, professional orbit/network visual */}
        <div className="relative flex items-center justify-center">
          <OrbitDiagram className="w-full max-w-md" />
        </div>

      </div>
    </section>
  );
};

export default Hero;