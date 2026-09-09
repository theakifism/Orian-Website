import React, { useEffect, useRef, useState } from 'react';
import { useScrollFX } from '../context/ScrollFXContext';

/**
 * Wraps its children in a section that tilts/rises into place in 3D as it
 * scrolls into the viewport, and softly falls back as it leaves --
 * direction-aware, so content entering while scrolling down rises up and
 * tilts back into place, and content entering while scrolling up settles
 * down and tilts forward into place.
 *
 * On mobile (see ScrollFXContext's `reduceMotion`) none of this runs: no
 * IntersectionObserver, no blur/transform/transition, content is just
 * rendered in its final state immediately. That's what was causing sections
 * to sit blank for a couple of scroll-lengths on phones before popping in.
 */
const Reveal = ({
  children,
  as: Tag = 'div',
  className = '',
  once = false,
  distance = 64,
  rotate = 20,
  delay = 0,
  ...rest
}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const { direction, reduceMotion } = useScrollFX();
  const enterDirection = useRef(direction);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const node = ref.current;
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
      {
        threshold: 0.12,
        rootMargin: '-8% 0px -8% 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, reduceMotion]);

  if (reduceMotion) {
    // No wrapper styling/animation at all -- just the plain tag so content
    // is visible immediately and scrolling never has to wait on it.
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const goingUp = enterDirection.current === 'up';

  const style = {
    '--reveal-distance': `${distance}px`,
    '--reveal-y': goingUp ? `-${distance}px` : `${distance}px`,
    // Tilt forward when rising from below, tilt back when settling from above
    '--reveal-rotate': goingUp ? `-${rotate}deg` : `${rotate}deg`,
    '--reveal-origin': goingUp ? 'center top' : 'center bottom',
    transitionDelay: inView ? `${delay}ms` : '0ms',
  };

  return (
    <Tag
      ref={ref}
      style={style}
      className={`reveal reveal-3d ${inView ? 'in-view' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
