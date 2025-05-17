import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { supabase } from '@/lib/supabase';

const Settings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [username, setUsername] = useState(currentUser?.user_metadata?.display_name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: username }
      });
      if (error) throw error;
      toast({ title: "Success", description: "Username updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update username", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (showProfileUpload) {
    return <ProfilePictureUpload onUploadComplete={() => setShowProfileUpload(false)} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Username'}
          </Button>
        </form>
        <div className="mt-6">
          <Button onClick={() => setShowProfileUpload(true)} variant="outline" className="w-full">
            Change Profile Picture
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 