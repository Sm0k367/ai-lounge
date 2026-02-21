import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Head from 'next/head';

function ClubScene({ started }: { started: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    // Manual Video Creation - Bypasses React state for speed
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

  // UseFrame forces the GPU to refresh the video every millisecond
  useFrame(() => {
    if (started && videoRef.current && texture) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
      texture.needsUpdate = true;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} scale={[16, 9, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} />
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

      {/* Interface */}
      <div className="absolute top-10 left-10 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="glitch-text text-[10px] tracking-[0.5em] text-purple-400">
          SM0K367 // NEURAL_GATEWAY
        </div>
      </div>

      {!started && (
        <div 
          onClick={() => setStarted(true)}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 cursor-pointer"
        >
          <div className="glitch-text text-xl border border-purple-500/30 p-12 hover:bg-purple-500/10 hover:border-purple-500 transition-all">
            [ INITIALIZE_SESSION ]
          </div>
        </div>
      )}

      {started && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-[7px] text-white/40 tracking-[1em] uppercase">
          STREAMING_8K_NEURAL_LINK
        </div>
      )}
    </div>
  );
}
