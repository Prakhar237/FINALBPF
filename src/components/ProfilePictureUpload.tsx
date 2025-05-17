import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface ProfilePictureUploadProps {
  onUploadComplete: () => void;
}

const ProfilePictureUpload = ({ onUploadComplete }: ProfilePictureUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropper, setCropper] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleCrop = () => {
    if (!cropper || !selectedFile || !currentUser) return;
    
    const canvas = cropper.getCroppedCanvas({
      width: 300,
      height: 300,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setLoading(true);
      try {
        // Convert blob to File
        const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
        
        // Upload to Supabase Storage
        const fileExt = 'jpg';
        const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);

        // Update user metadata with profile picture URL
        const { error: updateError } = await supabase.auth.updateUser({
          data: { profile_picture: publicUrl }
        });

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "Profile picture uploaded successfully!"
        });
        onUploadComplete();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to upload profile picture",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleSkip = () => {
    onUploadComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Add Profile Picture</h2>
        
        {!selectedFile ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                Choose Image
              </Button>
              <p className="mt-2 text-sm text-gray-500">
                Upload a profile picture (max 5MB)
              </p>
            </div>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full"
            >
              Skip for now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[300px] w-full">
              <Cropper
                src={URL.createObjectURL(selectedFile)}
                style={{ height: 300, width: '100%' }}
                aspectRatio={1}
                guides={true}
                onInitialized={(instance) => setCropper(instance)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedFile(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCrop}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload; 