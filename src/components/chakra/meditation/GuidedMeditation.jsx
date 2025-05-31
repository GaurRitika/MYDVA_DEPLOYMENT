// src/components/chakra/meditation/GuidedMeditation.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

const GuidedMeditation = ({ chakra, isActive, onComplete }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    {
      instruction: "Find a comfortable position and close your eyes",
      duration: 10000
    },
    {
      instruction: "Focus on your breath",
      duration: 15000
    },
    {
      instruction: `Direct your attention to your ${chakra.position}`,
      duration: 20000
    },
    {
      instruction: `Visualize the color ${chakra.color} glowing brightly`,
      duration: 20000
    },
    {
      instruction: `Chant the mantra "${chakra.mantra}" with each exhale`,
      duration: 30000
    }
  ];

  useEffect(() => {
    if (isActive && stage < stages.length) {
      const timer = setTimeout(() => {
        if (stage === stages.length - 1) {
          onComplete();
        } else {
          setStage(prev => prev + 1);
        }
      }, stages[stage].duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, stage, stages.length, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 40,
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          zIndex: 10
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: chakra.color,
            textShadow: `0 0 10px ${chakra.color}`,
            mb: 2
          }}
        >
          {stages[stage].instruction}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(stage / stages.length) * 100}
          sx={{
            width: 300,
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: chakra.color,
              borderRadius: 4
            }
          }}
        />
      </Box>
    </motion.div>
  );
};

export default GuidedMeditation;