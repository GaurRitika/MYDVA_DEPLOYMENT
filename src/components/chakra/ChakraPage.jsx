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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
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

// ChakraPage.jsx - Part 1: Enhanced UI Components



// ChakraPage.jsx - Part 1: Imports and Initial Components

// import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { 
//   OrbitControls, 
//   useGLTF, 
//   Sparkles, 
//   Stars, 
//   // Html,
//   // Text,
//   // EffectComposer,
//   // Bloom,
//   // ChromaticAberration
//   Effects as DreiEffects
// } from '@react-three/drei';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence, useAnimation } from 'framer-motion';
// import { 
//   Bloom,
//   ChromaticAberration,
//   RenderPass,
//   UnrealBloomPass,
//   ShaderPass
// } from '@react-three/postprocessing';
// import chakraData from '../../data/chakraData'; // Adjust the path as needed
// import { 
//   IconButton, 
//   Box, 
//   Typography, 
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   CircularProgress,
//   Grid,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   useTheme,
//   useMediaQuery,
//   Tooltip,
//   Fade,
//   Slider,
//   Tab,
//   Tabs
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import InfoIcon from '@mui/icons-material/Info';
// import CloseIcon from '@mui/icons-material/Close';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import VolumeOffIcon from '@mui/icons-material/VolumeOff';
// import PauseIcon from '@mui/icons-material/Pause';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import TimerIcon from '@mui/icons-material/Timer';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import TuneIcon from '@mui/icons-material/Tune';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import SpaIcon from '@mui/icons-material/Spa';
// import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
// import HealingIcon from '@mui/icons-material/Healing';
// import DiamondIcon from '@mui/icons-material/Diamond';
// import * as THREE from 'three';
// import gsap from 'gsap';
// import '../../styles/chakra.css';


// // Styled Components
// const StyledIconButton = styled(IconButton)(({ theme, color }) => ({
//   background: 'rgba(255, 255, 255, 0.05)',
//   backdropFilter: 'blur(10px)',
//   border: `1px solid ${color}40`,
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     background: `${color}20`,
//     transform: 'scale(1.1)',
//     boxShadow: `0 0 15px ${color}40`
//   }
// }));

// const GlowingText = styled(Typography)(({ theme, glowColor }) => ({
//   color: 'white',
//   textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}40`,
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     textShadow: `0 0 15px ${glowColor}, 0 0 30px ${glowColor}60`
//   }
// }));

// const FloatingCard = styled(motion.div)(({ theme, borderColor }) => ({
//   background: 'rgba(0, 0, 0, 0.7)',
//   backdropFilter: 'blur(10px)',
//   borderRadius: '20px',
//   border: `1px solid ${borderColor}40`,
//   padding: theme.spacing(3),
//   boxShadow: `0 0 20px ${borderColor}20`,
//   transition: 'all 0.3s ease'
// }));
// // ChakraPage.jsx - Part 2: Base Components and Effects

// // Enhanced Loading Screen
// const EnhancedLoadingScreen = ({ color }) => {
//   const loadingVariants = {
//     animate: {
//       scale: [1, 1.2, 1],
//       rotate: [0, 180, 360],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,1) 100%)',
//         zIndex: 9999
//       }}
//     >
//       <motion.div
//         variants={loadingVariants}
//         animate="animate"
//       >
//         <CircularProgress 
//           size={80}
//           thickness={4}
//           sx={{ 
//             color: color,
//             filter: `drop-shadow(0 0 20px ${color})`
//           }}
//         />
//       </motion.div>
//       <GlowingText
//         variant="h5"
//         glowColor={color}
//         sx={{ mt: 3, fontFamily: '"Playfair Display", serif' }}
//       >
//         Awakening Energy...
//       </GlowingText>
//     </motion.div>
//   );
// };

// const AudioVisualizer = ({ isPlaying, color, frequencyData }) => {
//   const visualizerRef = useRef();
//   const { clock } = useThree();

//   useFrame(() => {
//     if (!visualizerRef.current || !isPlaying) return;

//     try {
//       const time = clock.getElapsedTime();
//       // Create a simple torus animation without depending on geometry attributes
//       visualizerRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
//       visualizerRef.current.rotation.y = time * 0.2;
//       visualizerRef.current.scale.setScalar(1 + Math.sin(time) * 0.1);
//     } catch (error) {
//       console.warn('Visualization update failed:', error);
//     }
//   });

