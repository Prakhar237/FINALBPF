import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    copyright: "Verses for the Soul © 2025",
    tagline: "Bringing comfort and guidance through scripture"
  },
  es: {
    copyright: "Versículos para el Alma © 2025",
    tagline: "Brindando consuelo y guía a través de las escrituras"
  },
  fr: {
    copyright: "Versets pour l'Âme © 2025",
    tagline: "Apportant réconfort et guidance à travers les écritures"
  }
};

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <footer className="w-full py-6 text-center text-white/60">
      <p className="text-sm">{t.copyright}</p>
      <p className="text-xs mt-1">{t.tagline}</p>
    </footer>
  );
};

export default Footer;
