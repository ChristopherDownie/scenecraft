import { useEffect, useRef } from 'react'
import { HiOutlineX, HiOutlineTrash, HiOutlinePhotograph } from 'react-icons/hi'
import { cameraPresets, stylePresets, aspectRatios } from '../../data/cameraPresets'
import useProjectStore from '../../store/useProjectStore'
import './SceneDetailPanel.css'

export default function SceneDetailPanel() {
  const scene = useProjectStore(s => s.getSelectedScene())
  const detailPanelOpen = useProjectStore(s => s.detailPanelOpen)
  const closeDetailPanel = useProjectStore(s => s.closeDetailPanel)
  const updateScene = useProjectStore(s => s.updateScene)
  const deleteScene = useProjectStore(s => s.deleteScene)
  const panelRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && detailPanelOpen) {
        closeDetailPanel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [detailPanelOpen, closeDetailPanel])

  if (!detailPanelOpen || !scene) return null

  const handleUpdate = (field, value) => {
    updateScene(scene.id, { [field]: value })
  }

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const currentImages = scene.referenceImages || []
          updateScene(scene.id, { referenceImages: [...currentImages, ev.target.result] })
        }
        reader.readAsDataURL(file)
      })
    }
    input.click()
  }

  const handleRemoveImage = (index) => {
    const newImages = [...(scene.referenceImages || [])]
    newImages.splice(index, 1)
    updateScene(scene.id, { referenceImages: newImages })
  }

  const handleDelete = () => {
    deleteScene(scene.id)
    closeDetailPanel()
  }

  return (
    <div className="scene-detail-overlay">
      <div className="scene-detail-backdrop" onClick={closeDetailPanel} />
      <div className="scene-detail-panel" ref={panelRef}>
        <div className="scene-detail-header">
          <div className="scene-detail-header-left">
            <div className="scene-detail-badge">{scene.sceneNumber}</div>
            <input
              className="scene-detail-title-input"
              value={scene.title || ''}
              onChange={(e) => handleUpdate('title', e.target.value)}
              placeholder={`Scene ${scene.sceneNumber}`}
            />
          </div>
          <button className="btn-icon" onClick={closeDetailPanel}>
            <HiOutlineX />
          </button>
        </div>

        <div className="scene-detail-body">
          {/* Prompt */}
          <div className="detail-field">
            <label className="detail-field-label">AI Generation Prompt</label>
            <textarea
              value={scene.prompt || ''}
              onChange={(e) => handleUpdate('prompt', e.target.value)}
              placeholder="Describe the scene you want to generate. Include details about setting, lighting, action, mood, and composition..."
            />
          </div>

          {/* Camera Preset */}
          <div className="detail-field">
            <label className="detail-field-label">Camera Movement</label>
            <div className="camera-preset-grid">
              {cameraPresets.map(preset => (
                <button
                  key={preset.id}
                  className={`camera-preset-option ${scene.cameraPreset === preset.id ? 'active' : ''}`}
                  onClick={() => handleUpdate('cameraPreset', preset.id)}
                  title={preset.description}
                >
                  <span className="camera-preset-icon">{preset.icon}</span>
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Duration + Aspect Ratio */}
          <div className="detail-settings-row">
            <div className="detail-field">
              <label className="detail-field-label">Duration (seconds)</label>
              <input
                type="number"
                value={scene.duration || 5}
                onChange={(e) => handleUpdate('duration', parseInt(e.target.value) || 1)}
                min={1}
                max={60}
              />
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Aspect Ratio</label>
              <select
                value={scene.aspectRatio || '16:9'}
                onChange={(e) => handleUpdate('aspectRatio', e.target.value)}
              >
                {aspectRatios.map(ar => (
                  <option key={ar.id} value={ar.id}>
                    {ar.label} — {ar.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Style */}
          <div className="detail-field">
            <label className="detail-field-label">Visual Style</label>
            <div className="style-preset-chips">
              {stylePresets.map(style => (
                <button
                  key={style.id}
                  className={`style-preset-chip ${scene.style === style.id ? 'active' : ''}`}
                  style={{ color: scene.style === style.id ? style.color : undefined }}
                  onClick={() => handleUpdate('style', style.id)}
                >
                  <span className="style-preset-dot" style={{ background: style.color }} />
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Images */}
          <div className="detail-field">
            <label className="detail-field-label">Reference Images</label>
            <div className="reference-images-area" onClick={handleImageUpload}>
              <span className="reference-images-area-icon"><HiOutlinePhotograph /></span>
              <span>Click to upload reference images</span>
            </div>
            {scene.referenceImages && scene.referenceImages.length > 0 && (
              <div className="reference-images-grid">
                {scene.referenceImages.map((img, i) => (
                  <div key={i} className="reference-image-item">
                    <img src={img} alt={`Reference ${i + 1}`} />
                    <button
                      className="reference-image-remove"
                      onClick={() => handleRemoveImage(i)}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="detail-field">
            <label className="detail-field-label">Notes</label>
            <textarea
              className="notes-area"
              value={scene.notes || ''}
              onChange={(e) => handleUpdate('notes', e.target.value)}
              placeholder="Additional notes, director's comments, continuity details..."
            />
          </div>
        </div>

        <div className="scene-detail-footer">
          <button className="btn btn-ghost" style={{ color: 'var(--accent-red)' }} onClick={handleDelete}>
            <HiOutlineTrash /> Delete Scene
          </button>
        </div>
      </div>
    </div>
  )
}
