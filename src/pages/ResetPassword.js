import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AuthLayout from '../components/layout/AuthLayout';
import PasswordField from '../components/form/PasswordField';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { resetPasswordSchema } from '../schemas/auth';
import axiosClient from '../api/axiosClient';
import { backendRoute } from '../api/routeList';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    control,
    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Reset password token is missing');
      navigate('/forgot-password');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosClient.post(
        backendRoute.USER_RESET_PASSWORD,
        {
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Store the new authentication token
      localStorage.setItem('authToken', response.data.accessToken);
      toast.success(response.data.message || 'Password reset successfully');
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 422) {
        // Handle validation errors from backend
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((key) => {
          setError(key, {
            type: 'manual',
            message: validationErrors[key][0],
          });
        });
      } else if (error.response?.status === 401) {
        toast.error('Invalid or expired reset token');
        navigate('/forgot-password');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Resetting your password..." />}
      <AuthLayout
        title="Reset Your Password"
        subtitle="Please enter your new password"
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
          <PasswordField
            name="password"
            control={control}
            label="New Password"
            autoComplete="new-password"
            autoFocus
          />
          <PasswordField
            name="confirmPassword"
            control={control}
            label="Confirm New Password"
            autoComplete="new-password"
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
            Reset Password
          </Button>
        </Box>
      </AuthLayout>
    </>
  );
};

export default ResetPassword; 