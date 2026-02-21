# AI Lounge After Dark

Ultra-immersive, neon-drenched club experience powered by AI.
Live, social, cinematic—real-time crowd, kinetic lyrics, avatar MC, and fully interactive vibe.

## Features Roadmap
- 8K video club floor as dynamic background
- Kinetic neon lyric overlays (lyrics animate in sync to music)
- AI avatar host (reacts to events, greets users, announces features)
- Real-time user presence (avatars/silhouettes in the club)
- Crowd chat (chat bubbles animate in 3D)
- Social sharing (clip moments with overlays, instant post to X, TikTok, Insta)
- Secret events & rare visual FX
- Full mobile/desktop/AR support

## Folder Structure
ai-lounge/
├── README.md
├── package.json
├── tsconfig.json
├── public/
│ ├── club-bg.mp4 # Your clubroom or cityscape looping video(s)
│ └── avatar-default.png # Default MC/avatar image
│ └── ...other static/media
├── src/
│ ├── pages/
│ │ ├── _app.tsx
│ │ └── index.tsx # Main entrypoint
│ ├── components/
│ │ ├── ClubScene.tsx # Video + Three.js canvas
│ │ ├── KineticLyrics.tsx # Animated lyric overlays
│ │ ├── AIHost.tsx # Avatar MC / host logic
│ │ ├── Crowd.tsx # User avatars/silhouettes
│ │ ├── ChatBubbles.tsx # 3D chat bubbles, crowd messages
│ │ ├── SocialExport.tsx # Clip/share moments
│ │ └── ...other features
│ ├── styles/
│ │ └── globals.css
│ ├── lib/
│ │ ├── audioUtils.ts # Beat detection, sync to music
│ │ ├── supabase.ts # (Optional: for real-time)
│ │ └── ...helpers
│ └── utils/
│ ├── events.ts
│ └── ...etc
├── .env.local
└── ...


## How to Start
- Add your core video(s) and avatar art to `public/`
- Main entry: `src/pages/index.tsx` brings together all core components
- Build new features as self-contained React components in `components/`
- Keep your vibe consistent: glitch/neon/ultra-real FX in styles/components
- Want multiplayer? Use Supabase, Ably, or Socket.io for presence
