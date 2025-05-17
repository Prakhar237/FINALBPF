import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from 'lucide-react';

interface BibleVersionSelectorProps {
  onVersionChange: (version: string) => void;
  selectedVersion: string;
}

const BibleVersionSelector: React.FC<BibleVersionSelectorProps> = ({ onVersionChange, selectedVersion }) => {
  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={onVersionChange} value={selectedVersion}>
        <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm text-black">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <SelectValue placeholder="Select Bible Version" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/80 backdrop-blur-sm">
          <SelectItem value="KJV" className="text-black">King James Version (KJV)</SelectItem>
          <SelectItem value="NIV" className="text-black">New International Version (NIV)</SelectItem>
          <SelectItem value="ESV" className="text-black">English Standard Version (ESV)</SelectItem>
          <SelectItem value="NLT" className="text-black">New Living Translation (NLT)</SelectItem>
          <SelectItem value="MSG" className="text-black">The Message (MSG)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BibleVersionSelector;
