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
import { signupSchema } from '../schemas/auth';
import axiosClient from '../api/axiosClient';
import { backendRoute } from '../api/routeList';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axiosClient.post(backendRoute.USER_SIGNUP, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      toast.success(response.data.message);
      navigate('/login');
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
      } else {
        // toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Creating your account..." />}
      <AuthLayout
        title="Create Account"
        subtitle="Sign up to get started"
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
            name="firstName"
            control={control}
            label="First Name"
            autoComplete="given-name"
            autoFocus
          />
          <TextFieldWrapper
            name="lastName"
            control={control}
            label="Last Name"
            autoComplete="family-name"
          />
          <TextFieldWrapper
            name="email"
            control={control}
            label="Email Address"
            autoComplete="email"
          />
          <PasswordField
            name="password"
            control={control}
            label="Password"
            autoComplete="new-password"
          />
          <PasswordField
            name="confirmPassword"
            control={control}
            label="Confirm Password"
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
            Sign Up
          </Button>
          <Box
            sx={{
              textAlign: 'center',
              mt: isMobile ? 2 : 1,
            }}
          >
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    </>
  );
};

export default Signup; 