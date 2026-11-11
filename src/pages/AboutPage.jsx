import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import About from '../components/About';
import Reveal from '../components/Reveal';
import { litCardProps } from '../utils/litCard';
import { ShieldDoodle, RouteDoodle } from '../components/DoodleIcons';
import { PLATFORM_DELIVERY_RATE, PLATFORM_UPTIME } from '../data/homeCopy';
import PageContent from '../components/PageContent';

const milestones = [
  { value: `${PLATFORM_UPTIME}%`, label: 'Platform uptime', Doodle: ShieldDoodle },
  { value: `${PLATFORM_DELIVERY_RATE}%`, label: 'Message delivery rate', Doodle: RouteDoodle },
];

const AboutPage = () => {
  return (
    <>
      <Seo title={pageMeta.about.title} description={pageMeta.about.description} path={pageMeta.about.path} />
      <PageHeader
        eyebrow="About Orian"
        title="Business messaging"
        gradientWord="with Orian."
        subtitle="Explore SMS, voice, WhatsApp and related services, then speak with our team about your requirements."
        breadcrumbs={[{ label: 'About' }]}
      />

      <About variant="full" />

      {/* Shared platform metrics, also shown on the homepage and status page. */}
      <section className="relative py-20 bg-transparent overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal as="div" className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">Platform metrics</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-(--text) tracking-tight mt-2">
              Service performance
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {milestones.map((m, i) => (
              <Reveal as="div" key={m.label} delay={i * 80}>
                <div
                  {...litCardProps('#00AEEF', 'rgba(0, 0, 0, 0.6)', { tilt: false })}
                  className="h-full p-5 bg-(--surface)/90 border border-(--border) rounded-2xl transition-all duration-300 text-center flex flex-col items-center"
                >
                  <m.Doodle color="#00AEEF" className="mb-5" />
                  <div className="text-2xl md:text-3xl font-extrabold font-mono text-[#00AEEF]">{m.value}</div>
                  <div className="text-xs text-(--text-faint) mt-1 leading-snug">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    <PageContent id="about" />
    </>
  );
};

export default AboutPage;
