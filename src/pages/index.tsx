import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Head from 'next/head';

// This component handles the high-performance 8K video mapping
function ClubScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    // 1. Create the video element manually for maximum browser compatibility
    const vid = document.createElement("video");
    vid.src = "/club-bg.mp4";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true; // Required for iOS/Safari 2026
    vid.crossOrigin = "anonymous";
    
    // 2. Force play immediately (muted)
    vid.play().catch(err => console.warn("Video waiting for interaction:", err));

    // 3. Create the Three.js Texture
    const texture = new THREE.VideoTexture(vid);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    setVideoTexture(texture);

    return () => {
      vid.pause();
      vid.src = "";
      vid.load();
    };
  }, []);

  if (!videoTexture) return null;

  return (
    <mesh ref={meshRef} scale={[16, 9, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={videoTexture} toneMapped={false} />
    </mesh>
  );
}

export default function AILounge() {
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle the "Enter" click to sync audio/video
  const handleEntry = () => {
    setStarted(true);
    // GSAP Glitch Effect on UI
    gsap.to(".glitch-ui", {
      opacity: 0.3,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      onComplete: () => gsap.to(".glitch-ui", { opacity: 1 })
    });
  };

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-['Syncopate']">
      <Head>
        <title>AI LOUNGE // AFTER DARK</title>
      </Head>

      {/* Layer 0: 3D Render Engine */}
      <Canvas className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          {started && <ClubScene />}
          <ambientLight intensity={1} />
        </Suspense>
      </Canvas>

      {/* Layer 1: HUD / Branding */}
      <div className="absolute top-10 left-10 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="glitch-ui glitch-text text-[10px] tracking-[0.5em] text-purple-500">
          SM0K367 // NEURAL_GATEWAY
        </div>
        <div className="text-[8px] text-white/30 tracking-widest">
          STATUS: ONLINE // FEB_2026_PROTOCAL
        </div>
      </div>

      {/* Layer 2: Main Interaction Logic */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="glitch-text text-4xl md:text-6xl font-bold text-center leading-tight drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          {started ? "THE_ALGORITHM_IS_ABSOLUTE" : ""}
        </h1>
      </div>

      {/* Entry Gatekeeper */}
      {!started && (
        <div 
          onClick={handleEntry}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 cursor-crosshair group"
        >
          <div className="glitch-text text-xl border border-purple-500/30 p-12 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-500">
            [ INITIALIZE_SESSION ]
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-[7px] text-white/20 whitespace-nowrap tracking-[1em] uppercase">
        Vercel_Edge_Deployment_Active
      </div>
    </div>
  );
}
