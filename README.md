# SceneCraft 🎬

**AI Video Storyboarding — Plan your scenes before you generate them.**

SceneCraft is a storyboarding application purpose-built for AI video creators. Combine an **infinite canvas** for spatial scene planning with **Trello-style boards** for linear workflow management — all optimized for tools like Higgsfield, Sora, Runway, and more.

![SceneCraft](https://img.shields.io/badge/SceneCraft-AI%20Storyboarding-blue?style=for-the-badge)

## Features

### 🗺️ Infinite Canvas
- Pan & zoom workspace for spatial scene organization
- Visual scene nodes with prompt previews, camera presets, and thumbnails
- Connect scenes with directional edges to define sequence and flow
- Minimap for quick navigation
- Auto-layout for instant organization

### 📋 Trello-Style Board
- Workflow columns: **Concept → Scripting → Prompting → Generating → Final**
- Drag-and-drop cards between stages
- Track scene progress through your production pipeline

### 🎬 Scene Details
- **AI Prompt Editor** — Write and refine generation prompts
- **Camera Presets** — 18 Higgsfield-compatible presets (Dolly, Orbit, Crash Zoom, Bullet Time, etc.)
- **Duration & Aspect Ratio** — Configure per-scene settings
- **Style Presets** — Cinematic, Retro Film, Anime, Noir, Sci-Fi, and more
- **Reference Images** — Upload visual references for each scene
- **Notes** — Add director's comments and continuity details

### 💾 Project Management
- Multiple projects with local storage persistence
- Export/import projects as JSON
- Automatic save — never lose your work

## Tech Stack

- **React 18** + **Vite** — Lightning-fast development
- **React Flow** — Infinite canvas with nodes & edges
- **Zustand** — Lightweight state management with persistence
- **Vanilla CSS** — Custom dark theme design system
- **React Icons** — Beautiful iconography

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## License

MIT
