import { useEffect, useRef } from 'react';
import useDepthTier from '../../hooks/useDepthTier';

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const MsgGlyph = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v6A1.5 1.5 0 0 1 12.5 11H7l-3 3v-3H3.5A1.5 1.5 0 0 1 2 9.5v-6Z" />
  </svg>
);
const CheckGlyph = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m2.5 6.3 2.3 2.3 4.7-5" />
  </svg>
);

/**
 * The hero centrepiece: a phone built from real CSS 3D (perspective +
 * preserve-3d), receiving an OTP message while data cards float at
 * different depths.
 *
 * Depth system (shared with the rest of the site):
 *  - pointer-driven tilt, eased only while the pointer/scroll is moving
 *  - cursor-following light written to --lx/--ly CSS variables
 *  - scroll-driven rotation/lift as the hero leaves the viewport
 *  - 'lite' tier (reduced motion, weak or data-saver devices, or a device that
 *    drops frames) renders the same markup flat with no animation loop.
 */
const HeroPhone = () => {
  const [tier] = useDepthTier();
  const stageRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (tier !== 'full') return undefined;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return undefined;

    let raf = 0;
    let visible = false;
    let tx = 0; // target pointer, -1..1
    let ty = 0;
    let cx = 0; // eased
    let cy = 0;
    let targetScroll = clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1);
    let currentScroll = targetScroll;

    const start = () => {
      if (visible && !document.hidden && !raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      tx = clamp(((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)), -1, 1);
      ty = clamp(((e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.5)), -1, 1);
      start();
    };
    const onLeave = () => { tx = 0; ty = 0; start(); };
    const onScroll = () => {
      targetScroll = clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1);
      start();
    };

    const tick = () => {
      raf = 0;
      if (!visible || document.hidden) return;

      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      currentScroll += (targetScroll - currentScroll) * 0.14;

      if (Math.abs(tx - cx) < 0.002) cx = tx;
      if (Math.abs(ty - cy) < 0.002) cy = ty;
      if (Math.abs(targetScroll - currentScroll) < 0.002) currentScroll = targetScroll;

      const rotY = cx * 13 - currentScroll * 18;
      const rotX = -cy * 8 + currentScroll * 9;
      scene.style.transform =
        `translate3d(0, ${(-currentScroll * 42).toFixed(1)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      stage.style.setProperty('--lx', `${(50 + cx * 38).toFixed(1)}%`);
      stage.style.setProperty('--ly', `${(28 + cy * 34).toFixed(1)}%`);

      if (Math.abs(tx - cx) > 0 || Math.abs(ty - cy) > 0 || Math.abs(targetScroll - currentScroll) > 0) {
        raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0.01 });
    io.observe(stage);

    const onVis = () => { if (!document.hidden) onScroll(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
      if (raf) cancelAnimationFrame(raf);
      scene.style.transform = '';
    };
  }, [tier]);

  return (
    <div ref={stageRef} className="o2-stage o2-in" data-tier={tier} style={{ '--d': '160ms' }} aria-hidden="true">
      <div ref={sceneRef} className="o2-scene">
        <div className="o2-rings">
          <span style={{ '--i': 0 }} />
          <span style={{ '--i': 1 }} />
          <span style={{ '--i': 2 }} />
        </div>
        <div className="o2-floor" />

        <div className="o2-sway">
          <div className="o2-phone">
            {[-6, -4, -2, 0, 2, 4, 6].map((z) => (
              <i key={z} className="o2-ph-layer" style={{ transform: `translateZ(${z}px)` }} />
            ))}

            <div className="o2-ph-front">
              <div className="o2-screen">
                <span className="o2-island" />
                <p className="o2-clock">9:41</p>

                <div className="o2-notif">
                  <div className="o2-notif-head">
                    <i><MsgGlyph /></i>
                    Messages
                    <em>now</em>
                  </div>
                  <p className="o2-notif-from">SMS message</p>
                  <p className="o2-notif-body">
                    482915 is your verification code. It expires in 5 minutes. Do not share it with anyone.
                  </p>
                </div>

                <span className="o2-bar-home" />
              </div>
              <div className="o2-glare" />
            </div>
          </div>

          <div className="o2-float o2-f-report">
            <p className="o2-f-title">Delivery report</p>
            <ul className="o2-steps">
              <li><span className="dot"><b /></span><span className="lbl">Queued</span></li>
              <li><span className="dot"><b /></span><span className="lbl">Sent</span></li>
              <li><span className="dot"><b /></span><span className="lbl">Delivered</span></li>
            </ul>
          </div>

          <div className="o2-float o2-f-stat">
            <p className="o2-f-title">Message status</p>
            <p className="o2-stat-val">Delivery status</p>
            <p className="o2-f-title">Message tracking</p>
          </div>

          <div className="o2-float o2-f-tpl">
            <span className="o2-tpl-ic"><CheckGlyph /></span>
            Template matched
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPhone;
