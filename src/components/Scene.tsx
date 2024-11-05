import React from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import { AudioReactiveShape } from './AudioReactiveShape';
import { ParticleField } from './ParticleField';

interface SceneProps {
  audioData: Uint8Array;
}

export const Scene: React.FC<SceneProps> = ({ audioData }) => {
  return (
    <>
      <color attach="background" args={['#000008']} />
      <fog attach="fog" args={['#000008', 5, 30]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        castShadow
      />
      
      <ParticleField audioData={audioData} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      
      <AudioReactiveShape 
        position={[-4, 0, 0]}
        baseColor="#ff3366"
        audioData={audioData}
        frequencyBand={0}
        complexity={1}
      />
      <AudioReactiveShape 
        position={[0, 0, 0]}
        baseColor="#33ff99"
        audioData={audioData}
        frequencyBand={4}
        complexity={2}
      />
      <AudioReactiveShape 
        position={[4, 0, 0]}
        baseColor="#3366ff"
        audioData={audioData}
        frequencyBand={8}
        complexity={3}
      />
      
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </>
  );
};