import React from 'react';
import Reveal from './Reveal';
import { MailDoodle, ShieldDoodle, HeadsetDoodle, RocketDoodle } from './DoodleIcons';

/**
 * GoDaddy-style "humblebrag numbers" band: a big animated illustration over
 * a big number over one line of explanation, four across.
 */
const defaultItems = [
  { Doodle: MailDoodle, color: '#00AEEF', stat: 'SMS', text: 'Discuss messaging options for your use case.' },
  { Doodle: ShieldDoodle, color: '#00AEEF', stat: 'DLT', text: 'Ask about registration guidance and compliance.' },
  { Doodle: HeadsetDoodle, color: '#00AEEF', stat: 'Help', text: 'Contact the team about service support.' },
  { Doodle: RocketDoodle, color: '#3B82F6', stat: 'Plan', text: 'Discuss onboarding and timelines with our team.' },
];

const DoodleFeatures = ({
  title = 'Services shaped around your needs.',
  items = defaultItems,
}) => (
  <section className="relative py-20 overflow-hidden">
    <div className="max-w-6xl mx-auto px-6">
      <Reveal as="h2" className="text-center text-xl md:text-2xl font-bold text-(--text) max-w-2xl mx-auto mb-14">
        {title}
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {items.map((it, i) => (
          <Reveal as="div" key={it.stat} delay={i * 90} className="flex flex-col items-center text-center">
            <it.Doodle color={it.color} className="mb-5" />
            <p className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-(--text)">{it.stat}</p>
            <p className="text-sm text-(--text-dim) mt-3 max-w-[220px] leading-relaxed">{it.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default DoodleFeatures;
