import React, { useEffect, useRef } from 'react';
import { useScrollFX } from '../context/ScrollFXContext';

const DEFAULT_RINGS = [
  { tiltX: 72, tiltY: 0, color: '#00AEEF', radius: 0.44, className: 'i3d-ring-a' },
  { tiltX: -58, tiltY: 28, color: '#A855F7', radius: 0.34, className: 'i3d-ring-b' },
  { tiltX: 22, tiltY: -62, color: '#E8A23D', radius: 0.24, className: 'i3d-ring-c' },
];

const BASE_TILT_X = -14;
const HOVER_RANGE = 20; // degrees of parallax tilt the cursor can pull toward
const LERP = 0.09; // how quickly the tilt eases toward the cursor each frame

/**
 * A 3D "gyroscope" built from pure CSS 3D transforms (perspective +
 * preserve-3d) — no WebGL/three.js dependency. It's cursor-controlled:
 * just move the mouse anywhere over it and the whole assembly leans toward
 * the pointer, like it's watching you. Click-and-drag (or touch-drag) lets
 * you spin it freely instead. Release, or move the mouse away, and it eases
 * back into a slow ambient auto-rotation.
 */
const Interactive3DNetwork = ({
  className = '',
  size = 300,
  rings = DEFAULT_RINGS,
  centerIcon = '/logo-icon.png',
  legend = [],
}) => {
  const sceneRef = useRef(null);
  const wrapRef = useRef(null);

  // Continuous ambient spin around Y, always advancing (paused only while
  // free-dragging, since dragging takes over Y directly).
  const autoSpinY = useRef(28);
  // Where the cursor "wants" the tilt to be (parallax offset added on top
  // of the base tilt / auto-spin).
  const hoverTarget = useRef({ x: 0, y: 0 });
  // Where the tilt currently is — eased toward hoverTarget every frame so
  // it never snaps.
  const hoverCurrent = useRef({ x: 0, y: 0 });

  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const resumeTimer = useRef(null);
  const frameId = useRef(null);
  const { reduceMotion } = useScrollFX();

  const applyTransform = () => {
    if (!sceneRef.current) return;
    const x = BASE_TILT_X + hoverCurrent.current.x;
    const y = autoSpinY.current + hoverCurrent.current.y;
    sceneRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  };

  useEffect(() => {
    applyTransform();
    if (reduceMotion) return undefined;

    const loop = () => {
      if (!dragging.current) {
        autoSpinY.current += 0.08;
      }
      hoverCurrent.current.x += (hoverTarget.current.x - hoverCurrent.current.x) * LERP;
      hoverCurrent.current.y += (hoverTarget.current.y - hoverCurrent.current.y) * LERP;
      applyTransform();
      frameId.current = requestAnimationFrame(loop);
    };
    frameId.current = requestAnimationFrame(loop);
    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      window.clearTimeout(resumeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // Hover parallax — fires on every mouse move over the diagram, no click
  // needed. Cursor position within the box maps directly to tilt.
  const handlePointerMove = (e) => {
    if (dragging.current) {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      autoSpinY.current += dx * 0.4;
      hoverTarget.current.x = Math.max(-55, Math.min(55, hoverTarget.current.x - dy * 0.4));
      return;
    }
    const rect = wrapRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    hoverTarget.current = { x: -ny * HOVER_RANGE, y: nx * HOVER_RANGE };
  };

  const handlePointerLeave = () => {
    if (dragging.current) return;
    hoverTarget.current = { x: 0, y: 0 };
  };

  // Click-and-drag (mouse) or touch-drag: free, unclamped spin instead of
  // the gentle hover parallax — useful on touch devices, which have no
  // hover state at all.
  const handlePointerDown = (e) => {
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      hoverTarget.current = { x: 0, y: 0 };
    }, 200);
  };

  const px = (fraction) => Math.round(size * fraction);

  return (
    <div className={`relative select-none ${className}`}>
      <div className="absolute -inset-6 bg-linear-to-br from-[#00AEEF]/25 via-purple-500/15 to-[#E8A23D]/20 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div
        ref={wrapRef}
        className="relative mx-auto cursor-grab active:cursor-grabbing touch-none"
        style={{ width: size, height: size, perspective: '1200px' }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={endDrag}
        onPointerLeave={(e) => {
          handlePointerLeave();
          endDrag(e);
        }}
        onPointerCancel={endDrag}
        role="img"
        aria-label="Interactive 3D diagram of Orian's global network — move your cursor over it, or drag to spin"
      >
        <div
          ref={sceneRef}
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', transform: `rotateX(${BASE_TILT_X}deg) rotateY(${autoSpinY.current}deg)` }}
        >
          {rings.map((ring, i) => {
            const d = px(ring.radius) * 2;
            return (
              <div
                key={i}
                className={`absolute rounded-full ${ring.className || ''}`}
                style={{
                  width: d,
                  height: d,
                  top: '50%',
                  left: '50%',
                  marginTop: -d / 2,
                  marginLeft: -d / 2,
                  border: `1.5px ${i === 1 ? 'dashed' : 'solid'} ${ring.color}`,
                  opacity: 0.6,
                  boxShadow: `0 0 26px ${ring.color}40`,
                  transformStyle: 'preserve-3d',
                  '--i3d-tiltx': `${ring.tiltX}deg`,
                  '--i3d-tilty': `${ring.tiltY}deg`,
                }}
              >
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    top: -5,
                    left: '50%',
                    marginLeft: -5,
                    backgroundColor: ring.color,
                    boxShadow: `0 0 14px ${ring.color}, 0 0 4px ${ring.color}`,
                  }}
                />
              </div>
            );
          })}

          {/* Ambient glow behind the center mark, lifted toward the viewer */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00AEEF]/25 blur-2xl orbit-glow-pulse"
            style={{ width: px(0.28), height: px(0.28), transform: 'translateZ(36px)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ width: px(0.22), height: px(0.22), transform: 'translateZ(36px)' }}
          >
            <img src={centerIcon} alt="" className="w-full h-full object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </div>

      {legend.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6">
          {legend.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-dim)]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}

      <p className="text-center text-[10px] font-mono text-[var(--text-faint)] mt-3 tracking-wide uppercase">
        Move your cursor to look around &middot; drag to spin free
      </p>
    </div>
  );
};

export default Interactive3DNetwork;
