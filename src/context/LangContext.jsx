import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';
import { track } from '../utils/analytics';

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });
const KEY = 'orian-lang';

/**
 * Language state for the main pages. Server render and first client render are
 * always English (no hydration mismatch); the saved choice is applied after mount.
 */
export const LangProvider = ({ children }) => {
  const [lang, setLangState] = useState('en');
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved && translations[saved]) setLangState(saved);
    } catch {
      // storage can be blocked; English is fine
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!translations[next]) return;
    setLangState(next);
    try { window.localStorage.setItem(KEY, next); } catch { /* ignore */ }
    track('language_change', { lang: next });
  }, []);

  const t = useCallback((key) => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
