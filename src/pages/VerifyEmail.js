import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

import AuthLayout from '../components/layout/AuthLayout';
import LoadingOverlay from '../components/common/LoadingOverlay';
import axiosClient from '../api/axiosClient';
import backendRoute from '../api/routeList';

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        toast.error('Verification token is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosClient.post(backendRoute.USER_VERIFY_EMAIL, { token });
        setVerificationStatus('success');
        toast.success(response.data.message || 'Email verified successfully');
        // Store the token in localStorage
        localStorage.setItem('authToken', response.data.accessToken);
        // Wait for 2 seconds before redirecting to show the success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        setVerificationStatus('error');
        // Wait for 2 seconds before redirecting to show the error message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1">Verifying your email address...</Typography>
          </Box>
        );
      case 'success':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You will be redirected to the dashboard shortly.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{ minWidth: 200 }}
            >
              Go to Dashboard
            </Button>
          </Box>
        );
      case 'error':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Verification Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The verification link may have expired or is invalid.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ minWidth: 200 }}
            >
              Back to Login
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Verifying your email..." />}
      <AuthLayout
        title="Email Verification"
        subtitle={
          verificationStatus === 'verifying'
            ? 'Please wait while we verify your email address'
            : null
        }
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            mx: 'auto',
            py: 3,
          }}
        >
          {renderContent()}
        </Box>
      </AuthLayout>
    </>
  );
};

export default VerifyEmail; 