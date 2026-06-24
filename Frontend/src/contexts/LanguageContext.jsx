import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {}
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('shinde_admin_lang');
    if (saved) setLang(saved);
  }, []);

  // Persist language changes
  useEffect(() => {
    localStorage.setItem('shinde_admin_lang', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
