import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AnimatedBackground from './AnimatedBackground';

const AuthLayout = ({ children, title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        py: 3,
      }}
    >
      <AnimatedBackground />
      <Container maxWidth="sm">
        <Paper
          elevation={isMobile ? 0 : 6}
          sx={{
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: { xs: 2, sm: 3 },
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
            '&:hover': {
              transform: isMobile ? 'none' : 'translateY(-5px)',
              boxShadow: isMobile ? 'none' : theme.shadows[10],
            },
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              textAlign: 'center',
              mb: subtitle ? 1 : 3,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                mb: 3,
                maxWidth: '80%',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          )}
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout; 