// src/utils/animationControls.js
import { animate } from 'framer-motion';

export const createGeometryAnimation = (mesh) => {
  return animate(
    mesh.rotation,
    { z: Math.PI * 2 },
    { duration: 20, repeat: Infinity, ease: 'linear' }
  );
};

export const createPulseAnimation = (mesh) => {
  return animate(
    mesh.scale,
    { x: [1, 1.2, 1], y: [1, 1.2, 1], z: [1, 1.2, 1] },
    { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  );
};
