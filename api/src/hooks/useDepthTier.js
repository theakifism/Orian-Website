import { useEffect, useState } from 'react';

/**
 * Decides how much 3D/parallax a device gets.
 *   'full' - perspective tilt, cursor light, scroll-driven depth
 *   'lite' - flat layout, no JS animation loop (weak devices, data-saver,
 *            reduced motion, or a device that turned out to drop frames)
 *
 * Starts as 'lite' so the server-rendered HTML and the first client render
 * match (no hydration mismatch), then upgrades after mount. The second
 * return value lets a component downgrade at runtime if frames drop.
 */
export default function useDepthTier() {
  const [tier, setTier] = useState('lite');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData === true;
    // CPU/memory guessing removed: Chrome reports these and Safari does not,
    // which gave Windows and Mac different tiers. Slow devices still downgrade
    // at runtime through the setter returned below.
    const weak = saveData;
    // phones / touch screens: always the flat tier (3D tilt + scroll-driven
    // transforms + blur are what make phones stutter)
    const phone = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    setTier(reduce || weak || phone ? 'lite' : 'full');
  }, []);

  return [tier, setTier];
}
