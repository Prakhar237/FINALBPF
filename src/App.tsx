import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import TrustedProducts from './pages/TrustedProducts';
import CounsellingProgram from './pages/CounsellingProgram';
import Ebooks from './pages/Ebooks';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ 
                backgroundImage: `url('https://i.ibb.co/WNn7rLBh/mainbg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
              }}>
                <div className="min-h-screen bg-black/40 backdrop-blur-sm">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/trusted-products" element={<TrustedProducts />} />
                    <Route path="/counselling-program" element={<CounsellingProgram />} />
                    <Route path="/ebooks" element={<Ebooks />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <ScrollToTop />
                </div>
              </div>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
