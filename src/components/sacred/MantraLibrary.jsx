// src/components/sacred/MantraLibrary.jsx
import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause, VolumeUp } from '@mui/icons-material';
import { mantraService } from '../../services/sacred/MantraService'; // Note the change in import

const MantraLibrary = () => {
  const [playing, setPlaying] = useState(false);
  const [currentMantra, setCurrentMantra] = useState(null);
  const [volume, setVolume] = useState(0.7);

  const mantras = [
    {
      id: 'om',
      name: 'Om',
      frequency: 432,
      duration: 60
    },
    {
      id: 'gayatri',
      name: 'Gayatri',
      frequency: 528,
      duration: 108
    }
  ];

  useEffect(() => {
    mantraService.initialize();
    return () => mantraService.cleanup();
  }, []);

  const handlePlay = (mantra) => {
    if (currentMantra === mantra.id && playing) {
      mantraService.stop();
      setPlaying(false);
    } else {
      mantraService.play(mantra.id, { volume });
      setCurrentMantra(mantra.id);
      setPlaying(true);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Sacred Mantras
      </Typography>
      <Grid container spacing={2}>
        {mantras.map((mantra) => (
          <Grid item xs={12} sm={6} key={mantra.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handlePlay(mantra)}
                  color="primary"
                >
                  {currentMantra === mantra.id && playing ? <Pause /> : <PlayArrow />}
                </IconButton>
                <Box>
                  <Typography variant="subtitle1">{mantra.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {mantra.frequency} Hz
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MantraLibrary;
