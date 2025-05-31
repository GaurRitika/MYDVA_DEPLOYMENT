// src/utils/sacredGeometry.js
export const calculateSriYantra = () => {
    const points = [];
    const triangles = 9;
    const radius = 1;
    
    for (let i = 0; i < triangles; i++) {
      const angle = (i * 2 * Math.PI) / triangles;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(x, y, 0);
    }
    
    return new Float32Array(points);
  };
  
  export const calculateGoldenRatio = (size) => {
    const phi = (1 + Math.sqrt(5)) / 2;
    return size * phi;
  };
  