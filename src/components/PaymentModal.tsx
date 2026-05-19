import React from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const translations = {
  en: {
    title: "Continue Your Journey",
    verse: '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7',
    description: "You have reached your 3 free searches. To continue finding peace, inspiration, and guidance through God's word, please consider supporting our ministry with a premium upgrade.",
    upgrade: "Support & Upgrade (Stripe Coming Soon)",
    close: "Maybe Later"
  },
  es: {
    title: "Continúa Tu Viaje",
    verse: '"Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." - 2 Corintios 9:7',
    description: "Has alcanzado tus 3 búsquedas gratuitas. Para continuar encontrando paz, inspiración y guía a través de la palabra de Dios, por favor considera apoyar nuestro ministerio con una actualización premium.",
    upgrade: "Apoyar y Actualizar (Próximamente)",
    close: "Quizás Más Tarde"
  },
  fr: {
    title: "Continuez Votre Voyage",
    verse: '"Que chacun donne comme il l\'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie." - 2 Corinthiens 9:7',
    description: "Vous avez atteint vos 3 recherches gratuites. Pour continuer à trouver la paix, l'inspiration et les conseils à travers la parole de Dieu, veuillez envisager de soutenir notre ministère avec une mise à niveau premium.",
    upgrade: "Soutenir et Améliorer (Bientôt Disponible)",
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
    position: isMobile ? 'fixed' : 'absolute',
    top: isMobile ? '0' : '50%',
    left: isMobile ? '0' : '50%',
    transform: isMobile ? 'none' : 'translate(-50%, -50%)',
    width: isMobile ? '100%' : 'auto',
    maxWidth: '500px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: isMobile ? '0' : '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(234, 179, 8, 0.15)',
    height: isMobile ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid rgba(234, 179, 8, 0.2)'
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity">
      <div style={modalStyle} className="bg-white relative overflow-hidden">
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
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-7 text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02] border border-amber-600/20"
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
