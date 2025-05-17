import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveUserCounter from '@/components/LiveUserCounter';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

const CommunityContent = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 px-4 flex-grow">
        <Header />
        
        <div className="mt-16 md:mt-24">
          <h1 className="font-playfair text-3xl md:text-4xl text-white text-center mb-8">
            Counselling Program
          </h1>
          
          <div className="flex justify-center mb-8">
            <span className="h-px w-32 bg-white/30"></span>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 p-6 md:p-8 rounded-xl shadow-md backdrop-blur-sm">
              <p className="text-center text-lg text-white">
                Counselling Programs coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <LiveUserCounter />
      <Footer />
    </div>
  );
};

const Community = () => {
  return (
    <LanguageProvider>
      <CommunityContent />
    </LanguageProvider>
  );
};

export default Community; 