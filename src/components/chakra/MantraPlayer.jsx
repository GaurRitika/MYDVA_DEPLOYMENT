// src/components/chakra/MantraPlayer.jsx

import React from 'react';
import { Howl } from 'howler';
import { Box, Button } from '@mui/material';

const MantraPlayer = ({ audioUrl }) => {
  const sound = new Howl({ src: [audioUrl], loop: true });

  const handlePlay = () => sound.play();
  const handleStop = () => sound.stop();

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handlePlay}>
        Play Mantra
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleStop} sx={{ ml: 2 }}>
        Stop Mantra
      </Button>
    </Box>
  );
};

export default MantraPlayer;
