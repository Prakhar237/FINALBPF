import React, { useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Facebook, Instagram, MessageSquare, Bookmark, BookmarkCheck } from "lucide-react";
import { Twitter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SpeakButton from './SpeakButton';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

interface VerseCardProps {
  verse: string;
  index: number;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  bookmarkDisabled?: boolean;
}

const VerseCard: React.FC<VerseCardProps> = ({ verse, index, isBookmarked, onBookmark, bookmarkDisabled }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  let reference = '';
  let verseText = verse;
  let commentary = '';

  // Match Bible references like "John 3:16", "1 Corinthians 13:4", "Psalm 23:1-6", etc.
  // Supports numbered books (1 Corinthians, 2 Timothy) and multi-word books (Song of Solomon)
  const bibleRefRegex = /^(\d?\s?[A-Za-z]+(?:\s[A-Za-z]+)*\s\d+:\d+(?:-\d+)?)\s*/;

  const lines = verse.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length >= 1) {
    // Line 0: citation
    const refMatch = lines[0].match(bibleRefRegex);
    if (refMatch) {
      reference = refMatch[1].trim();
    } else {
      reference = lines[0];
    }
  }

  if (lines.length >= 2) {
    // Line 1: verse text — strip surrounding quotes if present
    verseText = lines[1].replace(/^[""]|[""]$/g, '').trim();
  }

  if (lines.length >= 3) {
    // Line 2+: commentary — strip "Commentary:" prefix if present
    const commentaryLines = lines.slice(2).join(' ');
    commentary = commentaryLines.replace(/^commentary:\s*/i, '').trim();
  }

  // Share text uses all three parts
  const fullShareText = `${reference}\n"${verseText}"\n\n${commentary}\n\nShared from Bible Peace Finder`;

  const downloadAsImage = async () => {
    if (!cardRef.current) return;

    try {
      // Create a temporary div for the clean version
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '600px';
      document.body.appendChild(tempDiv);

      // Clone the card content without buttons
      const cleanCard = cardRef.current.cloneNode(true) as HTMLElement;
      const buttonsContainer = cleanCard.querySelector('.flex.justify-end.gap-2');
      if (buttonsContainer) {
        buttonsContainer.remove();
      }

      // Set fixed width and padding for the clean card
      cleanCard.style.width = '600px';
      cleanCard.style.padding = '24px';
      cleanCard.style.margin = '0';
      cleanCard.style.borderRadius = '12px';
      cleanCard.style.overflow = 'hidden';

      // Adjust the content container
      const contentContainer = cleanCard.querySelector('.flex.flex-col');
      if (contentContainer) {
        (contentContainer as HTMLElement).style.padding = '0';
        (contentContainer as HTMLElement).style.margin = '0';
      }

      // Adjust the text elements
      const referenceElement = cleanCard.querySelector('h3');
      if (referenceElement) {
        (referenceElement as HTMLElement).style.marginBottom = '16px';
      }

      const textElement = cleanCard.querySelector('p');
      if (textElement) {
        (textElement as HTMLElement).style.marginBottom = '0';
        (textElement as HTMLElement).style.lineHeight = '1.6';
      }

      tempDiv.appendChild(cleanCard);

      // Generate the image from the clean version
      const canvas = await html2canvas(cleanCard, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
        width: 600,
        height: cleanCard.offsetHeight,
        windowWidth: 600,
        windowHeight: cleanCard.offsetHeight
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `bible-verse-${reference || 'quote'}.png`;
      link.click();

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(fullShareText)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(fullShareText)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
          break;
        case 'instagram':
          // For Instagram, we'll copy the text to clipboard
          await navigator.clipboard.writeText(fullShareText);
          toast({
            title: "Verse copied to clipboard",
            description: "You can now paste and share it on Instagram",
          });
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error sharing verse",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      ref={cardRef}
      className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in relative" 
      style={{ 
        animationDelay: `${index * 100}ms`,
        backgroundImage: `url('https://i.ibb.co/G4LWGGyh/versecardbg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CardContent className="p-6 bg-black/30">
        <div className="flex flex-col">
          {/* Citation — always shown at top */}
          {reference && (
            <h3 className="font-montserrat font-bold text-lg text-white mb-3">
              {reference}
            </h3>
          )}

          {/* Verse text — italic quote style */}
          <p className="font-montserrat italic text-white/95 leading-relaxed text-base mb-3">
            &ldquo;{verseText}&rdquo;
          </p>

          {/* Commentary — lighter muted style below */}
          {commentary && (
            <p className="font-montserrat text-sm text-white/70 leading-relaxed mb-4">
              {commentary}
            </p>
          )}
          
          <div className="flex flex-wrap justify-end gap-2 mt-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadAsImage}
              className="text-white/70 hover:bg-white/10 rounded-full p-2"
              title="Download verse as image"
            >
              <Download size={16} />
            </Button>
            
            <div className={`flex ${isMobile ? 'flex-wrap' : ''} gap-2`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('whatsapp')}
                className="text-white/70 hover:bg-white/10 rounded-full p-2"
                title="Share on WhatsApp"
              >
                <MessageSquare size={16} className="text-[#25D366]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="text-white/70 hover:bg-white/10 rounded-full p-2"
                title="Share on Facebook"
              >
                <Facebook size={16} className="text-[#1877F2]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="text-white/70 hover:bg-white/10 rounded-full p-2"
                title="Share on Twitter"
              >
                <Twitter size={16} className="text-[#1DA1F2]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('instagram')}
                className="text-white/70 hover:bg-white/10 rounded-full p-2"
                title="Share on Instagram"
              >
                <Instagram size={16} className="text-[#E4405F]" />
              </Button>
            </div>

            <SpeakButton text={verseText} />

            <Button
              variant="ghost"
              size="sm"
              onClick={onBookmark}
              className={`text-yellow-400 hover:text-yellow-500 rounded-full p-2`}
              title={bookmarkDisabled ? 'Sign in/up to bookmark' : isBookmarked ? 'Remove Bookmark' : 'Bookmark this verse'}
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerseCard;
