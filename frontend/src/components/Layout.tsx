import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { isAuthenticated, logout } from '../services/auth';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box
            component="img"
            src="/broker-name.png.png"
            alt="Broker Store Logo"
            sx={{
              height: 40,
              mr: 2,
            }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 600 }}>
            Broker Store
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          {isAuthenticated() ? (
            <>
              <Button
                component={RouterLink}
                to="/dashboard"
                color="primary"
                variant="contained"
                sx={{ mr: 2 }}
              >
                Dashboard
              </Button>
              <Button
                onClick={logout}
                color="inherit"
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              color="primary"
              variant="contained"
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Broker Store. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
} 