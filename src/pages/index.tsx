import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars, useVideoTexture } from '@react-three/drei';
import gsap from 'gsap';
import Head from 'next/head';

// Cinematic Video Mesh
function ClubScene() {
  const texture = useVideoTexture("/club-bg.mp4");
  
  return (
    <mesh scale={[16, 9, 1]}>
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
    // Pulsing background ambient light logic
    if (started) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(".glitch-ui", { opacity: 0.2, duration: 0.1, stagger: 0.05 })
        .to(".glitch-ui", { opacity: 1, duration: 0.1 });
    }
  }, [started]);

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-['Syncopate']">
      <Head>
        <title>AI LOUNGE // AFTER DARK</title>
      </Head>

      <Canvas className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          {started && <ClubScene />}
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>

      {/* Dynamic HUD */}
      <div className="absolute top-10 left-10 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="glitch-ui glitch-text text-[10px] tracking-[0.5em]">
          SM0K367 // NEURAL_GATEWAY
        </div>
        <div className="text-[8px] text-white/30 tracking-widest">
          NODE_STABLE: 22.1.0 // NEXT_LTS: 16.1.6
        </div>
      </div>

      {/* Center Narrative */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
        <h1 className="glitch-text text-3xl md:text-5xl font-bold text-center leading-tight">
          {started ? "THE_ALGORITHM_IS_ABSOLUTE" : ""}
        </h1>
      </div>

      {/* Entry System */}
      {!started && (
        <div 
          onClick={() => setStarted(true)}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 cursor-crosshair group transition-all duration-1000"
        >
          <div className="glitch-text text-xl border border-purple-500/50 p-12 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300 active:scale-95">
            [ INITIALIZE_EXPERIENCE ]
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-[7px] text-white/20 whitespace-nowrap tracking-[1em] uppercase">
        Realtime_Neural_Sync_Active // Feb_2026_Standard
      </div>
    </div>
  );
}
