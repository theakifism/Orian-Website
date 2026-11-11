import { useEffect, useState } from 'react';

/** true when the visitor asked the OS/browser for reduced motion. SSR-safe (false until mounted). */
export default function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return reduce;
}
