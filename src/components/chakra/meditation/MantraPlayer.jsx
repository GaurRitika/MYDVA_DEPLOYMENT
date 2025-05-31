// src/components/chakra/meditation/MantraPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  IconButton,
  Paper,
  Grid 
} from '@mui/material';
import { motion } from 'framer-motion';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const MantraPlayer = ({ chakra, onPlayStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [visualizerData, setVisualizerData] = useState(Array(32).fill(0));
  const audioRef = useRef(null);

  useEffect(() => {
    const updateVisualizer = () => {
      if (isPlaying) {
        const newData = Array(32).fill(0).map(() => 
          Math.random() * (isPlaying ? 1 : 0.1)
        );
        setVisualizerData(newData);
        requestAnimationFrame(updateVisualizer);
      }
    };

    if (isPlaying) {
      updateVisualizer();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    onPlayStateChange(!isPlaying);
  };

  return (
    <Box
      sx={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        p: 2,
        border: `1px solid ${chakra.color}30`
      }}
    >
      <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
        Sacred Mantra: {chakra.mantra}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton 
          onClick={togglePlay}
          sx={{ 
            color: chakra.color,
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <VolumeUpIcon sx={{ color: chakra.color, mr: 1 }} />
          <Slider
            value={volume}
            onChange={(_, newValue) => setVolume(newValue)}
            sx={{
              width: 100,
              color: chakra.color,
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 8px ${chakra.color}40`
                }
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
        {visualizerData.map((value, index) => (
          <motion.div
            key={index}
            animate={{ height: `${value * 100}%` }}
            transition={{ duration: 0.1 }}
            style={{
              flex: 1,
              backgroundColor: chakra.color,
              opacity: 0.7,
              borderRadius: '4px 4px 0 0'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MantraPlayer;