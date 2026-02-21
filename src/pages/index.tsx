import React, { useState, useRef } from "react";
import Head from "next/head";

export default function Home() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [username, setUsername] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleInitSession(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (username.trim()) {
      setSessionStarted(true);

      // Play club audio on session start (user interaction)
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Autoplay may be blocked; plays after next gesture
        });
      }
    }
  }

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col justify-center items-center overflow-hidden font-['Syncopate']">
      <Head>
        <title>AI LOUNGE AFTER DARK // NEURAL EDITION</title>
        <meta name="description" content="Enter the digital underground. Club. Create. Connect." />
      </Head>

      {/* Animated club video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 animate-fadein"
        src="/club-bg (2).mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/club-bg-poster.jpg"
      />

      {/* Club music/ambience (plays only after Initialize Session) */}
      <audio ref={audioRef} src="/dj_smoke_audio.mp3" preload="auto" loop />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50 pointer-events-none z-1" />

      {/* HERO + ENTRY */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="glitch-text text-3xl md:text-5xl font-bold mb-4 tracking-[0.3em] animate-glow">
          AI LOUNGE AFTER DARK<br />// NEURAL EDITION
        </h1>

        {!sessionStarted ? (
          <form
            className="flex flex-col items-center gap-4 p-6 bg-black/70 rounded-2xl border-2 border-purple-500/40 backdrop-blur-xl"
            onSubmit={handleInitSession}
          >
            <input
              ref={inputRef}
              className="w-60 md:w-96 p-3 rounded-lg bg-black/80 border border-purple-800 text-lg text-white text-center neon-glow outline-none focus:ring-2 focus:ring-magenta transition-all"
              placeholder="ENTER YOUR NAME"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
            />
            <button
              className="glitch-text mt-2 text-xl px-10 py-3 rounded-lg bg-gradient-to-br from-purple-700 to-pink-600 border border-magenta shadow-lg neon-btn hover:-translate-y-1 hover:bg-pink-800/70 transition-all animate-glow"
              type="submit"
            >
              [ INITIALIZE SESSION ]
            </button>
            <div className="text-sm text-white/70 mt-2 space-x-2">
              <span role="img" aria-label="headphones">🎧</span> Best experienced with headphones
              <span className="mx-2">|</span>
              <span role="img" aria-label="devices">📱</span> Mobile & desktop
              <span className="mx-2">|</span>
              <span role="img" aria-label="free">🆓</span> 100% free, no signup
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 bg-black/80 rounded-2xl border-2 border-purple-500/50 animate-glow">
            <div className="glitch-text text-2xl mb-2">WELCOME, {username.toUpperCase()}!</div>
            <div className="text-lg text-magenta">Session initialized. The club awaits…</div>
          </div>
        )}
      </main>

      {/* Social/Footer bar */}
      <footer className="absolute bottom-4 w-full flex justify-center gap-6 z-10">
        <a
          href="https://discord.gg/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          className="glitch-text text-sm px-4 py-1 rounded-full border border-purple-500 bg-black/70 hover:bg-purple-700/60 transition-all shine"
        >
          Join Discord
        </a>
        <a
          href="https://forms.gle/your-open-mic-form"
          target="_blank"
          rel="noopener noreferrer"
          className="glitch-text text-sm px-4 py-1 rounded-full border border-pink-500 bg-black/70 hover:bg-pink-700/60 transition-all shine"
        >
          Open Mic Signup
        </a>
        <a
          href="https://forms.gle/your-art-form"
          target="_blank"
          rel="noopener noreferrer"
          className="glitch-text text-sm px-4 py-1 rounded-full border border-cyan-500 bg-black/70 hover:bg-cyan-700/60 transition-all shine"
        >
          Submit Art/Meme
        </a>
      </footer>
    </div>
  );
}
