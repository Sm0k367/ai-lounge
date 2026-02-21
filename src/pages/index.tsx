import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Head from 'next/head';

function ClubScene({ started }: { started: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // 1. Memoize the video element so it's only created once
  const video = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const vid = document.createElement("video");
    vid.src = "/club-bg.mp4";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.crossOrigin = "anonymous";
    return vid;
  }, []);

  // 2. Create the texture
  const texture = useMemo(() => {
    if (!video) return null;
    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [video]);

  // 3. THE FRAME PUMP: This forces the texture to update every frame
  useFrame(() => {
    if (started && video && video.readyState >= video.HAVE_CURRENT_DATA) {
      texture!.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (started && video) {
      video.play().catch(e => console.error("Playback failed:", e));
    }
  }, [started, video]);

  if (!texture) return null;

  return (
    <mesh ref={meshRef} scale={[16, 9, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function AILounge() {
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-['Syncopate']">
      <Head>
        <title>AI LOUNGE // AFTER DARK</title>
      </Head>

      <Canvas className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Stars radius={100} count={5000} factor={4} fade speed={1} />
          <ClubScene started={started} />
          <ambientLight intensity={1.5} />
        </Suspense>
      </Canvas>

      {/* Interface Layer */}
      <div className="absolute top-10 left-10 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="glitch-text text-[10px] tracking-[0.5em] text-purple-400">
          SM0K367 // NEURAL_GATEWAY
        </div>
      </div>

      {!started && (
        <div 
          onClick={() => setStarted(true)}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 cursor-crosshair transition-all"
        >
          <div className="glitch-text text-xl border border-purple-500/30 p-12 hover:bg-purple-500/10 hover:border-purple-500 transition-all">
            [ INITIALIZE_SESSION ]
          </div>
        </div>
      )}

      {started && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <h1 className="glitch-text text-4xl md:text-6xl font-bold text-center opacity-80">
            SYSTEM_ACTIVE
          </h1>
        </div>
      )}
    </div>
  );
}
