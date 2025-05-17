import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { supabase } from '@/lib/supabase';

const Profile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.user_metadata?.display_name || '');
  const [loading, setLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSignedUrl() {
      const fileUrl = currentUser?.user_metadata?.profile_picture;
      if (fileUrl) {
        // Extract the file name from the URL
        const parts = fileUrl.split('/');
        const fileName = parts[parts.length - 1];
        const { data, error } = await supabase
          .storage
          .from('profile-pictures')
          .createSignedUrl(fileName, 60 * 60); // 1 hour
        if (data?.signedUrl) setProfilePicUrl(data.signedUrl);
        else setProfilePicUrl(null);
      } else {
        setProfilePicUrl(null);
      }
    }
    fetchSignedUrl();
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (showProfileUpload) {
    return (
      <ProfilePictureUpload
        onUploadComplete={() => setShowProfileUpload(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-500">?</span>
            </div>
          )}
          <Button
            onClick={() => setShowProfileUpload(true)}
            variant="outline"
          >
            Change Profile Picture
          </Button>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 