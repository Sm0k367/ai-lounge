import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, VideoTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Head from 'next/head';

function Scene() {
  const [video] = useState(() => {
    const vid = typeof window !== 'undefined' ? document.createElement("video") : null;
    if (vid) {
      vid.src = "/club-bg.mp4";
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      vid.muted = true; // Auto-play requires mute on first load
      vid.play();
    }
    return vid;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* The Cinematic Video Stage */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[16, 9]} />
        <meshBasicMaterial toneMapped={false}>
           {video && <videoTexture attach="map" args={[video]} />}
        </meshBasicMaterial>
      </mesh>

      {/* Ambient Cyber Glow */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#8b5cf6" intensity={2} />
    </>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Head>
        <title>AI LOUNGE // AFTER DARK</title>
      </Head>

      {!started && (
        <div 
          onClick={() => setStarted(true)}
          style={{
            position: "fixed", inset: 0, zIndex: 100, display: "flex", 
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            background: "rgba(0,0,0,0.9)", color: "#8b5cf6", letterSpacing: "0.5rem"
          }}>
          INITIATE_SESSION
        </div>
      )}

      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: "fixed", top: 40, left: 40, zIndex: 10,
        color: "#8b5cf6", fontSize: "0.7rem", textShadow: "0 0 10px #8b5cf6"
      }}>
        SM0K367 // NEURAL_SINGULARITY_V1.0
      </div>
    </div>
  );
}
