
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export const languages = [
  { name: 'English', code: 'en' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Malayalam', code: 'ml' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
