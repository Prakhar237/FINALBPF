import React, { useRef, useState, useEffect } from 'react';
import VerseCard from './VerseCard';
import { Button } from "@/components/ui/button";
import { Download, Bookmark, BookmarkCheck, ArrowUp } from "lucide-react";
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollTop(scrollPosition > 300); // Show button when scrolled down 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
    <>
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

      {/* Scroll to top button - Chakra UI style logic */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[50px] right-[50px] z-[1000] p-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all"
          aria-label="Scroll to top"
        >
          {/* Up arrow icon */}
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </>
  );
};

export default VersesDisplay;
