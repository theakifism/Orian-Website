import { useEffect } from 'react';

/**
 * Soft 3D tilt + cursor-following light for a single element.
 * Writes CSS variables (--rx, --ry, --lx, --ly) straight onto the node, so
 * there is no React re-render per pointer move. Only active on fine pointers
 * and when `enabled` is true.
 */
export default function useTiltLight(ref, { enabled = true, max = 6 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let raf = 0;
    let next = null;

    const apply = () => {
      raf = 0;
      if (!next) return;
      el.style.setProperty('--rx', `${next.rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${next.ry.toFixed(2)}deg`);
      el.style.setProperty('--lx', `${next.lx.toFixed(1)}%`);
      el.style.setProperty('--ly', `${next.ly.toFixed(1)}%`);
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      next = { rx: (0.5 - py) * max * 2, ry: (px - 0.5) * max * 2, lx: px * 100, ly: py * 100 };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      next = { rx: 0, ry: 0, lx: 50, ly: 30 };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, enabled, max]);
}