//   return (
//     <mesh ref={visualizerRef}>
//       <torusGeometry args={[3, 0.2, 100, 100]} />
//       <meshPhongMaterial
//         color={color}
//         emissive={color}
//         emissiveIntensity={isPlaying ? 2 : 0.5}
//         transparent
//         opacity={0.7}
//         wireframe
//       />
//     </mesh>
//   );
// };


// // StargateModel Component
// const StargateModel = ({ chakra }) => {
//   const { scene } = useGLTF('/models/chakras/stargate.glb');
//   const modelRef = useRef();
//   const { clock } = useThree();

//   useFrame(() => {
//     if (modelRef.current) {
//       const time = clock.getElapsedTime();
//       modelRef.current.rotation.y += 0.003;
//       modelRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      
//       // Breathing effect
//       const primaryBreathing = Math.sin(time) * 0.05;
//       const secondaryBreathing = Math.sin(time * 0.5) * 0.03;
//       const scale = 1.5 + primaryBreathing + secondaryBreathing;
      
//       modelRef.current.scale.set(scale, scale, scale);

//       // Dynamic color pulse
//       if (modelRef.current.material) {
//         const materials = Array.isArray(modelRef.current.material) 
//           ? modelRef.current.material 
//           : [modelRef.current.material];
        
//         materials.forEach(material => {
//           if (material.emissive) {
//             material.emissive.setHex(chakra.color.replace('#', '0x'));
//             material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
//           }
//         });
//       }
//     }
//   });

//   return (
//     <primitive
//       ref={modelRef}
//       object={scene}
//       position={[0, 0, 0]}
//       castShadow
//       receiveShadow
//     />
//   );
// };

// // Make sure to preload the model
// useGLTF.preload('/models/chakras/stargate.glb');



// // ChakraPage.jsx - Part 3: Advanced Effects and Animations

// // Enhanced Portal Effect
// const EnhancedPortalEffect = ({ chakra, isActive }) => {
//   const portalRef = useRef();
//   const { clock } = useThree();

//   const portalMaterial = useMemo(() => {
//     return new THREE.ShaderMaterial({
//       uniforms: {
//         time: { value: 0 },
//         color: { value: new THREE.Color(chakra.color) },
//         isActive: { value: isActive ? 1.0 : 0.0 }
//       },
//       vertexShader: `
//         varying vec2 vUv;
//         varying vec3 vPosition;
//         void main() {
//           vUv = uv;
//           vPosition = position;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform float time;
//         uniform vec3 color;
//         uniform float isActive;
//         varying vec2 vUv;
//         varying vec3 vPosition;
        
//         void main() {
//           vec2 center = vUv - 0.5;
//           float dist = length(center);
//           float angle = atan(center.y, center.x);
          
//           float pattern = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
//           float spiral = sin(angle * 5.0 + dist * 10.0 - time * 3.0) * 0.5 + 0.5;
          
//           vec3 finalColor = color * (pattern * spiral);
//           float alpha = (1.0 - dist * 2.0) * isActive;
          
//           gl_FragColor = vec4(finalColor, alpha);
//         }
//       `,
//       transparent: true,
//       side: THREE.DoubleSide
//     });
//   }, [chakra.color, isActive]);

//   useFrame(() => {
//     if (portalRef.current) {
//       portalRef.current.material.uniforms.time.value = clock.getElapsedTime();
//     }
//   });

//   return (
//     <mesh ref={portalRef} position={[0, 0, -3]}>
//       <circleGeometry args={[2, 64]} />
//       <primitive object={portalMaterial} attach="material" />
//     </mesh>
//   );
// };

// // Energy Field Effect
// const EnergyField = ({ color, intensity = 1 }) => {
//   const fieldRef = useRef();
//   const { clock } = useThree();

//   const shaderMaterial = useMemo(() => {
//     return new THREE.ShaderMaterial({
//       uniforms: {
//         time: { value: 0 },
//         color: { value: new THREE.Color(color) },
//         intensity: { value: intensity }
//       },
//       vertexShader: `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform float time;
//         uniform vec3 color;
//         uniform float intensity;
//         varying vec2 vUv;
        
//         void main() {
//           vec2 p = vUv * 2.0 - 1.0;
//           float d = length(p);
//           float c = sin(d * 10.0 - time) * 0.5 + 0.5;
//           gl_FragColor = vec4(color * c * intensity, c * 0.5);
//         }
//       `,
//       transparent: true,
//       blending: THREE.AdditiveBlending
//     });
//   }, [color, intensity]);

//   useFrame(() => {
//     if (fieldRef.current) {
//       fieldRef.current.material.uniforms.time.value = clock.getElapsedTime();
//     }
//   });

