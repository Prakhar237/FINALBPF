import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveUserCounter from '@/components/LiveUserCounter';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

// Final, clean Product type
interface Product {
  id: string;
  description?: string;
  price: number;
  image_url: string;
  is_active: boolean | string;
}

const TrustedProductsContent = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('id, description, price, image_url, is_active')
        .in('is_active', [true, 'true']); // Filter for active products

      if (error) {
        setError('Failed to load products.');
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-8 px-4 flex-grow">
        <Header />
        <div className="mt-16 md:mt-24">
          <h2 className="font-playfair text-3xl md:text-4xl text-white text-center mb-8">
            {language === 'en' ? 'Trusted E-Products' : language === 'es' ? 'Productos Electrónicos Confiables' : 'Produits Électroniques de Confiance'}
          </h2>
          <div className="flex justify-center mb-8">
            <span className="h-px w-32 bg-white/30"></span>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 p-6 md:p-8 rounded-xl shadow-md backdrop-blur-sm">
              {loading ? (
                <p className="text-center text-lg text-gray-800">{language === 'en' ? 'Loading products...' : language === 'es' ? 'Cargando productos...' : 'Chargement des produits...'}</p>
              ) : error ? (
                <p className="text-center text-lg text-red-600">{error}</p>
              ) : products.length === 0 ? (
                <p className="text-center text-lg text-gray-800">
                  {language === 'en' 
                    ? 'No products available at the moment.'
                    : language === 'es'
                    ? 'No hay productos disponibles en este momento.'
                    : 'Aucun produit disponible pour le moment.'}
                </p>
              ) : (
                <div className="flex flex-col gap-8">
                  {products.map(product => (
                    <div key={product.id} className="bg-gray-200/80 backdrop-blur-sm rounded-2xl p-4 flex flex-col sm:flex-row gap-6">
                      <img 
                        src={product.image_url} 
                        alt="Product Image" 
                        className="w-full sm:w-48 h-48 object-cover rounded-xl"
                      />
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{product.id}</h3>
                        <p className="text-lg text-gray-800 mt-2 flex-grow">
                          {product.description || 'No description available.'}
                        </p>
                        <div className="flex items-end justify-between mt-4">
                          <span className="text-3xl font-bold text-black">${product.price.toFixed(2)}</span>
                          <a 
                            href="https://payhip.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-[#00facc] hover:bg-[#00e7b8] text-black font-bold py-2 px-8 rounded-full transition-colors"
                          >
                            BUY NOW
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
