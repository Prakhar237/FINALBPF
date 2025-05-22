import React, { useRef, useState } from 'react';
import VerseCard from './VerseCard';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from 'html2pdf.js';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

const translations = {
  en: {
    yourVerses: "Your Verses",
    saveAsPdf: "Save As PDF"
  },
  es: {
    yourVerses: "Tus Versículos",
    saveAsPdf: "Guardar Como PDF"
  },
  fr: {
    yourVerses: "Tes Versets",
    saveAsPdf: "Enregistrer en PDF"
  }
};

interface VersesDisplayProps {
  verses: string[];
}

const VersesDisplay: React.FC<VersesDisplayProps> = ({ verses }) => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState<{ [key: number]: boolean }>({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalPosition, setAuthModalPosition] = useState<{ top: number; left: number } | undefined>(undefined);

  const exportPdf = async () => {
    if (!contentRef.current || verses.length === 0) return;

    const element = contentRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'verses-for-the-soul.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    toast({
      title: "Preparing your PDF",
      description: "Please wait while we generate your verses document..."
    });

    try {
      await html2pdf().from(element).set(opt).save();
      
      toast({
        title: "PDF Downloaded Successfully",
        description: "Your verses have been saved as a PDF",
      });
    } catch (error) {
      toast({
        title: "Failed to generate PDF",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = (i: number) => {
    if (!isAuthenticated) {
      // Find the ProblemInput box and get its position
      const inputBox = document.getElementById('problem-input-box');
      if (inputBox) {
        const rect = inputBox.getBoundingClientRect();
        setAuthModalPosition({
          top: rect.top + window.scrollY + rect.height / 2,
          left: rect.left + window.scrollX + rect.width / 2,
        });
      } else {
        setAuthModalPosition(undefined);
      }
      setShowAuthModal(true);
      return;
    }
    setBookmarked(prev => ({ ...prev, [i]: !prev[i] }));
  };

  if (verses.length === 0) return null;

  // Always skip the first verse and display the rest
  const displayVerses = verses.slice(1);

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-playfair text-2xl md:text-3xl text-white">{t.yourVerses}</h2>
        <Button 
          variant="outline" 
          className="border-black text-black hover:bg-gray-200 shadow-sm transition-all duration-300" 
          onClick={exportPdf}
        >
          <Download className="mr-2 h-4 w-4" />
          {t.saveAsPdf}
        </Button>
      </div>

      <div className="bg-white/60 p-6 md:p-8 rounded-xl shadow-md backdrop-blur-sm">
        <div ref={contentRef} className="space-y-6">
          <div className="text-center text-lg font-montserrat font-bold text-white mb-6">
            Here are your 21 Bible Verses that sympathise with your situation and provide you guidance
          </div>
          {displayVerses.length > 0 ? (
            displayVerses.map((verse, i) => (
              <VerseCard
                key={i}
                verse={verse}
                index={i}
                isBookmarked={!!bookmarked[i]}
                onBookmark={() => handleBookmark(i)}
                bookmarkDisabled={!isAuthenticated}
              />
            ))
          ) : null}
        </div>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} position={authModalPosition} />}
    </div>
  );
};

export default VersesDisplay;
