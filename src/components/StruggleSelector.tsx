import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

const translations = {
  en: {
    chooseStruggle: "Choose your struggle..."
  },
  es: {
    chooseStruggle: "Elige tu lucha..."
  },
  fr: {
    chooseStruggle: "Choisissez votre lutte..."
  }
};

const struggles = [
  "Abortion",
  "Abuse",
  "Adoption",
  "Adultery",
  "Aging",
  "Substance Abuse",
  "Anger",
  "Anxiety",
  "Birth Control",
  "Bitterness",
  "Broken Heart",
  "Career",
  "Elderly Parents",
  "Communication",
  "CO-dependency",
  "Confession",
  "Contentment",
  "Courtship",
  "Dating",
  "Death",
  "Depression",
  "Discipleship",
  "Discipling Children",
  "Divorce",
  "Eating Disorder",
  "Faith",
  "Fantasizing",
  "Fear & Worry",
  "Finances",
  "Flirtation",
  "Forgiveness",
  "Friendship",
  "God's Will",
  "Gossip",
  "Grief",
  "Guilt",
  "Health & Fasting",
  "Hospitality",
  "Same Sex Attraction",
  "Sickness",
  "Infertility",
  "Insomnia",
  "Internet Addiction",
  "Laziness",
  "Loneliness",
  "Lust",
  "Lying",
  "Marriage",
  "Materialism & Vanity",
  "Menopause",
  "Mentoring",
  "Miscarriage",
  "Mothering",
  "Movies",
  "Occult",
  "Organization",
  "Orphan",
  "Bad Memories",
  "Salvation",
  "Premenstrual Syndrome",
  "Prodigal Children",
  "Prostitution",
  "Psychics",
  "Quiet Time",
  "Rape",
  "Repentance",
  "Satan",
  "Self-Worth",
  "Sex",
  "Singleness",
  "Speech",
  "Spiritual Gifts",
  "Submission",
  "Suffering",
  "Temptation",
  "Time Wasting",
  "Widow & Widowers"
];

interface StruggleSelectorProps {
  onStruggleSelect: (struggle: string) => void;
}

const StruggleSelector: React.FC<StruggleSelectorProps> = ({ onStruggleSelect }) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <motion.div 
      className="w-full max-w-md mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Select onValueChange={onStruggleSelect}>
        <SelectTrigger className="w-full bg-white/90 backdrop-blur-sm text-gray-800 border-0 shadow-lg rounded-2xl px-4 py-6 text-lg font-montserrat transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20">
          <SelectValue placeholder={t.chooseStruggle} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl shadow-amber-500/20 rounded-xl">
          {struggles.map((struggle) => (
            <SelectItem 
              key={struggle}
              value={struggle}
              className="hover:bg-amber-50/50 transition-colors duration-200 cursor-pointer"
            >
              {struggle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default StruggleSelector; 