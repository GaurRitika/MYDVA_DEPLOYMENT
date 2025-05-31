// // src/components/ExpertTalk/DemoVideoCall.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   Grid, 
//   Button, 
//   Box, 
//   Typography, 
//   Paper,
//   Alert,
//   Divider,
//   TextField,
//   Snackbar,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import { 
//   ContentCopy, 
//   Share, 
//   CheckCircle,
//   Error as ErrorIcon
// } from '@mui/icons-material';
// import VideoConsultation from './VideoConsultation';

// const DemoVideoCall = ({ expert, onEndCall, roomId: providedRoomId }) => {
//   const [isDemoStarted, setIsDemoStarted] = useState(false);
//   const [roomId, setRoomId] = useState(providedRoomId || '');
//   const [showCopyAlert, setShowCopyAlert] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('waiting');

//   useEffect(() => {
//     if (providedRoomId) {
//       setRoomId(providedRoomId);
//     } else {
//       setRoomId(`demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
//     }
//   }, [providedRoomId]);

//   const getShareableLink = () => {
//     return `${window.location.origin}/dashboard/expert-talk?room=${roomId}`;
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(getShareableLink());
//     setShowCopyAlert(true);
//   };

//   const handleCopyRoomId = () => {
//     navigator.clipboard.writeText(roomId);
//     setShowCopyAlert(true);
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: 'Join my Ayurvedic Consultation',
//           text: `Join my consultation session. Room ID: ${roomId}`,
//           url: getShareableLink()
//         });
//       } catch (err) {
//         console.error('Error sharing:', err);
//         handleCopyLink();
//       }
//     } else {
//       handleCopyLink();
//     }
//   };

//   return (
//     <Box>
//       {!isDemoStarted ? (
//         <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
//           <Typography variant="h5" gutterBottom color="primary">
//             Video Consultation Room
//           </Typography>
          
//           <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
//             {providedRoomId ? 
//               'You are joining an existing consultation session.' :
//               'Share this room ID with someone to start a video consultation.'}
//           </Alert>

//           <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
//             <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//               Room ID
//             </Typography>
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center',
//               gap: 1 
//             }}>
//               <Typography variant="h6" component="div" sx={{ 
//                 fontFamily: 'monospace',
//                 bgcolor: 'background.paper',
//                 p: 1,
//                 borderRadius: 1,
//                 border: '1px dashed',
//                 borderColor: 'divider'
//               }}>
//                 {roomId}
//               </Typography>
//               <Tooltip title="Copy Room ID">
//                 <IconButton onClick={handleCopyRoomId} size="small">
//                   <ContentCopy />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>

//           {!providedRoomId && (
//             <Box sx={{ mb: 3 }}>
//               <Typography variant="subtitle1" gutterBottom>
//                 Share this room with others
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
//                 <Button
//                   variant="outlined"
//                   startIcon={<ContentCopy />}
//                   onClick={handleCopyLink}
//                 >
//                   Copy Link
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<Share />}
//                   onClick={handleShare}
//                 >
//                   Share
//                 </Button>
//               </Box>
//             </Box>
//           )}

//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             onClick={() => setIsDemoStarted(true)}
//             sx={{ mt: 2 }}
//           >
//             {providedRoomId ? 'Join Consultation' : 'Start Consultation'}
//           </Button>
//         </Paper>
//       ) : (
//         <Box>
//           <Paper sx={{ p: 2, mb: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Typography variant="subtitle1">
//                   Room ID: {roomId}
//                 </Typography>
//                 <Tooltip title="Copy Room ID">
//                   <IconButton onClick={handleCopyRoomId} size="small">
//                     <ContentCopy fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 {connectionStatus === 'connected' ? (
//                   <Tooltip title="Connected">
//                     <CheckCircle color="success" />
//                   </Tooltip>
//                 ) : connectionStatus === 'error' ? (
//                   <Tooltip title="Connection Error">
//                     <ErrorIcon color="error" />
//                   </Tooltip>
//                 ) : (
//                   <Typography variant="body2" color="text.secondary">
//                     Waiting for others to join...
//                   </Typography>
//                 )}
//               </Box>
//             </Box>
//           </Paper>

