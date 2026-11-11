import React, { useEffect, useRef, useState } from 'react';

/**
 * Loads a component's code only when its placeholder nears the viewport.
 * `loader` must be a stable function declared at module scope.
 * The server renders only the placeholder box, so there is no Suspense or
 * hydration mismatch, and the heavy chunk stays out of the first load.
 */
const LazyMount = ({ loader, minHeight = 600, rootMargin = '300px 0px', fallback = null, ...props }) => {
  const ref = useRef(null);
  const [Comp, setComp] = useState(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let cancelled = false;

    const load = () => {
      loader().then((m) => {
        if (!cancelled) setComp(() => m.default);
      });
    };

    if (!('IntersectionObserver' in window)) {
      load();
      return () => { cancelled = true; };
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { rootMargin }
    );
    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [loader, rootMargin]);

  return (
    <div ref={ref} style={Comp ? undefined : { minHeight }}>
      {Comp ? <Comp {...props} /> : fallback}
    </div>
  );
};

export default LazyMount;
