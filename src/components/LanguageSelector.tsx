import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange, currentLanguage }) => {
  return (
    <div className="flex justify-end">
      <Select onValueChange={onLanguageChange} defaultValue={currentLanguage || "en"} value={currentLanguage}>
        <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm text-black">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue placeholder="Language" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/80 backdrop-blur-sm">
          <SelectItem value="en" className="text-black">English</SelectItem>
          <SelectItem value="es" className="text-black">Español</SelectItem>
          <SelectItem value="fr" className="text-black">Français</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
