import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';

const Navigation = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const translations = {
    en: {
      home: 'Home',
      workOfFaith: 'Works of Faith',
      trustedProducts: 'Trusted E-Products',
      counsellingProgram: 'Trusted Programs',
      ebooks: 'E-books'
    },
    es: {
      home: 'Inicio',
      workOfFaith: 'Obras de Fe',
      trustedProducts: 'Productos Electrónicos Confiables',
      counsellingProgram: 'Programas de Confianza',
      ebooks: 'E-libros'
    },
    fr: {
      home: 'Accueil',
      workOfFaith: 'Œuvres de Foi',
      trustedProducts: 'Produits Électroniques de Confiance',
      counsellingProgram: 'Programmes de Confiance',
      ebooks: 'E-livres'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const navLinks = [
    { to: '/', label: t.home },
    { 
      label: t.workOfFaith,
      subMenu: [
        { to: '/trusted-products', label: t.trustedProducts },
        { to: '/counselling-program', label: t.counsellingProgram }
      ]
    },
    { label: 'Create Account', onClick: () => setShowAuthModal(true) }
  ];

  return (
    <nav className="relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="fixed inset-0 flex flex-col overflow-y-auto">
          <div className="flex flex-col items-center pt-16 pb-8 px-4">
            {navLinks.map((link, index) => (
              <div key={index} className="flex flex-col items-center my-2 w-full">
                {link.to ? (
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-xl px-6 py-2 rounded-lg transition-all duration-300 w-full text-center ${
                      location.pathname === link.to
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : link.onClick ? (
                  !isAuthenticated ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        link.onClick();
                      }}
                      className="text-xl px-6 py-2 rounded-lg transition-all duration-300 text-white/70 hover:bg-white/10 w-full"
                    >
                      {link.label}
                    </button>
                  ) : null
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <button
                      onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                      className={`text-xl px-6 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 w-full ${
                        isSubMenuOpen
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={20} />
                    </button>
                    {isSubMenuOpen && (
                      <div className="flex flex-col items-center mt-1 gap-1 w-full">
                        {link.subMenu?.map((subLink) => (
                          <Link
                            key={subLink.to}
                            to={subLink.to}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsSubMenuOpen(false);
                            }}
                            className={`whitespace-nowrap text-lg px-4 py-2 rounded-lg transition-all duration-300 w-full text-center ${
                              location.pathname === subLink.to
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isAuthenticated && (
              <div className="mt-2 w-full flex justify-center">
                <UserProfileDropdown />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center gap-4 mb-8">
        {navLinks.map((link, index) => (
          <div key={index} className="relative">
            {link.to ? (
              <Link
                to={link.to}
                className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center text-white/80 hover:bg-white/10 hover:text-white${location.pathname === link.to ? ' bg-white/10 text-white shadow-sm' : ''}`}
              >
                {link.label}
              </Link>
            ) : link.subMenu ? (
              <div className="relative group">
                <button
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                    location.pathname === '/trusted-products' || location.pathname === '/counselling-program'
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full -left-44 mt-1 w-[500px] bg-white/10 backdrop-blur-sm rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="grid grid-cols-2">
                    {link.subMenu?.map((subLink) => (
                      <div className="px-4 flex justify-center">
                        <Link
                          key={subLink.to}
                          to={subLink.to}
                          className={`block w-[200px] text-center whitespace-nowrap py-2 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 ${
                            location.pathname === subLink.to ? 'bg-white/20 text-white' : ''
                          }`}
                        >
                          {subLink.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : !isAuthenticated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={link.onClick}
                    className="px-4 py-2 rounded-md transition-all duration-300 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-black">
                  <span className="font-montserrat font-bold text-yellow-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]">
                    Creating your account allows you to bookmark and save your favourite Bible Verses.
                  </span>
                </TooltipContent>
              </Tooltip>
            ) : null}
          </div>
        ))}
        {isAuthenticated && (
          <div className="ml-4">
            <UserProfileDropdown />
          </div>
        )}
      </div>
      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </nav>
  );
};

export default Navigation; 