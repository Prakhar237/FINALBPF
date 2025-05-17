import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users } from 'lucide-react';

const translations = {
  en: {
    users: "Users Online"
  },
  es: {
    users: "Usuarios en Línea"
  },
  fr: {
    users: "Utilisateurs en Ligne"
  }
};

const LiveUserCounter = () => {
  const [userCount, setUserCount] = useState(12); // Start with a middle value
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const updateUserCount = () => {
      const newCount = Math.floor(Math.random() * (15 - 9 + 1)) + 9;
      setUserCount(newCount);
    };

    // Update count every 3-5 seconds
    const intervalId = setInterval(updateUserCount, Math.random() * 2000 + 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{userCount}</span>
        </div>
        <div className="relative flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
};

export default LiveUserCounter;
