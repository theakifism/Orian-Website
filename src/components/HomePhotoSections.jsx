import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { industries } from '../data/industries';
import { services } from '../data/services';
import { ShareIcon, CodeIcon } from './CardIcons';
import { whyUsData } from '../data/whyUs';
import { photoProps } from '../utils/photo';

/**
 * Photo-first sections for the Home page. Every image lives under
 * src/assets/images/... and reuses the same files as the inner pages where
 * possible (industries/, services/, why-us/, careers/, team/,
 * resources/), so no extra photos are needed beyond the small set under
 * src/assets/images/home/. A missing file never shows a broken-image icon --
 * the tile just keeps its soft background.
 */
const Photo = ({ name, alt, className = '', imgClassName = '', priority = false }) => (
  <div className={`${className.includes('absolute') ? '' : 'relative'} overflow-hidden bg-(--overlay) ${className}`}>
    <img
      {...photoProps(name, "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
      alt={alt}
      decoding="async"
      loading="lazy"
      className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  </div>
);

const SectionHead = ({ eyebrow, title, sub, to, cta }) => (
  <Reveal as="div" className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
    <div className="max-w-2xl">
      <span className="text-xs font-mono tracking-widest text-[#00AEEF] uppercase">{eyebrow}</span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-(--text) tracking-tight mt-2">{title}</h2>
      {sub && <p className="text-(--text-dim) text-sm md:text-base mt-3">{sub}</p>}
    </div>
    {to && (
      <Link to={to} className="text-sm font-semibold text-[#00AEEF] hover:underline underline-offset-4 whitespace-nowrap">
        {cta} &rarr;
      </Link>
    )}
  </Reveal>
);

/* 1. Wide banner photo with overlaid headline */
export const PhotoBanner = () => (
  <section className="relative py-10 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal as="div">
        <div className="relative rounded-3xl overflow-hidden aspect-21/9 min-h-[260px] bg-(--overlay)">
          <Photo name={'home/banner-team.png'} alt="The Orian team at work" className="absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-14 max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Real people behind every message.
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-5">
              15+ years of telecom experience, a support desk that never sleeps, and a team that picks up the phone.
            </p>
            <Link to="/about" className="w-fit px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-[#00AEEF] transition-colors">
              Meet the team
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* 2. Services as photo cards */
export const ServicesPhotoCards = () => (
  <section className="relative py-16 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHead
        eyebrow="What we do"
        title="Messaging, social and IT. One partner."
        sub="Tap any service to see how it works and who uses it."
        to="/services"
        cta="All services"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <Reveal as="div" key={s.slug} delay={i * 70}>
            <Link to={`/services/${s.slug}`} className="group block h-full rounded-2xl overflow-hidden border border-(--border) bg-(--surface)">
              {s.hasPhoto === false ? (
                <div className="aspect-4/3 flex items-center justify-center bg-(--surface-alt)" style={{ backgroundImage: `radial-gradient(circle at 50% 40%, ${s.accentColor}22, transparent 65%)` }}>
                  <span className="w-16 h-16 rounded-2xl border flex items-center justify-center" style={{ borderColor: `${s.accentColor}55`, color: s.accentColor, background: `${s.accentColor}14` }}>
                    {s.icon === 'social' ? <ShareIcon className="w-8 h-8" /> : <CodeIcon className="w-8 h-8" />}
                  </span>
                </div>
              ) : (
                <Photo name={`services/${s.slug}.jpg`} alt={s.title} className="aspect-4/3" imgClassName="group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="p-5">
                <h3 className="text-base font-bold text-(--text) mb-1.5">{s.title}</h3>
                <p className="text-xs text-(--text-dim) leading-relaxed mb-3">{s.tagline}</p>
                <span className="text-xs font-semibold text-[#00AEEF]">Learn more &rarr;</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* 3. Industries photo grid (first 8 of 20) */
export const IndustriesPhotoGrid = () => (
  <section className="relative py-16 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHead
        eyebrow="Industries"
        title="Built for the way you work."
        sub="From banks to factories to classrooms -- see how your sector uses Orian."
        to="/industries"
        cta={`All ${industries.length} industries`}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {industries.slice(0, 8).map((ind, i) => (
          <Reveal as="div" key={ind.slug} delay={i * 50}>
            <Link to={`/industries/${ind.slug}`} className="group relative block rounded-2xl overflow-hidden aspect-4/5 bg-(--overlay)">
              <Photo name={`industries/${ind.slug}.jpg`} alt={ind.name} className="absolute inset-0" imgClassName="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-sm md:text-base font-bold leading-snug">{ind.name}</h3>
                <span className="text-[11px] text-white/70">View use cases &rarr;</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* 4. Zig-zag: photo left/text right, then flipped */
const zig = [
  {
    photo: 'team/founders.jpg',
    title: 'Business messaging with Orian.',
    body: 'Explore messaging and communication services for your business requirements.',
    to: '/about', cta: 'Our story',
  },
  {
    photo: 'team/office.jpg',
    title: 'Support for your requirements.',
    body: 'Contact the team to discuss support channels and service arrangements.',
    to: '/why-us/support-247', cta: 'See our support',
  },
];
export const ZigZagStory = () => (
  <section className="relative py-16 overflow-hidden">
    <div className="max-w-6xl mx-auto px-6 space-y-16 md:space-y-24">
      {zig.map((z, i) => (
        <Reveal as="div" key={z.title} variant="side" side={i % 2 ? 'right' : 'left'} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className={i % 2 ? 'md:order-2' : ''}>
            <Photo name={z.photo} alt={z.title} className="aspect-4/3 rounded-2xl border border-(--border)" />
          </div>
          <div className={i % 2 ? 'md:order-1' : ''}>
            <h3 className="text-2xl md:text-3xl font-extrabold text-(--text) tracking-tight mb-3">{z.title}</h3>
            <p className="text-(--text-dim) text-sm md:text-base leading-relaxed mb-5">{z.body}</p>
            <Link to={z.to} className="inline-flex px-5 py-2.5 border border-(--border) rounded-full text-sm font-semibold text-(--text) hover:bg-(--overlay) transition-colors">
              {z.cta} &rarr;
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* 5. Why-us photo strip (first 3 reasons) */
export const WhyUsPhotoStrip = () => (
  <section className="relative py-16 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHead eyebrow="Why Orian" title="Reasons teams stay with us." to="/why-us" cta="All reasons" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {whyUsData.slice(0, 3).map((w, i) => (
          <Reveal as="div" key={w.slug} delay={i * 80}>
            <Link to={`/why-us/${w.slug}`} className="group block rounded-2xl overflow-hidden border border-(--border) bg-(--surface) h-full">
              <Photo name={`why-us/${w.slug}.jpg`} alt={w.title} className="aspect-16/10" imgClassName="group-hover:scale-105 transition-transform duration-500" />
              <div className="p-5">
                <h3 className="text-base font-bold text-(--text) mb-1.5">{w.title}</h3>
                <p className="text-xs text-(--text-dim) leading-relaxed">{w.desc}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* 6. Latest resources preview */
const articles = [
  { slug: 'sms-route-redundancy', badge: 'SMS', title: 'Reducing OTP delivery failures with route redundancy', read: '5 min read' },
  { slug: 'whatsapp-chatbot-flow', badge: 'WHATSAPP', title: 'Building your first WhatsApp chatbot flow', read: '7 min read' },
  { slug: 'whatsapp-vs-sms', badge: 'WHATSAPP', title: 'WhatsApp vs SMS: when to use which channel', read: '6 min read' },
];
export const ResourcesPreview = () => (
  <section className="relative py-16 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHead eyebrow="Resources" title="Guides from the Orian team." to="/resources" cta="All resources" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((a, i) => (
          <Reveal as="div" key={a.slug} delay={i * 80}>
            <Link to="/resources" className="group block">
              <Photo name={`resources/${a.slug}.jpg`} alt={a.title} className="aspect-4/3 rounded-xl mb-3" imgClassName="group-hover:scale-105 transition-transform duration-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00AEEF]">{a.badge}</span>
              <h3 className="text-sm font-bold text-(--text) leading-snug mt-1 mb-1">{a.title}</h3>
              <p className="text-[11px] text-(--text-faint)">{a.read}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* 7. "Life at Orian" photo mosaic */
