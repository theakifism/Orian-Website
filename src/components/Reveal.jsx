import React, { useEffect, useRef, useState } from 'react';
import { useScrollFX } from '../context/ScrollFXContext';

/**
 * Reveals content once as it enters the viewport. A small opacity/translate
 * transition avoids repaint-heavy blur and 3D effects during scrolling.
 *
 * On mobile (see ScrollFXContext's `reduceMotion`) it uses the same light
 * opacity/translate treatment, with no blur or perspective work.
 */
const Reveal = ({
  children,
  as: Tag = 'div',
  className = '',
  once = true,
  distance = 64,
  delay = 0,
  // 'up' (default): rises in from below.
  // 'side': slides in from the left or right — pass `side` to
  // pick which. Used to break up sections that would otherwise all use
  // the same "rise from below" motion.
  variant = 'up',
  side = 'left',
  ...rest
}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const { reduceMotion } = useScrollFX();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      {
        threshold: 0.05,
        // A larger positive bottom margin means the reveal fires while
        // the section is still mostly below the fold, so it's already
        // animating in by the time it scrolls into view — this is what
        // made scroll entrances feel late/slow.
        rootMargin: '0px 0px 22% 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  if (reduceMotion) {
    // Mobile: cheap opacity + rise only -- see `.reveal-mobile` in index.css.
    return (
      <Tag
        ref={ref}
        style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
        className={`reveal-mobile ${inView ? 'in-view' : ''} ${className}`}
        {...rest}
      >
        {children}
      </Tag>
    );
  }

  if (variant === 'side') {
    const style = {
      '--reveal-x': side === 'right' ? `${distance}px` : `-${distance}px`,
      transitionDelay: inView ? `${delay}ms` : '0ms',
    };

    return (
      <Tag
        ref={ref}
        style={style}
        className={`reveal-side ${inView ? 'in-view' : ''} ${className}`}
        {...rest}
      >
        {children}
      </Tag>
    );
  }

  const style = {
    '--reveal-distance': `${distance}px`,
    '--reveal-y': `${distance}px`,
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
