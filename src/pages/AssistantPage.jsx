import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import AiAssistant from '../components/AiAssistant';

const punches = [
  { value: '< 10 sec', label: 'to a real answer, not a ticket queue' },
  { value: '24 / 7', label: 'no "we\u2019ll get back to you Monday"' },
  { value: '0', label: 'sales calls required to get pricing' },
];

const AssistantPage = () => {
  return (
    <>
      <PageHeader
        eyebrow="Live AI Assistant"
        title="Stop reading docs."
        gradientWord="Just ask."
        subtitle="Orian AI knows our routing network, DLT compliance process, WhatsApp onboarding and pricing cold — because that's all we built it to know. Ask it anything you'd normally ask a salesperson, at 2am, and get a straight answer."
        breadcrumbs={[{ label: 'Assistant' }]}
        glowClass="bg-purple-500/10"
      />

      <section className="relative pb-4 bg-transparent overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {punches.map((p) => (
            <div
              key={p.label}
              className="p-5 text-center bg-[var(--surface)]/80 border border-[var(--border)] rounded-2xl backdrop-blur-xl hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-extrabold font-mono bg-gradient-to-r from-[#00AEEF] to-purple-400 bg-clip-text text-transparent">
                {p.value}
              </div>
              <div className="text-[11px] md:text-xs text-[var(--text-faint)] mt-1.5 leading-snug">{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      <AiAssistant showHeading={false} />

      <section className="relative pb-20 bg-transparent overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm text-[var(--text-faint)]">
            Prefer talking to an actual human?{' '}
            <Link to="/contact" className="text-[#00AEEF] hover:text-[#E8A23D] font-semibold transition-colors">
              Reach our team directly &rarr;
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default AssistantPage;
