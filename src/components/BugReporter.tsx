import React, { useState } from 'react';
import { Bug, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    title: "Report a Bug",
    placeholder: "Describe the issue you're facing...",
    submit: "Submit Bug",
    submitting: "Submitting...",
    success: "Bug reported successfully. Thank you!",
    error: "Failed to report bug. Please try again.",
    notConfigured: "Bug reporting is currently unavailable."
  },
  es: {
    title: "Reportar un Error",
    placeholder: "Describe el problema que enfrentas...",
    submit: "Enviar Error",
    submitting: "Enviando...",
    success: "Error reportado exitosamente. ¡Gracias!",
    error: "No se pudo reportar el error. Inténtalo de nuevo.",
    notConfigured: "El reporte de errores no está disponible actualmente."
  },
  fr: {
    title: "Signaler un Bug",
    placeholder: "Décrivez le problème que vous rencontrez...",
    submit: "Soumettre",
    submitting: "Soumission...",
    success: "Bug signalé avec succès. Merci !",
    error: "Échec du signalement. Veuillez réessayer.",
    notConfigured: "Le signalement de bugs est actuellement indisponible."
  }
};

const BugReporter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  if (!isSupabaseConfigured) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bugs')
        .insert([{ query }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: t.success,
      });
      setQuery('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting bug:', error);
      toast({
        title: "Error",
        description: t.error,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-2xl p-4 w-72 md:w-80 border border-gray-200 animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Bug className="h-4 w-4 text-red-500" />
              {t.title}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-24 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none outline-none"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting || !query.trim()}
              className="w-full h-9 bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                t.submitting
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  {t.submit}
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all hover:scale-105 flex items-center gap-2"
          aria-label="Report a bug"
        >
          <Bug className="h-5 w-5 text-gray-600" />
          <span className="hidden md:inline font-medium text-sm">Report a Bug</span>
        </button>
      )}
    </div>
  );
};

export default BugReporter;
