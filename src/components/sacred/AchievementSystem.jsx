// src/components/sacred/AchievementSystem.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Badge,
  IconButton,
  Dialog,
  DialogContent,
  Slide,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  Timer,
  Favorite,
  Psychology,
  TrendingUp,
  Close,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const achievements = [
  {
    id: 'beginner',
    title: 'Sacred Initiate',
    description: 'Complete your first meditation session',
    icon: <Timer />,
    requirement: 1,
    type: 'sessions',
    reward: 'Access to basic sacred geometries',
  },
  {
    id: 'consistent',
    title: 'Rhythm of the Universe',
    description: 'Maintain a 7-day practice streak',
    icon: <TrendingUp />,
    requirement: 7,
    type: 'streak',
    reward: 'Unlock advanced sound frequencies',
  },
  {
    id: 'chakra-master',
    title: 'Chakra Harmonizer',
    description: 'Balance all chakras above 70%',
    icon: <Favorite />,
    requirement: 70,
    type: 'chakra',
    reward: 'Access to chakra-specific meditations',
  },
  {
    id: 'meditation-adept',
    title: 'Meditation Adept',
    description: 'Complete 50 meditation sessions',
    icon: <Psychology />,
    requirement: 50,
    type: 'sessions',
    reward: 'Unlock advanced visualization patterns',
  },
  // Add more achievements...
];

const AchievementCard = ({ achievement, progress, onUnlock }) => {
  const percentage = Math.min((progress / achievement.requirement) * 100, 100);
  const isUnlocked = percentage === 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card
        sx={{
          bgcolor: isUnlocked ? 'rgba(74, 103, 65, 0.2)' : 'rgba(26, 26, 26, 0.9)',
          color: '#F5F1E8',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Badge
              badgeContent={isUnlocked ? '✓' : null}
              color="success"
            >
              {achievement.icon}
            </Badge>
            <Typography variant="h6">{achievement.title}</Typography>
          </Box>

          <Typography variant="body2" paragraph>
            {achievement.description}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(245, 241, 232, 0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: isUnlocked ? '#4A6741' : '#8BA888',
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">
              {Math.floor(progress)}/{achievement.requirement}
            </Typography>
            <Typography variant="body2">
              {Math.floor(percentage)}%
            </Typography>
          </Box>

          {isUnlocked && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{
                mt: 2,
                p: 1,
                borderRadius: 1,
                bgcolor: 'rgba(74, 103, 65, 0.2)',
              }}
            >
              <Typography variant="body2">
                Reward: {achievement.reward}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AchievementSystem = () => {
  const dispatch = useDispatch();
  const { meditationProgress, chakraBalances } = useSelector(state => state.sacred);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  useEffect(() => {
    checkAchievements();
  }, [meditationProgress, chakraBalances]);

  const checkAchievements = () => {
    achievements.forEach(achievement => {
      const progress = calculateProgress(achievement);
      if (progress >= achievement.requirement) {
        handleAchievementUnlock(achievement);
      }
    });
  };

  const calculateProgress = (achievement) => {
    switch (achievement.type) {
      case 'sessions':
        return meditationProgress.sessions.length;
      case 'streak':
        return calculateStreak();
      case 'chakra':
        return Math.min(...Object.values(chakraBalances));
      default:
        return 0;
    }
  };

  const calculateStreak = () => {
    let streak = 0;
    const currentDate = new Date('2024-12-11 18:54:50');
    let checkDate = new Date(currentDate);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasPractice = meditationProgress.sessions.some(
        session => session.timestamp.startsWith(dateStr)
      );

      if (!hasPractice) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  const handleAchievementUnlock = (achievement) => {
    setUnlockedAchievement(achievement);
    setShowUnlockDialog(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sacred Achievements
      </Typography>

      <Grid container spacing={3}>
        {achievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <AchievementCard
              achievement={achievement}
              progress={calculateProgress(achievement)}
              onUnlock={() => handleAchievementUnlock(achievement)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={showUnlockDialog}
        onClose={() => setShowUnlockDialog(false)}
        TransitionComponent={Slide}
      >
        <DialogContent
          sx={{
            bgcolor: '#1a1a1a',
            color: '#F5F1E8',
            textAlign: 'center',
            p: 4,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <EmojiEvents sx={{ fontSize: 60, color: '#4A6741', mb: 2 }} />
          </motion.div>

          <Typography variant="h5" gutterBottom>
            Achievement Unlocked!
          </Typography>

          {unlockedAchievement && (
            <>
              <Typography variant="h6" color="primary" gutterBottom>
                {unlockedAchievement.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {unlockedAchievement.description}
              </Typography>
              <Typography variant="body2" color="primary">
                Reward: {unlockedAchievement.reward}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AchievementSystem;
