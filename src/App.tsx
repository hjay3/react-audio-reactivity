import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Scene } from './components/Scene';
import { RewardManager } from './components/RewardManager';

const App: React.FC = () => {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(32));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const audioContext = new AudioContext();
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 64;
        analyzer.smoothingTimeConstant = 0.8;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);

        audioContextRef.current = audioContext;
        analyzerRef.current = analyzer;

        const updateAudioData = () => {
          const dataArray = new Uint8Array(analyzer.frequencyBinCount);
          analyzer.getByteFrequencyData(dataArray);
          setAudioData(dataArray);
          requestAnimationFrame(updateAudioData);
        };

        updateAudioData();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <>
      <div className="w-screen h-screen">
        <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
          <Scene audioData={audioData} />
          <EffectComposer>
            <Bloom 
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
            <ChromaticAberration offset={[0.002, 0.002]} />
          </EffectComposer>
        </Canvas>
      </div>
      <RewardManager audioData={audioData} />
    </>
  );
};

export default App;