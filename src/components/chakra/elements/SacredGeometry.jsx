// src/components/chakra/elements/SacredGeometry.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SacredGeometry = ({ color, complexity = 6 }) => {
  const geometryRef = useRef();
  const pointsRef = useRef();

  useFrame(({ clock }) => {
    if (geometryRef.current) {
      const time = clock.getElapsedTime();
      geometryRef.current.rotation.z = time * 0.2;
      
      const points = [];
      for (let i = 0; i < complexity; i++) {
        const angle = (i / complexity) * Math.PI * 2;
        const radius = 1 + Math.sin(time + i) * 0.2;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
          )
        );
      }
      geometryRef.current.geometry.setFromPoints(points);
    }
  });

  return (
    <group ref={geometryRef}>
      <line>
        <bufferGeometry />
        <lineBasicMaterial 
          color={color} 
          linewidth={2}
          transparent
          opacity={0.6}
        />
      </line>
      {Array(complexity).fill().map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshPhongMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

export default SacredGeometry;
