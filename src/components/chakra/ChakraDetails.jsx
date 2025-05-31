// src/components/chakra/ChakraDetails.jsx
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { chakraData } from '../../data/chakraData';

const ChakraModel = ({ modelPath }) => {
  // Update the path to include the correct public path
  const fullPath = `/models/chakras/${modelPath}`;
  const { scene } = useGLTF(fullPath);

  return (
    <primitive 
      object={scene} 
      scale={1.5} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]} 
    />
  );
};

const ChakraDetails = () => {
  const { id } = useParams();
  const chakra = chakraData.find((c) => c.id === parseInt(id));

  if (!chakra) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Chakra not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: 400,
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: 'transparent' }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <spotLight
                    position={[0, 5, 5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={1}
                    castShadow
                  />
                  <ChakraModel modelPath={chakra.modelFile} />
                  <OrbitControls 
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={2}
                    maxDistance={10}
                  />
                </Suspense>
              </Canvas>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3 
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: chakra.color,
                    boxShadow: 3
                  }}
                />
                <Typography variant="h4" color="primary">
                  {chakra.name}
                </Typography>
              </Box>

              <Typography 
                variant="body1" 
                paragraph 
                sx={{ fontSize: '1.1rem' }}
              >
                {chakra.description}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Position: {chakra.position}
                </Typography>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Mantra: {chakra.mantra}
                </Typography>
                <Typography variant="h6" color="secondary">
                  Frequency: {chakra.frequency}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ChakraDetails;
