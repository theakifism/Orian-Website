import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="scroll-mt-24 relative py-24 bg-transparent overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column: Contact Cards with Vibrant Shadow Hover Effects */}
          <div className="space-y-6 flex flex-col justify-between">
            
            {/* Phone */}
            <div className="group p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl hover:border-[#00AEEF]/60 hover:shadow-[0_0_30px_rgba(0,174,239,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <span className="text-xs font-mono text-[var(--text-faint)] block mb-2 transition-colors duration-300 group-hover:text-[#00AEEF]">24x7 CUSTOMER HELPLINE</span>
              <div className="space-y-1 font-mono text-lg font-bold text-[var(--text)] transition-all duration-300 group-hover:scale-[1.03] group-hover:text-[#00AEEF] origin-left">
                <p className="cursor-pointer">+91 95525 56786</p>
                <p className="cursor-pointer">+91 95525 01029</p>
                <p className="cursor-pointer">+91 98500 87786</p>
              </div>
            </div>

            {/* Email */}
            <div className="group p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <span className="text-xs font-mono text-[var(--text-faint)] block mb-2 transition-colors duration-300 group-hover:text-purple-400">EMAIL ENQUIRIES</span>
              <div className="space-y-1 text-base font-semibold text-[var(--text-soft)] transition-all duration-300 group-hover:scale-[1.03] group-hover:text-purple-400 origin-left">
                <p className="cursor-pointer">orianteleservices@gmail.com</p>
                <p className="cursor-pointer">support@orian.in</p>
              </div>
            </div>

            {/* Address */}
            <div className="group p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl hover:border-[#E8A23D]/60 hover:shadow-[0_0_30px_rgba(232,162,61,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <span className="text-xs font-mono text-[var(--text-faint)] block mb-2 transition-colors duration-300 group-hover:text-[#E8A23D]">OFFICE ADDRESS</span>
              <p className="text-[var(--text-soft)] text-sm leading-relaxed transition-colors duration-300 group-hover:text-[#E8A23D]">
                Plot no 2, Kgn Nagar, near St Joseph School, Godhni, Nagpur, Maharashtra 441123
              </p>
            </div>

          </div>

          {/* Right Column: Theme-Aware Map Embed */}
          <div className="relative h-96 lg:h-auto min-h-[380px] rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--shadow-ambient)] hover:border-[#00AEEF]/50 transition-all duration-500 group">
            <iframe
              title="Orian Teleservices Location"
              src="https://www.google.com/maps?q=Plot%20no%202%2C%20Kgn%20Nagar%2C%20near%20St%20Joseph%20School%2C%20Godhni%2C%20Nagpur%2C%20Maharashtra%20441123&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'var(--map-filter)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-4 left-4 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 text-xs font-mono text-white pointer-events-none">
              <span className="text-[#00AEEF] font-bold">Orian HQ</span> • Nagpur, India
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;