//   return (
//     <mesh ref={fieldRef} rotation={[-Math.PI / 2, 0, 0]}>
//       <planeGeometry args={[20, 20, 32, 32]} />
//       <primitive object={shaderMaterial} attach="material" />
//     </mesh>
//   );
// };

// // Particle System
// const ParticleSystem = ({ color, count = 1000 }) => {
//   const particles = useRef();
//   const { clock } = useThree();
  
//   useFrame(() => {
//     if (!particles.current) return;
//     const time = clock.getElapsedTime();
//     const positions = particles.current.geometry.attributes.position.array;

//     for (let i = 0; i < positions.length; i += 3) {
//       const x = positions[i];
//       const y = positions[i + 1];
//       const z = positions[i + 2];

//       positions[i + 1] = y + Math.sin(time + x) * 0.01;
//       positions[i + 2] = z + Math.cos(time + y) * 0.01;
//     }

//     particles.current.geometry.attributes.position.needsUpdate = true;
//   });

//   const [positions] = useState(() => {
//     const pos = new Float32Array(count * 3);
//     for (let i = 0; i < count * 3; i += 3) {
//       pos[i] = (Math.random() - 0.5) * 20;
//       pos[i + 1] = (Math.random() - 0.5) * 20;
//       pos[i + 2] = (Math.random() - 0.5) * 20;
//     }
//     return pos;
//   });

//   return (
//     <points ref={particles}>
//       <bufferGeometry>
//         <bufferAttribute
//           attachObject={['attributes', 'position']}
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.05}
//         color={color}
//         transparent
//         opacity={0.6}
//         sizeAttenuation
//         blending={THREE.AdditiveBlending}
//       />
//     </points>
//   );
// };
// // ChakraPage.jsx - Part 4: UI Components and Controls

// // Enhanced Meditation Guide
// const MeditationGuide = ({ chakra, isActive }) => {
//   const [currentPhase, setCurrentPhase] = useState('prepare');
//   const [guideText, setGuideText] = useState('');

//   const guideVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut"
//       }
//     },
//     exit: {
//       opacity: 0,
//       y: -20,
//       transition: {
//         duration: 0.3
//       }
//     }
//   };

//   useEffect(() => {
//     if (!isActive) return;

//     const phases = [
//       { text: 'Find a comfortable position...', duration: 5000 },
//       { text: 'Take a deep breath in...', duration: 4000 },
//       { text: 'Hold...', duration: 4000 },
//       { text: 'Release slowly...', duration: 4000 },
//       { text: 'Focus on your breathing...', duration: 5000 }
//     ];

//     let currentIndex = 0;
//     const cyclePhases = () => {
//       setGuideText(phases[currentIndex].text);
//       currentIndex = (currentIndex + 1) % phases.length;
//     };

//     cyclePhases();
//     const interval = setInterval(cyclePhases, 5000);

//     return () => clearInterval(interval);
//   }, [isActive]);

//   return (
//     <AnimatePresence>
//       {isActive && (
//         <motion.div
//           variants={guideVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           style={{
//             position: 'absolute',
//             top: '30%',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             textAlign: 'center',
//             zIndex: 1000
//           }}
//         >
//           <GlowingText
//             variant="h3"
//             glowColor={chakra.color}
//             sx={{
//               fontFamily: '"Playfair Display", serif',
//               fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
//             }}
//           >
//             {guideText}
//           </GlowingText>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // Enhanced Control Interface
// const ControlInterface = ({ chakra, isPlaying, onPlayPause, onMeditationToggle }) => {
//   const controlVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 200,
//         damping: 20
//       }
//     }
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.1,
//       boxShadow: `0 0 20px ${chakra.color}`,
//       transition: {
//         duration: 0.3,
//         yoyo: Infinity
//       }
//     },
//     tap: {
//       scale: 0.95
//     }
//   };

//   return (
//     <motion.div
//       variants={controlVariants}
//       initial="hidden"
//       animate="visible"
//       className="control-interface"
//       style={{
//         position: 'absolute',
//         bottom: '2rem',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         display: 'flex',
//         gap: '2rem',
//         zIndex: 100
//       }}
//     >
//       <FloatingCard
//         borderColor={chakra.color}
//         style={{
//           padding: '1.5rem',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '2rem'
//         }}
//       >
//         <motion.div
//           variants={buttonVariants}
//           whileHover="hover"
//           whileTap="tap"
//         >
//           <StyledIconButton
//             onClick={onPlayPause}
//             color={chakra.color}
//             size="large"
//             sx={{
//               width: '70px',
//               height: '70px',
//               background: isPlaying ? `${chakra.color}20` : 'transparent'
//             }}
//           >
//             {isPlaying ? (
//               <PauseIcon sx={{ fontSize: '2rem' }} />
//             ) : (
//               <PlayArrowIcon sx={{ fontSize: '2rem' }} />
//             )}
//           </StyledIconButton>
//         </motion.div>

