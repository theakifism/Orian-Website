import React from 'react';
import { Link } from 'react-router-dom';
import { RobotDoodle } from './DoodleIcons';
import Typewriter from './Typewriter';

const askWords = ['routing?', 'DLT compliance?', 'sender IDs?', 'WhatsApp templates?', 'delivery reports?'];

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#00AEEF]/10 via-[#00AEEF]/10 to-transparent border-t border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <RobotDoodle className="w-16 h-16 shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text)] leading-snug">
            Got a question about{' '}
            <Typewriter
              words={askWords}
              className="text-[#00AEEF]"
            />
            <br className="hidden sm:block" /> Ask Orian AI.
          </h3>
          <p className="text-[var(--text-dim)] text-sm mt-1">Ask about routing, DLT, sender IDs, WhatsApp templates, or delivery reports.</p>
        </div>
        <Link
          to="/assistant"
          className="px-8 py-4 bg-[#00AEEF] text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
        >
          Chat with Orian AI &rarr;
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
