// src/components/chakra/ChakraHumanBody.jsx
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Html, useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import  chakraData  from '../../data/chakraData';
import { 
  Typography, 
  Box, 
  IconButton, 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogActions,
  Button,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import * as THREE from 'three';
import gsap from 'gsap';

// Interactive Chakra Point Component
const ChakraPoint = ({ position, color, name, onClick }) => {
  const pointRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame(({ clock }) => {
    if (pointRef.current && ringRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      pointRef.current.scale.set(scale, scale, scale);
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Main chakra sphere */}
      <mesh ref={pointRef}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Energy rings */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.25, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Point light for glow effect */}
      <pointLight
        color={color}
        intensity={hovered ? 2 : 1}
        distance={1.5}
        decay={2}
      />

      {/* Particle effects */}
      <Sparkles
        count={25}
        scale={0.6}
        size={0.6}
        speed={0.3}
        color={color}
      />

      {/* Hover tooltip */}
      {hovered && (
        <Html center>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '10px 20px',
            borderRadius: '12px',
            color: color,
            whiteSpace: 'nowrap',
            transform: 'translateY(-35px)',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: `0 0 25px ${color}`,
            border: `2px solid ${color}`,
            backdropFilter: 'blur(4px)',
          }}>
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Portal Effect Component
const PortalEffect = ({ color, onComplete }) => {
  const meshRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (meshRef.current) {
      const mesh = meshRef.current;
      scene.add(mesh);
      gsap.to(mesh.position, {
        y: 2,
        duration: 1,
        onComplete
      });

      return () => {
        scene.remove(mesh);
      };
    }
  }, [scene, onComplete]);

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <circleGeometry args={[1, 32]} />
      <shaderMaterial
        uniforms={{
          time: { value: 0 },
          color: { value: new THREE.Color(color) }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          void main() {
            float dist = length(vUv - vec2(0.5));
            float alpha = smoothstep(0.5, 0.4, dist);
            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent={true}
      />
    </mesh>
  );
};

// 3D Model Component for Chakra Details
const ChakraModel = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
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

const ChakraHumanBody = () => {
  const navigate = useNavigate();
  const [selectedChakra, setSelectedChakra] = useState(null);
  const [showPortal, setShowPortal] = useState(false);

  const handleChakraClick = (chakra) => {
    setSelectedChakra(chakra);
    setShowPortal(true);
  };

  const handlePortalComplete = () => {
    setShowPortal(false);
    navigate(`/dashboard/chakras/${selectedChakra.id}`);
  };

  const handleClose = () => {
    setSelectedChakra(null);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const getChakraPosition = (chakraId) => {
    switch (chakraId) {
      case 7: return [0, 1.8, 0.2];   // Crown (Purple)
      case 6: return [0, 1.2, 0.2];   // Third Eye (Indigo)
      case 5: return [0, 0.6, 0.2];   // Throat (Blue)
      case 4: return [0, 0, 0.2];     // Heart (Green)
      case 3: return [0, -0.6, 0.2];  // Solar Plexus (Yellow)
      case 2: return [0, -1.2, 0.2];  // Sacral (Orange)
      case 1: return [0, -1.8, 0.2];  // Root (Red)
      default: return [0, 0, 0.2];
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        overflow: 'hidden',
        background: '#000',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/okay.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'glow 4s ease-in-out infinite',
          filter: 'brightness(1.2)',
          zIndex: 0
        },
        '@keyframes glow': {
          '0%': { filter: 'brightness(1.2)' },
          '50%': { filter: 'brightness(1.4)' },
          '100%': { filter: 'brightness(1.2)' }
        }
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          top: 30,
          left: 30,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1000,
          padding: '12px',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.5)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease'
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      {/* Title */}
      <Typography
        variant="h2"
        sx={{
          position: 'absolute',
          top: 30,
          width: '100%',
          textAlign: 'center',
          color: '#fff',
          fontFamily: '"Playfair Display", serif',
          fontWeight: 300,
          letterSpacing: '0.5em',
          textShadow: '0 0 30px rgba(255,255,255,0.6)',
          opacity: 0.9,
          pointerEvents: 'none',
          zIndex: 3,
          fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
          padding: '0 20px'
        }}
      >
        Sacred Chakra Journey
      </Typography>

      {/* Main Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ 
          position: 'relative', 
          zIndex: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          {/* Background particles */}
          <Sparkles
            count={200}
            scale={12}
            size={1.5}
            speed={0.3}
            opacity={0.1}
          />

          {/* Chakra Points */}
          {chakraData.map((chakra) => (
            <ChakraPoint
              key={chakra.id}
              position={getChakraPosition(chakra.id)}
              color={chakra.color}
              name={chakra.name}
              onClick={() => handleChakraClick(chakra)}
            />
          ))}

          {showPortal && selectedChakra && (
            <PortalEffect
              color={selectedChakra.color}
              onComplete={handlePortalComplete}
            />
          )}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>

      {/* Chakra Details Modal */}
      <Dialog
        open={Boolean(selectedChakra) && !showPortal}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            border: selectedChakra ? `2px solid ${selectedChakra?.color}` : 'none',
            boxShadow: selectedChakra ? `0 0 30px ${selectedChakra?.color}` : 'none',
            minHeight: '60vh'
          }
        }}
      >
        {selectedChakra && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${selectedChakra.color}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h4" sx={{ color: selectedChakra.color }}>
                {selectedChakra.name}
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 400, border: `1px solid ${selectedChakra.color}`, borderRadius: 2 }}>
                    <Canvas camera={{ position: [0, 0, 3] }}>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <ChakraModel modelPath={`/models/chakras/stargate.glb`} />
                        <OrbitControls />
                      </Suspense>
                    </Canvas>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: selectedChakra.color }}>
                    Position: {selectedChakra.position}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedChakra.description}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ color: selectedChakra.color }}>
                    Mantra: {selectedChakra.mantra}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ color: selectedChakra.color }}>
                    Frequency: {selectedChakra.frequency}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ borderTop: `1px solid ${selectedChakra.color}` }}>
              <Button 
                onClick={handleClose}
                sx={{ 
                  color: selectedChakra.color,
                  borderColor: selectedChakra.color,
                  '&:hover': {
                    borderColor: selectedChakra.color,
                    backgroundColor: `${selectedChakra.color}22`
                  }
                }}
                variant="outlined"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ChakraHumanBody;
