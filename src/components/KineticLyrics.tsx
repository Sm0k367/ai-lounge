import React, { useState, useEffect } from 'react';
import { AudioEngine } from '../lib/audioUtils';

interface KineticLyricsProps {
  audioEngine?: AudioEngine;
}

const SAMPLE_LYRICS = [
  "WELCOME TO THE AI LOUNGE",
  "WHERE THE FUTURE MEETS THE BEAT",
  "FEEL THE RHYTHM",
  "LOSE YOURSELF IN THE SOUND",
  "THIS IS YOUR MOMENT",
  "DANCE LIKE NOBODY'S WATCHING",
  "THE NIGHT IS YOUNG",
  "LET THE MUSIC TAKE CONTROL",
  "VIBES ON MAXIMUM",
  "ENERGY UNLIMITED"
];

export default function KineticLyrics({ audioEngine }: KineticLyricsProps) {
  const [currentLyric, setCurrentLyric] = useState(0);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [glitchActive, setGlitchActive] = useState(false);
  
  useEffect(() => {
    // Change lyrics every 8 seconds
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentLyric((prev) => (prev + 1) % SAMPLE_LYRICS.length);
        setOpacity(1);
      }, 500);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (!audioEngine) return;
    
    const animate = () => {
      const isBeat = audioEngine.isBeat();
      const bass = audioEngine.getBass();
      const beatStrength = audioEngine.getBeatStrength();
      
      // Scale on beat
      if (isBeat) {
        setScale(1 + beatStrength * 0.3);
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      } else {
        setScale((prev) => prev * 0.95 + 1 * 0.05);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [audioEngine]);
  
  const lyric = SAMPLE_LYRICS[currentLyric];
  const words = lyric.split(' ');
  
  return (
    <div className="absolute top-1/4 left-0 w-full text-center z-20 pointer-events-none px-4">
      <div
        className="relative inline-block"
        style={{
          transform: `scale(${scale})`,
          opacity,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {words.map((word, i) => (
            <Word
              key={`${currentLyric}-${i}`}
              word={word}
              index={i}
              glitchActive={glitchActive}
              audioEngine={audioEngine}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface WordProps {
  word: string;
  index: number;
  glitchActive: boolean;
  audioEngine?: AudioEngine;
}

function Word({ word, index, glitchActive, audioEngine }: WordProps) {
  const [hue, setHue] = useState(270);
  
  useEffect(() => {
    if (!audioEngine) return;
    
    const animate = () => {
      const treble = audioEngine.getTreble();
      setHue((prev) => (prev + treble * 2) % 360);
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [audioEngine]);
  
  return (
    <span
      className={`
        text-2xl md:text-4xl lg:text-6xl font-bold
        ${glitchActive ? 'glitch-text-active' : 'glitch-text'}
      `}
      style={{
        animationDelay: `${index * 0.1}s`,
        color: `hsl(${hue}, 100%, 60%)`,
        textShadow: `
          0 0 10px hsl(${hue}, 100%, 60%),
          0 0 20px hsl(${hue}, 100%, 50%),
          0 0 30px hsl(${hue}, 100%, 40%)
        `
      }}
    >
      {word}
    </span>
  );
}
