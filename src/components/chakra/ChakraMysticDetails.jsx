


// import React, { Suspense, useRef, useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Canvas , useFrame } from '@react-three/fiber';
// import { OrbitControls, Sparkles , useGLTF } from '@react-three/drei';
// import { 
//   Box, 
//   Typography, 
//   IconButton, 
//   Tabs,
//   Tab,
//   Paper,
//   Grid,
//   Chip,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   CircularProgress,
//   Tooltip,
// } from '@mui/material';
// import { Howl } from 'howler';
// import { motion, AnimatePresence } from 'framer-motion';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import VolumeOffIcon from '@mui/icons-material/VolumeOff';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import DiamondIcon from '@mui/icons-material/Diamond';
// import { chakraData } from '../../data/chakraData';
// // import { useFrame } from '@react-three/fiber';
// // import { useGLTF } from '@react-three/drei';
// import * as THREE from 'three';


// // Import your 3D components
// // import SacredGeometry from './elements/SacredGeometry';
// // import YantraPattern from './elements/YantraPattern';
// // import EnergyPathways from './elements/EnergyPathways';
// // import MudraVisualizer from './elements/MudraVisualizer';
// const ChakraModel = ({ color }) => {
//     const modelRef = useRef();
//     const { scene } = useGLTF('/models/chakras/stargate.glb');
  
//     useFrame(({ clock }) => {
//       if (modelRef.current) {
//         modelRef.current.rotation.y = clock.getElapsedTime() * 0.5;
//         modelRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
//       }
//     });
  
//     useEffect(() => {
//       if (scene) {
//         scene.traverse((child) => {
//           if (child.isMesh) {
//             child.material = new THREE.MeshPhongMaterial({
//               color: color,
//               emissive: color,
//               emissiveIntensity: 0.5,
//               transparent: true,
//               opacity: 0.9,
//               side: THREE.DoubleSide,
//             });
//           }
//         });
//       }
//     }, [scene, color]);
  
//     return (
//       <primitive
//         ref={modelRef}
//         object={scene}
//         scale={2}
//         position={[0, 0, 0]}
//       />
//     );
//   };
  
//   const EnergyRing = ({ color }) => {
//     const ringRef = useRef();
  
//     useFrame(({ clock }) => {
//       if (ringRef.current) {
//         ringRef.current.rotation.z = clock.getElapsedTime() * 0.3;
//         const scale = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
//         ringRef.current.scale.set(scale, scale, 1);
//       }
//     });
  
//     return (
//       <mesh ref={ringRef} position={[0, 0, -2]}>
//         <torusGeometry args={[3, 0.2, 16, 100]} />
//         <meshPhongMaterial
//           color={color}
//           transparent
//           opacity={0.3}
//           side={THREE.DoubleSide}
//         />
//       </mesh>
//     );
//   };
  
//   const ChakraMysticDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const chakra = chakraData.find((c) => c.id === parseInt(id));
//     const [activeTab, setActiveTab] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [loading, setLoading] = useState(true);
    
//     // Replace the current audio implementation with this new one
//     const [audio] = useState(new Audio());

//     useEffect(() => {
//       if (chakra) {
//         const mantraPath = `/audio/mantras/${chakra.mantra.toLowerCase()}.mp3`;
//         console.log('Loading mantra from:', mantraPath);
        
//         audio.src = mantraPath;
//         audio.load();
//         audio.loop = true;

//         // Add error handling
//         audio.addEventListener('error', (e) => {
//           console.error('Audio error:', e);
//           setLoading(false);
//         });

//         audio.addEventListener('loadeddata', () => {
//           console.log('Audio loaded successfully');
//           setLoading(false);
//         });

//         return () => {
//           audio.pause();
//           audio.currentTime = 0;
//           audio.src = '';
//         };
//       }
//     }, [chakra, audio]);

//     const toggleSound = () => {
//       console.log('Toggle sound clicked, current state:', isPlaying);
//       if (isPlaying) {
//         audio.pause();
//         setIsPlaying(false);
//       } else {
//         audio.play().catch(error => {
//           console.error('Error playing audio:', error);
//           setIsPlaying(false);
//         });
//         setIsPlaying(true);
//       }
//     };

