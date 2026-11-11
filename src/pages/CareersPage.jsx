import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import Careers from '../components/Careers';
import Reveal from '../components/Reveal';
import { litCardProps } from '../utils/litCard';
import { RocketDoodle, GlobeDoodle, RouteDoodle } from '../components/DoodleIcons';
import { EMAIL_SALES } from '../config/site';
import { photoProps } from '../utils/photo';

// Where applications go. Change this to your hiring/HR email if you have one.
const CAREERS_EMAIL = EMAIL_SALES;

const mailto = (role) =>
  `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${role}`)}&body=${encodeURIComponent(
    'Hi Orian team,\n\nName:\nPhone:\nCurrent city:\nYears of experience:\nLinkedIn / portfolio:\n\nA few lines about what I have worked on:\n'
  )}`;

const values = [
  { title: 'Remote-first', desc: 'Our team operates across cities — what matters is the work, not the seat you sit in.', color: '#00AEEF', glow: 'rgba(0, 0, 0, 0.6)', Doodle: GlobeDoodle },
  { title: 'Telecom depth', desc: 'You\u2019ll work alongside people who\u2019ve built carrier routing for 15+ years, not generalists guessing at it.', color: '#00AEEF', glow: 'rgba(0, 0, 0, 0.6)', Doodle: RouteDoodle },
  { title: 'Ship fast', desc: 'Small team, real ownership — features go from idea to production in days, not quarters.', color: '#00AEEF', glow: 'rgba(0, 0, 0, 0.6)', Doodle: RocketDoodle },
];

// Edit the "lookingFor" lists so they match who you really want to hire.
const teams = [
  {
    slug: 'customer-care',
    name: 'Customer Care',
    desc: 'Our support team helps clients troubleshoot routing, DLT registration and delivery issues around the clock — the first voice a client hears when something needs fixing.',
    lookingFor: [
      'Clear, calm communication on calls, email and WhatsApp',
      'Patience with step-by-step troubleshooting',
      'Interest in SMS, DLT and telecom (experience is a plus)',
    ],
  },
  {
    slug: 'technical',
    name: 'Technical',
    desc: 'Engineers building and maintaining the carrier-routing backbone, the dashboard, and the APIs behind our messaging platform.',
    lookingFor: [
      'Backend or API development, or cloud infrastructure experience',
      'SMS routing, SMPP or telecom background is a strong plus',
      'Comfort owning a feature from idea to production',
    ],
  },
  {
    slug: 'corporate',
    name: 'Corporate',
    desc: 'Sales, finance, compliance and operations — the people who keep contracts, billing and DLT paperwork moving so the technical team can focus on delivery.',
    lookingFor: [
      'Sales, accounts, compliance or operations experience',
      'Good with documentation and following through on details',
      'Comfortable speaking with business clients',
    ],
  },
];

const steps = [
  { n: '1', title: 'Send your CV', desc: 'Email us your CV and a few lines about what you have worked on. Tell us which team interests you.' },
  { n: '2', title: 'We keep it on file', desc: 'There are no open roles today, so we keep your profile on file instead of letting it sit in an inbox.' },
  { n: '3', title: 'We reach out', desc: 'When a role that matches your background opens, we contact you directly.' },
];

const include = [
  'The team you are interested in (Customer Care, Technical or Corporate)',
  'Your CV (PDF is fine)',
  'Your current city and when you could start',
  'A link to LinkedIn, GitHub or a portfolio, if you have one',
  'A few lines on what you have worked on and what you want to do next',
];

const CareersPage = () => {
  return (
    <>
      <Seo title={pageMeta.careers.title} description={pageMeta.careers.description} path={pageMeta.careers.path} />
      <PageHeader
        eyebrow="Careers & Culture"
        title="Help us build the"
        gradientWord="next carrier backbone."
        subtitle="No open roles today, but we're actively scouting for telecom routing, cloud infrastructure and AI engineering talent for what's next. Send your CV and we'll keep it on file."
        breadcrumbs={[{ label: 'Careers' }]}
        glowClass="bg-[#00AEEF]/10"
      />

      <section className="relative pb-4 bg-transparent overflow-hidden">
        <h2 className="sr-only">Life at Orian Teleservices</h2>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              {...litCardProps(v.color, v.glow)}
              className="p-6 bg-(--surface)/90 border border-(--border) rounded-2xl transition-all duration-300"
            >
              <v.Doodle color={v.color} className="w-28 h-28 mb-2" />
              <h3 className="text-base font-bold text-(--text) mb-2">{v.title}</h3>
              <p className="text-xs md:text-sm text-(--text-dim) leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team categories — zig-zag rows */}
      <section className="relative py-16 bg-transparent overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 space-y-16 md:space-y-24">
          {teams.map((team, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <Reveal
                as="div"
                key={team.slug}
                variant="side"
                side={reversed ? 'right' : 'left'}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
              >
                <div className={reversed ? 'md:order-2' : ''}>
                  <div className="aspect-4/3 rounded-2xl border border-(--border) overflow-hidden bg-(--surface)">
                    <img
                      {...photoProps(`careers/${team.slug}.jpg`, "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
                      alt={`${team.name} team at Orian`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.style.backgroundColor = 'var(--overlay)';
                      }}
                    />
                  </div>
                </div>
                <div className={reversed ? 'md:order-1' : ''}>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-(--text) tracking-tight mb-3">
                    {team.name}
                  </h3>
                  <p className="text-(--text-dim) text-sm md:text-base leading-relaxed mb-4">
                    {team.desc}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-wider text-(--text-faint) mb-2">
                    Good fit if you have
                  </p>
                  <ul className="space-y-1.5 mb-5">
                    {team.lookingFor.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-(--text-dim) leading-relaxed">
                        <span className="text-[#00AEEF]" aria-hidden="true">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={mailto(team.name)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-(--border) rounded-full text-sm font-semibold text-(--text) hover:bg-(--overlay) transition-colors"
                  >
                    Send your CV for {team.name} &rarr;
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* How to apply */}
      <section id="apply" className="scroll-mt-24 relative py-12 bg-transparent overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-extrabold text-(--text) tracking-tight mb-8">
            How to apply
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {steps.map((s) => (
              <div
                key={s.n}
                {...litCardProps('#00AEEF', 'rgba(0, 0, 0, 0.6)')}
                className="p-6 bg-(--surface)/90 border border-(--border) rounded-2xl transition-all duration-300"
              >
                <div className="text-sm font-mono text-[#00AEEF] mb-2">Step {s.n}</div>
                <h3 className="text-base font-bold text-(--text) mb-2">{s.title}</h3>
                <p className="text-xs md:text-sm text-(--text-dim) leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-6 md:p-8 bg-(--surface)/90 border border-(--border) rounded-2xl">
            <h3 className="text-base font-bold text-(--text) mb-3">What to include in your email</h3>
            <ul className="space-y-1.5 mb-6">
              {include.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-(--text-dim) leading-relaxed">
                  <span className="text-[#00AEEF]" aria-hidden="true">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={mailto('Open application')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00AEEF] text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Email {CAREERS_EMAIL}
            </a>
          </div>
        </div>
      </section>

      <Careers />
    </>
  );
};

export default CareersPage;