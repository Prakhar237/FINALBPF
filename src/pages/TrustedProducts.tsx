import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveUserCounter from '@/components/LiveUserCounter';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

const TrustedProductsContent = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 px-4 flex-grow">
        <Header />
        
        <div className="mt-16 md:mt-24">
          <h2 className="font-playfair text-3xl md:text-4xl text-white text-center mb-8">
            {language === 'en' ? 'Trusted Products' : language === 'es' ? 'Productos Confiables' : 'Produits de Confiance'}
          </h2>
          
          <div className="flex justify-center mb-8">
            <span className="h-px w-32 bg-white/30"></span>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 p-6 md:p-8 rounded-xl shadow-md backdrop-blur-sm">
              <p className="text-center text-lg text-gray-800">
                {language === 'en' 
                  ? 'Coming soon: Bible study materials, devotionals, and more to help you grow in your faith journey.'
                  : language === 'es'
                  ? 'Próximamente: Materiales de estudio bíblico, devocionales y más para ayudarte a crecer en tu camino de fe.'
                  : 'À venir: Matériel d\'étude biblique, dévotionnels et plus pour vous aider à grandir dans votre parcours de foi.'}
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

const TrustedProducts = () => {
  return (
    <LanguageProvider>
      <TrustedProductsContent />
    </LanguageProvider>
  );
};

export default TrustedProducts; 