'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingEmbers } from './FloatingEmbers';

interface BBQSceneProps {
  className?: string;
  emberCount?: number;
}

export const BBQScene: React.FC<BBQSceneProps> = ({
  className = '',
  emberCount = 80,
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, -2, 2]} intensity={2} color="#FF6A00" />
        <Suspense fallback={null}>
          <FloatingEmbers count={emberCount} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BBQScene;
