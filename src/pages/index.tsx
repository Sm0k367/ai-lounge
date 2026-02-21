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
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  }

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col justify-center items-center overflow-hidden font-['Syncopate']">
      <Head>
        <title>AI LOUNGE AFTER DARK // NEURAL EDITION</title>
        <meta name="description" content="Enter the digital underground. Club. Create. Connect." />
      </Head>

      {/* Club video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 animate-fadein"
        src="/club-bg (2).mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/club-bg-poster.jpg"
      />

      {/* Club music, plays only after session start */}
      <audio ref={audioRef} src="/dj_smoke_audio.mp3" preload="auto" loop />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50 pointer-events-none z-1" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-2 w-full">
        <h1 className="glitch-text text-2xl sm:text-3xl md:text-5xl font-bold mb-4 tracking-[0.15em] animate-glow text-center leading-tight">
          AI LOUNGE AFTER DARK<br />// NEURAL EDITION
        </h1>
        {!sessionStarted ? (
          <form
            className="flex flex-col items-center gap-4 px-4 py-6 w-full max-w-md bg-black/70 rounded-2xl border-2 border-purple-500/40 backdrop-blur-xl"
            onSubmit={handleInitSession}
          >
            <input
              ref={inputRef}
              className="w-full p-3 rounded-lg bg-black/80 border border-purple-800 text-base md:text-lg text-white text-center neon-glow outline-none focus:ring-2 focus:ring-magenta transition-all"
              placeholder="ENTER YOUR NAME"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
              inputMode="text"
              maxLength={28}
            />
            <button
              className="glitch-text mt-2 text-lg md:text-xl px-6 md:px-10 py-3 rounded-lg bg-gradient-to-br from-purple-700 to-pink-600 border border-magenta shadow-lg neon-btn hover:-translate-y-1 hover:bg-pink-800/70 transition-all animate-glow w-full"
              type="submit"
              aria-label="Start Session"
            >
              [ INITIALIZE SESSION ]
            </button>
            <div className="text-xs md:text-sm text-white/70 mt-2 space-x-1 text-center w-full">
              <span role="img" aria-label="headphones">🎧</span> Best with headphones
              <span className="mx-1">|</span>
              <span role="img" aria-label="devices">📱</span> Mobile & desktop
              <span className="mx-1">|</span>
              <span role="img" aria-label="free">🆓</span> 100% free
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 px-2 py-8 w-full max-w-md bg-black/80 rounded-2xl border-2 border-purple-500/50 animate-glow">
            <div className="glitch-text text-lg md:text-2xl mb-2 text-center">WELCOME, {username.toUpperCase()}!</div>
            <div className="text-base md:text-lg text-magenta text-center">Session initialized. The club awaits…</div>
          </div>
        )}
      </main>

      <footer className="absolute bottom-2 left-0 w-full flex flex-wrap justify-center gap-2 md:gap-6 z-10 px-2">
        <a
          href="https://discord.gg/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          className="glitch-text text-xs md:text-sm px-3 py-1 rounded-full border border-purple-500 bg-black/70 hover:bg-purple-700/60 transition-all shine w-max"
        >
          Join Discord
        </a>
        <a
          href="https://forms.gle/your-open-mic-form"
          target="_blank"
          rel="noopener noreferrer"
          className="glitch-text text-xs md:text-sm px-3 py-1 rounded-full border border-pink-500 bg-black/70 hover:bg-pink-700/60 transition-all shine w-max"
        >
          Open Mic Signup
        </a>
        <a
          href="https://forms.gle/your-art-form"
          target="_blank"
          rel="noopener noreferrer"
          className="glitch-text text-xs md:text-sm px-3 py-1 rounded-full border border-cyan-500 bg-black/70 hover:bg-cyan-700/60 transition-all shine w-max"
        >
          Submit Art/Meme
        </a>
      </footer>
    </div>
  );
}
