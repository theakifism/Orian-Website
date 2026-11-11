import React from 'react';
import { Link } from 'react-router-dom';
import { litCardProps } from '../utils/litCard';
import { T, useTx, useData } from '../content';
import { careerStats as careerStatsDefault } from '../content/defaults/Careers';

const Careers = () => { const careerStats = useData("Careers.careerStats", careerStatsDefault); const t = useTx();
  return (
    <section id="careers" className="scroll-mt-24 relative py-20 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          {...litCardProps('#00AEEF', 'rgba(0, 174, 239, 0.35)', { tilt: false })}
          className="relative overflow-hidden bg-(--surface)/90 border border-(--border) rounded-3xl p-8 md:p-12 shadow-(--shadow-ambient) transition-all duration-500 group"
        >
          
          {/* Animated Background Accent Glow */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Content Left */}
            <div className="space-y-6 z-10">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-full uppercase tracking-wider">
                <T k="Careers.1" d={"Careers & Culture"} />
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-(--text) leading-tight">
                <T k="Careers.2" d={"We're building the bench, "} /><br />
                <span className="text-[#00AEEF]">
                  <T k="Careers.3" d={"before the roles go live."} />
                </span>
              </h2>
              <p className="text-(--text-dim) text-sm md:text-base leading-relaxed">
                <T k="Careers.4" d={"No open positions today — but we're actively scouting for telecom routing, cloud infrastructure, and AI engineering talent for what's next. Get on our radar early."} />
              </p>
              <div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#00AEEF] text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
                >
                  <T k="Careers.5" d={"Get on our radar →"} />
                </Link>
              </div>
            </div>

            {/* Visual Right: clean 3D stat blocks (replaces the stock photo) */}
            <div className="relative flex flex-col items-center justify-center gap-6 z-10 h-auto md:h-80 py-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <img src="/logo-icon.webp" alt={t("Careers.6", "Orian Mark")} width="64" height="48" loading="lazy" decoding="async" className="w-16 h-16 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)]" />
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm">
                {careerStats.map((stat) => {
                  const hoverProps = litCardProps(stat.color, stat.glow);
                  return (
                  <div
                    key={stat.label}
                    {...hoverProps}
                    style={{ ...hoverProps.style, '--accent': stat.color }}
                    className="group min-w-0 overflow-hidden p-4 bg-(--surface-alt)/90 border border-(--border) rounded-2xl text-center backdrop-blur-md shadow-lg transition-all duration-300 ease-out cursor-default will-change-transform"
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
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Careers;
