# 🎵 AI LOUNGE // AFTER DARK

**The future of digital nightlife is here.** A revolutionary, immersive AI-powered club experience that's 100% free to run and gives users the best online experience they've ever had.

🔗 **LIVE:** https://ai-lounge-six.vercel.app/

---

## ✨ REVOLUTIONARY FEATURES

### 🎧 **Audio-Reactive Everything**
- **Real-time beat detection** using Web Audio API
- **3D visualizations** that pulse and react to music
- **Kinetic typography** that dances with the beat
- **Particle systems** synchronized to bass, mids, and treble
- **Laser beams** and **floor grid** that respond to audio

### 🌐 **FREE Multiplayer (No Server Costs!)**
- **Peer-to-peer connections** using PeerJS
- **Real-time presence** - see other users in 3D space
- **Live chat** with animated bubbles
- **Zero infrastructure costs** - runs entirely in the browser

### 🤖 **AI Host with Personality**
- **Dynamic mood system** (chill, vibing, hyped)
- **Context-aware messages** based on music energy
- **Real-time user count** and status updates
- **Animated avatar** that reacts to the vibe

### 🎬 **Social Sharing Built-In**
- **Screen recording** with one click
- **Screenshot capture** of epic moments
- **Native sharing** to social media
- **Download clips** for later

### 🎉 **Timed Events & Surprises**
- **Random club events** (laser shows, confetti, strobe, smoke)
- **Scheduled surprises** (hourly drops, midnight specials)
- **Achievement system** with localStorage persistence
- **Weekend party mode** for extra energy

### 🎨 **Stunning Visuals**
- **Advanced 3D scene** with Three.js and React Three Fiber
- **1000+ audio-reactive particles**
- **Neon glitch effects** and animations
- **Responsive design** - works on mobile and desktop
- **Glass morphism UI** with backdrop blur

---

## 🚀 TECH STACK (100% FREE)

- **Next.js 16** - React framework
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **PeerJS** - Free P2P multiplayer (no server!)
- **Web Audio API** - Beat detection & visualization
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **LocalStorage** - Free persistence

**Total Monthly Cost: $0.00** ✅

---

## 🎯 GETTING STARTED

### Prerequisites
- Node.js 18+ installed
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/Sm0k367/ai-lounge.git
cd ai-lounge

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎮 HOW TO USE

1. **Enter your name** when prompted
2. **Click "INITIALIZE SESSION"** to start
3. **Allow audio** when prompted (required for beat detection)
4. **Enjoy the experience!**

### Controls
- **💬 Chat Button** (bottom left) - Open live chat
- **📸 Screenshot** (bottom right) - Capture the moment
- **🎥 Record** (bottom right) - Record a clip (max 30 seconds)

### Multiplayer
- **Share your Peer ID** with friends to connect
- **See other users** as glowing avatars in 3D space
- **Chat in real-time** with animated bubbles

---

## 🏗️ PROJECT STRUCTURE

```
ai-lounge/
├── src/
│   ├── components/
│   │   ├── AIHost.tsx           # AI host with personality
│   │   ├── ChatBubbles.tsx      # Live chat system
│   │   ├── ClubScene.tsx        # 3D scene with audio-reactive effects
│   │   ├── Crowd.tsx            # Multiplayer user avatars
│   │   ├── ErrorBoundary.tsx    # Error handling
│   │   ├── KineticLyrics.tsx    # Beat-synced typography
│   │   └── SocialExport.tsx     # Recording & sharing
│   ├── lib/
│   │   ├── audioUtils.ts        # Web Audio API engine
│   │   └── multiplayer.ts       # PeerJS multiplayer engine
│   ├── utils/
│   │   └── events.ts            # Event system & achievements
│   ├── pages/
│   │   ├── _app.tsx             # App wrapper
│   │   └── index.tsx            # Main page
│   └── styles/
│       └── globals.css          # Global styles & animations
├── public/
│   ├── club-bg.mp4              # Background video
│   └── avatar-default.png       # Default avatar
└── package.json
```

---

## 🎨 CUSTOMIZATION

### Add Your Own Music
Replace `/public/club-bg.mp4` with your own video/audio file.

### Change Colors
Edit `src/styles/globals.css`:
```css
:root {
  --neon-purple: #8b5cf6;
  --neon-magenta: #d946ef;
  --neon-cyan: #06b6d4;
}
```

### Add New Events
Edit `src/utils/events.ts` to add custom club events.

### Customize AI Host
Edit `src/components/AIHost.tsx` to change messages and personality.

---

## 🌟 FEATURES IN DETAIL

### Audio Engine
- **FFT Analysis** for frequency data
- **Beat Detection** with energy threshold
- **Bass/Mids/Treble** separation
- **Smoothing** for natural animations

### Multiplayer Engine
- **WebRTC** peer-to-peer connections
- **Automatic reconnection** on disconnect
- **User presence** tracking
- **Position synchronization**
- **Chat message** broadcasting

### Event System
- **Random events** every 20-60 seconds
- **Scheduled events** (hourly, midnight, weekend)
- **Achievement tracking** with localStorage
- **Event callbacks** for custom behavior

---

## 📱 MOBILE SUPPORT

Fully responsive and optimized for mobile devices:
- Touch-friendly UI
- Reduced particle count on mobile
- Optimized 3D rendering
- Mobile-first design

---

## 🔧 TROUBLESHOOTING

### Audio not working?
- Make sure you clicked "Allow" when prompted for audio
- Check browser console for errors
- Try refreshing the page

### Multiplayer not connecting?
- Check your firewall settings
- Make sure WebRTC is enabled in your browser
- Try a different network

### Performance issues?
- Close other tabs
- Reduce browser zoom level
- Try a different browser (Chrome recommended)

---

## 🚀 DEPLOYMENT

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
Works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

---

## 🎯 ROADMAP

- [ ] Voice chat integration
- [ ] Custom room creation
- [ ] DJ mode with music upload
- [ ] VR support
- [ ] Mobile app (React Native)
- [ ] NFT avatar integration
- [ ] Token-gated rooms

---

## 🤝 CONTRIBUTING

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 LICENSE

MIT License - feel free to use this project however you want!

---

## 🙏 ACKNOWLEDGMENTS

- **Three.js** - Amazing 3D library
- **PeerJS** - Free P2P connections
- **Vercel** - Free hosting
- **The community** - For inspiration and support

---

## 💬 CONTACT

Built with 🔥 by **Smoke Stream**

- GitHub: [@Sm0k367](https://github.com/Sm0k367)
- Live Demo: [ai-lounge-six.vercel.app](https://ai-lounge-six.vercel.app/)

---

## ⚡ QUICK START COMMANDS

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel
```

---

**🎵 WELCOME TO THE FUTURE OF DIGITAL NIGHTLIFE 🎵**

*Experience the AI Lounge. Where technology meets the beat.*
