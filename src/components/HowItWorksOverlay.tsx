import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HowItWorksOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowItWorksOverlay: React.FC<HowItWorksOverlayProps> = ({ isOpen, onClose }) => {
  const text = "Bible Peace Finder provides you with tailored Bible verses & simple safe advice for any situation you're facing, directly from the Good Book. Note: All of our materials are sourced directly from your favourite version of the Bible. Just explain your personal problem in as much or as little detail as you like, or select from our pre-made Choose Your Struggle section and we'll provide you with the best Bible verses meant to bring you peace and rest in any circumstance!!!";
  const words = text.split(' ');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />
          
          {/* Overlay Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl">
                <div className="flex justify-end mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-10 w-10 rounded-full bg-white/50 hover:bg-red-100 hover:text-red-600 transition-all duration-300 transform hover:rotate-90 hover:scale-110 border border-gray-200 shadow-sm"
                  >
                    <X size={24} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center text-center max-w-xl mx-auto">
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.03,
                        type: "spring",
                        stiffness: 100
                      }}
                      className="font-montserrat font-bold text-gray-800 text-lg leading-relaxed inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HowItWorksOverlay; 