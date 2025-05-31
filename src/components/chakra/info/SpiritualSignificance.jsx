// src/components/chakra/info/SpiritualSignificance.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Divider 
} from '@mui/material';
import { motion } from 'framer-motion';

const SpiritualSignificance = ({ chakra }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          p: 3,
          borderRadius: 2,
          border: `1px solid ${chakra.color}30`,
          color: '#fff'
        }}
      >
        <Typography variant="h5" sx={{ color: chakra.color, mb: 3 }}>
          Spiritual Significance
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {chakra.spiritualMeaning}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, bgcolor: `${chakra.color}50` }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
            Sacred Practices
          </Typography>
          <Grid container spacing={2}>
            {chakra.practices.map((practice, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: `${chakra.color}15`,
                    border: `1px solid ${chakra.color}30`,
                    height: '100%'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ color: chakra.color, mb: 1 }}
                  >
                    {practice.name}
                  </Typography>
                  <Typography variant="body2">
                    {practice.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
            Healing Properties
          </Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: `${chakra.color}15`,
              border: `1px solid ${chakra.color}30`
            }}
          >
            <Typography variant="body1">
              {chakra.healingProperties}
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default SpiritualSignificance;