import React from 'react';
import { Link } from 'react-router-dom';
import { HeadsetIcon, TagIcon, ShieldCheckIcon, BoltIcon, TowerIcon, TrendUpIcon } from './CardIcons';
import { whyUsData } from '../data/whyUs';

const iconMap = {
  headset: HeadsetIcon,
  tag: TagIcon,
  shield: ShieldCheckIcon,
  bolt: BoltIcon,
  tower: TowerIcon,
  trend: TrendUpIcon,
};

/**
 * `variant="preview"` (home page) shows the first three reasons and points
 * to /why-us for the rest. `variant="full"` (the /why-us page) shows all six.
 */
const WhyUs = ({ variant = 'full' }) => {
  const items = variant === 'preview' ? whyUsData.slice(0, 3) : whyUsData;

  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 12}deg) rotateY(${x / 12}deg) translateZ(10px) scale(1.03)`;
  };

  const handleMouseLeave = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
  };

  return (
    <section id="why-us" className="scroll-mt-24 py-24 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text)]">Why Choose Orian</h2>
          <p className="text-[var(--text-dim)] text-sm md:text-base max-w-xl mx-auto">
            High-performance infrastructure built specifically for enterprise reach and zero downtime.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${variant === 'preview' ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-8`}>
          {items.map((item) => {
            const Icon = iconMap[item.icon] || ShieldCheckIcon;
            return (
              <Link
                to={`/why-us/${item.slug}`}
                key={item.id}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl transition-all duration-300 ease-out cursor-pointer relative group block"
                style={{
                  boxShadow: `0 10px 30px -10px transparent`,
                  '--accent': item.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px -10px ${item.glow}`;
                  e.currentTarget.style.borderColor = item.color;
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                  style={{ color: item.color, borderColor: `${item.color}4D`, backgroundColor: `${item.color}1A` }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)]">
                  {item.title}
                </h3>
                <p className="text-[var(--text-dim)] text-xs md:text-sm leading-relaxed transition-colors duration-300 group-hover:text-[var(--text-soft)]">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>

        {variant === 'preview' && (
          <div className="text-center">
            <Link
              to="/why-us"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00AEEF] hover:text-[#E8A23D] transition-colors"
            >
              See all reasons to choose Orian &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyUs;