//     // Rest of your component code...

//   if (!chakra) {
//     return (
//       <Box sx={{ 
//         height: '100vh', 
//         width: '100vw',
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center',
//         background: '#000' 
//       }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 0: // Overview
//         return (
//           <Box>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//                   <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                     Element & Position
//                   </Typography>
//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Typography variant="subtitle2" color={chakra.color}>Element</Typography>
//                       <Typography>{chakra.element.name}</Typography>
//                       <Typography variant="caption">{chakra.element.significance}</Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="subtitle2" color={chakra.color}>Position</Typography>
//                       <Typography>{chakra.position}</Typography>
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               </Grid>

//               <Grid item xs={12}>
//                 <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//                   <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                     Sacred Sound
//                   </Typography>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Box>
//                       <Typography variant="subtitle2" color={chakra.color}>Mantra</Typography>
//                       <Typography variant="h5">{chakra.mantra}</Typography>
//                     </Box>
//                     <Box>
//                       <Typography variant="subtitle2" color={chakra.color}>Frequency</Typography>
//                       <Typography>{chakra.frequency}</Typography>
//                     </Box>
//                     <IconButton 
//   onClick={toggleSound}
//   disabled={loading}
//   sx={{ 
//     color: chakra.color,
//     '&:hover': {
//       backgroundColor: `${chakra.color}22`
//     },
//     '&.Mui-disabled': {
//       color: `${chakra.color}44`
//     }
//   }}
// >
//   {isPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
// </IconButton>


//                   </Box>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </Box>
//         );

//       case 1: // Spiritual
//         return (
//           <Box>
//             <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                 Spiritual Significance
//               </Typography>
//               <Typography>{chakra.spiritualMeaning}</Typography>
//             </Paper>

//             <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                 Deity Association
//               </Typography>
//               <Typography variant="subtitle1" color={chakra.color}>
//                 {chakra.deity.name}
//               </Typography>
//               <Typography>{chakra.deity.description}</Typography>
//             </Paper>

//             <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                 Psychological Aspects
//               </Typography>
//               <List>
//                 {chakra.psychologicalAspects.map((aspect, index) => (
//                   <ListItem key={index}>
//                     <ListItemIcon>
//                       <FiberManualRecordIcon sx={{ color: chakra.color }} />
//                     </ListItemIcon>
//                     <ListItemText primary={aspect} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Box>
//         );

//       case 2: // Practice
//         return (
//           <Box>
//             <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                 Sacred Practices
//               </Typography>
//               {chakra.practices.map((practice, index) => (
//                 <Box key={index} sx={{ mb: 2 }}>
//                   <Typography variant="subtitle1" color={chakra.color}>
//                     {practice.name}
//                   </Typography>
//                   <Typography>{practice.description}</Typography>
//                 </Box>
//               ))}
//             </Paper>

//             <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                 Healing Properties
//               </Typography>
//               <Typography>{chakra.healingProperties}</Typography>
//             </Paper>

