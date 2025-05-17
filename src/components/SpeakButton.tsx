import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SpeakButtonProps {
  text: string;
}

const SpeakButton: React.FC<SpeakButtonProps> = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }

    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    // Start speaking
    window.speechSynthesis.cancel(); // Cancel any ongoing speech first
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Get available voices and try to select a Google voice
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('English') || 
      voice.name.includes('US')
    );
    
    if (googleVoice) {
      utterance.voice = googleVoice;
    }
    
    // Configure speech parameters
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Handle when speech ends
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    // Handle if speech is interrupted
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    // Pre-fetch voices if needed (for Chrome)
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = speechSynthesis.getVoices();
        const updatedGoogleVoice = updatedVoices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('English') || 
          voice.name.includes('US')
        );
        
        if (updatedGoogleVoice) {
          utterance.voice = updatedGoogleVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      };
    } else {
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };
  
  return (
    <Button 
      onClick={toggleSpeech}
      variant="ghost" 
      size="sm"
      className={`rounded-full p-2 ${
        isSpeaking 
          ? 'bg-white/20 text-white' 
          : 'text-white hover:bg-white/20'
      }`}
      title={isSpeaking ? "Stop speaking" : "Listen to verse"}
      aria-label={isSpeaking ? "Stop speaking" : "Listen to verse"}
    >
      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </Button>
  );
};

export default SpeakButton;
