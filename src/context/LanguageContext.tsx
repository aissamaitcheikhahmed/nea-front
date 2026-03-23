import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Locale, translations } from '../i18n/translations';

type TranslationKeys = (typeof translations)[Locale];

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('nl');
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
