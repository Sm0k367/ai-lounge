import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import gsap from 'gsap';
import Head from 'next/head';

function ClubBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [video] = useState(() => {
    if (typeof window === 'undefined') return null;
    const vid = document.createElement("video");
    vid.src = "/club-bg.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    return vid;
  });

  useEffect(() => {
    if (video) video.play();
  }, [video]);

  return (
    <mesh ref={meshRef} scale={[16, 9, 1]}>
      <planeGeometry />
      <meshBasicMaterial toneMapped={false}>
        {video && <videoTexture attach="map" args={[video]} />}
      </meshBasicMaterial>
    </mesh>
  );
}

export default function AILounge() {
  const [started, setStarted] = useState(false);
  const lyricRef = useRef<HTMLDivElement>(null);

  // Trigger a "Glitch" animation on a timer to simulate a beat
  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        gsap.to(".glitch-text", {
          skewX: 20,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power4.inOut"
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [started]);

  if (typeof window === 'undefined') return null;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-['Syncopate']">
      <Head>
        <title>AI LOUNGE // AFTER DARK</title>
      </Head>

      <Canvas className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Stars radius={100} count={5000} factor={4} fade speed={2} />
          <ClubBackground />
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>

      {/* Kinetic Typography Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div ref={lyricRef} className="glitch-text text-4xl font-bold text-center px-10">
          {started ? "SHOCK_TO_YOUR_SYSTEM" : ""}
        </div>
      </div>

      {/* Top UI */}
      <div className="absolute top-10 left-10 z-30 flex flex-col gap-2">
        <div className="glitch-text text-[10px] tracking-widest">SM0K367 // NEURAL_SINGULARITY</div>
        <div className="text-[8px] text-white/40 tracking-[0.8em]">SYSTEM_STABLE: 16.1.6</div>
      </div>

      {/* Gatekeeper Button */}
      {!started && (
        <div 
          onClick={() => {
            setStarted(true);
            const vid = document.querySelector('video');
            if (vid) vid.play();
          }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 cursor-pointer hover:bg-black/80 transition-colors"
        >
          <div className="glitch-text text-2xl border border-purple-500 p-8 hover:bg-purple-500/10 transition-all">
            ENTER_THE_MAINFRAME
          </div>
        </div>
      )}

      {/* Bottom Status */}
      <div className="absolute bottom-10 left-10 z-30 text-[8px] text-white/30 uppercase tracking-tighter">
        Friction_and_Flow // No_Law_Tonight // Gods_in_the_Haze
      </div>
    </div>
  );
}
