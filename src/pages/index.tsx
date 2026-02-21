import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import Head from 'next/head';
import ClubScene from '../components/ClubScene';
import KineticLyrics from '../components/KineticLyrics';
import AIHost from '../components/AIHost';
import Crowd from '../components/Crowd';
import ChatBubbles from '../components/ChatBubbles';
import SocialExport from '../components/SocialExport';
import { AudioEngine } from '../lib/audioUtils';
import { MultiplayerEngine, ChatMessage, User } from '../lib/multiplayer';
import { EventEngine, AchievementEngine } from '../utils/events';

export default function AILounge() {
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);
  const [multiplayerEngine, setMultiplayerEngine] = useState<MultiplayerEngine | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const eventEngineRef = useRef<EventEngine | null>(null);
  const achievementEngineRef = useRef<AchievementEngine | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Initialize event and achievement engines
    eventEngineRef.current = new EventEngine();
    achievementEngineRef.current = new AchievementEngine();
    
    // Check first visit achievement
    achievementEngineRef.current.checkAchievement('first-visit', true);
    
    return () => {
      eventEngineRef.current?.stop();
    };
  }, []);
  
  const handleStart = async () => {
    if (!userName.trim()) {
      alert('Please enter your name!');
      return;
    }
    
    setShowNamePrompt(false);
    
    // Initialize audio engine
    if (audioRef.current) {
      const engine = new AudioEngine();
      await engine.initialize(audioRef.current);
      setAudioEngine(engine);
      audioRef.current.play().catch(() => {});
    }
    
    // Initialize multiplayer
    const mp = new MultiplayerEngine();
    const userId = await mp.initialize(userName);
    
    mp.setOnUserJoined((user) => {
      setUsers((prev) => [...prev, user]);
    });
    
    mp.setOnUserLeft((userId) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    });
    
    mp.setOnChatMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });
    
    setMultiplayerEngine(mp);
    setUsers(mp.getUsers());
    
    // Start event engine
    eventEngineRef.current?.start();
    
    setStarted(true);
  };
  
  const handleSendMessage = (message: string) => {
    multiplayerEngine?.sendChatMessage(message);
  };
  
  if (!mounted) return null;
  
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-['Syncopate']">
      <Head>
        <title>AI LOUNGE // AFTER DARK</title>
        <meta name="description" content="The future of digital nightlife - immersive, interactive, revolutionary" />
      </Head>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/club-bg.mp4"
        loop
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      
      {/* 3D Canvas */}
      <Canvas className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Stars radius={100} count={5000} factor={4} fade speed={1} />
          <ClubScene started={started} audioEngine={audioEngine || undefined} />
          <Crowd audioEngine={audioEngine || undefined} users={users} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
          <pointLight position={[-10, 10, 10]} intensity={2} color="#d946ef" />
        </Suspense>
      </Canvas>
      
      {/* UI Overlays */}
      {started && (
        <>
          <AIHost audioEngine={audioEngine || undefined} userCount={users.length} />
          <KineticLyrics audioEngine={audioEngine || undefined} />
          <ChatBubbles messages={messages} onSendMessage={handleSendMessage} />
          <SocialExport />
          
          {/* Status bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-sm px-6 py-2 rounded-full border border-purple-500/30">
            <div className="text-[8px] text-white/60 tracking-[0.5em] uppercase flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                LIVE
              </span>
              <span>{users.length} ONLINE</span>
              <span>8K NEURAL LINK</span>
            </div>
          </div>
        </>
      )}
      
      {/* Name prompt */}
      {showNamePrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="max-w-md w-full mx-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 shadow-2xl">
              <h1 className="glitch-text text-3xl md:text-4xl text-center mb-2">
                AI LOUNGE
              </h1>
              <p className="text-purple-300 text-center text-sm mb-6">
                AFTER DARK // NEURAL EDITION
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm font-bold mb-2 block">
                    ENTER YOUR NAME
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                    placeholder="Anonymous"
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                    maxLength={20}
                    autoFocus
                  />
                </div>
                
                <button
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/50"
                >
                  [ INITIALIZE SESSION ]
                </button>
              </div>
              
              <div className="mt-6 text-center text-white/40 text-xs space-y-1">
                <p>🎧 Best experienced with headphones</p>
                <p>📱 Works on mobile & desktop</p>
                <p>🆓 100% free, no signup required</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
