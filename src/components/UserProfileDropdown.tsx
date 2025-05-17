import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface UserProfileDropdownProps {
  size?: number;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ size = 32 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSignedUrl() {
      const fileUrl = currentUser?.user_metadata?.profile_picture;
      if (fileUrl) {
        const parts = fileUrl.split('/');
        const fileName = parts[parts.length - 1];
        const { data } = await supabase
          .storage
          .from('profile-pictures')
          .createSignedUrl(fileName, 60 * 60);
        if (data?.signedUrl) setProfilePicUrl(data.signedUrl);
        else setProfilePicUrl(null);
      } else {
        setProfilePicUrl(null);
      }
    }
    fetchSignedUrl();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Signed out successfully"
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const defaultAvatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={profilePicUrl || defaultAvatarUrl}
          alt="Profile"
          style={{ width: size, height: size }}
          className="rounded-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-medium text-white">{currentUser?.email}</p>
            {currentUser?.user_metadata?.display_name && (
              <p className="text-xs text-white/70">{currentUser.user_metadata.display_name}</p>
            )}
          </div>
          
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>

          <button
            onClick={() => {
              navigate('/settings');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown; 