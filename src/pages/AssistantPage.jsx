import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import AiAssistant from '../components/AiAssistant';
import { litCardProps } from '../utils/litCard';
import PageContent from '../components/PageContent';

const punches = [
  { value: 'AI', label: 'Ask a question about messaging' },
  { value: 'Team', label: 'Contact us for account-specific help' },
];

const AssistantPage = () => {
  return (
    <>
      <Seo title={pageMeta.assistant.title} description={pageMeta.assistant.description} path={pageMeta.assistant.path} />
      <PageHeader
        eyebrow="Live AI Assistant"
        title="Stop reading docs."
        gradientWord="Just ask."
        subtitle="Orian AI knows our routing network, DLT compliance process, WhatsApp onboarding cold — because that's all we built it to know. Ask it anything you'd normally ask a salesperson, at 2am, and get a straight answer."
        breadcrumbs={[{ label: 'Assistant' }]}
        glowClass="bg-[#00AEEF]/10"
      />

      <section className="relative pb-4 bg-transparent overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-2 sm:gap-4">
          {punches.map((p) => (
            <div
              key={p.label}
              {...litCardProps('#00AEEF', 'rgba(168, 85, 247, 0.35)', { tilt: false })}
              className="p-3 sm:p-5 text-center bg-[var(--surface)]/80 border border-[var(--border)] rounded-2xl backdrop-blur-xl transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-extrabold font-mono text-[#00AEEF]">
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
            <Link to="/contact" className="text-[#00AEEF] hover:text-[#35C1F4] font-semibold transition-colors">
              Reach our team directly &rarr;
            </Link>
          </p>
        </div>
      </section>
    <PageContent id="assistant" />
    </>
  );
};

export default AssistantPage;