//         <motion.div
//           variants={buttonVariants}
//           whileHover="hover"
//           whileTap="tap"
//         >
//           <Tooltip
//             title="Enter Meditation Mode"
//             placement="top"
//             arrow
//             TransitionComponent={Fade}
//           >
//             <StyledIconButton
//               onClick={onMeditationToggle}
//               color={chakra.color}
//               size="large"
//             >
//               <SpaIcon sx={{ fontSize: '1.8rem' }} />
//             </StyledIconButton>
//           </Tooltip>
//         </motion.div>
//       </FloatingCard>
//     </motion.div>
//   );
// };
// // ChakraPage.jsx - Part 5: Information Panels and Visual Effects

// // Enhanced Chakra Information Panel
// const ChakraInfoPanel = ({ chakra, isVisible, onClose }) => {
//   const [selectedTab, setSelectedTab] = useState(0);

//   const panelVariants = {
//     hidden: { x: '100%', opacity: 0 },
//     visible: {
//       x: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 200,
//         damping: 25
//       }
//     },
//     exit: {
//       x: '100%',
//       opacity: 0,
//       transition: { duration: 0.3 }
//     }
//   };

//   const tabData = [
//     {
//       label: "Overview",
//       icon: <InfoIcon />,
//       content: (
//         <Box>
//           <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
//             {chakra.description}
//           </Typography>
//           <Grid container spacing={2}>
//             {[
//               { label: 'Sanskrit Name', value: chakra.sanskritName },
//               { label: 'Element', value: chakra.element },
//               { label: 'Location', value: chakra.position },
//               { label: 'Frequency', value: chakra.frequency }
//             ].map((item, index) => (
//               <Grid item xs={6} key={index}>
//                 <InfoCard label={item.label} value={item.value} color={chakra.color} />
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )
//     },
//     {
//       label: "Physical",
//       icon: <AccessibilityNewIcon />,
//       content: (
//         <List>
//           {chakra.physicalAspects.map((aspect, index) => (
//             <ListItem key={index} sx={{ borderBottom: `1px solid ${chakra.color}20` }}>
//               <ListItemText primary={aspect} sx={{ color: 'white' }} />
//             </ListItem>
//           ))}
//         </List>
//       )
//     },
//     {
//       label: "Emotional",
//       icon: <FavoriteIcon />,
//       content: (
//         <List>
//           {chakra.emotionalAspects.map((aspect, index) => (
//             <ListItem key={index} sx={{ borderBottom: `1px solid ${chakra.color}20` }}>
//               <ListItemText primary={aspect} sx={{ color: 'white' }} />
//             </ListItem>
//           ))}
//         </List>
//       )
//     },
//     {
//       label: "Healing",
//       icon: <HealingIcon />,
//       content: (
//         <List>
//           {chakra.healingPractices.map((practice, index) => (
//             <ListItem key={index} sx={{ borderBottom: `1px solid ${chakra.color}20` }}>
//               <ListItemText primary={practice} sx={{ color: 'white' }} />
//             </ListItem>
//           ))}
//         </List>
//       )
//     }
//   ];

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           variants={panelVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           style={{
//             position: 'absolute',
//             right: 0,
//             top: 0,
//             width: '400px',
//             height: '100%',
//             background: 'rgba(0, 0, 0, 0.9)',
//             backdropFilter: 'blur(10px)',
//             borderLeft: `2px solid ${chakra.color}40`,
//             zIndex: 1000,
//             display: 'flex',
//             flexDirection: 'column'
//           }}
//         >
//           <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <GlowingText
//               variant="h5"
//               glowColor={chakra.color}
//               sx={{ fontFamily: '"Playfair Display", serif' }}
//             >
//               {chakra.name}
//             </GlowingText>
//             <StyledIconButton onClick={onClose} color={chakra.color}>
//               <CloseIcon />
//             </StyledIconButton>
//           </Box>

//           <Tabs
//             value={selectedTab}
//             onChange={(_, newValue) => setSelectedTab(newValue)}
//             variant="fullWidth"
//             sx={{
//               borderBottom: `1px solid ${chakra.color}40`,
//               '& .MuiTab-root': {
//                 color: 'white',
//                 opacity: 0.7,
//                 '&.Mui-selected': {
//                   color: chakra.color,
//                   opacity: 1
//                 }
//               },
//               '& .MuiTabs-indicator': {
//                 backgroundColor: chakra.color,
//                 height: 3,
//                 borderRadius: '2px'
//               }
//             }}
//           >
//             {tabData.map((tab, index) => (
//               <Tab
//                 key={index}
//                 icon={tab.icon}
//                 label={tab.label}
//                 sx={{
//                   minHeight: '72px',
//                   textTransform: 'none'
//                 }}
//               />
//             ))}
//           </Tabs>

//           <Box sx={{ 
//             flex: 1, 
//             overflow: 'auto', 
//             p: 3,
//             '&::-webkit-scrollbar': {
//               width: '6px'
//             },
//             '&::-webkit-scrollbar-thumb': {
//               backgroundColor: `${chakra.color}40`,
//               borderRadius: '3px'
//             }
//           }}>
//             {tabData[selectedTab].content}
//           </Box>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
// // ChakraPage.jsx - Part 6: Scene Effects and Environment

// const SceneEffectsManager = ({ chakra, isPlaying, meditationMode }) => {
//   const { gl, scene, camera } = useThree();

//   useEffect(() => {
//     // Basic scene setup
//     scene.fog = new THREE.Fog('black', 10, 25);
//     return () => {
//       scene.fog = null;
//     };
//   }, [scene]);

//   return null;
// };
// // Environment Elements
// const EnvironmentElements = ({ chakra, isPlaying }) => {
//   const environmentRef = useRef();
//   const { clock } = useThree();

//   useFrame(() => {
//     if (environmentRef.current) {
//       const time = clock.getElapsedTime();
//       environmentRef.current.rotation.y = time * 0.05;
//     }
//   });

//   return (
//     <group ref={environmentRef}>
//       <Stars
//         radius={100}
//         depth={50}
//         count={5000}
//         factor={4}
//         saturation={0}
//         fade
//         speed={1}
//       />
      
//       <Sparkles
//         count={100}
//         scale={10}
//         size={1}
//         speed={0.3}
//         opacity={0.5}
//         color={chakra.color}
//       />

//       <fog attach="fog" args={['black', 10, 25]} />
      
//       <ambientLight intensity={0.2} />
//       <pointLight
//         position={[10, 10, 10]}
//         intensity={1.5}
//         color={chakra.color}
//         distance={20}
//         decay={2}
//       />
//       <spotLight
//         position={[-10, -10, -10]}
//         intensity={0.5}
//         color={chakra.color}
//         angle={0.3}
//         penumbra={1}
//       />

//       <EnergyField
//         color={chakra.color}
//         intensity={isPlaying ? 1.5 : 0.8}
//       />
//     </group>
//   );
// };

// // Energy Streams
// const EnergyStreams = ({ chakra, intensity = 1 }) => {
//   const streamRef = useRef();
//   const { clock } = useThree();

//   const streamCount = 50;
//   const [streamPositions] = useState(() => {
//     const positions = new Float32Array(streamCount * 3);
//     for (let i = 0; i < streamCount * 3; i += 3) {
//       const angle = (i / 3) * (Math.PI * 2) / streamCount;
//       const radius = 2;
//       positions[i] = Math.cos(angle) * radius;
//       positions[i + 1] = Math.sin(angle) * radius;
//       positions[i + 2] = 0;
//     }
//     return positions;
//   });

//   useFrame(() => {
//     if (!streamRef.current) return;
//     const time = clock.getElapsedTime();
//     const positions = streamRef.current.geometry.attributes.position.array;

//     for (let i = 0; i < positions.length; i += 3) {
//       const angle = (i / 3) * (Math.PI * 2) / streamCount + time * 0.5;
//       const radius = 2 + Math.sin(time + i) * 0.2;
//       positions[i] = Math.cos(angle) * radius;
//       positions[i + 1] = Math.sin(angle) * radius;
//       positions[i + 2] = Math.sin(time + i / 3) * 0.5;
//     }

//     streamRef.current.geometry.attributes.position.needsUpdate = true;
//   });

//   return (
//     <points ref={streamRef}>
//       <bufferGeometry>
//         <bufferAttribute
//           attachObject={['attributes', 'position']}
//           count={streamCount}
//           array={streamPositions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.1}
//         color={chakra.color}
//         transparent
//         opacity={0.8}
//         sizeAttenuation
//         blending={THREE.AdditiveBlending}
//       />
//     </points>
//   );
// };
// // ChakraPage.jsx - Part 7: Additional UI Components and Controls

// // Progress Indicator
// const ProgressIndicator = ({ chakra, progress }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       style={{
//         position: 'absolute',
//         bottom: '8rem',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         width: '200px',
//         height: '4px',
//         background: `${chakra.color}20`,
//         borderRadius: '2px',
//         overflow: 'hidden'
//       }}
//     >
//       <motion.div
//         initial={{ width: 0 }}
//         animate={{ width: `${progress * 100}%` }}
//         style={{
//           height: '100%',
//           background: chakra.color,
//           boxShadow: `0 0 10px ${chakra.color}`
//         }}
//       />
//     </motion.div>
//   );
// };

// // Volume Control
// const VolumeControl = ({ chakra, volume, onChange }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <motion.div
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       style={{
//         position: 'absolute',
//         right: '2rem',
//         bottom: '2rem',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '1rem',
//         zIndex: 100
//       }}
//     >
//       <FloatingCard borderColor={chakra.color}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
//           <IconButton
//             size="small"
//             onClick={() => onChange(volume === 0 ? 0.5 : 0)}
//             sx={{
//               color: 'white',
//               '&:hover': { color: chakra.color }
//             }}
//           >
//             {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
//           </IconButton>

//           <motion.div
//             initial={{ width: 0, opacity: 0 }}
//             animate={{
//               width: isHovered ? 100 : 0,
//               opacity: isHovered ? 1 : 0
//             }}
//             transition={{ duration: 0.3 }}
//           >
//             <Slider
//               value={volume}
//               onChange={(_, newValue) => onChange(newValue)}
//               aria-label="Volume"
//               min={0}
//               max={1}
//               step={0.1}
//               sx={{
//                 color: chakra.color,
//                 '& .MuiSlider-thumb': {
//                   width: 12,
//                   height: 12,
//                   '&:hover, &.Mui-focusVisible': {
//                     boxShadow: `0 0 0 8px ${chakra.color}30`
//                   }
//                 },
//                 '& .MuiSlider-rail': {
//                   opacity: 0.3
//                 }
//               }}
//             />
//           </motion.div>
//         </Box>
//       </FloatingCard>
//     </motion.div>
//   );
// };

// // Add the InfoCard component definition
// const InfoCard = ({ label, value, color }) => (
//   <Box
//     sx={{
//       background: `${color}10`,
//       border: `1px solid ${color}30`,
//       borderRadius: '10px',
//       padding: '1rem',
//       height: '100%',
//       transition: 'all 0.3s ease',
//       '&:hover': {
//         background: `${color}20`,
//         transform: 'translateY(-2px)',
//         boxShadow: `0 5px 15px ${color}20`
//       }
//     }}
//   >
//     <Typography
//       variant="caption"
//       sx={{ 
//         color: color,
//         opacity: 0.8,
//         display: 'block',
//         mb: 1
//       }}
//     >
//       {label}
//     </Typography>
//     <Typography
//       variant="body1"
//       sx={{ 
//         color: 'white',
//         fontWeight: 500
//       }}
//     >
//       {value}
//     </Typography>
//   </Box>
// );

// // Energy Meter
// const EnergyMeter = ({ chakra, level }) => {
//   const meterRef = useRef();

//   useEffect(() => {
//     if (meterRef.current) {
//       gsap.to(meterRef.current, {
//         height: `${level * 100}%`,
//         duration: 1,
//         ease: "power2.out"
//       });
//     }
//   }, [level]);

//   return (
//     <Box
//       sx={{
//         position: 'absolute',
//         right: '2rem',
//         top: '50%',
//         transform: 'translateY(-50%)',
//         width: '4px',
//         height: '200px',
//         background: `${chakra.color}20`,
//         borderRadius: '2px',
//         overflow: 'hidden'
//       }}
//     >
//       <Box
//         ref={meterRef}
//         sx={{
//           position: 'absolute',
//           bottom: 0,
//           width: '100%',
//           background: chakra.color,
//           boxShadow: `0 0 10px ${chakra.color}`,
//           transition: 'height 0.3s ease'
//         }}
//       />
//     </Box>
//   );
// };

// const ChakraSymbolEffect = ({ chakra, isActive }) => {
//   const symbolRef = useRef();
//   const { clock } = useThree();

//   useFrame(() => {
//     if (symbolRef.current) {
//       symbolRef.current.rotation.z = clock.getElapsedTime() * 0.2;
//     }
//   });

//   return (
//     <mesh ref={symbolRef}>
//       <planeGeometry args={[2, 2]} />
//       <meshBasicMaterial
//         color={chakra.color}
//         transparent
//         opacity={isActive ? 0.8 : 0.4}
//       />
//     </mesh>
//   );
// };

// // Rename Effects component reference to DreiEffects
// // Replace <Effects /> with:
// <DreiEffects />

// // Navigation Controls
// const NavigationControls = ({ onBack, color }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -50 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//       style={{
//         position: 'absolute',
//         top: '2rem',
//         left: '2rem',
//         zIndex: 100
//       }}
//     >
//       <Tooltip 
//         title="Return to Dashboard" 
//         placement="right"
//         TransitionComponent={Fade}
//         TransitionProps={{ timeout: 600 }}
//       >
//         <StyledIconButton
//           onClick={onBack}
//           color={color}
//           size="large"
//           aria-label="back to dashboard"
//         >
//           <ArrowBackIcon fontSize="large" />
//         </StyledIconButton>
//       </Tooltip>
//     </motion.div>
//   );
// };
// // ChakraPage.jsx - Part 8: Main Component Implementation

// // Main ChakraPage Component
// const ChakraPage = () => {
//   const { chakraId } = useParams();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const chakra = chakraData.find(c => c.id === parseInt(chakraId));
  
//   // State Management
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showInfo, setShowInfo] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [meditationMode, setMeditationMode] = useState(false);
//   const [volume, setVolume] = useState(0.7);
//   const [energyLevel, setEnergyLevel] = useState(0);
//   const [audioAnalyser, setAudioAnalyser] = useState(null);
//   const [frequencyData, setFrequencyData] = useState(new Uint8Array());

//   // Refs
//   const audioRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const rafRef = useRef(null);
//   const sceneRef = useRef(null);

//   // Initialize Audio System
//   useEffect(() => {
//     const setupAudio = async () => {
//       try {
//         audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//         const audio = new Audio(`/audio/chakras/${chakra.id}_mantra.mp3`);
//         audio.crossOrigin = "anonymous";
        
//         const analyser = audioContextRef.current.createAnalyser();
//         analyser.fftSize = 256;
        
//         const source = audioContextRef.current.createMediaElementSource(audio);
//         source.connect(analyser);
//         analyser.connect(audioContextRef.current.destination);
        
//         audio.volume = volume;
//         setAudioAnalyser(analyser);
//         audioRef.current = audio;
        
//         audio.addEventListener('canplaythrough', () => {
//           setIsLoading(false);
//           setEnergyLevel(0.3);
//         });
//         audio.addEventListener('ended', handleAudioEnd);
//       } catch (error) {
//         console.error('Audio setup failed:', error);
//         setIsLoading(false);
//       }
//     };

//     setupAudio();
//     return cleanup;
//   }, [chakra.id]);

//   // Audio Visualization Loop
//   useEffect(() => {
//     const updateFrequencyData = () => {
//       if (audioAnalyser && isPlaying) {
//         const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
//         audioAnalyser.getByteFrequencyData(dataArray);
//         setFrequencyData(dataArray);
        
//         // Update energy level based on frequency data
//         const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
//         setEnergyLevel(Math.min(average / 255 + 0.3, 1));
        
//         rafRef.current = requestAnimationFrame(updateFrequencyData);
//       }
//     };

//     if (isPlaying) {
//       updateFrequencyData();
//     }

//     return () => {
//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//       }
//     };
//   }, [isPlaying, audioAnalyser]);

//   // Handlers
//   const handlePlayPause = async () => {
//     if (!audioRef.current) return;

//     try {
//       if (isPlaying) {
//         audioRef.current.pause();
//         setIsPlaying(false);
//       } else {
//         if (audioContextRef.current.state === 'suspended') {
//           await audioContextRef.current.resume();
//         }
//         await audioRef.current.play();
//         setIsPlaying(true);
//       }
//     } catch (error) {
//       console.error('Playback error:', error);
//     }
//   };

//   const handleMeditationToggle = () => {
//     setMeditationMode(!meditationMode);
//     if (!meditationMode && !isPlaying) {
//       handlePlayPause();
//     }
//   };

//   const handleVolumeChange = (newVolume) => {
//     setVolume(newVolume);
//     if (audioRef.current) {
//       audioRef.current.volume = newVolume;
//     }
//   };

//   const handleAudioEnd = () => {
//     setIsPlaying(false);
//     if (meditationMode) {
//       setMeditationMode(false);
//     }
//   };

//   const cleanup = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.src = '';
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//     }
//   };

//   if (!chakra) return null;

// // ChakraPage.jsx - Part 9: Main Component Render Method

//   // Continue from previous part...
//   return (
//     <motion.div
    
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="chakra-page"
//       style={{
//         position: 'relative',
//         width: '100vw',
//         height: '100vh',
//         overflow: 'hidden',
//         background: '#000'
//       }}
//     >
//       {isLoading && <EnhancedLoadingScreen color={chakra.color} />}

//       {/* Main 3D Scene */}
//       <Canvas
//         ref={sceneRef}
//         shadows
//         camera={{ position: [0, 0, 8], fov: 60 }}
//         style={{ background: 'black' }}
//       >
//         <SceneEffectsManager 
//           chakra={chakra}
//           isPlaying={isPlaying}
//           meditationMode={meditationMode}
//         />
        
//         <Suspense fallback={null}>
//           <group>
//             <StargateModel chakra={chakra} />
            
//             {/* Dynamic Portal Effect */}
//             <EnhancedPortalEffect
//               chakra={chakra}
//               isActive={isPlaying}
//             />

//             {/* Particle Systems */}
//             <ParticleSystem
//               color={chakra.color}
//               count={1000}
//             />

//             {/* Energy Streams */}
//             <EnergyStreams
//               chakra={chakra}
//               intensity={energyLevel}
//             />

//             {/* Audio Visualization */}
//             {isPlaying && (
//               <AudioVisualizer
//                 chakra={chakra}
//                 isPlaying={isPlaying}
//                 frequencyData={frequencyData}
//               />
//             )}

//             {/* Meditation Mode Elements */}
//             {meditationMode && (
//               <>
//                 <ChakraSymbolEffect
//                   chakra={chakra}
//                   isActive={true}
//                 />
//                 <EnergyField
//                   color={chakra.color}
//                   intensity={1.5}
//                 />
//               </>
//             )}
//           </group>

//           {/* Environment */}
//           <EnvironmentElements
//             chakra={chakra}
//             isPlaying={isPlaying}
//           />

//           {/* Post-processing Effects */}
//           {/* <Effects /> */}
//         </Suspense>

//         {/* Camera Controls */}
//         <OrbitControls
//           enableZoom={!meditationMode}
//           enablePan={!meditationMode}
//           enableRotate={!meditationMode}
//           maxPolarAngle={Math.PI}
//           minPolarAngle={0}
//           maxDistance={15}
//           minDistance={3}
//         />
//       </Canvas>

//       {/* UI Overlay */}
//       <motion.div className="ui-overlay glass-panel">
//         {/* Navigation */}
//         <NavigationControls
//           onBack={() => navigate('/dashboard/chakras')}
//           color={chakra.color}
//         />

//         {/* Title */}
//         <motion.div
//         className="chakra-title"
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           style={{
//             position: 'absolute',
//             top: '10%',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             textAlign: 'center'
//           }}
//         >
//           <GlowingText
//             variant="h2"
//             glowColor={chakra.color}
//             sx={{
//               fontFamily: '"Playfair Display", serif',
//               fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
//             }}
//           >
//             {chakra.name}
//           </GlowingText>
//           <GlowingText
//             variant="h4"
//             glowColor={chakra.color}
//             sx={{
//               fontFamily: '"Sanskrit Text", serif',
//               opacity: 0.8,
//               mt: 1
//             }}
//           >
//             {chakra.sanskritName}
//           </GlowingText>
//         </motion.div>

//         {/* Controls */}
//         <ControlInterface
//           chakra={chakra}
//           isPlaying={isPlaying}
//           onPlayPause={handlePlayPause}
//           onMeditationToggle={handleMeditationToggle}
//         />

//         {/* Volume Control */}
//         <VolumeControl
//           chakra={chakra}
//           volume={volume}
//           onChange={handleVolumeChange}
//         />

//         {/* Energy Meter */}
//         <EnergyMeter
//           chakra={chakra}
//           level={energyLevel}
//         />

//         {/* Meditation Guide */}
//         {meditationMode && (
//           <MeditationGuide
//             chakra={chakra}
//             isActive={true}
//           />
//         )}

//         {/* Progress Indicator */}
//         {isPlaying && (
//           <ProgressIndicator
//             chakra={chakra}
//             progress={audioRef.current ? 
//               audioRef.current.currentTime / audioRef.current.duration : 0
//             }
//           />
//         )}

//         {/* Info Panel */}
//         <ChakraInfoPanel
//           chakra={chakra}
//           isVisible={showInfo}
//           onClose={() => setShowInfo(false)}
//         />
//       </motion.div>

//       {/* Meditation Mode Overlay */}
//       <AnimatePresence>
//         {meditationMode && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="meditation-overlay"
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100%',
//               background: `radial-gradient(circle at center, transparent, rgba(0,0,0,0.8))`,
//               pointerEvents: 'none',
//               zIndex: 10
//             }}
//           />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default ChakraPage;
