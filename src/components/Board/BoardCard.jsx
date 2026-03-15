import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import { cameraPresets } from '../../data/cameraPresets'
import useProjectStore from '../../store/useProjectStore'
import './BoardCard.css'

export default function BoardCard({ scene, isDragging }) {
  const selectScene = useProjectStore(s => s.selectScene)
  const deleteScene = useProjectStore(s => s.deleteScene)
  const preset = cameraPresets.find(p => p.id === scene.cameraPreset) || cameraPresets[0]

  return (
    <div
      className={`board-card ${isDragging ? 'dragging' : ''}`}
      onClick={() => selectScene(scene.id)}
    >
      {scene.referenceImages && scene.referenceImages.length > 0 && (
        <div className="board-card-thumbnail">
          <img src={scene.referenceImages[0]} alt="Reference" />
        </div>
      )}

      <div className="board-card-header">
        <div className="board-card-number">
          <div className="board-card-badge">{scene.sceneNumber}</div>
          <span className="board-card-title">{scene.title || `Scene ${scene.sceneNumber}`}</span>
        </div>
        <div className="board-card-actions">
          <button className="board-card-action" onClick={(e) => { e.stopPropagation(); selectScene(scene.id) }}>
            <HiOutlinePencil />
          </button>
          <button className="board-card-action delete" onClick={(e) => { e.stopPropagation(); deleteScene(scene.id) }}>
            <HiOutlineTrash />
          </button>
        </div>
      </div>

      <div className="board-card-prompt">
        {scene.prompt || 'No prompt yet — click to edit'}
      </div>

      <div className="board-card-meta">
        <span className="board-card-tag">{preset.icon} {preset.name}</span>
        <span className="board-card-tag">{scene.duration}s</span>
        <span className="board-card-tag">{scene.aspectRatio}</span>
      </div>
    </div>
  )
}
