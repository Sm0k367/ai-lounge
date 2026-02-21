import React, { useState, useEffect } from 'react';
import { AudioEngine } from '../lib/audioUtils';

interface AIHostProps {
  audioEngine?: AudioEngine;
  userCount?: number;
}

const HOST_MESSAGES = [
  "Welcome to the AI Lounge! 🎉",
  "The vibe is immaculate tonight! ✨",
  "Feeling the energy in here! 🔥",
  "This beat is EVERYTHING! 💜",
  "You all are amazing! 🌟",
  "Let's turn it UP! 🚀",
  "The future of nightlife is HERE! 🎵",
  "Can you feel that bass? 🎧",
  "This is what dreams are made of! 💫",
  "We're just getting started! ⚡"
];

export default function AIHost({ audioEngine, userCount = 1 }: AIHostProps) {
  const [message, setMessage] = useState(HOST_MESSAGES[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mood, setMood] = useState<'chill' | 'hyped' | 'vibing'>('chill');
  
  useEffect(() => {
    // Change message every 15 seconds
    const interval = setInterval(() => {
      const randomMessage = HOST_MESSAGES[Math.floor(Math.random() * HOST_MESSAGES.length)];
      setMessage(randomMessage);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (!audioEngine) return;
    
    const checkMood = () => {
      const bass = audioEngine.getBass();
      const energy = audioEngine.getOverallVolume();
      
      if (energy > 0.7) {
        setMood('hyped');
      } else if (energy > 0.4) {
        setMood('vibing');
      } else {
        setMood('chill');
      }
      
      requestAnimationFrame(checkMood);
    };
    
    checkMood();
  }, [audioEngine]);
  
  const getMoodEmoji = () => {
    switch (mood) {
      case 'hyped': return '🔥';
      case 'vibing': return '✨';
      case 'chill': return '😎';
    }
  };
  
  const getMoodColor = () => {
    switch (mood) {
      case 'hyped': return 'from-red-500 to-orange-500';
      case 'vibing': return 'from-purple-500 to-pink-500';
      case 'chill': return 'from-blue-500 to-cyan-500';
    }
  };
  
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
      {/* AI Host Avatar */}
      <div className="relative group">
        <div className={`
          w-20 h-20 md:w-24 md:h-24 rounded-full
          bg-gradient-to-br ${getMoodColor()}
          flex items-center justify-center
          shadow-lg shadow-purple-500/50
          border-2 border-white/20
          transition-all duration-300
          ${isAnimating ? 'scale-110' : 'scale-100'}
          hover:scale-105 cursor-pointer
        `}>
          <span className="text-4xl md:text-5xl animate-pulse">
            {getMoodEmoji()}
          </span>
        </div>
        
        {/* Pulse ring on beat */}
        <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
      </div>
      
      {/* Host name and status */}
      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/30">
        <div className="text-purple-300 text-xs font-bold tracking-wider">
          EPIC TECH AGENT
        </div>
        <div className="text-white/60 text-[10px] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          LIVE • {userCount} {userCount === 1 ? 'GUEST' : 'GUESTS'}
        </div>
      </div>
      
      {/* Message bubble */}
      <div className={`
        bg-gradient-to-br ${getMoodColor()}
        rounded-2xl rounded-tr-none px-4 py-3
        max-w-xs shadow-xl
        border border-white/20
        transition-all duration-500
        ${isAnimating ? 'translate-x-2 opacity-0' : 'translate-x-0 opacity-100'}
      `}>
        <p className="text-white text-sm font-medium">
          {message}
        </p>
      </div>
      
      {/* Mood indicator */}
      <div className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-500/30">
        <div className="text-white/80 text-[10px] font-bold tracking-widest uppercase">
          MOOD: {mood}
        </div>
      </div>
    </div>
  );
}
