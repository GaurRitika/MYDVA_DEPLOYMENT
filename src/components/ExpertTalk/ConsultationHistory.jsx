// src/components/ExpertTalk/ConsultationHistory.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  Button,
  Divider
} from '@mui/material';
import {
  VideocamOutlined,
  PhoneOutlined,
  ChatOutlined,
  FileDownloadOutlined,
  AccessTime
} from '@mui/icons-material';

const consultations = [
  {
    id: 1,
    expert: {
      name: "Dr. Ayush Sharma",
      image: "https://example.com/expert1.jpg",
      specialization: "Vata Dosha Specialist"
    },
    date: "2024-12-12",
    time: "10:00 AM",
    duration: "45 mins",
    type: "video",
    status: "completed",
    prescription: true,
    notes: "Follow-up required in 2 weeks"
  },
  {
    id: 2,
    expert: {
      name: "Dr. Priya Patel",
      image: "https://example.com/expert2.jpg",
      specialization: "Pitta Dosha Expert"
    },
    date: "2024-12-10",
    time: "2:30 PM",
    duration: "30 mins",
    type: "audio",
    status: "completed",
    prescription: true,
    notes: "Diet plan provided"
  }
];

const ConsultationHistory = () => {
  const getConsultationTypeIcon = (type) => {
    switch(type) {
      case 'video':
        return <VideocamOutlined />;
      case 'audio':
        return <PhoneOutlined />;
      case 'chat':
        return <ChatOutlined />;
      default:
        return <VideocamOutlined />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Consultation History
      </Typography>

      {consultations.map((consultation) => (
        <Paper
          key={consultation.id}
          sx={{
            p: 3,
            mb: 2,
            '&:hover': {
              boxShadow: 3,
              transition: 'box-shadow 0.3s ease-in-out'
            }
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={consultation.expert.image}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">
                    {consultation.expert.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {consultation.expert.specialization}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Chip
                  icon={getConsultationTypeIcon(consultation.type)}
                  label={consultation.type}
                  size="small"
                />
                <Chip
                  label={consultation.status}
                  color={getStatusColor(consultation.status)}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, my: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2">
                    {consultation.date} at {consultation.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Duration: {consultation.duration}
                </Typography>
              </Box>

              {consultation.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Notes: {consultation.notes}
                </Typography>
              )}

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                {consultation.prescription && (
                  <Button
                    size="small"
                    startIcon={<FileDownloadOutlined />}
                    variant="outlined"
                  >
                    Download Prescription
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                >
                  View Details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {consultations.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No consultation history available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your past consultations will appear here
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ConsultationHistory;
