import React from 'react';
import { Box } from '@mui/material';

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        background: 'linear-gradient(45deg, #EAEFEF 0%, #B8CFCE 100%)',
        zIndex: -1,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(127, 140, 170, 0.1)',
          animation: 'float 20s infinite linear',
        },
        '&::before': {
          top: '-100px',
          right: '-100px',
          animation: 'float 25s infinite linear',
        },
        '&::after': {
          bottom: '-100px',
          left: '-100px',
          width: '700px',
          height: '700px',
          background: 'rgba(51, 52, 70, 0.1)',
          animation: 'float 30s infinite linear reverse',
        },
        '@keyframes float': {
          '0%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '33%': {
            transform: 'translate(100px, 100px) rotate(120deg)',
          },
          '66%': {
            transform: 'translate(-50px, 50px) rotate(240deg)',
          },
          '100%': {
            transform: 'translate(0, 0) rotate(360deg)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '45%',
          width: '300px',
          height: '300px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: 'rgba(184, 207, 206, 0.2)',
          animation: 'morphing 15s infinite linear',
          '@keyframes morphing': {
            '0%': {
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              transform: 'rotate(0deg)',
            },
            '50%': {
              borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
              transform: 'rotate(180deg)',
            },
            '100%': {
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              transform: 'rotate(360deg)',
            },
          },
        }}
      />
    </Box>
  );
};

export default AnimatedBackground; 