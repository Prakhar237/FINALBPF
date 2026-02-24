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
import { isSupabaseConfigured } from './lib/supabase';
import { AlertCircle, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const queryClient = new QueryClient();

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4" style={{
        backgroundImage: `url('https://i.ibb.co/WNn7rLBh/mainbg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <Card className="max-w-md w-full relative z-10 border-amber-500/50 bg-black/80 text-white backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-3 text-amber-500 mb-2">
              <AlertCircle className="h-8 w-8" />
              <CardTitle className="text-2xl">Configuration Missing</CardTitle>
            </div>
            <CardDescription className="text-gray-300 text-base leading-relaxed">
              Your application is missing the required **Supabase environment variables**.
              <br /><br />
              If you are seeing this on Netlify, please ensure you have added:
              <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-xs text-amber-200/80">
                <li>VITE_SUPABASE_URL</li>
                <li>VITE_SUPABASE_ANON_KEY</li>
              </ul>
              <br />
              to your <b>Site Configuration &gt; Environment variables</b>.
            </CardDescription>
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2 text-xs text-amber-100/60 font-mono">
              <Terminal className="h-4 w-4" />
              <span>Check console for technical details.</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