//           <VideoConsultation
//             expert={expert}
//             roomId={roomId}
//             isInitiator={!providedRoomId}
//             onEndSession={() => {
//               setIsDemoStarted(false);
//               if (onEndCall) onEndCall();
//             }}
//             onConnectionStatusChange={setConnectionStatus}
//           />
//         </Box>
//       )}

//       <Snackbar
//         open={showCopyAlert}
//         autoHideDuration={3000}
//         onClose={() => setShowCopyAlert(false)}
//         message="Copied to clipboard"
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       />
//     </Box>
//   );
// };

// export default DemoVideoCall;


// src/components/ExpertTalk/DemoVideoCall.jsx
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Paper,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  ContentCopy, 
  Share, 
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import VideoConsultation from './VideoConsultation';

const DemoVideoCall = ({ expert, onEndCall, roomId: providedRoomId }) => {
  const [isDemoStarted, setIsDemoStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('waiting');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (providedRoomId) {
      setRoomId(providedRoomId);
      setIsJoining(true);
    } else {
      // Generate a unique room ID
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setRoomId(uniqueId);
    }
  }, [providedRoomId]);

  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/dashboard/expert-talk?room=${roomId}`;
  };

  const handleCopyLink = () => {
    const link = getShareableLink();
    navigator.clipboard.writeText(link).then(() => {
      setShowCopyAlert(true);
    }).catch(() => {
      setError('Failed to copy link');
    });
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setShowCopyAlert(true);
    }).catch(() => {
      setError('Failed to copy room ID');
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join Ayurvedic Consultation',
      text: `Join my consultation session with ${expert?.name}`,
      url: getShareableLink()
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleConnectionStatusChange = (status) => {
    setConnectionStatus(status);
    if (status === 'error') {
      setError('Connection failed. Please try again.');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'success.main';
      case 'waiting':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'grey.500';
    }
  };

  const renderStatusMessage = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'waiting':
        return 'Waiting for participant...';
      case 'error':
        return 'Connection failed';
      default:
        return 'Initializing...';
    }
  };

  // In DemoVideoCall.jsx, add this function:
const openTestWindow = () => {
    const joinUrl = `${window.location.origin}/dashboard/expert-talk?room=${roomId}`;
    window.open(joinUrl, '_blank', 'width=800,height=600');
  };
  
  // Add this button near your other buttons:
  <Button
    variant="outlined"
    onClick={openTestWindow}
    sx={{ mt: 2 }}
  >
    Open Test Window
  </Button>
  

  return (
    <Box>
      {!isDemoStarted ? (
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom color="primary">
            {isJoining ? 'Join Consultation' : 'Start Demo Consultation'}
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            {isJoining 
              ? 'You are joining an existing consultation session'
              : 'Share this room ID with someone to start a video consultation'}
          </Alert>

          <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Room ID
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1 
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'monospace',
                  bgcolor: 'background.paper',
                  p: 1.5,
                  px: 3,
                  borderRadius: 1,
                  border: '1px dashed',
                  borderColor: 'divider',
                  letterSpacing: 1
                }}
              >
                {roomId}
              </Typography>
              <Tooltip title="Copy Room ID">
                <IconButton onClick={handleCopyRoomId} size="small">
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {!isJoining && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Share with others
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyLink}
                >
                  Copy Link
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShare}
                >
                  Share
                </Button>
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setIsDemoStarted(true)}
            sx={{ mt: 2 }}
          >
            {isJoining ? 'Join Session' : 'Start Session'}
          </Button>
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">
                    Room: {roomId}
                  </Typography>
                  <Tooltip title="Copy Room ID">
                    <IconButton onClick={handleCopyRoomId} size="small">
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ color: getStatusColor() }}
                  >
                    {renderStatusMessage()}
                  </Typography>
                  {connectionStatus === 'waiting' && (
                    <CircularProgress size={16} />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <VideoConsultation
            expert={expert}
            roomId={roomId}
            isInitiator={!isJoining}
            onEndSession={() => {
              setIsDemoStarted(false);
              if (onEndCall) onEndCall();
            }}
            onConnectionStatusChange={handleConnectionStatusChange}
          />
        </Box>
      )}

      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={() => setShowCopyAlert(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DemoVideoCall;
