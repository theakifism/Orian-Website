import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { photoProps } from '../utils/photo';

/**
 * The GoDaddy-homepage "bento grid" pattern: a mixed-size grid of feature
 * tiles, each with its own solid background color, a simple icon or stat,
 * and one wider tile showing a realistic product-mockup screenshot. No
 * decorative photography — the color blocks and typography carry it.
 */
const TilePhoto = ({ name }) => (
  <img
    {...photoProps(name, "(min-width: 768px) 50vw, 100vw")}
    alt=""
    aria-hidden="true"
    loading="lazy"
    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply pointer-events-none"
    onError={(e) => { e.currentTarget.style.display = 'none'; }}
  />
);

const BentoGrid = () => {
  return (
    <section className="relative py-16 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(200px,auto)]">

          {/* 1. Large tile — go-live speed, colored background */}
          <Reveal as="div" className="md:row-span-2">
            <Link
              to="/services"
              className="group flex flex-col justify-between h-full p-8 rounded-2xl bg-[#00AEEF] text-black overflow-hidden relative"
            >
              <TilePhoto name="home/bento-golive.jpg" />
              <svg className="relative w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="relative">
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
                  First live send in under 48 hours for most clients.
                </h3>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4 group-hover:gap-2.5 transition-all">
                  See how it works &rarr;
                </span>
              </div>
            </Link>
          </Reveal>

          {/* 2. Dark tile — security/compliance */}
          <Reveal as="div" delay={80}>
            <Link
              to="/why-us"
              className="group relative overflow-hidden flex flex-col justify-between h-full p-7 rounded-2xl bg-[#0B1220] text-white"
            >
              <img {...photoProps('home/bento-compliance.jpg', "(min-width: 768px) 50vw, 100vw")} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="relative inline-flex w-12 h-12 items-center justify-center rounded-full bg-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <h3 className="relative text-lg font-bold mt-4">DLT guidance for your messaging needs.</h3>
            </Link>
          </Reveal>

          {/* 3. White tile — pure stat, no icon (GoDaddy "20m+ trust us" style) */}
          <Reveal as="div" delay={160}>
            <div className="flex flex-col justify-center h-full p-7 rounded-2xl bg-(--surface) border border-(--border)">
              <svg className="w-8 h-8 mb-4 text-(--text-faint)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-2xl md:text-3xl font-extrabold text-(--text) leading-tight">
                Destination availability depends on your requirements.
              </p>
            </div>
          </Reveal>

          {/* 4. Wide tile — product mockup (GoDaddy "Lane & Willis" pattern) */}
          <Reveal as="div" delay={240} className="md:col-span-2">
            <div className="h-full rounded-2xl bg-(--surface) border border-(--border) p-7 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-extrabold text-(--text) leading-tight mb-2">
                  One dashboard for every channel.
                </h3>
                <p className="text-sm text-(--text-soft) mb-4">
                  Trigger SMS, voice and WhatsApp from the same campaign — no juggling three logins.
                </p>
                <Link
                  to="/assistant"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-(--text) text-(--bg) text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#00AEEF] hover:text-black transition-colors"
                >
                  Explore Dashboard
                </Link>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
