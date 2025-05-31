// src/components/chakra/info/ChakraTheory.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Grid 
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ChakraTheory = ({ chakra }) => {
  return (
    <Paper
      sx={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        p: 3,
        borderRadius: 2,
        border: `1px solid ${chakra.color}30`
      }}
    >
      <Typography variant="h5" sx={{ color: chakra.color, mb: 2 }}>
        {chakra.name} - Spiritual Theory
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: chakra.color, mb: 1 }}>
          Element & Deity
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, bgcolor: `${chakra.color}15` }}>
              <Typography variant="subtitle2" sx={{ color: chakra.color }}>
                Element: {chakra.element.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                {chakra.element.significance}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, bgcolor: `${chakra.color}15` }}>
              <Typography variant="subtitle2" sx={{ color: chakra.color }}>
                Deity: {chakra.deity.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                {chakra.deity.description}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3, bgcolor: chakra.color }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: chakra.color, mb: 1 }}>
          Psychological Aspects
        </Typography>
        <List>
          {chakra.psychologicalAspects.map((aspect, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ color: chakra.color }}>
                <FiberManualRecordIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={aspect} sx={{ color: '#fff' }} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: chakra.color, mb: 1 }}>
          Associated Stones
        </Typography>
        <Grid container spacing={1}>
          {chakra.stones.map((stone, index) => (
            <Grid item key={index}>
              <Paper
                sx={{
                  p: 1,
                  bgcolor: `${chakra.color}15`,
                  border: `1px solid ${chakra.color}30`
                }}
              >
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  {stone}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ChakraTheory;