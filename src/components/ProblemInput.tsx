import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    placeholder: "Explain your problem/situation here or click the button above to- Choose your struggle...",
    findVerses: "Find My Verses",
    findingVerses: "Finding verses..."
  },
  es: {
    placeholder: "Explica tu problema/situación aquí o haz clic en el botón de arriba para- Elegir tu lucha...",
    findVerses: "Encontrar Mis Versículos",
    findingVerses: "Buscando versículos..."
  },
  fr: {
    placeholder: "Expliquez votre problème/situation ici ou cliquez sur le bouton ci-dessus pour- Choisir votre lutte...",
    findVerses: "Trouver Mes Versets",
    findingVerses: "Recherche de versets..."
  }
};

interface ProblemInputProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

const ProblemInput: React.FC<ProblemInputProps> = ({
  userInput,
  setUserInput,
  handleSubmit,
  isLoading
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try using a modern browser like Chrome.",
        variant: "destructive",
      });
      return;
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      // Configure recognition settings
      recognition.continuous = false; // Changed to false to prevent duplicate words
      recognition.interimResults = false; // Changed to false to prevent duplicate words
      
      // Add mobile-specific settings
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        recognition.continuous = false;
        recognition.interimResults = false;
      }

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Start speaking. Click the microphone again to stop.",
        });
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        // Only update if we have new content
        if (transcript.trim() !== userInput.trim()) {
          setUserInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "Error",
        description: "There was an error starting speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Stopped Listening",
        description: "Speech recognition has been stopped.",
      });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div id="problem-input-box" className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center space-y-6">
      <div className="w-full relative">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t.placeholder}
          className="min-h-28 p-4 text-lg border-0 shadow-lg rounded-2xl bg-[#f5e6d0]/90 backdrop-blur-sm text-gray-800 focus:ring-0 focus:border-0 placeholder:text-gray-600 pr-12"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleListening}
          className={`absolute bottom-2 right-2 h-8 w-8 rounded-full transition-all duration-300 ${
            isListening 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-white/50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
      </div>
      
      <div>
        <Button
          onClick={handleSubmit}
          disabled={!userInput.trim() || isLoading}
          className="px-10 py-6 text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-full border-0 font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-2xl">✦</span>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t.findingVerses}
            </>
          ) : (
            t.findVerses
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProblemInput;
