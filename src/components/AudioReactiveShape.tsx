import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AudioReactiveShapeProps {
  position: [number, number, number];
  baseColor: string;
  audioData: Uint8Array;
  frequencyBand: number;
  complexity: number;
}

const generateNoise = (amplitude: number): number => {
  return (Math.random() - 0.5) * amplitude;
};

const lerpColor = (color1: string, color2: string, t: number): string => {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  const r = c1.r + (c2.r - c1.r) * t;
  const g = c1.g + (c2.g - c1.g) * t;
  const b = c1.b + (c2.b - c1.b) * t;
  return new THREE.Color(r, g, b).getHexString();
};

export const AudioReactiveShape: React.FC<AudioReactiveShapeProps> = ({
  position,
  baseColor,
  audioData,
  frequencyBand,
  complexity,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const [originalPosition] = React.useState(position);
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const audioIntensity = audioData[frequencyBand] / 255;
    
    const baseScale = 1 + audioIntensity * 2;
    const noiseScale = generateNoise(0.1 * audioIntensity);
    meshRef.current.scale.set(
      baseScale + noiseScale,
      baseScale + noiseScale,
      baseScale + noiseScale
    );

    meshRef.current.rotation.x += 0.01 + audioIntensity * 0.05;
    meshRef.current.rotation.y += 0.01 + audioIntensity * 0.05;
    meshRef.current.rotation.z += audioIntensity * 0.02;

    const posOffset = Math.sin(time * 2) * audioIntensity;
    meshRef.current.position.x = originalPosition[0] + posOffset;
    meshRef.current.position.y = originalPosition[1] + Math.cos(time) * audioIntensity;
    
    const pulseColor = lerpColor(baseColor, '#ffffff', audioIntensity);
    materialRef.current.color.setHex(parseInt(pulseColor, 16));
    materialRef.current.emissiveIntensity = audioIntensity * 2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {complexity === 1 ? (
        <icosahedronGeometry args={[1, 2]} />
      ) : complexity === 2 ? (
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      ) : (
        <octahedronGeometry args={[1, 2]} />
      )}
      <meshPhysicalMaterial
        ref={materialRef}
        color={baseColor}
        roughness={0.2}
        metalness={0.8}
        emissive={baseColor}
        emissiveIntensity={1}
        wireframe={true}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
};