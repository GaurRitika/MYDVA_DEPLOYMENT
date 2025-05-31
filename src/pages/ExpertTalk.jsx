// src/pages/ExpertTalk.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Tab,
  Tabs,
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ExpertList from '../components/ExpertTalk/ExpertList';
import BookingModal from '../components/ExpertTalk/BookingModal';
import VideoConsultation from '../components/ExpertTalk/VideoConsultation';
import ExpertSchedule from '../components/ExpertTalk/ExpertSchedule';
import HealthRecords from '../components/ExpertTalk/HealthRecords';
import ConsultationHistory from '../components/ExpertTalk/ConsultationHistory';
import DemoVideoCall from '../components/ExpertTalk/DemoVideoCall';

const ExpertTalk = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVideoSessionActive, setIsVideoSessionActive] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');

  // Check for room ID in URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    if (roomId) {
      setJoinRoomId(roomId);
      setSelectedExpert({ id: 'join', isDemoCall: true, roomId });
      setActiveTab(1);
      setIsVideoSessionActive(true);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert);
    if (expert.isDemoCall) {
      setActiveTab(1);
      setIsVideoSessionActive(true);
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleJoinRoom = () => {
    if (joinRoomId) {
      setShowJoinRoom(false);
      setSelectedExpert({ 
        id: 'join', 
        isDemoCall: true, 
        roomId: joinRoomId,
        name: 'Joined Session'
      });
      setActiveTab(1);
      setIsVideoSessionActive(true);
    }
  };

  const handleEndConsultation = () => {
    setIsVideoSessionActive(false);
    setSelectedExpert(null);
    setActiveTab(0);
    // Clear room ID from URL if it exists
    if (window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={0} sx={{ mb: 3, p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Expert Ayurvedic Consultations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Connect with experienced Ayurvedic practitioners for personalized guidance
        </Typography>
      </Paper>

      <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Find Experts" />
          <Tab label="Active Consultations" />
          <Tab label="Health Records" />
          <Tab label="History" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Box hidden={activeTab !== 0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Alert severity="info" sx={{ flex: 1, mr: 2 }}>
                Try our demo video consultation feature to experience the platform's capabilities.
              </Alert>
              <Button 
                variant="outlined" 
                onClick={() => setShowJoinRoom(true)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Join Room
              </Button>
            </Box>
            <ExpertList onExpertSelect={handleExpertSelect} />
          </Box>

          <Box hidden={activeTab !== 1}>
            {isVideoSessionActive ? (
              selectedExpert?.isDemoCall ? (
                <DemoVideoCall 
                  expert={selectedExpert}
                  onEndCall={handleEndConsultation}
                  roomId={selectedExpert.roomId}
                />
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <VideoConsultation 
                      expert={selectedExpert}
                      onEndSession={handleEndConsultation}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ExpertSchedule expert={selectedExpert} />
                  </Grid>
                </Grid>
              )
            ) : (
              <Typography variant="h6" align="center" color="text.secondary" sx={{ py: 8 }}>
                No active consultation. Select an expert to begin or join a room.
              </Typography>
            )}
          </Box>

          <Box hidden={activeTab !== 2}>
            <HealthRecords />
          </Box>

          <Box hidden={activeTab !== 3}>
            <ConsultationHistory />
          </Box>
        </Box>
      </Paper>

      <BookingModal
        open={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={selectedExpert}
        onBookingConfirm={() => {
          setIsBookingModalOpen(false);
          setIsVideoSessionActive(true);
          setActiveTab(1);
        }}
      />

      <Dialog 
        open={showJoinRoom} 
        onClose={() => setShowJoinRoom(false)}
        PaperProps={{
          sx: { width: '100%', maxWidth: 400 }
        }}
      >
        <DialogTitle>Join Consultation Room</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the room ID shared with you to join the consultation.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Room ID"
            fullWidth
            variant="outlined"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            placeholder="Enter room ID here"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJoinRoom(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleJoinRoom}
            variant="contained"
            disabled={!joinRoomId}
          >
            Join Room
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpertTalk;
