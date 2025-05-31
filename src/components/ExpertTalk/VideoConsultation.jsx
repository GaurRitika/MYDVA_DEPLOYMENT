// src/components/ExpertTalk/VideoConsultation.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Grid,
  Drawer,
  TextField,
  Button,
  Avatar,
  Badge,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Chat,
  CallEnd,
  Send,
  ScreenShare,
  StopScreenShare,
  FiberManualRecord
} from '@mui/icons-material';
import signalingService from '../../services/signalingService';

const VideoConsultation = ({ expert, roomId, isInitiator, onEndSession, onConnectionStatusChange }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [error, setError] = useState(null);
  const [connectionState, setConnectionState] = useState('connecting');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const iceCandidatesQueue = useRef([]);

  // In VideoConsultation.jsx
  const cleanup = () => {
    console.log('Cleaning up media and connections...');
    
    // Stop all tracks of the local media stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
    }
  
    // Close the peer connection if it exists
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null; // Ensure no stale connections remain
    }
  
    // Disconnect from the signaling server
    if (signalingService && typeof signalingService.disconnect === 'function') {
      signalingService.disconnect();
    }
  };
  

  const handleMediaError = async () => {
    try {
      cleanup();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      return stream;
    } catch (error) {
      console.error('Failed to get media:', error);
      throw error;
    }
  };

  const initializeCall = async () => {
    try {
      console.log(`Initializing call as ${isInitiator ? 'initiator' : 'receiver'} in room: ${roomId}`);
      
      const stream = await handleMediaError();
      console.log('Media access granted');
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'webrtc@live.com',
            credential: 'muazkh'
          }
        ]
      };

      console.log('Creating peer connection...');
      peerConnection.current = new RTCPeerConnection(configuration);

      peerConnection.current.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.current.connectionState);
        setConnectionState(peerConnection.current.connectionState);
        if (onConnectionStatusChange) {
          onConnectionStatusChange(peerConnection.current.connectionState);
        }
      };

      peerConnection.current.oniceconnectionstatechange = () => {
        console.log('🌐 ICE connection state changed:', peerConnection.current.iceConnectionState);
      };

      stream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`);
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        console.log('Received remote track');
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate');
          signalingService.sendIceCandidate({
            candidate: event.candidate,
            roomId: roomId
          });
        }
      };

      const socket = signalingService.connect();

      socket.on('user-connected', async (userId) => {
        console.log('User connected:', userId);
        if (isInitiator) {
          try {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            signalingService.sendOffer({ offer, roomId });
          } catch (err) {
            console.error('Error creating offer:', err);
            setError('Failed to create offer');
          }
        }
      });

      socket.on('offer', async ({ offer }) => {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          signalingService.sendAnswer({ answer, roomId });
        } catch (err) {
          console.error('Error handling offer:', err);
          setError('Failed to handle offer');
        }
      });

      socket.on('answer', async ({ answer }) => {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error('Error handling answer:', err);
          setError('Failed to handle answer');
        }
      });

      socket.on('ice-candidate', async ({ candidate }) => {
        try {
          if (peerConnection.current.remoteDescription) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            iceCandidatesQueue.current.push(candidate);
          }
        } catch (err) {
          console.error('Error handling ICE candidate:', err);
        }
      });

      signalingService.joinRoom(roomId);

    } catch (error) {
      console.error('Error in call initialization:', error);
      setError(`Call initialization failed: ${error.message}`);
      if (onConnectionStatusChange) {
        onConnectionStatusChange('failed');
      }
    }
  };

  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, []);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnection.current
          .getSenders()
          .find(s => s.track.kind === 'video');
        await sender.replaceTrack(videoTrack);
        setIsScreenSharing(true);

        videoTrack.onended = () => {
          handleScreenShare();
        };
      } else {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        const videoTrack = userStream.getVideoTracks()[0];
        const sender = peerConnection.current
          .getSenders()
          .find(s => s.track.kind === 'video');
        await sender.replaceTrack(videoTrack);
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Screen sharing error:', err);
      setError('Failed to share screen');
    }
  };

  const handleEndCall = () => {
    cleanup();
    if (onEndSession) {
      onEndSession();
    }
  };

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Paper elevation={3} sx={{ height: '70vh', position: 'relative', borderRadius: 2 }}>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            width: 200,
            height: 150,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
            bgcolor: 'rgba(0,0,0,0.5)',
            p: 2,
            borderRadius: 3
          }}
        >
          <IconButton
            onClick={toggleMute}
            sx={{ color: isMuted ? 'error.main' : 'white' }}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </IconButton>
          
          <IconButton
            onClick={toggleVideo}
            sx={{ color: isVideoOff ? 'error.main' : 'white' }}
          >
            {isVideoOff ? <VideocamOff /> : <Videocam />}
          </IconButton>
          
          <IconButton
            onClick={handleScreenShare}
            sx={{ color: 'white' }}
          >
            {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
          </IconButton>
          
          <IconButton
            onClick={handleEndCall}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            <CallEnd />
          </IconButton>
        </Box>

        {/* Connection Status */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            p: 1,
            borderRadius: 1
          }}
        >
          <Typography variant="body2">
            Status: {connectionState}
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VideoConsultation;



