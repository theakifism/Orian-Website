import React from 'react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';
import AnimatedIconBadge from './AnimatedIconBadge';
import { GatewayIcon, WaveformIcon, ShieldCheckIcon, ChatIcon } from './CardIcons';
import { services } from '../data/services';

const iconMap = {
  gateway: GatewayIcon,
  waveform: WaveformIcon,
  shield: ShieldCheckIcon,
  chat: ChatIcon,
};

/**
 * `variant="preview"` (used on the home page) shows every service but keeps
 * the section compact and points at /services for the full write-ups.
 * `variant="full"` (used on the /services page itself) is identical markup,
 * just without the "view all" footer link.
 */
const Services = ({ variant = 'full' }) => {
  return (
    <section id="services" className="scroll-mt-24 relative py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">Our Offerings</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight mt-2">
              Our Enterprise <span className="bg-gradient-to-r from-[#00AEEF] to-purple-500 bg-clip-text text-transparent">Suite</span>
            </h2>
          </div>
          {variant === 'preview' && (
            <Link
              to="/services"
              className="text-sm font-semibold text-[#00AEEF] hover:text-[#E8A23D] transition-colors inline-flex items-center gap-1.5"
            >
              View all services &rarr;
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((card, idx) => {
            const Icon = iconMap[card.icon] || GatewayIcon;
            const accent = ['#00AEEF', '#A855F7', '#E8A23D', '#34d399'][idx % 4];
            return (
              <TiltCard key={card.slug} delay={idx * 100}>
                <Link
                  to={`/services/${card.slug}`}
                  className={`block p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group ${card.borderHover}`}
                >
                  <AnimatedIconBadge color={accent} size="sm" className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <span className={`inline-flex w-9 h-9 items-center justify-center rounded-xl ${card.tagColor}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                  </AnimatedIconBadge>
                  <h3 className={`text-2xl font-bold text-[var(--text)] mb-3 transition-all duration-300 group-hover:[transform:translateX(4px)_translateZ(22px)] ${card.textAccent}`}>
                    {card.title}
                  </h3>
                  <p className="text-[var(--text-dim)] text-sm leading-relaxed transition-all duration-300 group-hover:text-[var(--text-soft)] group-hover:[transform:translateZ(12px)]">
                    {card.desc}
                  </p>
                  <span className={`inline-flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wider ${card.textAccent} text-[var(--text-faint)]`}>
                    Learn more &rarr;
                  </span>
                </Link>
              </TiltCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;
