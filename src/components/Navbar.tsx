import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Create Form', path: '/create' },
    { label: 'Preview Form', path: '/preview' },
    { label: 'My Forms', path: '/myforms' },
  ];

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            🧩 Form Builder
          </Typography>

          <Box>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                sx={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                  borderRadius: 0,
                }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Add top padding to avoid content being hidden behind the fixed Navbar */}
      <Box sx={{ paddingTop: '64px' }}>
        {/* Your page content goes here */}
      </Box>
    </>
  );
};

export default Navbar;
