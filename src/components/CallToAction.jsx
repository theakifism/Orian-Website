import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#00AEEF]/10 via-purple-600/10 to-transparent border-t border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text)]">Got a question? Orian AI never sleeps.</h3>
          <p className="text-[var(--text-dim)] text-sm mt-1">Skip the contact form — ask it anything about routing, pricing or DLT and get a straight answer in seconds.</p>
        </div>
        <Link
          to="/assistant"
          className="px-8 py-4 bg-gradient-to-r from-[#00AEEF] to-blue-600 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(0,174,239,0.4)] hover:scale-105 transition-all duration-300 whitespace-nowrap"
        >
          Chat with Orian AI &rarr;
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
