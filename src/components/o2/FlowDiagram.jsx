import React, { useEffect, useRef, useState } from 'react';
import useDepthTier from '../../hooks/useDepthTier';
import SectionHead from './SectionHead';
import { useLang } from '../../context/LangContext';

const STEPS = [
  { title: 'API request', body: 'Your app calls the API with the number, sender ID and template.', log: 'POST /messages', res: 'accepted' },
  { title: 'DLT check', body: 'The sender ID and template are checked against your registered headers and templates.', log: 'template matched', res: 'ok' },
  { title: 'Route selection', body: 'A route is chosen for the message type, with a fallback ready if it degrades.', log: 'route selected', res: 'primary' },
  { title: 'Operator', body: 'The message is handed to the operator network for delivery.', log: 'submitted to operator', res: 'ok' },
  { title: 'Handset', body: 'The operator delivers the message to the phone.', log: 'handset reached', res: 'ok' },
  { title: 'Delivery report', body: 'The status comes back and is stored against that message.', log: 'delivery report stored', res: 'delivered' },
];

/**
 * Scroll-driven message-flow diagram. While the section is pinned, scroll
 * progress advances the active step. On small screens, reduced motion or weak
 * devices it becomes a normal static list with every step shown.
 */
const FlowDiagram = () => {
  const { t } = useLang();
  const [tier] = useDepthTier();
  const root = useRef(null);
  const [mode, setMode] = useState('static');
  const [active, setActive] = useState(STEPS.length - 1);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 960px) and (min-height: 480px)');
    const apply = () => setMode(tier === 'full' && wide.matches ? 'scroll' : 'static');
    apply();
    wide.addEventListener('change', apply);
    return () => wide.removeEventListener('change', apply);
  }, [tier]);

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    if (mode !== 'scroll') { setActive(STEPS.length - 1); el.style.setProperty('--fp', 1); return undefined; }

    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      el.style.setProperty('--fp', ((idx + 0.5) / STEPS.length).toFixed(3));
      if (idx !== last) { last = idx; setActive(idx); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [mode]);

  return (
    <section ref={root} className="o2 o2-flow" data-mode={mode} id="how-it-works" data-section="message-flow">
      <div className="o2-flow-stick">
        <div className="o2-wrap">
          <div className="o2-flow-grid">
            <div>
              <SectionHead eyebrow={t('flow.eyebrow')} title={t('flow.title')} lead={t('flow.lead')} />
              <ol className="o2-flow-steps">
                <span className="o2-flow-line" aria-hidden="true" />
                {STEPS.map((s, i) => (
                  <li key={s.title} className={i < active ? 'is-done' : i === active ? 'is-active' : ''}>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="o2-log" aria-hidden="true">
              <div className="o2-log-head"><span>Message journey</span></div>
              <div className="o2-log-body">
                {STEPS.slice(0, active + 1).map((s, i) => (
                  <div key={s.title} className={`o2-log-line${i === active ? ' is-last' : ''}`}>
                    <b>{i + 1}</b>
                    <span>{s.log}</span>
                    <em>{s.res}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowDiagram;
