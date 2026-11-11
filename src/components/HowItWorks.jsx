import React from 'react';
import { MailDoodle, ShieldDoodle, RouteDoodle, PhoneDoodle } from './DoodleIcons';

/**
 * A general illustration of the steps in a business messaging flow.
 */
const steps = [
  {
    label: 'Your Platform',
    desc: 'API call, CRM trigger, or bulk upload',
    color: '#00AEEF',
    Doodle: MailDoodle,
  },
  {
    label: 'Messaging provider',
    desc: 'Processing and routing depend on the service',
    color: '#00AEEF',
    Doodle: ShieldDoodle,
  },
  {
    label: 'Carrier Network',
    desc: 'Carrier network',
    color: '#00AEEF',
    Doodle: RouteDoodle,
  },
  {
    label: "Customer's Phone",
    desc: 'Delivery timing depends on the route and carrier network.',
    color: '#00AEEF',
    Doodle: PhoneDoodle,
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-20 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">The Flow</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-(--text) tracking-tight">
            What happens when you <span className="text-[#00AEEF]">hit send.</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {steps.map((step, idx) => (
            <div key={step.label} className="relative flex flex-col items-center text-center gap-3">
              <step.Doodle color={step.color} className="w-16 h-16 md:w-20 md:h-20" />
              <span className="font-mono text-xs font-bold tracking-widest" style={{ color: step.color }}>
                STEP {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm md:text-base font-bold text-(--text)">{step.label}</h3>
              <p className="text-xs text-(--text-dim) leading-relaxed max-w-[160px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
