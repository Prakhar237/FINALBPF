import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfilePictureUpload from './ProfilePictureUpload';

interface AuthModalProps {
  onClose: () => void;
  position?: { top: number; left: number };
}

const AuthModal = ({ onClose, position }: AuthModalProps) => {
  const [tab, setTab] = useState<'signup' | 'signin' | 'forgot-password'>('signup');
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
  const [signinData, setSigninData] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, sendEmailConfirmation } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(signupData.email, signupData.password);
      toast({
        title: "Success",
        description: "Account created! Please check your email for confirmation."
      });
      setShowProfileUpload(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(signinData.email, signinData.password);
      toast({
        title: "Success",
        description: "Signed in successfully!"
      });
      onClose();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(resetEmail);
      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email."
      });
      setTab('signin');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset instructions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await sendEmailConfirmation();
      toast({
        title: "Success",
        description: "Confirmation email has been resent."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend confirmation email",
        variant: "destructive"
      });
    }
  };

  const modalStyle = position
    ? {
        position: 'absolute' as const,
        top: position.top,
        left: position.left,
        zIndex: 1000,
        transform: 'translate(-50%, 0)',
      }
    : {};

  if (showProfileUpload) {
    return (
      <ProfilePictureUpload
        onUploadComplete={() => {
          setShowProfileUpload(false);
          onClose();
          navigate('/');
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
        style={modalStyle}
      >
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 text-lg font-medium ${tab === 'signup' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 text-lg font-medium ${tab === 'signin' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setTab('signin')}
          >
            Sign In
          </button>
        </div>

        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={signupData.email}
                onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={signupData.password}
                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={signupData.confirmPassword}
                onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        )}

        {tab === 'signin' && (
          <form onSubmit={handleSignin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={signinData.email}
                onChange={e => setSigninData({ ...signinData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={signinData.password}
                onChange={e => setSigninData({ ...signinData, password: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setTab('forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {tab === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending Reset Instructions...' : 'Send Reset Instructions'}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;