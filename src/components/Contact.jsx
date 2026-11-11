import React from 'react';
import MapEmbed from './MapEmbed';
import { litCardProps } from '../utils/litCard';
import { T } from '../content';

const Contact = () => {
  return (
    <section id="contact" className="scroll-mt-24 relative py-24 bg-transparent overflow-hidden">
      {/* Background Ambient Orbs */}

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column: Contact Cards with Vibrant Shadow Hover Effects */}
          <div className="space-y-6 flex flex-col justify-between">
            
            {/* Phone */}
            <div
              className="group p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
              {...litCardProps('#00AEEF', 'rgba(0, 174, 239, 0.35)', { tilt: false })}
            >
              <span className="text-xs font-mono text-[var(--text-faint)] block mb-2 transition-colors duration-300 group-hover:text-[#00AEEF]"><T k="Contact.1" d={"24/7 CUSTOMER HELPLINE"} /></span>
              <div className="space-y-1 font-mono text-lg font-bold text-[var(--text)] transition-all duration-300 group-hover:scale-[1.03] group-hover:text-[#00AEEF] origin-left">
                <p className="cursor-pointer"><T k="Contact.2" d={"+91 95525 56786"} /></p>
                <p className="cursor-pointer"><T k="Contact.3" d={"+91 95525 01029"} /></p>
                <p className="cursor-pointer"><T k="Contact.4" d={"+91 98500 87786"} /></p>
              </div>
            </div>

            {/* Email */}
            <div
              className="group p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
              {...litCardProps('#00AEEF', 'rgba(168, 85, 247, 0.35)', { tilt: false })}
            >
              <span className="text-xs font-mono text-[var(--text-faint)] block mb-2 transition-colors duration-300 group-hover:text-[#00AEEF]"><T k="Contact.5" d={"EMAIL ENQUIRIES"} /></span>
              <div className="space-y-1 text-base font-semibold text-[var(--text-soft)] transition-all duration-300 group-hover:scale-[1.03] group-hover:text-[#00AEEF] origin-left">
                <p className="cursor-pointer"><T k="Contact.6" d={"orianteleservices@gmail.com"} /></p>
                <p className="cursor-pointer"><T k="Contact.7" d={"support@orian.in"} /></p>
              </div>
            </div>

            {/* Address */}
            <div
              className="group p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
              {...litCardProps('#00AEEF', 'rgba(52, 211, 153, 0.35)', { tilt: false })}
            >
              <span className="text-xs font-mono text-[var(--text-faint)] block mb-2 transition-colors duration-300 group-hover:text-[#35C1F4]"><T k="Contact.8" d={"OFFICE ADDRESS"} /></span>
              <p className="text-[var(--text-soft)] text-sm leading-relaxed transition-colors duration-300 group-hover:text-[#35C1F4]">
                <T k="Contact.9" d={"Plot no 2, Kgn Nagar, near St Joseph School, Godhni, Nagpur, Maharashtra 441123"} />
              </p>
            </div>

          </div>

          {/* Right Column: Theme-Aware Map Embed */}
          <MapEmbed className="h-96 lg:h-[440px] min-h-[380px]" />

        </div>

      </div>
    </section>
  );
};

export default Contact;