//             <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
//                 Associated Stones
//               </Typography>
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                 {chakra.stones.map((stone, index) => (
//                   <Chip
//                     key={index}
//                     icon={<DiamondIcon />}
//                     label={stone}
//                     sx={{
//                       bgcolor: `${chakra.color}30`,
//                       color: '#fff',
//                       '& .MuiChip-icon': { color: chakra.color }
//                     }}
//                   />
//                 ))}
//               </Box>
//             </Paper>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: '100vw',
//         height: '100vh',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         background: '#000',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Background Effect */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           opacity: 0.4,
//           background: `
//             radial-gradient(circle at 20% 20%, ${chakra.color}20 0%, transparent 50%),
//             radial-gradient(circle at 80% 80%, ${chakra.color}20 0%, transparent 50%),
//             radial-gradient(circle at center, ${chakra.color}10 0%, transparent 70%)
//           `,
//           filter: 'blur(40px)',
//           zIndex: 1,
//         }}
//       />

//       {/* Back Navigation */}
//       <Tooltip title="Return to Sacred Journey" placement="right">
//         <IconButton
//           onClick={() => navigate('/dashboard/chakras')}
//           sx={{
//             position: 'absolute',
//             top: 20,
//             left: 20,
//             zIndex: 1000,
//             color: chakra.color,
//             background: 'rgba(0,0,0,0.3)',
//             backdropFilter: 'blur(10px)',
//             border: `1px solid ${chakra.color}30`,
//             '&:hover': {
//               background: 'rgba(0,0,0,0.5)',
//               transform: 'scale(1.1)',
//             },
//             transition: 'all 0.3s ease',
//           }}
//         >
//           <ArrowBackIcon />
//         </IconButton>
//       </Tooltip>

//       {/* Title */}
//       <Typography
//         variant="h2"
//         sx={{
//           position: 'absolute',
//           top: 20,
//           width: '100%',
//           textAlign: 'center',
//           color: chakra.color,
//           fontFamily: '"Playfair Display", serif',
//           fontWeight: 300,
//           letterSpacing: '0.3em',
//           textShadow: `0 0 30px ${chakra.color}`,
//           zIndex: 2,
//           fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
//           padding: '0 20px'
//         }}
//       >
//         {chakra.name}
//       </Typography>

//       {/* Main Content */}
//       <Box sx={{ display: 'flex', height: '100vh' }}>
//         {/* Left Panel - 3D Visualization */}
//         <Box sx={{ flex: 1, position: 'relative' }}>
//         <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
//         <Suspense fallback={null}>
//           <ambientLight intensity={0.5} />
//           <pointLight position={[10, 10, 10]} intensity={1} />
//           <spotLight
//             position={[0, 5, 0]}
//             angle={0.3}
//             penumbra={1}
//             intensity={2}
//             castShadow
//           />
          
//           <ChakraModel color={chakra.color} />
          
//           <Sparkles
//             count={200}
//             scale={10}
//             size={1}
//             speed={0.4}
//             color={chakra.color}
//           />

//           <OrbitControls
//             enableZoom={true}
//             enablePan={true}
//             enableRotate={true}
//             autoRotate={false}
//             minDistance={3}
//             maxDistance={10}
//           />
//         </Suspense>
//       </Canvas>


//         </Box>

//         {/* Right Panel - Information */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             initial={{ opacity: 0, x: 100 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 100 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Paper
//               sx={{
//                 width: '400px',
//                 height: '100vh',
//                 bgcolor: 'rgba(0,0,0,0.8)',
//                 backdropFilter: 'blur(10px)',
//                 borderLeft: `1px solid ${chakra.color}30`,
//                 overflow: 'auto',
//                 position: 'relative',
//                 '&::-webkit-scrollbar': {
//                   width: '8px'
//                 },
//                 '&::-webkit-scrollbar-thumb': {
//                   background: chakra.color,
//                   borderRadius: '4px'
//                 }
//               }}
//             >
//               <Box sx={{ p: 3 }}>
//                 <Tabs
//                   value={activeTab}
//                   onChange={(_, newValue) => setActiveTab(newValue)}
//                   sx={{
//                     mb: 3,
//                     '& .MuiTab-root': { color: '#fff' },
//                     '& .Mui-selected': { color: chakra.color },
//                     '& .MuiTabs-indicator': { backgroundColor: chakra.color }
//                   }}
//                 >
//                   <Tab label="Overview" />
//                   <Tab label="Spiritual" />
//                   <Tab label="Practice" />
//                 </Tabs>

//                 {renderTabContent()}
//               </Box>
//             </Paper>
//           </motion.div>
//         </AnimatePresence>
//       </Box>
//     </Box>
//   );
// };

// export default ChakraMysticDetails;
// useGLTF.preload('/models/chakras/stargate.glb');





import React, { Suspense, useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, useGLTF } from '@react-three/drei';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tabs,
  Tab,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Tooltip,
  Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DiamondIcon from '@mui/icons-material/Diamond';
import { chakraData } from '../../data/chakraData';
import * as THREE from 'three';

const ChakraModel = ({ color }) => {
    const modelRef = useRef();
    const { scene } = useGLTF('/models/chakras/stargate.glb');
  
    useFrame(({ clock }) => {
      if (modelRef.current) {
        modelRef.current.rotation.y = clock.getElapsedTime() * 0.5;
        modelRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      }
    });
  
    useEffect(() => {
      if (scene) {
        scene.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: color,
              emissive: color,
              emissiveIntensity: 0.5,
              transparent: true,
              opacity: 0.9,
              side: THREE.DoubleSide,
            });
          }
        });
      }
    }, [scene, color]);
  
    return (
      <primitive
        ref={modelRef}
        object={scene}
        scale={2}
        position={[0, 0, 0]}
      />
    );
};

