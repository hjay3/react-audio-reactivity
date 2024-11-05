import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  audioData: Uint8Array;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ audioData }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame(() => {
    if (!particlesRef.current) return;
    const avgAudio = Array.from(audioData).reduce((a, b) => a + b, 0) / audioData.length;
    particlesRef.current.rotation.y += 0.001 * (avgAudio / 128);
    particlesRef.current.rotation.x += 0.0005 * (avgAudio / 128);
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};