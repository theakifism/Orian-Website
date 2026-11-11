import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import Reveal from '../components/Reveal';
import Typewriter from '../components/Typewriter';
import { photoProps } from '../utils/photo';
import PageContent from '../components/PageContent';

const searchExamples = ['sender ID registration', 'WhatsApp template approval', 'DLT registration', 'delivery reports'];

const iconCategories = [
  { label: 'Getting Started', icon: 'M13 10V3L4 14h7v7l9-11h-7z', href: '/services' },
  { label: 'SMS & OTP', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', href: '/services/bulk-sms-otp-gateways' },
  { label: 'Voice & IVR', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', href: '/services' },
  { label: 'WhatsApp API', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', href: '/services' },
  { label: 'DLT Compliance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', href: '/why-us' },
  { label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', href: '/contact' },
  { label: 'API Docs', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', href: '/services' },
  { label: 'Account & Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', href: '/contact' },
];

const linkGroups = [
  {
    heading: 'Messaging Channels',
    links: [
      { label: 'Bulk SMS setup', href: '/services/bulk-sms-otp-gateways' },
      { label: 'OTP delivery best practices', href: '/services' },
      { label: 'Voice call blasting', href: '/services' },
      { label: 'IVR flow builder', href: '/services' },
    ],
  },
  {
    heading: 'WhatsApp Business API',
    links: [
      { label: 'Getting Meta-verified', href: '/services' },
      { label: 'Template approval guide', href: '/services' },
      { label: 'Chatbot setup', href: '/services' },
    ],
  },
  {
    heading: 'Compliance & Billing',
    links: [
      { label: 'DLT registration walkthrough', href: '/why-us' },
      { label: 'Understanding your invoice', href: '/contact' },
      { label: 'Route redundancy & SLA', href: '/why-us' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Adding team members', href: '/contact' },
      { label: 'API key management', href: '/contact' },
      { label: 'Contact support', href: '/contact' },
    ],
  },
];

const HelpCenterPage = () => {
  const [query, setQuery] = useState('');

  return (
    <>
      <Seo title={pageMeta.helpCenter.title} description={pageMeta.helpCenter.description} path={pageMeta.helpCenter.path} />

      {/* Gradient hero with search + person photo (GoDaddy Help Center hero) */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-linear-to-br from-[#D9EEF0] to-[#EAF3E9] dark:from-[#0E1A24] dark:to-[#0C1A17]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#0B6E73] dark:text-[#00AEEF] uppercase">Orian Support</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-(--text) tracking-tight mt-2 mb-3">
              Help Center
            </h1>
            <p className="text-(--text-soft) text-sm md:text-base mb-6 max-w-lg">
              We're here with the guidance you need to get your messages delivered.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex max-w-lg rounded-xl overflow-hidden border border-(--border-strong) bg-(--surface)"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="What can we help with?"
                className="flex-1 px-4 py-3 text-sm text-(--text) outline-none bg-transparent"
              />
              {/* Animated placeholder: a real placeholder attribute can't
                  hold the Typewriter's cursor span, so this sits over the
                  input and hides the moment there's real text or focus. */}
              {!query && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--text-faint) pointer-events-none flex items-center gap-1">
                  Try &ldquo;<Typewriter words={searchExamples} typingSpeed={55} deletingSpeed={30} className="text-[#0B6E73] dark:text-[#00AEEF]" />&rdquo;
                </span>
              )}
              <button
                type="submit"
                className="px-5 bg-(--text) text-(--bg) flex items-center justify-center hover:bg-[#00AEEF] hover:text-black transition-colors"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>
            </form>
          </div>
          <div className="hidden md:block aspect-4/3 rounded-2xl overflow-hidden bg-white/40 dark:bg-white/5">
            <img
              {...photoProps('help-center/hero-person.jpg', "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
              alt="Orian support agent"
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>

      {/* Icon grid + category link lists */}
      <section className="relative py-16 bg-transparent overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal as="div" className="rounded-2xl border border-(--border) bg-(--surface) p-8 md:p-10 mb-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
              {iconCategories.map((cat) => (
                <Link key={cat.label} to={cat.href} className="group flex flex-col items-center text-center gap-3">
                  <svg className="w-8 h-8 text-(--text-soft) group-hover:text-[#00AEEF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={cat.icon} />
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-(--text-soft) leading-snug relative pb-1.5 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-[#00AEEF] after:opacity-0 group-hover:after:opacity-100 after:transition-opacity">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {linkGroups.map((group, i) => (
              <Reveal as="div" key={group.heading} delay={i * 60}>
                <h2 className="text-sm font-bold text-(--text) mb-4">{group.heading}</h2>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm text-[#00AEEF] hover:underline underline-offset-2">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    <PageContent id="helpCenter" />
    </>
  );
};

export default HelpCenterPage;
