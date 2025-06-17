import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Snackbar,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import { backendRoute } from '../api/routeList';
import PasswordField from '../components/form/PasswordField';

const schema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 25;

  // Character type checks
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;

  return strength;
};

const getStrengthColor = (strength) => {
  if (strength <= 25) return 'error';
  if (strength <= 50) return 'warning';
  if (strength <= 75) return 'info';
  return 'success';
};

const getStrengthText = (strength) => {
  if (strength <= 25) return 'Weak';
  if (strength <= 50) return 'Fair';
  if (strength <= 75) return 'Good';
  return 'Strong';
};

const ChangePassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const newPassword = watch('newPassword');

  React.useEffect(() => {
    setPasswordStrength(getPasswordStrength(newPassword));
  }, [newPassword]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axiosClient.post(backendRoute.CHANGE_PASSWORD, {
        password: data.newPassword,
      });

      toast.success('Password updated successfully');
      reset();
      setPasswordStrength(0);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50'
      }}
    >
      <Card
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 4,
              justifyContent: 'center'
            }}
          >
            <LockIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Change Password
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={1}>
              <PasswordField
                name="currentPassword"
                control={control}
                label="Current Password"
                fullWidth
              />

              <Box>
                <PasswordField
                  name="newPassword"
                  control={control}
                  label="New Password"
                  fullWidth
                />
                {newPassword && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mr: 1 }}
                      >
                        Password Strength:
                      </Typography>
                      <Typography
                        variant="caption"
                        color={`${getStrengthColor(passwordStrength)}.main`}
                        sx={{ fontWeight: 500 }}
                      >
                        {getStrengthText(passwordStrength)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      color={getStrengthColor(passwordStrength)}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'grey.200'
                      }}
                    />
                  </Box>
                )}
              </Box>

              <PasswordField
                name="confirmPassword"
                control={control}
                label="Confirm New Password"
                fullWidth
              />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    px: 4
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword; 