import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { buildWhyUsMeta } from '../seo/dynamicMeta';
import { getWhyUsBySlug, whyUsData } from '../data/whyUs';
import { HeadsetIcon, TagIcon, ShieldCheckIcon, BoltIcon, TowerIcon, TrendUpIcon, CheckCircleIcon } from '../components/CardIcons';

const iconMap = {
  headset: HeadsetIcon,
  tag: TagIcon,
  shield: ShieldCheckIcon,
  bolt: BoltIcon,
  tower: TowerIcon,
  trend: TrendUpIcon,
};

const WhyUsDetailPage = () => {
  const { slug } = useParams();
  const reason = getWhyUsBySlug(slug);

  if (!reason) {
    return <Navigate to="/why-us" replace />;
  }

  const Icon = iconMap[reason.icon] || ShieldCheckIcon;
  const others = whyUsData.filter((w) => w.slug !== reason.slug);
  const meta = buildWhyUsMeta(reason);

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={`/why-us/${reason.slug}`} />
      <PageHeader
        eyebrow={`Reason ${reason.id}`}
        title={reason.title}
        subtitle={reason.desc}
        breadcrumbs={[{ label: 'Why Us', href: '/why-us' }, { label: reason.title }]}
      />

      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-8">
            <div
              className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl transition-all duration-300"
              style={{ boxShadow: `0 10px 40px -20px ${reason.glow}` }}
            >
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center mb-5"
                style={{ color: reason.color, borderColor: `${reason.color}4D`, backgroundColor: `${reason.color}1A` }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-[var(--text-soft)] text-sm md:text-base leading-relaxed">{reason.detail}</p>

              <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center gap-4">
                <div className="text-2xl md:text-3xl font-extrabold font-mono" style={{ color: reason.color }}>
                  {reason.stat.value}
                </div>
                <div className="text-xs text-[var(--text-faint)] uppercase tracking-wide">{reason.stat.label}</div>
              </div>
            </div>

            <div className="p-8 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-[var(--text)] mb-5">What this means for you</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {reason.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 p-4 bg-[var(--overlay)] border border-[var(--border)] rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = reason.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
                  >
                    <span className="shrink-0 mt-0.5" style={{ color: reason.color }}>
                      <CheckCircleIcon className="w-5 h-5" />
                    </span>
                    <span className="text-xs md:text-sm text-[var(--text-soft)] leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-6 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl text-center">
              <p className="text-sm text-[var(--text-dim)] mb-4">See it for yourself.</p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#E8A23D] transition-colors"
              >
                Talk to our team &rarr;
              </Link>
            </div>

            <div className="p-6 bg-[var(--surface)]/70 border border-[var(--border)] rounded-2xl">
              <span className="text-xs font-mono tracking-widest text-[var(--text-faint)] uppercase">Other Reasons</span>
              <div className="flex flex-col gap-2 mt-3">
                {others.map((w) => (
                  <Link
                    key={w.slug}
                    to={`/why-us/${w.slug}`}
                    className="text-sm text-[var(--text-soft)] hover:text-[#00AEEF] transition-colors"
                  >
                    {w.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
};

export default WhyUsDetailPage;
