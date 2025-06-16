import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Link, Box, useTheme, useMediaQuery } from '@mui/material';
import { toast } from 'react-hot-toast';

import AuthLayout from '../components/layout/AuthLayout';
import TextFieldWrapper from '../components/form/TextFieldWrapper';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { forgotPasswordSchema } from '../schemas/auth';
import axiosClient from '../api/axiosClient';
import { backendRoute } from '../api/routeList';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await axiosClient.post(backendRoute.USER_FORGOT_PASSWORD, data);
      setEmailSent(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((key) => {
          setError(key, {
            type: 'manual',
            message: validationErrors[key][0],
          });
        });
      } else if (error.response?.status === 404) {
        toast.error('No account found with this email address');
      } else {
        toast.error('Failed to send reset instructions. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We have sent password reset instructions to your email address"
      >
        <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
          <Link
            href="/login"
            variant="body2"
            sx={{
              display: 'inline-block',
              py: 1,
            }}
          >
            Back to Sign In
          </Link>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <>
      {isLoading && <LoadingOverlay message="Sending reset instructions..." />}
      <AuthLayout
        title="Reset Password"
        subtitle="Enter your email address and we'll send you instructions to reset your password"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            width: '100%',
            maxWidth: '400px',
            mx: 'auto',
          }}
        >
          <TextFieldWrapper
            name="email"
            control={control}
            label="Email Address"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '0.9rem' : '1rem',
            }}
            disabled={isLoading}
          >
            Send Reset Instructions
          </Button>
          <Box
            sx={{
              textAlign: 'center',
              mt: isMobile ? 2 : 1,
            }}
          >
            <Link
              href="/login"
              variant="body2"
              sx={{
                display: 'inline-block',
                py: 1,
              }}
            >
              Back to Sign In
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword; 