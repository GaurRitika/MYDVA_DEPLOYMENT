// src/components/chakra/ChakraModel3D.jsx

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const ChakraModel3D = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);

  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <primitive object={scene} scale={1} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default ChakraModel3D;