const EnergyRing = ({ color }) => {
    const ringRef = useRef();
  
    useFrame(({ clock }) => {
      if (ringRef.current) {
        ringRef.current.rotation.z = clock.getElapsedTime() * 0.3;
        const scale = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
        ringRef.current.scale.set(scale, scale, 1);
      }
    });
  
    return (
      <mesh ref={ringRef} position={[0, 0, -2]}>
        <torusGeometry args={[3, 0.2, 16, 100]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
};
const ChakraMysticDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chakra = chakraData.find((c) => c.id === parseInt(id));
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  // New Audio Implementation
  useEffect(() => {
    if (chakra) {
        const mantraName = chakra.mantra.toLowerCase();
        const audioPath = `/audio/mantras/${mantraName}.mp3`;
        console.log('Attempting to load audio from:', audioPath);
        
        const audio = new Audio(audioPath);
        
        audio.addEventListener('loadeddata', () => {
            console.log(`Audio file ${mantraName}.mp3 loaded successfully`);
            setLoading(false);
        });

        audio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            console.error('Audio source path:', audioPath);
            console.error('Audio error code:', e.target.error.code);
            setLoading(false);
        });

        // Test if file exists
        fetch(audioPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('Audio file exists and is accessible');
            })
            .catch(error => {
                console.error('Error checking audio file:', error);
            });

        setAudioElement(audio);

        return () => {
            console.log('Cleaning up audio');
            audio.pause();
            audio.src = '';
        };
    }
}, [chakra]);

