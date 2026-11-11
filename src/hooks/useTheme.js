import { useEffect, useState } from 'react';

const STORAGE_KEY = 'orian-theme';

export default function useTheme() {
  // Always start at the same value the prerendered HTML was built with
  // ('dark' — see the build-time branch below). Reading localStorage here
  // would make the very first client render diverge from the static markup
  // for any visitor who'd previously switched to light mode, which is what
  // was causing the hydration mismatch (React error #418). The saved
  // preference is picked up right after mount instead, once hydration has
  // already completed, so it only triggers an ordinary re-render.
  const [theme, setTheme] = useState('dark');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') setTheme(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, hydrated]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
