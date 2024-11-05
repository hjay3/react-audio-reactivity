import React, { useRef, useMemo, useEffect } from 'react';
import { useReward } from 'react-rewards';

interface RewardManagerProps {
  audioData: Uint8Array;
}

export const RewardManager: React.FC<RewardManagerProps> = ({ audioData }) => {
  const rewardIds = useMemo(() => ['reward1', 'reward2', 'reward3', 'reward4', 'reward5'], []);
  const rewards = rewardIds.map(id => useReward(id, 'confetti'));
  const lastTriggerTime = useRef<number>(0);
  
  const positions = useMemo(() => [
    { top: '20%', left: '20%' },
    { top: '20%', right: '20%' },
    { top: '80%', left: '30%' },
    { top: '50%', right: '25%' },
    { top: '65%', left: '50%' }
  ], []);

  const triggerReward = () => {
    const now = Date.now();
    if (now - lastTriggerTime.current < 1000) return;

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const { reward } = rewards[randomIndex];
    
    const rewardTypes = ['confetti', 'emoji', 'balloons'] as const;
    const randomType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
    
    if (reward) {
      switch (randomType) {
        case 'confetti':
          reward({
            spread: 90,
            elementCount: 100,
            elementSize: 8,
            colors: ['#ff3366', '#33ff99', '#3366ff', '#ffff00', '#ff00ff']
          });
          break;
        case 'emoji':
          reward({
            spread: 60,
            elementCount: 20,
            elementSize: 30,
            emoji: ['✨', '💫', '⚡️', '💥', '🌟']
          });
          break;
        case 'balloons':
          reward({
            spread: 45,
            elementCount: 30,
            startVelocity: 45
          });
          break;
      }
      lastTriggerTime.current = now;
    }
  };

  useEffect(() => {
    const checkAudioPeak = () => {
      const avgIntensity = Array.from(audioData).reduce((a, b) => a + b, 0) / audioData.length;
      if (avgIntensity > 200) {
        triggerReward();
      }
      requestAnimationFrame(checkAudioPeak);
    };
    checkAudioPeak();
  }, [audioData]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {positions.map((pos, idx) => (
        <div key={idx} className="absolute" style={pos}>
          <span id={rewardIds[idx]} />
        </div>
      ))}
    </div>
  );
};