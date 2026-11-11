import React from 'react';
import { Link } from 'react-router-dom';
import { HeadsetDoodle, ChartDoodle, ShieldDoodle, ClockDoodle, RouteDoodle, RocketDoodle } from './DoodleIcons';
import { useCollection } from '../content';
import { litCardProps } from '../utils/litCard';

const doodleMap = {
  headset: HeadsetDoodle,
  tag: ChartDoodle,
  shield: ShieldDoodle,
  bolt: ClockDoodle,
  tower: RouteDoodle,
  trend: RocketDoodle,
};

/**
 * `variant="preview"` (home page) shows the first three reasons and points
 * to /why-us for the rest. `variant="full"` (the /why-us page) shows all six.
 */
const WhyUs = ({ variant = 'full' }) => {
  const whyUsData = useCollection('whyUs');
  const items = variant === 'preview' ? whyUsData.slice(0, 3) : whyUsData;

  return (
    <section id="why-us" className="scroll-mt-24 py-24 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text)]">Why Choose Orian</h2>
          <p className="text-[var(--text-dim)] text-sm md:text-base max-w-xl mx-auto">
            Explore onboarding, security questions, routing options and delivery reporting.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${variant === 'preview' ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-8`}>
          {items.map((item) => {
            const Doodle = doodleMap[item.icon] || ShieldDoodle;
            return (
              <Link
                to={`/why-us/${item.slug}`}
                key={item.id}
                {...litCardProps(item.color, item.glow)}
                className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl transition-all duration-300 ease-out cursor-pointer relative group block"
              >
                <Doodle color={item.color} className="mb-5" />
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
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00AEEF] hover:text-[#35C1F4] transition-colors"
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
