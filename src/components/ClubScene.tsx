import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AudioEngine } from '../lib/audioUtils';

interface ClubSceneProps {
  started: boolean;
  audioEngine?: AudioEngine;
}

export default function ClubScene({ started, audioEngine }: ClubSceneProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const vid = document.createElement("video");
    vid.src = "/club-bg.mp4";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.crossOrigin = "anonymous";
    videoRef.current = vid;
    const tex = new THREE.VideoTexture(vid);
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);
    return () => {
      vid.pause();
      vid.src = "";
      vid.remove();
    };
  }, []);

  useFrame(() => {
    if (started && videoRef.current && texture) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
      texture.needsUpdate = true;
    }
    
    // Audio-reactive scaling
    if (meshRef.current && audioEngine) {
      const bass = audioEngine.getBass();
      const scale = 1 + bass * 0.05;
      meshRef.current.scale.set(scale * 16, scale * 9, 1);
    }
  });

  if (!texture) return null;
  
  return (
    <>
      <mesh ref={meshRef} scale={[16, 9, 1]} position={[0, 0, -5]}>
        <planeGeometry />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      
      {/* Audio-reactive particles */}
      <AudioParticles audioEngine={audioEngine} />
      
      {/* Laser beams */}
      <LaserBeams audioEngine={audioEngine} />
      
      {/* Floor grid */}
      <FloorGrid audioEngine={audioEngine} />
    </>
  );
}

// Audio-reactive particle system
function AudioParticles({ audioEngine }: { audioEngine?: AudioEngine }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      
      const color = new THREE.Color();
      color.setHSL(Math.random(), 1, 0.5);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return [pos, col];
  }, []);
  
  useFrame(() => {
    if (particlesRef.current && audioEngine) {
      const bass = audioEngine.getBass();
      const mids = audioEngine.getMids();
      const treble = audioEngine.getTreble();
      
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const colArray = particlesRef.current.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        // Move particles based on audio
        posArray[i * 3 + 1] += (bass * 0.1 + mids * 0.05);
        
        // Wrap around
        if (posArray[i * 3 + 1] > 10) {
          posArray[i * 3 + 1] = -10;
        }
        
        // Color shift based on treble
        const hue = (colArray[i * 3] + treble * 0.01) % 1;
        const color = new THREE.Color();
        color.setHSL(hue, 1, 0.5 + bass * 0.3);
        colArray[i * 3] = color.r;
        colArray[i * 3 + 1] = color.g;
        colArray[i * 3 + 2] = color.b;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
      
      // Rotate particle system
      particlesRef.current.rotation.y += 0.001 + mids * 0.01;
    }
  });
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Laser beam effects
function LaserBeams({ audioEngine }: { audioEngine?: AudioEngine }) {
  const beamRefs = useRef<THREE.Mesh[]>([]);
  const beamCount = 8;
  
  useFrame(() => {
    if (audioEngine) {
      const isBeat = audioEngine.isBeat();
      const bass = audioEngine.getBass();
      
      beamRefs.current.forEach((beam, i) => {
        if (beam) {
          // Rotate beams
          beam.rotation.z += 0.02 + bass * 0.05;
          
          // Flash on beat
          if (isBeat) {
            const material = beam.material as THREE.MeshBasicMaterial;
            material.opacity = 0.8;
          } else {
            const material = beam.material as THREE.MeshBasicMaterial;
            material.opacity = Math.max(0.2, material.opacity * 0.95);
          }
        }
      });
    }
  });
  
  return (
    <group position={[0, 5, -10]}>
      {Array.from({ length: beamCount }).map((_, i) => {
        const angle = (i / beamCount) * Math.PI * 2;
        const color = new THREE.Color();
        color.setHSL(i / beamCount, 1, 0.5);
        
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) beamRefs.current[i] = el;
            }}
            position={[Math.cos(angle) * 2, 0, Math.sin(angle) * 2]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.1, 20, 0.1]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Audio-reactive floor grid
function FloorGrid({ audioEngine }: { audioEngine?: AudioEngine }) {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame(() => {
    if (gridRef.current && audioEngine) {
      const bass = audioEngine.getBass();
      const isBeat = audioEngine.isBeat();
      
      // Pulse on beat
      if (isBeat) {
        gridRef.current.scale.set(1.1, 1.1, 1.1);
      } else {
        gridRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      
      // Color shift
      const color = new THREE.Color();
      color.setHSL(0.7 + bass * 0.2, 1, 0.3 + bass * 0.3);
      (gridRef.current.material as THREE.LineBasicMaterial).color = color;
    }
  });
  
  return (
    <gridHelper
      ref={gridRef}
      args={[50, 50, 0x8b5cf6, 0x8b5cf6]}
      position={[0, -5, 0]}
    />
  );
}
