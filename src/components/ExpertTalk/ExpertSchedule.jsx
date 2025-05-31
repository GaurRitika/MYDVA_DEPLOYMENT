// src/components/ExpertTalk/ExpertSchedule.jsx
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Button,
//   Chip,
  Divider
} from '@mui/material';
// import { CalendarMonth, AccessTime } from '@mui/icons-material';

const ExpertSchedule = ({ expert }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const timeSlots = [
    { time: '09:00', status: 'available' },
    { time: '10:00', status: 'booked' },
    { time: '11:00', status: 'available' },
    { time: '14:00', status: 'available' },
    { time: '15:00', status: 'available' },
    { time: '16:00', status: 'booked' }
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Schedule
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1}>
          {generateWeekDates().map((date) => (
            <Grid item key={date.toISOString()}>
              <Button
                variant={selectedDate.toDateString() === date.toDateString() ? 'contained' : 'outlined'}
                onClick={() => setSelectedDate(date)}
                sx={{ minWidth: '45px', flexDirection: 'column', p: 1 }}
              >
                <Typography variant="caption">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Typography>
                <Typography>
                  {date.getDate()}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Available Slots
        </Typography>
        <Grid container spacing={1}>
          {timeSlots.map((slot) => (
            <Grid item xs={6} key={slot.time}>
              <Button
                fullWidth
                variant="outlined"
                disabled={slot.status === 'booked'}
                sx={{
                  borderColor: slot.status === 'booked' ? 'grey.300' : 'primary.main',
                  color: slot.status === 'booked' ? 'grey.500' : 'primary.main'
                }}
              >
                {slot.time}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ExpertSchedule;
