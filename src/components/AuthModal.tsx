import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const translations = {
  en: {
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    close: "Close"
  },
  es: {
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    email: "Correo Electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",
    close: "Cerrar"
  },
  fr: {
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas de compte ?",
    haveAccount: "Déjà un compte ?",
    close: "Fermer"
  }
};

interface AuthModalProps {
  onClose: () => void;
  position?: { top: number; left: number };
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, position }) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const username = formData.get('username') as string;

    if (!isSignIn && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      if (isSignIn) {
        await signIn(email, password);
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
      } else {
        await signUp(email, password, username);
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate('/auth/reset-password');
  };

  const modalStyle: React.CSSProperties = {
    position: isMobile ? 'fixed' : 'absolute',
    top: isMobile ? '0' : position?.top ? `${position.top}px` : '50%',
    left: isMobile ? '0' : position?.left ? `${position.left}px` : '50%',
    transform: isMobile ? 'none' : 'translate(-50%, -50%)',
    width: isMobile ? '100%' : 'auto',
    maxWidth: '400px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: isMobile ? '0' : '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div style={modalStyle} className="bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignIn ? t.signIn : t.signUp}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {!isSignIn && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t.confirmPassword}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {isSignIn && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {t.forgotPassword}
              </button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignIn ? t.signIn : t.signUp)}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isSignIn ? t.noAccount : t.haveAccount}
            </span>
            <button
              type="button"
              onClick={() => setIsSignIn(!isSignIn)}
              className="ml-1 text-blue-600 hover:text-blue-500"
            >
              {isSignIn ? t.signUp : t.signIn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;