import { useState, useRef, useEffect } from 'react';

export const useAudioAnalyzer = () => {
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

  return audioData;
};