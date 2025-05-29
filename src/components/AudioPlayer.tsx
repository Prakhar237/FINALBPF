import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    turnOnMusic: "Turn On Music",
    turnOffMusic: "Turn Off Music"
  },
  es: {
    turnOnMusic: "Encender Música",
    turnOffMusic: "Apagar Música"
  },
  fr: {
    turnOnMusic: "Activer la Musique",
    turnOffMusic: "Désactiver la Musique"
  }
};

const AudioPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioRef.current.muted = true;
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="px-4">
      <audio
        ref={audioRef}
        src="/zen1-updated.mp3"
        loop
        preload="auto"
        muted={true}
      />
      <Button
        onClick={toggleMute}
        variant="ghost"
        className={`w-full max-w-2xl mx-auto py-3 px-6 rounded-lg text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          isMuted 
            ? 'bg-gray-100/20 text-gray-300 hover:bg-gray-100/30' 
            : 'bg-amber-100/20 text-amber-300 hover:bg-amber-100/30'
        }`}
      >
        {isMuted ? (
          <>
            <VolumeX className="h-5 w-5" />
            <span>{t.turnOnMusic}</span>
          </>
        ) : (
          <>
            <Volume2 className="h-5 w-5" />
            <span>{t.turnOffMusic}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default AudioPlayer; 