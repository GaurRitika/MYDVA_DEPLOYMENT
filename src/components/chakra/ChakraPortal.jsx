// src/components/chakra/ChakraPortal.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';

export const ChakraPortal = ({ color, position = [0, 0, -2], intensity = 1.0 }) => {
  const portalRef = useRef();
  const glowRef = useRef();
  const particlesRef = useRef();
  const timeRef = useRef(0);

  // Custom shader for portal effect
  const portalMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(color) },
      intensity: { value: intensity }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform float intensity;
      varying vec2 vUv;

      void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = length(vUv - center);
        
        // Create spiral effect
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
        float spiral = sin(dist * 20.0 - time * 2.0 + angle * 2.0);
        
        // Pulsating glow
        float pulse = sin(time) * 0.5 + 0.5;
        
        // Edge glow
        float edge = smoothstep(0.5, 0.4, dist);
        
        // Combine effects
        float alpha = edge * (0.5 + spiral * 0.5) * intensity;
        vec3 finalColor = color * (1.0 + pulse * 0.5);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });

  // Energy field effect
  const EnergyField = () => {
    const fieldRef = useRef();
    const fieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vPosition;
        
        void main() {
          float noise = sin(vPosition.x * 10.0 + time) * 
                       sin(vPosition.y * 10.0 + time) * 
                       sin(vPosition.z * 10.0 + time);
          float alpha = smoothstep(0.0, 1.0, noise * 0.5 + 0.5);
          gl_FragColor = vec4(color, alpha * 0.3);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    useFrame(({ clock }) => {
      if (fieldRef.current) {
        fieldRef.current.material.uniforms.time.value = clock.getElapsedTime();
      }
    });

    return (
      <mesh ref={fieldRef} material={fieldMaterial}>
        <sphereGeometry args={[2.2, 32, 32]} />
      </mesh>
    );
  };

  useFrame(({ clock }) => {
    timeRef.current = clock.getElapsedTime();
    
    if (portalRef.current) {
      portalRef.current.material.uniforms.time.value = timeRef.current;
      portalRef.current.rotation.z = timeRef.current * 0.2;
    }

    if (glowRef.current) {
      glowRef.current.intensity = intensity * (1 + Math.sin(timeRef.current * 2) * 0.2);
    }
  });

  return (
    <group position={position}>
      {/* Main portal ring */}
      <mesh ref={portalRef} material={portalMaterial}>
        <ringGeometry args={[1.5, 2, 64]} />
      </mesh>

      {/* Inner glow */}
      <pointLight
        ref={glowRef}
        color={color}
        intensity={intensity * 2}
        distance={4}
        decay={2}
      />

      {/* Particle effects */}
      <Sparkles
        ref={particlesRef}
        count={50}
        scale={3}
        size={0.4}
        speed={0.3}
        opacity={0.5}
        color={color}
      />

      {/* Energy field */}
      <EnergyField />

      {/* Additional effects */}
      <mesh>
        <ringGeometry args={[1.8, 1.85, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default ChakraPortal;