const playMantra = () => {
  console.log('Play mantra clicked');
  console.log('Audio element:', audioElement);
  console.log('Current playing state:', isPlaying);

  if (!audioElement) {
      console.error('No audio element available');
      return;
  }

  if (isPlaying) {
      console.log('Stopping audio');
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
  } else {
      console.log('Starting audio');
      audioElement.play()
          .then(() => {
              console.log('Audio playing successfully');
              setIsPlaying(true);
          })
          .catch(error => {
              console.error('Error playing audio:', error);
              setIsPlaying(false);
          });
  }
};

  if (!chakra) {
      return (
          <Box sx={{ 
              height: '100vh', 
              width: '100vw',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              background: '#000' 
          }}>
              <CircularProgress />
          </Box>
      );
  }
  const renderTabContent = () => {
    switch (activeTab) {
        case 0: // Overview
            return (
                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                                    Element & Position
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color={chakra.color}>Element</Typography>
                                        <Typography>{chakra.element.name}</Typography>
                                        <Typography variant="caption">{chakra.element.significance}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color={chakra.color}>Position</Typography>
                                        <Typography>{chakra.position}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                                    Sacred Sound
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle2" color={chakra.color}>Mantra</Typography>
                                        <Typography variant="h5">{chakra.mantra}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color={chakra.color}>Frequency</Typography>
                                        <Typography>{chakra.frequency}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <IconButton 
                                            onClick={playMantra}
                                            disabled={loading}
                                            sx={{ 
                                                color: chakra.color,
                                                bgcolor: 'rgba(0,0,0,0.3)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                }
                                            }}
                                        >
                                            {isPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
                                        </IconButton>
                                        
                                        <Button
                                            variant="contained"
                                            onClick={playMantra}
                                            disabled={loading}
                                            sx={{
                                                bgcolor: chakra.color,
                                                color: '#fff',
                                                '&:hover': {
                                                    bgcolor: `${chakra.color}cc`
                                                }
                                            }}
                                        >
                                            {isPlaying ? 'Stop Mantra' : 'Play Mantra'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            );

        case 1: // Spiritual
            return (
                <Box>
                    <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                            Spiritual Significance
                        </Typography>
                        <Typography>{chakra.spiritualMeaning}</Typography>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                            Deity Association
                        </Typography>
                        <Typography variant="subtitle1" color={chakra.color}>
                            {chakra.deity.name}
                        </Typography>
                        <Typography>{chakra.deity.description}</Typography>
                    </Paper>

                    <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                            Psychological Aspects
                        </Typography>
                        <List>
                            {chakra.psychologicalAspects.map((aspect, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon sx={{ color: chakra.color }} />
                                    </ListItemIcon>
                                    <ListItemText primary={aspect} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>
            );
            case 2: // Practice
                return (
                    <Box>
                        <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                                Sacred Practices
                            </Typography>
                            {chakra.practices.map((practice, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" color={chakra.color}>
                                        {practice.name}
                                    </Typography>
                                    <Typography>{practice.description}</Typography>
                                </Box>
                            ))}
                        </Paper>

                        <Paper sx={{ p: 3, mb: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                                Healing Properties
                            </Typography>
                            <Typography>{chakra.healingProperties}</Typography>
                        </Paper>

                        <Paper sx={{ p: 3, bgcolor: `${chakra.color}15`, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: chakra.color, mb: 2 }}>
                                Associated Stones
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {chakra.stones.map((stone, index) => (
                                    <Chip
                                        key={index}
                                        icon={<DiamondIcon />}
                                        label={stone}
                                        sx={{
                                            bgcolor: `${chakra.color}30`,
                                            color: '#fff',
                                            '& .MuiChip-icon': { color: chakra.color }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Paper>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                background: '#000',
                overflow: 'hidden',
            }}
        >
            {/* Background Effect */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.4,
                    background: `
                        radial-gradient(circle at 20% 20%, ${chakra.color}20 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${chakra.color}20 0%, transparent 50%),
                        radial-gradient(circle at center, ${chakra.color}10 0%, transparent 70%)
                    `,
                    filter: 'blur(40px)',
                    zIndex: 1,
                }}
            />

            {/* Back Navigation */}
            <Tooltip title="Return to Sacred Journey" placement="right">
                <IconButton
                    onClick={() => navigate('/dashboard/chakras')}
                    sx={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        zIndex: 1000,
                        color: chakra.color,
                        background: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${chakra.color}30`,
                        '&:hover': {
                            background: 'rgba(0,0,0,0.5)',
                            transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            </Tooltip>
            {/* Title */}
            <Typography
                variant="h2"
                sx={{
                    position: 'absolute',
                    top: 20,
                    width: '100%',
                    textAlign: 'center',
                    color: chakra.color,
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    textShadow: `0 0 30px ${chakra.color}`,
                    zIndex: 2,
                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                    padding: '0 20px'
                }}
            >
                {chakra.name}
            </Typography>

            {/* Main Content */}
            <Box sx={{ display: 'flex', height: '100vh' }}>
                {/* Left Panel - 3D Visualization */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <spotLight
                                position={[0, 5, 0]}
                                angle={0.3}
                                penumbra={1}
                                intensity={2}
                                castShadow
                            />
                            
                            <ChakraModel color={chakra.color} />
                            
                            <Sparkles
                                count={200}
                                scale={10}
                                size={1}
                                speed={0.4}
                                color={chakra.color}
                            />

                            <OrbitControls
                                enableZoom={true}
                                enablePan={true}
                                enableRotate={true}
                                autoRotate={false}
                                minDistance={3}
                                maxDistance={10}
                            />
                        </Suspense>
                    </Canvas>
                </Box>

                {/* Right Panel - Information */}
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            sx={{
                                width: '400px',
                                height: '100vh',
                                bgcolor: 'rgba(0,0,0,0.8)',
                                backdropFilter: 'blur(10px)',
                                borderLeft: `1px solid ${chakra.color}30`,
                                overflow: 'auto',
                                position: 'relative',
                                '&::-webkit-scrollbar': {
                                    width: '8px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: chakra.color,
                                    borderRadius: '4px'
                                }
                            }}
                        >
                            <Box sx={{ p: 3 }}>
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

                                {renderTabContent()}
                            </Box>
                        </Paper>
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default ChakraMysticDetails;
useGLTF.preload('/models/chakras/stargate.glb');
