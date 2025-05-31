import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpaIcon from '@mui/icons-material/Spa';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { motion } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      component={motion.div}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: scrolled 
          ? 'linear-gradient(135deg, rgba(255, 253, 250, 0.98), rgba(246, 242, 238, 0.98))'
          : 'linear-gradient(135deg, rgba(255, 253, 250, 0.95), rgba(246, 242, 238, 0.95))',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled 
          ? '0 4px 30px rgba(0, 0, 0, 0.1)'
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        borderBottom: '1px solid rgba(193, 127, 89, 0.2)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          height: scrolled ? '70px' : '80px',
          padding: { xs: '0 16px', md: '0 32px' },
          transition: 'all 0.3s ease'
        }}
      >
        {/* Menu Icon for Mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              display: { sm: 'none' },
              color: '#4A6741',
              '&:hover': {
                background: 'rgba(74, 103, 65, 0.12)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
        </motion.div>

        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flex: 1,
            justifyContent: 'center'
          }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <SpaIcon 
              sx={{ 
                color: '#4A6741',
                fontSize: { xs: '2rem', md: '2.5rem' },
                filter: 'drop-shadow(0 2px 4px rgba(74, 103, 65, 0.2))',
              }} 
            />
          </motion.div>

          <Typography
            variant="h5"
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2C3E50, #4A6741)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.8rem' },
              letterSpacing: '0.5px',
              position: 'relative',
              cursor: 'pointer',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '0%',
                height: '2px',
                background: 'linear-gradient(90deg, #4A6741, #C17F59)',
                transition: 'width 0.4s ease',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            AyurGuide - Digital Vedic Ayurveda
          </Typography>
        </motion.div>

        {/* Right Side Icons */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            display: 'flex', 
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {!isMobile && (
            <IconButton
              sx={{
                color: '#4A6741',
                '&:hover': {
                  background: 'rgba(74, 103, 65, 0.12)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <NotificationsIcon />
            </IconButton>
          )}

          <IconButton
            sx={{
              color: '#C17F59',
              background: 'rgba(193, 127, 89, 0.05)',
              '&:hover': {
                background: 'rgba(193, 127, 89, 0.12)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <AccountCircleIcon />
          </IconButton>

          <IconButton
            sx={{
              color: '#C17F59',
              background: 'rgba(193, 127, 89, 0.05)',
              '&:hover': {
                background: 'rgba(193, 127, 89, 0.12)',
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.6s ease',
            }}
          >
            <LocalFloristIcon sx={{ fontSize: '1.8rem' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
