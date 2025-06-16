import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid
} from '@mui/material';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordField from '../components/form/PasswordField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Add your API call here
      toast.success('Password updated successfully');
      reset();
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PasswordField
                name="currentPassword"
                control={control}
                label="Current Password"
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                name="newPassword"
                control={control}
                label="New Password"
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                name="confirmPassword"
                control={control}
                label="Confirm New Password"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  Update Password
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default ChangePassword; 