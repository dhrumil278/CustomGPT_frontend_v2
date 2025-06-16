import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

import AuthLayout from '../components/layout/AuthLayout';
import LoadingOverlay from '../components/common/LoadingOverlay';
import axiosClient from '../api/axiosClient';
import backendRoute from '../api/routeList';

const VerifyForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyForgotPasswordToken = async () => {
      if (!token) {
        setVerificationStatus('error');
        toast.error('Verification token is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosClient.post(backendRoute.USER_VERIFY_FORGOT_PASSWORD, { token });
        setVerificationStatus('success');
        toast.success(response.data.message || 'Token verified successfully');
        // Wait for 2 seconds before redirecting to show the success message
        setTimeout(() => {
          // Pass the verified token to reset password page
          navigate(`/reset-password?token=${token}`);
        }, 2000);
      } catch (error) {
        setVerificationStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
        // Wait for 2 seconds before redirecting to show the error message
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyForgotPasswordToken();
  }, [token, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1">Verifying your reset password link...</Typography>
          </Box>
        );
      case 'success':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Link Verified Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You will be redirected to reset your password shortly.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/reset-password?token=${token}`)}
              sx={{ minWidth: 200 }}
            >
              Reset Password
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
              The reset password link may have expired or is invalid.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/forgot-password')}
              sx={{ minWidth: 200 }}
            >
              Back to Forgot Password
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Verifying your reset password link..." />}
      <AuthLayout
        title="Reset Password Verification"
        subtitle={
          verificationStatus === 'verifying'
            ? 'Please wait while we verify your reset password link'
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

export default VerifyForgotPassword;