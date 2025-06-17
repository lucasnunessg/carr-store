import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c9a84e', // Dourado elegante
      light: '#d4b86a',
      dark: '#b08c2e',
      contrastText: '#1a1f36',
    },
    secondary: {
      main: '#1a1f36', // Azul escuro
      light: '#2a2f46',
      dark: '#0a0f26',
      contrastText: '#f5f5f5',
    },
    background: {
      default: '#f5f5f5', // Cinza claro
      paper: '#ffffff',
    },
    text: {
      primary: '#3c3c3c', // Cinza escuro
      secondary: '#666666',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#1a1f36',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1a1f36',
    },
    h2: {
      fontWeight: 600,
      color: '#1a1f36',
    },
    h3: {
      fontWeight: 600,
      color: '#1a1f36',
    },
    h4: {
      fontWeight: 600,
      color: '#1a1f36',
    },
    h5: {
      fontWeight: 500,
      color: '#1a1f36',
    },
    h6: {
      fontWeight: 500,
      color: '#1a1f36',
    },
    subtitle1: {
      color: '#3c3c3c',
    },
    subtitle2: {
      color: '#3c3c3c',
    },
    body1: {
      color: '#3c3c3c',
    },
    body2: {
      color: '#3c3c3c',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#c9a84e',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#c9a84e',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1f36',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1f36',
          color: '#f5f5f5',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(201, 168, 78, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(201, 168, 78, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(201, 168, 78, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        colorPrimary: {
          backgroundColor: '#c9a84e',
          color: '#1a1f36',
          '&:hover': {
            backgroundColor: '#b08c2e',
          },
        },
      },
    },
  },
});

export default theme; 