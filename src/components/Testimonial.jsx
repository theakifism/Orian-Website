import React from 'react';
import Reveal from './Reveal';
import { photoProps } from '../utils/photo';

const highlights = [
  { label: 'Bulk SMS & OTP', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Voice & IVR', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { label: 'WhatsApp Business API', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'DLT Compliance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

/**
 * Customer-story section: a real client photo on one side, a large pull
 * quote and feature/product icon list on the other — the GoDaddy "Airo
 * every day, all the way" testimonial pattern. Deliberately kept to a
 * single real photo (see src/assets/images/testimonial/client-1.jpg) rather
 * than a generated one — a faked "customer" next to a quote reads as
 * inauthentic in a way a generated banking or classroom scene doesn't.
 */
const Testimonial = () => {
  return (
    <section className="relative py-20 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal as="h2" className="text-2xl md:text-3xl font-extrabold text-(--text) tracking-tight mb-10">
          What our clients say
        </Reveal>

        <Reveal
          as="div"
          className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-0 rounded-2xl border border-(--border) overflow-hidden bg-(--surface)"
        >
          <div className="aspect-4/5 md:aspect-auto md:h-full bg-(--surface-alt)">
            <img
              {...photoProps('testimonial/client-1.jpg', "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
              alt="Orian client"
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.display = 'flex';
                e.currentTarget.parentElement.style.alignItems = 'center';
                e.currentTarget.parentElement.style.justifyContent = 'center';
              }}
            />
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="text-xl md:text-2xl font-medium text-(--text) leading-snug mb-8">
              &ldquo;Switching to Orian cut our OTP delivery failures to almost zero. Their team set up
              DLT compliance and had us live within a week — support that actually picks up the
              phone.&rdquo;
            </p>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
              {highlights.map((h) => (
                <li key={h.label} className="flex items-center gap-2.5 text-sm font-medium text-(--text-soft)">
                  <svg className="w-5 h-5 text-[#00AEEF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={h.icon} />
                  </svg>
                  {h.label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonial;
