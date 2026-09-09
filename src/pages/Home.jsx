import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ShatterTitle from '../components/ShatterTitle';
import ScrollStatement from '../components/ScrollStatement';
import About from '../components/About';
import Services from '../components/Services';
import WhyUs from '../components/WhyUs';
import Careers from '../components/Careers';
import CallToAction from '../components/CallToAction';
import Reveal from '../components/Reveal';
import Interactive3DNetwork from '../components/Interactive3DNetwork';

const Home = () => {
  return (
    <>
      {/* Hero stays as the immediate first-view, no reveal delay */}
      <Hero />

      <Reveal as="div">
        <ShatterTitle />
      </Reveal>
      <Reveal as="div">
        <ScrollStatement />
      </Reveal>

      {/* Company Overview & Services — preview mode: enough to read, then a
          "view all" link into the dedicated /about, /services, /industries,
          /why-us pages. */}
      <Reveal as="div">
        <About variant="preview" />
      </Reveal>

      <Reveal as="div">
        <Services variant="preview" />
      </Reveal>

      {/* Interactive 3D network diagram — a visual anchor between the
          service grid and the "why us" reasons, tying the two together. */}
      <Reveal as="div">
        <section className="relative py-20 bg-transparent overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5 order-2 lg:order-1">
              <span className="text-xs font-mono tracking-widest text-[#E8A23D] uppercase">Live Network</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight">
                One network, <span className="bg-gradient-to-r from-[#00AEEF] to-purple-500 bg-clip-text text-transparent">every channel.</span>
              </h2>
              <p className="text-[var(--text-dim)] text-sm md:text-base leading-relaxed max-w-lg">
                SMS, voice and WhatsApp all ride the same carrier-grade backbone — 1,200+ operator
                routes across 180+ countries, monitored and automatically rerouted in real time.
                Move your cursor over the diagram — it follows you.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/services"
                  className="px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#E8A23D] transition-colors"
                >
                  See how it works
                </Link>
                <Link
                  to="/why-us"
                  className="px-6 py-3 bg-[var(--overlay)] border border-[var(--border)] text-[var(--text-soft)] rounded-xl text-sm hover:bg-[var(--overlay-strong)] transition-colors"
                >
                  Why it's reliable
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Interactive3DNetwork
                size={320}
                className="mx-auto"
                legend={[
                  { label: 'SMS & OTP', color: '#00AEEF' },
                  { label: 'Voice & IVR', color: '#A855F7' },
                  { label: 'WhatsApp API', color: '#E8A23D' },
                ]}
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal as="div">
        <WhyUs variant="preview" />
      </Reveal>

      <Reveal as="div">
        <Careers />
      </Reveal>

      <Reveal as="div">
        <CallToAction />
      </Reveal>

      {/* Contact teaser — brief, with a link into the full /contact page
          (which carries the phone/email/address cards and the map). */}
      <Reveal as="div">
        <section className="relative py-24 bg-transparent overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
            <span className="text-xs font-mono tracking-widest text-[#E8A23D] uppercase">Contact Us</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight">
              Let's start a <span className="bg-gradient-to-r from-[#00AEEF] via-purple-400 to-[#E8A23D] bg-clip-text text-transparent">project.</span>
            </h2>
            <p className="text-[var(--text-dim)] text-sm md:text-base max-w-xl mx-auto">
              24x7 helpline, email support, or drop by our Nagpur office — pick whatever's easiest.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00AEEF] to-blue-600 text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(0,174,239,0.3)] hover:shadow-[0_0_35px_rgba(0,174,239,0.6)] hover:scale-105 transition-all duration-300"
            >
              Get in touch &rarr;
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
};

export default Home;
