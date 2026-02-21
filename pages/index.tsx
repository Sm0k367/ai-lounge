import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, VideoTexture, Stars, Center } from '@react-three/drei';
import Head from 'next/head';

// This component handles the video texture loading
function ClubBackground() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = document.createElement("video");
    vid.src = "/club-bg.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play().catch(e => console.log("Auto-play blocked, waiting for user interaction", e));
    setVideo(vid);
  }, []);

  if (!video) return null;

  return (
    <mesh scale={[16, 9, 1]}>
      <planeGeometry />
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </mesh>
  );
}

export default function AILounge() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen bg-black">
      <Head>
        <title>AI LOUNGE // AFTER DARK</title>
      </Head>

      {/* Layer 1: 3D Scene */}
      <Canvas className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ClubBackground />
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>

      {/* Layer 2: UI Overlays */}
      <div className="absolute top-10 left-10 z-10 glitch-text text-sm">
        SM0K367 // ACCESS_GRANTED
      </div>

      <div className="absolute bottom-10 right-10 z-10 text-[10px] opacity-50 tracking-[0.5em]">
        NEURAL_SINGULARITY_V1.0
      </div>

      {/* Initiation Overlay */}
      <div 
        id="gatekeeper"
        onClick={(e) => {
          (e.currentTarget as HTMLElement).style.display = 'none';
          const vid = document.querySelector('video');
          if (vid) vid.play();
        }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 cursor-crosshair group"
      >
        <span className="glitch-text text-xl group-hover:scale-110 transition-transform duration-500">
          [ INITIATE_SESSION ]
        </span>
      </div>
    </div>
  );
}
