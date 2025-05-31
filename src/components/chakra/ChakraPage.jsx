// src/components/chakra/ChakraPage.jsx
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Sparkles } from '@react-three/drei';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconButton, 
  Box, 
  Typography, 
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { ChakraPortal } from './ChakraPortal';
import { ChakraEffects } from './ChakraEffects';
import chakraData from '../../data/chakraData';
import '../../styles/chakra.css';

// Add this model component before the ChakraPage component
const StargateModel = ({ chakra }) => {
  const { scene } = useGLTF('/models/chakras/stargate.glb');
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
      // Add breathing effect
      const breathe = Math.sin(state.clock.getElapsedTime()) * 0.1 + 1;
      modelRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
    />
  );
};

// Make sure to add this line to preload the model
useGLTF.preload('/models/chakras/stargate.glb');

// Audio Visualizer Component
const AudioVisualizer = ({ isPlaying, color }) => {
  const visualizerRef = useRef();
  const analyzerRef = useRef();
  const dataArrayRef = useRef();

  useEffect(() => {
    if (isPlaying && !analyzerRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyzerRef.current = audioContext.createAnalyser();
      analyzerRef.current.fftSize = 256;
      const bufferLength = analyzerRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }
  }, [isPlaying]);

  useFrame(() => {
    if (visualizerRef.current && isPlaying && analyzerRef.current) {
      analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
      const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
      const scale = 1 + (average / 255) * 0.5;
      visualizerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={visualizerRef}>
      <torusGeometry args={[2, 0.1, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isPlaying ? 2 : 0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

// Loading Screen Component
const LoadingScreen = ({ color }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#000',
      zIndex: 1000
    }}>
      <CircularProgress 
        size={60}
        thickness={4}
        sx={{ 
          color: color,
          filter: `drop-shadow(0 0 10px ${color})`
        }}
      />
    </div>
  );
};

// Information Panel Component
const InfoPanel = ({ chakra, isVisible, onClose }) => {
  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30 
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '400px',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            borderLeft: `2px solid ${chakra.color}40`,
            padding: '2rem',
            color: 'white',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: chakra.color,
              '&:hover': {
                backgroundColor: `${chakra.color}20`
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" 
            sx={{ 
              color: chakra.color,
              mb: 3,
              textShadow: `0 0 10px ${chakra.color}40`
            }}
          >
            {chakra.name} - {chakra.sanskritName}
          </Typography>

          {/* Chakra Sections */}
          {[
            {
              title: "Element & Energy",
              content: [
                `Element: ${chakra.element}`,
                `Frequency: ${chakra.frequency}`,
                `Location: ${chakra.position}`
              ]
            },
            {
              title: "Physical Aspects",
              content: chakra.physicalAspects
            },
            {
              title: "Emotional Aspects",
              content: chakra.emotionalAspects
            },
            {
              title: "Healing Practices",
              content: chakra.healingPractices
            },
            {
              title: "Balancing Foods",
              content: chakra.balancingFoods
            },
            {
              title: "Crystal Healing",
              content: chakra.crystals
            }
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ marginBottom: '2rem' }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: chakra.color,
                  mb: 1,
                  borderBottom: `1px solid ${chakra.color}40`,
                  paddingBottom: '0.5rem'
                }}
              >
                {section.title}
              </Typography>
              <List dense>
                {section.content.map((item, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={item}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'white',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </motion.div>
          ))}

          {/* Dosha Connection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: chakra.color,
                mb: 1,
                borderBottom: `1px solid ${chakra.color}40`,
                paddingBottom: '0.5rem'
              }}
            >
              Dosha Connection
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
              {chakra.doshaInfluence}
            </Typography>
            <Box sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap'
            }}>
              {chakra.doshas.map((dosha, index) => (
                <Box
                  key={dosha}
                  sx={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    backgroundColor: `${chakra.color}20`,
                    border: `1px solid ${chakra.color}40`,
                    color: 'white'
                  }}
                >
                  {dosha}
                </Box>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main ChakraPage Component
const ChakraPage = () => {
  const { chakraId } = useParams();
  const navigate = useNavigate();
  const chakra = chakraData.find(c => c.id === parseInt(chakraId));
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Initialize audio context and setup
  useEffect(() => {
    const setupAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        const audio = new Audio();
        audio.src = `/audio/mantras/${chakra.mantra.toLowerCase()}.mp3`;
        audio.preload = 'auto';

        // Create audio source and connect to analyser
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        audio.addEventListener('canplaythrough', () => setIsLoading(false));
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
        audio.addEventListener('ended', () => setIsPlaying(false));

        audioRef.current = audio;
      } catch (error) {
        console.error('Audio setup error:', error);
        setIsLoading(false);
      }
    };

    setupAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [chakra]);

  const toggleAudio = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Resume audio context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/dashboard/chakras');
  };

  if (!chakra) return null;

  return (
    <div className="chakra-page">
      {isLoading && <LoadingScreen color={chakra.color} />}

      {/* Background Effect */}
      <motion.div
        className="chakra-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at center, ${chakra.color}22 0%, #000000 70%)`,
          zIndex: 1
        }}
      />

      {/* Navigation Controls */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="navigation-controls"
      >
        <IconButton
          onClick={handleBack}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: `${chakra.color}44`,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </motion.div>

      {/* Info Button */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="info-button"
      >
        <IconButton
          onClick={() => setShowInfo(!showInfo)}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: `${chakra.color}44`,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <InfoIcon fontSize="large" />
        </IconButton>
      </motion.div>

      {/* Continue with Part 4 for the remaining JSX */}
      {/* Chakra Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="chakra-title"
      >
        <Typography
          variant="h2"
          sx={{
            color: chakra.color,
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            textAlign: 'center',
            textShadow: `0 0 20px ${chakra.color}88`,
            marginBottom: '1rem'
          }}
        >
          {chakra.name} - {chakra.sanskritName}
        </Typography>
      </motion.div>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
  <ambientLight intensity={0.3} />
  <pointLight position={[10, 10, 10]} intensity={0.5} />
  
  <Suspense fallback={null}>
    <group>
      <StargateModel chakra={chakra} />
      <ChakraPortal color={chakra.color} position={[0, 0, -2]} />
      <ChakraEffects color={chakra.color} />
      {isPlaying && (
        <AudioVisualizer isPlaying={isPlaying} color={chakra.color} />
      )}
    </group>

    <Sparkles
      count={100}
      scale={10}
      size={1}
      speed={0.3}
      opacity={0.5}
      color={chakra.color}
    />
  </Suspense>
  
  <OrbitControls 
    enableZoom={true}  // Changed to true
    maxPolarAngle={Math.PI}  // Allow full rotation
    minPolarAngle={0}  // Allow full rotation
    enablePan={true}  // Enable panning
    enableRotate={true}  // Enable rotation
  />
</Canvas>


      {/* Chakra Description */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="chakra-description"
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 2rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {chakra.description}
        </Typography>
      </motion.div>

      {/* Audio Controls */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="audio-controls"
      >
        <button 
          onClick={toggleAudio}
          style={{
            background: isPlaying ? chakra.color : 'transparent',
            border: `2px solid ${chakra.color}`,
            color: isPlaying ? 'black' : chakra.color,
            padding: '15px 30px',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: `0 0 15px ${chakra.color}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {isPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
          {isPlaying ? 'Stop' : 'Play'} Mantra
        </button>

        <motion.div
          animate={{
            opacity: isPlaying ? [0.5, 1] : 0.7,
            scale: isPlaying ? [1, 1.1] : 1
          }}
          transition={{
            duration: 1,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse"
          }}
          style={{ 
            fontSize: '1rem',
            marginTop: '1rem',
            color: chakra.color,
            textAlign: 'center',
            textShadow: `0 0 10px ${chakra.color}88`
          }}
        >
          {chakra.mantra} - {chakra.frequency}
        </motion.div>
      </motion.div>

      {/* Info Panel */}
      <InfoPanel
        chakra={chakra}
        isVisible={showInfo}
        onClose={() => setShowInfo(false)}
      />
    </div>
  );
};

export default ChakraPage;
