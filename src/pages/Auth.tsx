import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <AuthModal
      onClose={() => navigate('/')}
    />
  );
};

export default Auth; 