import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { buildWhyUsMeta } from '../seo/dynamicMeta';
import { getWhyUsBySlug, whyUsData } from '../data/whyUs';
import { HeadsetIcon, TagIcon, ShieldCheckIcon, BoltIcon, TowerIcon, TrendUpIcon, CheckCircleIcon } from '../components/CardIcons';
import { litCardProps } from '../utils/litCard';
import { photoProps } from '../utils/photo';
import { renderInline } from '../utils/inlineLinks';
import { whyUsDetail } from '../data/whyUs.detail';

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
  const reasonBase = getWhyUsBySlug(slug);
  const reason = reasonBase && { ...reasonBase, ...whyUsDetail[reasonBase.slug] };

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
            {/* Real photo banner — src/assets/images/why-us/<slug>.jpg */}
            <div className="aspect-21/9 rounded-2xl border border-(--border) overflow-hidden bg-(--surface)">
              <img
                {...photoProps(`why-us/${reason.slug}.jpg`, "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
                alt={reason.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.style.backgroundColor = 'var(--overlay)';
                }}
              />
            </div>

            <div
              className="p-8 bg-(--surface)/90 border border-(--border) rounded-2xl backdrop-blur-xl transition-all duration-300"
              style={{ boxShadow: `0 10px 40px -20px ${reason.glow}` }}
            >
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center mb-5"
                style={{ color: reason.color, borderColor: `${reason.color}4D`, backgroundColor: `${reason.color}1A` }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-(--text-soft) text-sm md:text-base leading-relaxed">{reason.detail}</p>

            </div>

            <div className="p-8 bg-(--surface)/90 border border-(--border) rounded-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-(--text) mb-5">What this means for you</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {reason.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 p-4 bg-(--overlay) border border-(--border) rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    {...litCardProps(reason.color, reason.glow, { tilt: false })}
                  >
                    <span className="shrink-0 mt-0.5" style={{ color: reason.color }}>
                      <CheckCircleIcon className="w-5 h-5" />
                    </span>
                    <span className="text-xs md:text-sm text-(--text-soft) leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {reason.sections?.map((sec) => (
              <div key={sec.title} className="p-8 bg-(--surface)/90 border border-(--border) rounded-2xl backdrop-blur-xl">
                <h2 className="text-xl font-bold text-(--text) mb-3">{sec.title}</h2>
                {sec.p && <p className="text-sm text-(--text-soft) leading-relaxed">{renderInline(sec.p)}</p>}
                {sec.ul && (
                  <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm text-(--text-soft) leading-relaxed">
                    {sec.ul.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                )}
              </div>
            ))}

            {reason.links?.length > 0 && (
              <p className="text-sm text-(--text-soft)">
                Related:{' '}
                {reason.links.map((l, i) => (
                  <React.Fragment key={l.to}>
                    {i > 0 && ' · '}
                    <Link to={l.to} className="text-[#00AEEF] hover:text-[#35C1F4] underline underline-offset-2">{l.text}</Link>
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>

          <aside className="space-y-4">
            <div className="p-6 bg-(--surface)/90 border border-(--border) rounded-2xl text-center">
              <p className="text-sm text-(--text-dim) mb-4">See it for yourself.</p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#35C1F4] transition-colors"
              >
                Talk to our team &rarr;
              </Link>
            </div>

            <div className="p-6 bg-(--surface)/70 border border-(--border) rounded-2xl">
              <span className="text-xs font-mono tracking-widest text-(--text-faint) uppercase">Other Reasons</span>
              <div className="flex flex-col gap-2 mt-3">
                {others.map((w) => (
                  <Link
                    key={w.slug}
                    to={`/why-us/${w.slug}`}
                    className="text-sm text-(--text-soft) hover:text-[#00AEEF] transition-colors"
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
