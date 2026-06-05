import React from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const translations = {
  en: {
    title: "Continue Your Journey",
    verse: '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7',
    description: "You have reached your 7 free searches. To continue finding peace, inspiration, and guidance through God's word, please consider supporting our ministry with a premium upgrade for just $1.99.",
    upgrade: "Support & Upgrade for $1.99 (Stripe Coming Soon)",
    close: "Maybe Later"
  },
  es: {
    title: "Continúa Tu Viaje",
    verse: '"Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." - 2 Corintios 9:7',
    description: "Has alcanzado tus 7 búsquedas gratuitas. Para continuar encontrando paz, inspiración y guía a través de la palabra de Dios, por favor considera apoyar nuestro ministerio con una actualización premium por solo $1.99.",
    upgrade: "Apoyar y Actualizar por $1.99 (Próximamente)",
    close: "Quizás Más Tarde"
  },
  fr: {
    title: "Continuez Votre Voyage",
    verse: '"Que chacun donne comme il l\'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie." - 2 Corinthiens 9:7',
    description: "Vous avez atteint vos 7 recherches gratuites. Pour continuer à trouver la paix, l'inspiration et les conseils à travers la parole de Dieu, veuillez envisager de soutenir notre ministère avec une mise à niveau premium pour seulement 1,99 $.",
    upgrade: "Soutenir et Améliorer pour 1,99 $ (Bientôt Disponible)",
    close: "Peut-être Plus Tard"
  }
};

interface PaymentModalProps {
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const isMobile = useIsMobile();

  const handlePayment = () => {
    // Placeholder for future Stripe integration
    alert('Stripe checkout will open here in the future!');
  };

  const modalStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'white',
    padding: isMobile ? '1.75rem 1.25rem' : '2.5rem',
    borderRadius: isMobile ? '0' : '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(234, 179, 8, 0.15)',
    height: isMobile ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid rgba(234, 179, 8, 0.2)'
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] transition-opacity flex items-center justify-center p-0 md:p-4">
      <div style={modalStyle} className="bg-white relative overflow-y-auto">
        {/* Soft golden glow in the background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-transparent pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-2.5 rounded-full shadow-inner border border-amber-200">
              <Heart className="h-6 w-6 text-amber-600 fill-amber-600/20" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-serif">
              {t.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 italic text-gray-700 text-center shadow-sm">
            <p className="font-serif leading-relaxed">
              {t.verse}
            </p>
          </div>

          <p className="text-gray-600 text-[1.05rem] leading-relaxed text-center px-2">
            {t.description}
          </p>

          <div className="pt-2">
            <Button 
              onClick={handlePayment} 
              className="w-full h-auto py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-base md:text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02] border border-amber-600/20 whitespace-normal text-center"
            >
              {t.upgrade}
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors uppercase tracking-wider text-xs"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
