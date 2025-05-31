// src/components/chakra/components/ChakraInfoPanel.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs,
  Tab,
  Divider,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ChakraInfoPanel = ({ chakra, isPlaying, onPlayClick, loading }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Paper
        elevation={24}
        sx={{
          position: 'absolute',
          right: 40,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '400px',
          maxHeight: '80vh',
          overflowY: 'auto',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${chakra.color}30`,
          borderRadius: '20px',
          padding: 4,
          color: '#fff',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: chakra.color,
            borderRadius: '4px'
          }
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: chakra.color,
            fontFamily: '"Playfair Display", serif',
            textAlign: 'center',
            mb: 2,
            textShadow: `0 0 10px ${chakra.color}50`
          }}
        >
          {chakra.name}
        </Typography>

        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: '#fff' },
            '& .Mui-selected': { color: chakra.color },
            '& .MuiTabs-indicator': { backgroundColor: chakra.color }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Spiritual" />
          <Tab label="Practice" />
        </Tabs>

        <AnimatePresence mode='wait'>
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Position & Element
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: `${chakra.color}15` }}>
                      <Typography variant="subtitle2" sx={{ color: chakra.color }}>
                        Position
                      </Typography>
                      <Typography>{chakra.position}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: `${chakra.color}15` }}>
                      <Typography variant="subtitle2" sx={{ color: chakra.color }}>
                        Element
                      </Typography>
                      <Typography>{chakra.element.name}</Typography>
                      <Typography variant="caption">
                        {chakra.element.significance}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Sacred Sound
                </Typography>
                <Paper sx={{ p: 2, bgcolor: `${chakra.color}15` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: chakra.color }}>
                        Mantra
                      </Typography>
                      <Typography variant="h5">{chakra.mantra}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: chakra.color }}>
                        Frequency
                      </Typography>
                      <Typography>{chakra.frequency}</Typography>
                    </Box>
                    <IconButton 
                      onClick={onPlayClick}
                      sx={{ color: chakra.color }}
                    >
                      {isPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </IconButton>
                  </Box>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Associated Stones
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {chakra.stones.map((stone, index) => (
                    <Chip 
                      key={index}
                      label={stone}
                      sx={{
                        bgcolor: `${chakra.color}15`,
                        color: '#fff',
                        border: `1px solid ${chakra.color}30`
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Spiritual Significance
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {chakra.spiritualMeaning}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Deity Association
                </Typography>
                <Paper sx={{ p: 2, bgcolor: `${chakra.color}15` }}>
                  <Typography variant="subtitle1" sx={{ color: chakra.color }}>
                    {chakra.deity.name}
                  </Typography>
                  <Typography>
                    {chakra.deity.description}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Psychological Aspects
                </Typography>
                <List>
                  {chakra.psychologicalAspects.map((aspect, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ color: chakra.color }}>
                        <FiberManualRecordIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={aspect} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Sacred Practices
                </Typography>
                {chakra.practices.map((practice, index) => (
                  <Paper 
                    key={index}
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      bgcolor: `${chakra.color}15`,
                      border: `1px solid ${chakra.color}30`
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: chakra.color }}>
                      {practice.name}
                    </Typography>
                    <Typography>
                      {practice.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                  Healing Properties
                </Typography>
                <Typography>
                  {chakra.healingProperties}
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
};

export default ChakraInfoPanel;
