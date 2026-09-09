import React, { useEffect, useRef, useState } from 'react';
import { useScrollFX } from '../context/ScrollFXContext';

/**
 * Wraps a card in two layers:
 *  - an outer layer that owns perspective + mouse-tracked tilt (rotateX/rotateY)
 *  - an inner layer that owns the scroll pop-in transform
 * The actual card markup (with its own hover/group-hover classes) is rendered
 * untouched inside, so its own hover effects (color, scale, translate, text)
 * keep working exactly as before -- this wrapper never sets a transform on
 * the card element itself, only on the wrapping divs around it.
 *
 * On mobile (`reduceMotion` from ScrollFXContext) this renders the children
 * directly with no observer, no mouse-tilt listeners, and no pop-in
 * transform/blur -- cards are simply visible immediately instead of
 * appearing blank until scrolled further into view.
 */
const TiltCard = ({
  children,
  className = '',
  maxTilt = 14,
  scaleOnHover = 1.04,
  delay = 0,
  once = false,
  // Optional CSS color (any valid `background` color value, e.g. an rgba()
  // string) for a soft glow that follows the cursor across the card. When
  // omitted, no spotlight layer is rendered at all.
  spotlightColor = null,
}) => {
  const outerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);
  // Tracks whether the one-time scroll pop-in has finished. The staggered
  // `delay` below is only meant to offset that entrance animation -- once
  // it's done we drop the delay to 0 so every later transform update
  // (i.e. the cursor tilt) responds immediately instead of lagging behind
  // the mouse by `delay`ms on every single move.
  const [hasEntered, setHasEntered] = useState(false);
  const { direction, reduceMotion } = useScrollFX();
  const enterDirection = useRef(direction);

  useEffect(() => {
    if (reduceMotion || !inView || hasEntered) return undefined;
    const timer = setTimeout(() => setHasEntered(true), delay + 850);
    return () => clearTimeout(timer);
  }, [inView, hasEntered, delay, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const node = outerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          enterDirection.current = direction;
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.15, rootMargin: '-6% 0px -6% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, reduceMotion]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e) => {
    const node = outerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = (-y / (rect.height / 2)) * maxTilt;
    const ry = (x / (rect.width / 2)) * maxTilt;
    setTilt({ rx, ry, scale: scaleOnHover });

    // Percentage position within the card, for the cursor-tracked spotlight.
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setPointer({ x: px, y: py });
  };

  const handleMouseEnter = () => setHovering(true);

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, scale: 1 });
    setHovering(false);
  };

  const goingUp = enterDirection.current === 'up';
  const popY = goingUp ? -40 : 40;
  const popRotate = goingUp ? -14 : 14;

  // A small forward lift (translateZ) on top of the tilt so the whole card
  // visibly "pops" toward the cursor on hover, instead of only rotating.
  const hoverLift = hovering ? 26 : 0;

  const innerTransform = inView
    ? `translateY(0px) translateZ(${hoverLift}px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`
    : `translateY(${popY}px) rotateX(${popRotate}deg) scale(0.92)`;

  return (
    <div
      ref={outerRef}
      className={`tilt-card-outer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="tilt-card-inner"
        style={{
          transform: innerTransform,
          opacity: inView ? 1 : 0,
          filter: inView ? 'blur(0px)' : 'blur(8px)',
          transitionDelay: inView && !hasEntered ? `${delay}ms` : '0ms',
        }}
      >
        {children}
        {spotlightColor && (
          <div
            className="tilt-card-spotlight"
            aria-hidden="true"
            style={{
              background: `radial-gradient(280px circle at ${pointer.x}% ${pointer.y}%, ${spotlightColor}, transparent 72%)`,
              opacity: hovering ? 1 : 0,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TiltCard;
