import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { organizationSchema } from '../seo/jsonld';
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
import MapEmbed from '../components/MapEmbed';
import SpecialRequirement from '../components/SpecialRequirement';
import AnimatedIconBadge from '../components/AnimatedIconBadge';
import { ChatIcon } from '../components/CardIcons';

const Home = () => {
  return (
    <>
      <Seo
        title={pageMeta.home.title}
        description={pageMeta.home.description}
        path={pageMeta.home.path}
        jsonLd={organizationSchema()}
      />

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

      {/* Get Started hub — the three things that must live on the home page:
          the AI assistant, the map, and a direct contact number — laid out
          as one clear panel, plus the full requirement form right below so
          people can act immediately without leaving the page. */}
      <Reveal as="div">
        <section id="get-started" className="scroll-mt-24 relative py-24 bg-transparent overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <span className="text-xs font-mono tracking-widest text-[#E8A23D] uppercase">Get Started</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight">
                Talk to us, <span className="bg-gradient-to-r from-[#00AEEF] via-purple-400 to-[#E8A23D] bg-clip-text text-transparent">right now.</span>
              </h2>
              <p className="text-[var(--text-dim)] text-sm md:text-base">
                Ask our AI assistant, find us on the map, or just call — whichever's fastest for you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

              {/* 1. AI Assistant */}
              <Link
                to="/assistant"
                className="group relative flex flex-col p-7 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300 hover:-translate-y-1"
              >
                <AnimatedIconBadge color="#A855F7" className="mb-4">
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                    <ChatIcon className="w-6 h-6" />
                  </span>
                </AnimatedIconBadge>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 orbit-live-dot" />
                  Online 24/7
                </span>
                <h3 className="text-xl font-bold text-[var(--text)] mb-2 group-hover:text-purple-400 transition-colors">
                  Ask Orian AI
                </h3>
                <p className="text-[var(--text-dim)] text-sm leading-relaxed mb-4 flex-1">
                  Pricing, DLT compliance, WhatsApp onboarding, routing — get a straight answer in under 10 seconds, no sales call needed.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Chat now &rarr;
                </span>
              </Link>

              {/* 2. Map */}
              <div className="group relative flex flex-col p-7 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl hover:border-[#00AEEF]/60 hover:shadow-[0_0_30px_rgba(0,174,239,0.25)] transition-all duration-300 hover:-translate-y-1">
                <AnimatedIconBadge color="#00AEEF" className="mb-4">
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#00AEEF]/15 text-[#00AEEF]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </AnimatedIconBadge>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00AEEF] mb-2">Orian HQ &bull; Nagpur</span>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3 group-hover:text-[#00AEEF] transition-colors">
                  Find us on the map
                </h3>
                <MapEmbed compact className="flex-1 min-h-[180px]" />
              </div>

              {/* 3. Contact number */}
              <div className="group relative flex flex-col p-7 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl hover:border-[#E8A23D]/60 hover:shadow-[0_0_30px_rgba(232,162,61,0.25)] transition-all duration-300 hover:-translate-y-1">
                <AnimatedIconBadge color="#E8A23D" className="mb-4">
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#E8A23D]/15 text-[#E8A23D]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                </AnimatedIconBadge>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8A23D] mb-2">24x7 Helpline</span>
                <h3 className="text-xl font-bold text-[var(--text)] mb-4 group-hover:text-[#E8A23D] transition-colors">
                  Call us directly
                </h3>
                <div className="space-y-2 font-mono text-sm font-bold text-[var(--text)] mb-4 flex-1">
                  <a href="tel:+919552556786" className="block hover:text-[#E8A23D] transition-colors">+91 95525 56786</a>
                  <a href="tel:+919552501029" className="block hover:text-[#E8A23D] transition-colors">+91 95525 01029</a>
                  <a href="tel:+919850087786" className="block hover:text-[#E8A23D] transition-colors">+91 98500 87786</a>
                </div>
                <a
                  href="tel:+919552556786"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#E8A23D] text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#00AEEF] transition-all duration-300 shadow-[0_0_15px_rgba(232,162,61,0.3)] hover:shadow-[0_0_20px_rgba(0,174,239,0.5)]"
                >
                  Call now &rarr;
                </a>
              </div>

            </div>
          </div>
        </section>
      </Reveal>

      {/* Full requirement form, embedded directly on the home page so
          people can send their requirement without navigating away. */}
      <Reveal as="div">
        <SpecialRequirement />
      </Reveal>
    </>
  );
};

export default Home;
