// src/components/sacred/SacredPracticeHub.jsx
import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import MantraLibrary from './MantraLibrary';

const SacredPracticeHub = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Sacred Practice Hub
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px', bgcolor: 'rgba(74, 103, 65, 0.1)' }}>
            <Typography variant="h6" gutterBottom>
              Sacred Geometry
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <MantraLibrary />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SacredPracticeHub;
