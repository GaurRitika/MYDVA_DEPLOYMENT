// src/components/sacred/SacredAnimations.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const SacredSymbol = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  background: url('/path-to-your-symbol.svg');
  background-size: contain;
  opacity: 0.6;
`;

export const FloatingSymbols = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <SacredSymbol
          key={i}
          initial={{ y: 0, x: i * 200 }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </>
  );
};
