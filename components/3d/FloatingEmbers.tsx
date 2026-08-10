'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingEmbersProps {
  count?: number;
}

export const FloatingEmbers: React.FC<FloatingEmbersProps> = ({ count = 90 }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate particle positions, speeds and sizes
  const [positions, scales, speeds, opacityPhase] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const spe = new Float32Array(count * 3);
    const opa = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // X: spread across screen
      pos[i * 3] = (Math.random() - 0.5) * 16;
      // Y: vertically distributed
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      // Z: depth placement
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // Particle scale
      sca[i] = Math.random() * 0.12 + 0.04;

      // Velocity: slowly rising up with mild horizontal sway
      spe[i * 3] = (Math.random() - 0.5) * 0.008; // X sway
      spe[i * 3 + 1] = Math.random() * 0.015 + 0.006; // Y rise
      spe[i * 3 + 2] = (Math.random() - 0.5) * 0.004; // Z drift

      opa[i] = Math.random() * Math.PI * 2;
    }

    return [pos, sca, spe, opa];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Move Y up
      array[i * 3 + 1] += speeds[i * 3 + 1];
      // Move X sway
      array[i * 3] += Math.sin(state.clock.elapsedTime * 1.5 + opacityPhase[i]) * 0.003;

      // Reset when particle goes above screen
      if (array[i * 3 + 1] > 6) {
        array[i * 3 + 1] = -6;
        array[i * 3] = (Math.random() - 0.5) * 16;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#FF6A00"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
