// src/components/chakra/EnhancedChakraDetails.jsx
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Sparkles, Text3D, Float } from '@react-three/drei';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Fade,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { chakraData } from '../../data/chakraData';
import { Howl } from 'howler';
import * as THREE from 'three';

const ChakraModel = ({ color }) => {
  const modelRef = useRef();
  const glowRef = useRef();
  const { scene } = useGLTF('/models/chakras/stargate.glb');

  useEffect(() => {
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
  }, [scene, color]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.rotation.y = time * 0.5;
      modelRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.rotation.z = time * 0.3;
      glowRef.current.scale.set(
        1 + Math.sin(time) * 0.1,
        1 + Math.sin(time) * 0.1,
        1
      );
    }
  });

  return (
    <group>
      <primitive
        ref={modelRef}
        object={scene.clone()}
        scale={2}
        position={[0, 0, 0]}
      />
      
      {/* Energy field effect */}
      <mesh ref={glowRef} position={[0, 0, -2]}>
        <torusGeometry args={[3, 0.2, 16, 100]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const FloatingMantra = ({ text, color }) => {
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      position={[0, 2, 0]}
    >
      <Text3D
        font="/fonts/Sanskrit_Regular.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
      >
        {text}
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Text3D>
    </Float>
  );
};

const EnhancedChakraDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chakra = chakraData.find((c) => c.id === parseInt(id));
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const sound = useRef(null);

  useEffect(() => {
    if (chakra) {
      sound.current = new Howl({
        src: [`/audio/mantras/${chakra.mantra.toLowerCase()}.mp3`],
        loop: true,
        volume: 0.5,
        onload: () => setLoading(false),
      });
    }

    return () => {
      if (sound.current) {
        sound.current.stop();
      }
    };
  }, [chakra]);

  const toggleSound = () => {
    if (isPlaying) {
      sound.current?.stop();
    } else {
      sound.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!chakra) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#000' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

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
      {/* Background glow effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at center, ${chakra.color}22 0%, #00000000 70%)`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Navigation and Controls */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          display: 'flex',
          gap: 2,
        }}
      >
        <IconButton
          onClick={() => navigate('/dashboard/chakras')}
          sx={{
            color: chakra.color,
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={toggleSound}
          disabled={loading}
          sx={{
            color: chakra.color,
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
      </Box>

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
        }}
      >
        {chakra.name}
      </Typography>

      {/* Main 3D Scene */}
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
          <FloatingMantra text={chakra.mantra} color={chakra.color} />
          
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
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>

      {/* Information Panel */}
      <Fade in={true}>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: 40,
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: '400px',
              background: 'rgba(0,0,0,0.7)',
              padding: 4,
              borderRadius: 2,
              border: `1px solid ${chakra.color}`,
              boxShadow: `0 0 30px ${chakra.color}40`,
              zIndex: 10,
              color: '#fff',
            }}
          >
            <Typography variant="h5" sx={{ color: chakra.color, mb: 2 }}>
              Position: {chakra.position}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              {chakra.description}
            </Typography>
            <Typography variant="h6" sx={{ color: chakra.color, mb: 1 }}>
              Mantra: {chakra.mantra}
            </Typography>
            <Typography variant="h6" sx={{ color: chakra.color, mb: 3 }}>
              Frequency: {chakra.frequency}
            </Typography>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={toggleSound}
              disabled={loading}
              sx={{
                color: chakra.color,
                borderColor: chakra.color,
                '&:hover': {
                  borderColor: chakra.color,
                  backgroundColor: `${chakra.color}22`,
                },
                '&.Mui-disabled': {
                  borderColor: `${chakra.color}44`,
                  color: `${chakra.color}44`,
                },
              }}
            >
              {loading ? 'Loading Mantra...' : isPlaying ? 'Stop Mantra' : 'Play Mantra'}
            </Button>
          </Box>
        </motion.div>
      </Fade>
    </Box>
  );
};

export default EnhancedChakraDetails;
