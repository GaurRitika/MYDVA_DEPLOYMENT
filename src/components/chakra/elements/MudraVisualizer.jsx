// src/components/chakra/elements/MudraVisualizer.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MudraVisualizer = ({ chakra }) => {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/chakras/stargate.glb');

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
};

export default MudraVisualizer;