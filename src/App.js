


import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

// Import components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import HerbalRemedy from './pages/HerbalRemedy';
import DoshaAnalysis from './pages/DoshaAnalysis';
import PersonalConsultation from './pages/PersonalConsultation';
import MyHome from './pages/MyHome';
import Login from './pages/Login';
import Register from './pages/Register';
import AyurvedicCenters from './pages/AyurvedicCentres';
import AyurvedaEducation from './pages/Education/AyurvedaEducation';
import ChakraExplorer from './pages/ChakraExplorer';
import ExpertTalk from './pages/ExpertTalk';
import ChakraPage from './components/chakra/ChakraPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A6741',
      light: '#7B9971',
      dark: '#2F442A',
    },
    secondary: {
      main: '#C17F59',
      light: '#E2A984',
      dark: '#8B5E3C',
    },
    background: {
      default: '#F5F1E8',
      paper: '#FDFAF3',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D4037',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Poppins", sans-serif',
    h1: {
      fontFamily: 'Playfair Display',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Playfair Display',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'Poppins',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Layout component for protected routes
const ProtectedLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', background: '#F5F1E8' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          paddingTop: '80px',
          paddingX: { xs: 2, sm: 4, md: 6 },
          background: 'linear-gradient(135deg, #F5F1E8 0%, #FDFAF3 100%)',
          backgroundImage: `
            radial-gradient(circle at 100% 100%, rgba(193, 127, 89, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 0% 0%, rgba(74, 103, 65, 0.05) 0%, transparent 50%)
          `,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MyHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route
                    element={<ProtectedLayout />}
                  >
                    <Route index element={<Home />} />
                    <Route path="dosha-analysis" element={<DoshaAnalysis />} />
                    <Route path="consultation" element={<PersonalConsultation />} />
                    <Route path="herbal-remedy" element={<HerbalRemedy />} />
                    <Route path="centers" element={<AyurvedicCenters />} />
                    <Route path="education" element={<AyurvedaEducation />} />
                    <Route path="chakras" element={<ChakraExplorer />} />
                    <Route path="expert-talk" element={<ExpertTalk />} />
                  </Route>
                  
                  {/* Full screen route */}
                  <Route path="chakras/:chakraId" element={<ChakraPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}



export default App;
 