// src/components/sacred/SacredMeditation.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  VolumeUp,
  Favorite,
  Timer,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MantraService from '../../services/sacred/MantraService';

const meditationExercises = [
  {
    id: 'chakraAlignment',
    name: 'Chakra Alignment',
    duration: 15,
    description: 'Align and balance your chakras through sacred geometry visualization',
    mantra: 'om',
    geometry: 'sriYantra'
  },
  {
    id: 'cosmicConnection',
    name: 'Cosmic Connection',
    duration: 20,
    description: 'Connect with universal consciousness through sacred patterns',
    mantra: 'gayatri',
    geometry: 'flowerOfLife'
  },
  // Add more exercises...
];

const SacredMeditation = () => {
  const [activeExercise, setActiveExercise] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && activeExercise) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + (100 / (activeExercise.duration * 60));
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeExercise]);

  const handleStart = (exercise) => {
    setActiveExercise(exercise);
    setProgress(0);
    setIsPlaying(true);
    MantraService.play(exercise.mantra, { volume: 0.5 });
  };

  const handlePause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      MantraService.pause();
    } else {
      MantraService.resume();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sacred Meditation Exercises
      </Typography>

      <Grid container spacing={4}>
        {meditationExercises.map((exercise) => (
          <Grid item xs={12} md={6} key={exercise.id}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              sx={{
                bgcolor: 'rgba(74, 103, 65, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {exercise.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {exercise.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Timer />
                  <Typography variant="body2">
                    {exercise.duration} minutes
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleStart(exercise)}
                >
                  Begin Practice
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Paper
              elevation={3}
              sx={{
                position: 'fixed',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: 600,
                p: 2,
                bgcolor: 'rgba(47, 68, 42, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1, color: '#F5F1E8' }}>
                  {activeExercise.name}
                </Typography>
                <IconButton onClick={handlePause} sx={{ color: '#F5F1E8' }}>
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(245, 241, 232, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#F5F1E8',
                  },
                }}
              />
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SacredMeditation;
