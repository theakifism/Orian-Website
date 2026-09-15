import React from 'react';
import { Link } from 'react-router-dom';

const careerStats = [
  { label: 'Remote-First Ops', value: '100%', color: '#00AEEF', glow: 'rgba(0, 174, 239, 0.35)' },
  { label: 'Global Routes', value: '180+', color: '#E8A23D', glow: 'rgba(232, 162, 61, 0.35)' },
  { label: 'Open Roles Soon', value: '3', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.35)' },
];

const Careers = () => {
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(900px) rotateX(${-y / 16}deg) rotateY(${x / 16}deg) translateY(-6px) scale(1.06)`;
  };

  const handleMouseLeave = (card) => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
  };

  return (
    <section id="careers" className="scroll-mt-24 relative py-20 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="relative overflow-hidden bg-(--surface)/90 border border-(--border) rounded-3xl p-8 md:p-12 shadow-(--shadow-ambient) hover:border-[#00AEEF]/40 transition-all duration-500 group">
          
          {/* Animated Background Accent Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-[#00AEEF]/20 transition-all duration-700" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Content Left */}
            <div className="space-y-6 z-10">
              <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs rounded-full uppercase tracking-wider">
                Careers & Culture
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-(--text) leading-tight">
                We're building the bench, <br />
                <span className="bg-linear-to-r from-[#00AEEF] to-emerald-400 bg-clip-text text-transparent">
                  before the roles go live.
                </span>
              </h2>
              <p className="text-(--text-dim) text-sm md:text-base leading-relaxed">
                No open positions today — but we're actively scouting for telecom routing, cloud infrastructure, and AI engineering talent for what's next. Get on our radar early.
              </p>
              <div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#00AEEF] to-blue-600 text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(0,174,239,0.3)] hover:shadow-[0_0_35px_rgba(0,174,239,0.6)] hover:scale-105 transition-all duration-300"
                >
                  Get on our radar &rarr;
                </Link>
              </div>
            </div>

            {/* Visual Right: clean 3D stat blocks (replaces the stock photo) */}
            <div className="relative flex flex-col items-center justify-center gap-6 z-10 h-auto md:h-80 py-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <img src="/logo-icon.png" alt="Orian Mark" loading="lazy" decoding="async" className="w-16 h-16 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)]" />
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm">
                {careerStats.map((stat) => (
                  <div
                    key={stat.label}
                    onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                    onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                    className="group min-w-0 overflow-hidden p-4 bg-(--surface-alt)/90 border border-(--border) rounded-2xl text-center backdrop-blur-md shadow-lg transition-all duration-300 ease-out cursor-default will-change-transform"
                    style={{ boxShadow: '0 10px 24px -12px transparent', '--accent': stat.color }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 16px 32px -12px ${stat.glow}`;
                      e.currentTarget.style.borderColor = stat.color;
                    }}
                  >
                    <div
                      className="text-lg sm:text-xl font-extrabold font-mono [text-shadow:0_2px_6px_rgba(0,0,0,0.25)] inline-block transition-transform duration-300 group-hover:scale-125"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-(--text-faint) whitespace-nowrap font-mono mt-1 transition-colors duration-300 group-hover:text-(--accent)">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Careers;
