import { useEffect, useRef, useState } from 'react';

/**
 * Scroll reveal that never hides content in the server-rendered HTML.
 * Returns [ref, className]. The reveal class is only applied after mount
 * (so no-JS / pre-hydration visitors see everything), then toggles `is-in`
 * the first time the element nears the viewport.
 */
export default function useInView({ rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!('IntersectionObserver' in window)) return undefined;
    setArmed(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);

  const className = armed ? (seen ? 'o2-reveal is-in' : 'o2-reveal') : '';
  return [ref, className];
}
