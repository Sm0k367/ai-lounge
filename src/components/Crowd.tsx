import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AudioEngine } from '../lib/audioUtils';
import { User } from '../lib/multiplayer';

interface CrowdProps {
  audioEngine?: AudioEngine;
  users?: User[];
}

export default function Crowd({ audioEngine, users = [] }: CrowdProps) {
  return (
    <group position={[0, -3, -8]}>
      {/* Simulated crowd members */}
      <SimulatedCrowd audioEngine={audioEngine} />
      
      {/* Real multiplayer users */}
      {users.map((user) => (
        <UserAvatar key={user.id} user={user} audioEngine={audioEngine} />
      ))}
    </group>
  );
}

// Simulated crowd for atmosphere
function SimulatedCrowd({ audioEngine }: { audioEngine?: AudioEngine }) {
  const crowdRef = useRef<THREE.InstancedMesh>(null);
  const crowdCount = 50;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const positions = useMemo(() => {
    const pos: { x: number; y: number; z: number; phase: number }[] = [];
    for (let i = 0; i < crowdCount; i++) {
      const angle = (i / crowdCount) * Math.PI * 2;
      const radius = 5 + Math.random() * 5;
      pos.push({
        x: Math.cos(angle) * radius,
        y: 0,
        z: Math.sin(angle) * radius,
        phase: Math.random() * Math.PI * 2
      });
    }
    return pos;
  }, []);
  
  useFrame(({ clock }) => {
    if (!crowdRef.current) return;
    
    const bass = audioEngine?.getBass() || 0;
    const isBeat = audioEngine?.isBeat() || false;
    
    positions.forEach((pos, i) => {
      // Bounce on beat
      const bounce = isBeat ? 0.5 : 0;
      const wave = Math.sin(clock.elapsedTime * 2 + pos.phase) * 0.2;
      
      dummy.position.set(pos.x, wave + bounce + bass * 0.5, pos.z);
      dummy.scale.set(1, 1 + bass * 0.3, 1);
      
      // Rotate towards center
      dummy.lookAt(0, 0, 0);
      
      dummy.updateMatrix();
      crowdRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    crowdRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={crowdRef} args={[undefined, undefined, crowdCount]}>
      <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

// Real user avatar in 3D space
function UserAvatar({ user, audioEngine }: { user: User; audioEngine?: AudioEngine }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const bass = audioEngine?.getBass() || 0;
    const isBeat = audioEngine?.isBeat() || false;
    
    // Bounce on beat
    if (isBeat) {
      meshRef.current.position.y = user.position.y + 0.5;
    } else {
      meshRef.current.position.y += (user.position.y - meshRef.current.position.y) * 0.1;
    }
    
    // Scale with bass
    const scale = 1 + bass * 0.2;
    meshRef.current.scale.set(scale, scale, scale);
  });
  
  const color = new THREE.Color(user.color);
  
  return (
    <mesh
      ref={meshRef}
      position={[user.position.x, user.position.y, user.position.z]}
    >
      <capsuleGeometry args={[0.4, 1, 4, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}
