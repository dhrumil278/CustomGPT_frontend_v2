import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingOverlay = ({ message = 'Please wait...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(234, 239, 239, 0.8)', // Using our theme color with opacity
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: '#333446', // Using our primary color
          mb: 2,
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: '#333446',
          fontWeight: 500,
          textAlign: 'center',
          px: 2,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingOverlay; 