/**
 * Higgsfield-compatible camera presets for AI video generation
 */
export const cameraPresets = [
  { id: 'static', name: 'Static', icon: '📷', description: 'No camera movement' },
  { id: 'dolly-in', name: 'Dolly In', icon: '🎬', description: 'Camera moves toward subject' },
  { id: 'dolly-out', name: 'Dolly Out', icon: '🎬', description: 'Camera moves away from subject' },
  { id: 'pan-left', name: 'Pan Left', icon: '↩️', description: 'Camera pans left' },
  { id: 'pan-right', name: 'Pan Right', icon: '↪️', description: 'Camera pans right' },
  { id: 'tilt-up', name: 'Tilt Up', icon: '⬆️', description: 'Camera tilts upward' },
  { id: 'tilt-down', name: 'Tilt Down', icon: '⬇️', description: 'Camera tilts downward' },
  { id: 'orbit-left', name: 'Orbit Left', icon: '🔄', description: '360° orbit to the left' },
  { id: 'orbit-right', name: 'Orbit Right', icon: '🔄', description: '360° orbit to the right' },
  { id: 'crash-zoom', name: 'Crash Zoom', icon: '💥', description: 'Fast dramatic zoom in' },
  { id: 'aerial-pullback', name: 'Aerial Pullback', icon: '🚁', description: 'Camera rises and pulls back' },
  { id: 'bullet-time', name: 'Bullet Time', icon: '⏱️', description: 'Slow-motion orbit effect' },
  { id: 'tracking', name: 'Tracking Shot', icon: '🏃', description: 'Camera follows subject movement' },
  { id: 'crane-up', name: 'Crane Up', icon: '🏗️', description: 'Vertical crane movement up' },
  { id: 'crane-down', name: 'Crane Down', icon: '🏗️', description: 'Vertical crane movement down' },
  { id: 'handheld', name: 'Handheld', icon: '✋', description: 'Shaky handheld camera feel' },
  { id: 'zoom-in', name: 'Zoom In', icon: '🔍', description: 'Lens zoom toward subject' },
  { id: 'zoom-out', name: 'Zoom Out', icon: '🔍', description: 'Lens zoom away from subject' },
]

export const stylePresets = [
  { id: 'cinematic', name: 'Cinematic', color: '#3b82f6' },
  { id: 'retro-film', name: 'Retro Film', color: '#f59e0b' },
  { id: 'anime', name: 'Anime', color: '#ec4899' },
  { id: 'documentary', name: 'Documentary', color: '#6b7280' },
  { id: 'noir', name: 'Noir', color: '#1e293b' },
  { id: 'fantasy', name: 'Fantasy', color: '#a78bfa' },
  { id: 'sci-fi', name: 'Sci-Fi', color: '#22d3ee' },
  { id: 'horror', name: 'Horror', color: '#dc2626' },
  { id: 'romantic', name: 'Romantic', color: '#f472b6' },
  { id: 'action', name: 'Action', color: '#fb923c' },
]

export const aspectRatios = [
  { id: '16:9', label: '16:9', description: 'Landscape / Widescreen' },
  { id: '9:16', label: '9:16', description: 'Portrait / Vertical' },
  { id: '1:1', label: '1:1', description: 'Square' },
  { id: '4:3', label: '4:3', description: 'Classic' },
  { id: '21:9', label: '21:9', description: 'Ultra-wide / Cinematic' },
]

export const defaultColumns = [
  { id: 'concept', title: 'Concept', color: '#64748b' },
  { id: 'scripting', title: 'Scripting', color: '#a78bfa' },
  { id: 'prompting', title: 'Prompting', color: '#3b82f6' },
  { id: 'generating', title: 'Generating', color: '#fb923c' },
  { id: 'final', title: 'Final', color: '#34d399' },
]
