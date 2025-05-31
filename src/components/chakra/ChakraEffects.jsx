// src/components/chakra/ChakraEffects.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const ChakraEffects = ({ color, intensity = 1.0 }) => {
  const particlesRef = useRef();
  const glowRef = useRef();
  const ringsRef = useRef();

  // Convert color string to THREE.Color
  const chakraColor = new THREE.Color(color);

  // Create animated rings
  const RingEffect = ({ radius, rotationSpeed, opacity }) => {
    const ringRef = useRef();

    useFrame(({ clock }) => {
      if (ringRef.current) {
        ringRef.current.rotation.z = clock.getElapsedTime() * rotationSpeed;
        // Add breathing effect
        const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
        ringRef.current.scale.set(scale, scale, scale);
      }
    });

    return (
      <mesh ref={ringRef}>
        <ringGeometry args={[radius, radius + 0.1, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  };

  // Energy field effect
  const EnergyField = () => {
    const fieldRef = useRef();
    const fieldGeometry = new THREE.SphereGeometry(2, 32, 32);
    const fieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 finalColor = color * (intensity + 0.2) * pulse;
          gl_FragColor = vec4(finalColor, intensity * 0.5);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    useFrame(({ clock }) => {
      if (fieldRef.current) {
        fieldRef.current.material.uniforms.time.value = clock.getElapsedTime();
      }
    });

    return <mesh ref={fieldRef} geometry={fieldGeometry} material={fieldMaterial} />;
  };

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.intensity = intensity * (1 + Math.sin(clock.getElapsedTime() * 2) * 0.2);
    }
  });

  return (
    <group>
      {/* Particle effects */}
      <Sparkles
        ref={particlesRef}
        count={100}
        scale={4}
        size={0.4}
        speed={0.3}
        opacity={0.5}
        color={color}
      />

      {/* Glowing light */}
      <pointLight
        ref={glowRef}
        color={color}
        intensity={intensity}
        distance={6}
        decay={2}
      />

      {/* Animated rings */}
      <group ref={ringsRef}>
        <RingEffect radius={1.5} rotationSpeed={0.5} opacity={0.3} />
        <RingEffect radius={2.0} rotationSpeed={-0.3} opacity={0.2} />
        <RingEffect radius={2.5} rotationSpeed={0.2} opacity={0.1} />
      </group>

      {/* Energy field */}
      <EnergyField />

      {/* Additional ambient particles */}
      <Sparkles
        count={50}
        scale={8}
        size={0.6}
        speed={0.2}
        opacity={0.3}
        color={color}
      />
    </group>
  );
};

export default ChakraEffects;
