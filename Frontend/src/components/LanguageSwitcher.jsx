import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

const LanguageSwitcher = () => {
  const { lang, setLang } = useContext(LanguageContext);

  const handleChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <select
      value={lang}
      onChange={handleChange}
      className="bg-white/30 backdrop-blur-lg border border-gray-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0B2C56]"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
