import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Link, Box, useTheme, useMediaQuery } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import AuthLayout from '../components/layout/AuthLayout';
import TextFieldWrapper from '../components/form/TextFieldWrapper';
import PasswordField from '../components/form/PasswordField';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { loginSchema } from '../schemas/auth';
import axiosClient from '../api/axiosClient';
import { backendRoute } from '../api/routeList';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axiosClient.post(backendRoute.USER_LOGIN, data);
      localStorage.setItem('authToken', response.data.data.accessToken);
      toast.success(response.data.message);
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
        toast.error('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Signing in..." />}
      <AuthLayout
        title="Welcome Back"
        subtitle="Please sign in to continue"
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
          <PasswordField
            name="password"
            control={control}
            label="Password"
            autoComplete="current-password"
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
            Sign In
          </Button>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? 1 : 0,
            }}
          >
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    </>
  );
};

export default Login; 