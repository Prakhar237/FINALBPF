import React, { useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Facebook, Instagram, MessageSquare, Bookmark, BookmarkCheck } from "lucide-react";
import { Twitter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SpeakButton from './SpeakButton';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";

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
  
  const hasSeparator = verse.includes(':');
  let reference = '';
  let text = verse;
  
  if (hasSeparator) {
    const firstColonIndex = verse.indexOf(':');
    const lastSpaceBeforeReference = verse.lastIndexOf(' ', firstColonIndex - 10) || 0;
    reference = verse.substring(lastSpaceBeforeReference, firstColonIndex + 3).trim();
    text = verse.substring(firstColonIndex + 3).trim();
  }

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
      const shareText = `${text}\n\n- ${reference}\nShared from Bible Peace Finder`;
      
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
          break;
        case 'instagram':
          // For Instagram, we'll copy the text to clipboard
          await navigator.clipboard.writeText(shareText);
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
        backgroundImage: `url('https://media-hosting.imagekit.io/30986410b8734cba/Untitled%20design%20(83).png?Expires=1839570451&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yfnLcQ5CBUyuXRRJBEtM14gmpYIZ0k-97~BnQNLsJi8poRyHTk-ffxY6RTJLblG93oSq~1C9lGhI5mI-BdRSjjrX49Bj2kIjaw5~vRuioGENdfURZd8clgnohLIlBEGLuDomCD2WjU~OUSlVAn-8hdr2DMKOMTS-~spzwiytqalvfsmp7zrQyujWStI-AUOcgfhbxLuaAyPov4h9u6GSSmzGoTEakpZeqiaq19h8xTAGr5aVqTS9OhIevcYf1av8vD92N6NJIUYtAoosymXBGTmA6hgYRCWhM8OOzxU-x3NKxGkMGX2lZFxk3fkiA9HzU0ZZturPVcaFttf1VXn2AA__')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CardContent className="p-6 bg-black/30">
        <div className="flex flex-col">
          {reference && (
            <h3 className="font-montserrat font-bold text-lg text-white mb-3">
              {reference}
            </h3>
          )}
          <p className="font-montserrat font-bold text-white/90 leading-relaxed text-base mb-4">{text}</p>
          
          <div className="flex justify-end gap-2 mt-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadAsImage}
              className="text-white/70 hover:bg-white/10 rounded-full p-2"
              title="Download verse as image"
            >
              <Download size={16} />
            </Button>
            
            <div className="flex gap-2">
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

            <SpeakButton text={text} />

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
