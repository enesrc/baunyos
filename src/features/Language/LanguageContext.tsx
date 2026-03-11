'use client';

import { createContext, useContext } from 'react';
import type { Lang } from './config';
import { translate as t } from './translate';


interface LanguageContextValue {
  lang: Lang;
  translate: (en: string, tr: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const translate = (en: string, tr: string) => t(lang, en, tr);

  return (
    <LanguageContext.Provider value={{ lang, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}