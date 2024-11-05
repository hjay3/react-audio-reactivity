import * as THREE from 'three';

export const generateNoise = (amplitude: number): number => {
  return (Math.random() - 0.5) * amplitude;
};

export const lerpColor = (color1: string, color2: string, t: number): string => {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  const r = c1.r + (c2.r - c1.r) * t;
  const g = c1.g + (c2.g - c1.g) * t;
  const b = c1.b + (c2.b - c1.b) * t;
  return new THREE.Color(r, g, b).getHexString();
};