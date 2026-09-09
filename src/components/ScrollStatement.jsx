import React from 'react';
import TiltCard from './TiltCard';
import { GatewayIcon, ShieldCheckIcon, WaveformIcon } from './CardIcons';

const ScrollStatement = () => {
  return (
        <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
        
        {/* High-Contrast Gradient Typography with Correct Spacing */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-(--text) leading-snug tracking-tight">
          Fifteen years in messaging taught us one thing:{' '}
          <span className="bg-linear-to-r from-[#00AEEF] via-purple-400 to-[#E8A23D] bg-clip-text text-transparent">
            businesses don't need more noise, they need to be heard.
          </span>
        </h2>

        <p className="text-(--text-dim) text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          From high-volume OTP dispatchers to intelligent WhatsApp customer engagement, we eliminate delivery bottlenecks with direct operator routes.
        </p>

        {/* Dynamic Pop Cards with Floating Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">

          <TiltCard delay={0}>
            <div className="group p-6 bg-(--surface)/80 border border-(--border) rounded-2xl hover:scale-105 hover:border-[#00AEEF] hover:shadow-[0_10px_30px_rgba(0,174,239,0.2)] transition-all duration-300 animate-float hover:[animation-play-state:paused]">
              <div className="w-12 h-12 rounded-xl bg-[#00AEEF]/10 border border-[#00AEEF]/30 flex items-center justify-center text-[#00AEEF] mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <GatewayIcon className="w-6 h-6" />
              </div>
              <h3 className="text-(--text) text-lg font-bold mb-2 transition-all duration-300 group-hover:text-[#00AEEF] group-hover:translate-z-5.5">Direct SMPP Gateways</h3>
              <p className="text-(--text-dim) text-xs leading-relaxed transition-all duration-300 group-hover:text-(--text-soft) group-hover:translate-z-3">High-throughput connections ensuring low latency for critical banking and security OTPs.</p>
            </div>
          </TiltCard>

          <TiltCard delay={120}>
            <div className="group p-6 bg-(--surface)/80 border border-(--border) rounded-2xl hover:scale-105 hover:border-[#E8A23D] hover:shadow-[0_10px_30px_rgba(232,162,61,0.2)] transition-all duration-300 animate-float [animation-delay:200ms] hover:[animation-play-state:paused]">
              <div className="w-12 h-12 rounded-xl bg-[#E8A23D]/10 border border-[#E8A23D]/30 flex items-center justify-center text-[#E8A23D] mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-(--text) text-lg font-bold mb-2 transition-all duration-300 group-hover:text-[#E8A23D] group-hover:translate-z-5.5">DLT Regulatory Sync</h3>
              <p className="text-(--text-dim) text-xs leading-relaxed transition-all duration-300 group-hover:text-(--text-soft) group-hover:translate-z-3">Complete automated support for TRAI DLT registration, entity approval, and template scrub.</p>
            </div>
          </TiltCard>

          <TiltCard delay={240}>
            <div className="group p-6 bg-(--surface)/80 border border-(--border) rounded-2xl hover:scale-105 hover:border-purple-500 hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] transition-all duration-300 animate-float [animation-delay:400ms] hover:[animation-play-state:paused]">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <WaveformIcon className="w-6 h-6" />
              </div>
              <h3 className="text-(--text) text-lg font-bold mb-2 transition-all duration-300 group-hover:text-purple-400 group-hover:translate-z-5.5">Voice & GRPTALK</h3>
              <p className="text-(--text-dim) text-xs leading-relaxed transition-all duration-300 group-hover:text-(--text-soft)] group-hover:translate-z-3">Automated voice call blasting and enterprise multi-party audio conferencing solutions.</p>
            </div>
          </TiltCard>

        </div>

      </div>
    </section>
  );
};

export default ScrollStatement;