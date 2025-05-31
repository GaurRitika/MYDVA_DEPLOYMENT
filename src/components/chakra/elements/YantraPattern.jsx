
// src/components/chakra/elements/YantraPattern.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const YantraPattern = ({ color, complexity = 9 }) => {
  const yantraRef = useRef();
  
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < complexity; i++) {
      const angle = (i / complexity) * Math.PI * 2;
      const radius = 1 + Math.sin(i * 0.5) * 0.3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
    }
    return new THREE.ShapeGeometry(shape);
  }, [complexity]);

  useFrame(({ clock }) => {
    if (yantraRef.current) {
      yantraRef.current.rotation.z = clock.getElapsedTime() * 0.2;
      yantraRef.current.scale.x = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
      yantraRef.current.scale.y = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <mesh ref={yantraRef} geometry={geometry}>
      <meshPhongMaterial 
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={0.5}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

export default YantraPattern;