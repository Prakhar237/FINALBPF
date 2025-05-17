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
                backgroundImage: `url('https://media-hosting.imagekit.io/30986410b8734cba/Untitled%20design%20(84).png?Expires=1839570451&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yfnLcQ5CBUyuXRRJBEtM14gmpYIZ0k-97~BnQNLsJi8poRyHTk-ffxY6RTJLblG93oSq~1C9lGhI5mI-BdRSjjrX49Bj2kIjaw5~vRuioGENdfURZd8clgnohLIlBEGLuDomCD2WjU~OUSlVAn-8hdr2DMKOMTS-~spzwiytqalvfsmp7zrQyujWStI-AUOcgfhbxLuaAyPov4h9u6GSSmzGoTEakpZeqiaq19h8xTAGr5aVqTS9OhIevcYf1av8vD92N6NJIUYtAoosymXBGTmA6hgYRCWhM8OOzxU-x3NKxGkMGX2lZFxk3fkiA9HzU0ZZturPVcaFttf1VXn2AA__')`,
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
