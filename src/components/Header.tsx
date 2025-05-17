import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import HowItWorksOverlay from './HowItWorksOverlay';
import Navigation from './Navigation';
import { Button } from "@/components/ui/button";
import AudioPlayer from './AudioPlayer';

const Header = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const translations = {
    en: {
      title: 'Bible Peace Finder',
      subtitle: 'Tell us what you are going through...',
      howItWorks: 'How It Works'
    },
    es: {
      title: 'Buscador de Paz Bíblica',
      subtitle: 'Cuéntanos por lo que estás pasando...',
      howItWorks: 'Cómo Funciona'
    },
    fr: {
      title: 'Trouveur de Paix Biblique',
      subtitle: 'Dites-nous ce que vous traversez...',
      howItWorks: 'Comment ça Marche'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <header className="text-center">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-4 mt-24"
      >
        {t.title}
      </motion.h1>

      {isHomePage && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center items-center gap-2 mb-8"
          >
            <span className="h-px w-16 bg-white/30"></span>
            <Button
              variant="ghost"
              onClick={() => setIsOverlayOpen(true)}
              className="bg-white/10 text-white hover:bg-white/20 transition-all duration-300 rounded-full px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm flex items-center gap-2 transform hover:scale-105"
            >
              <span className="text-xl">✨</span>
              {t.howItWorks}
            </Button>
            <span className="h-px w-16 bg-white/30"></span>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {t.subtitle.split(' ').map((word, index) => (
              <span
                key={index}
                className="inline-block mr-2 text-white/90 text-xl md:text-2xl font-playfair italic"
              >
                {word}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <AudioPlayer />
          </div>

          <HowItWorksOverlay 
            isOpen={isOverlayOpen}
            onClose={() => setIsOverlayOpen(false)}
          />
        </>
      )}
    </header>
  );
};

export default Header;
