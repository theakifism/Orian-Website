import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_PAGE_URL } from '../../config/site';
import { PLATFORM_DELIVERY_RATE, PLATFORM_UPTIME } from '../../data/homeCopy';
import { useLang } from '../../context/LangContext';
import useReducedMotion from '../../hooks/useReducedMotion';

// Counts up once when it first scrolls into view (instant with reduced motion).
const Counter = ({ to, decimals = 1, suffix = '' }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const target = parseFloat(to);
  const [val, setVal] = useState(target);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce || !('IntersectionObserver' in window)) return undefined;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1100;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        setVal(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setVal(0);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, reduce]);

  return <b ref={ref}>{val.toFixed(decimals)}{suffix}</b>;
};

/** Shared platform metrics. */
const StatusStrip = () => {
  const { t } = useLang();
  return (
    <div className="o2 o2-status" data-section="status-strip">
      <div className="o2-wrap">
        <div className="o2-status-in">
          <span>{t('status.ok')}</span>
          <span className="o2-status-stat">{t('status.uptime')} <Counter to={PLATFORM_UPTIME} decimals={2} suffix="%" /></span>
          <span className="o2-status-stat">{t('status.delivery')} <Counter to={PLATFORM_DELIVERY_RATE} decimals={2} suffix="%" /></span>
          <Link to={STATUS_PAGE_URL} data-track="status_strip_link">View metrics</Link>
        </div>
      </div>
    </div>
  );
};

export default StatusStrip;
