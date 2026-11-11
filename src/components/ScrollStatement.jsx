import React from 'react';
import { PhoneDoodle, ShieldDoodle, HeadsetDoodle } from './DoodleIcons';
import { litCardProps } from '../utils/litCard';

const cards = [
  {
    Doodle: PhoneDoodle,
    color: '#00AEEF',
    glow: 'rgba(0, 0, 0, 0.6)',
    title: 'Direct SMPP Gateways',
    desc: 'High-throughput connections ensuring low latency for critical banking and security OTPs.',
  },
  {
    Doodle: ShieldDoodle,
    color: '#00AEEF',
    glow: 'rgba(0, 0, 0, 0.6)',
    title: 'DLT Regulatory Sync',
    desc: 'Complete automated support for TRAI DLT registration, entity approval, and template scrub.',
  },
  {
    Doodle: HeadsetDoodle,
    color: '#00AEEF',
    glow: 'rgba(0, 0, 0, 0.6)',
    title: 'Voice & GRPTALK',
    desc: 'Automated voice call blasting and enterprise multi-party audio conferencing solutions.',
  },
];

const ScrollStatement = () => {
  return (
        <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-8">

        {/* High-Contrast Gradient Typography with Correct Spacing */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-(--text) leading-snug tracking-tight">
          Fifteen years in messaging taught us one thing:{' '}
          <span className="text-[#00AEEF]">
            businesses don't need more noise, they need to be heard.
          </span>
        </h2>

        <p className="text-(--text-dim) text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          From OTP messages to WhatsApp customer engagement, discuss the delivery and integration options available for your account.
        </p>

        {/* Same "lit card" hover treatment used everywhere else on the site */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {cards.map((card) => {
            const Doodle = card.Doodle;
            return (
              <div
                key={card.title}
                {...litCardProps(card.color, card.glow)}
                className="group p-6 bg-(--surface)/80 border border-(--border) rounded-2xl transition-all duration-300"
              >
                <Doodle color={card.color} className="mx-auto mb-5" />
                <h3 className="text-(--text) text-lg font-bold mb-2 transition-colors duration-300" style={{ '--tw-text-opacity': 1 }}>
                  {card.title}
                </h3>
                <p className="text-(--text-dim) text-xs leading-relaxed transition-colors duration-300 group-hover:text-(--text-soft)">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ScrollStatement;
