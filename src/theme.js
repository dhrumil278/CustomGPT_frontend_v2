import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333446',
      light: '#484957',
      dark: '#252635',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7F8CAA',
      light: '#99A3BC',
      dark: '#677390',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff',
    },
    background: {
      default: '#EAEFEF',
      paper: '#fff',
      surface: '#B8CFCE',
    },
    text: {
      primary: '#333446',
      secondary: '#666874',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
      color: '#333446',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.334,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      color: '#666874',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.9375rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          fontSize: '0.9375rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(51, 52, 70, 0.12)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(51, 52, 70, 0.08)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(51, 52, 70, 0.12)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: 'rgba(51, 52, 70, 0.2)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: '#333446',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#333446',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 16px rgba(51, 52, 70, 0.08)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(51, 52, 70, 0.12)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#7F8CAA',
          textDecoration: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            color: '#333446',
          },
        },
      },
    },
  },
});

export default theme; 