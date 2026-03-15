import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cameraPresets } from '../../data/cameraPresets'
import { defaultColumns } from '../../data/cameraPresets'
import useProjectStore from '../../store/useProjectStore'
import './SceneNode.css'

function SceneNode({ data, selected }) {
  const selectScene = useProjectStore(s => s.selectScene)
  const preset = cameraPresets.find(p => p.id === data.cameraPreset) || cameraPresets[0]
  const statusCol = defaultColumns.find(c => c.id === data.status) || defaultColumns[0]

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    selectScene(data.sceneId)
  }

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={`scene-node ${selected ? 'selected' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        <div className="scene-node-header">
          <div className="scene-node-number">
            <div className="scene-node-badge">{data.sceneNumber}</div>
            <span>{data.title || `Scene ${data.sceneNumber}`}</span>
          </div>
          <div className="scene-node-status" style={{ background: statusCol.color }} title={statusCol.title} />
        </div>

        <div className="scene-node-thumbnail">
          {data.referenceImages && data.referenceImages.length > 0 ? (
            <img src={data.referenceImages[0]} alt="Scene reference" />
          ) : (
            <span className="scene-node-thumbnail-placeholder">🎬</span>
          )}
          <span className="scene-node-duration">{data.duration}s</span>
        </div>

        <div className="scene-node-body">
          <div className="scene-node-title">{data.title || `Scene ${data.sceneNumber}`}</div>
          <div className="scene-node-prompt">
            {data.prompt || 'Double-click to add a prompt...'}
          </div>
        </div>

        <div className="scene-node-footer">
          <span className="scene-node-tag">{preset.icon} {preset.name}</span>
          <span className="scene-node-tag">{data.aspectRatio}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  )
}

export default memo(SceneNode)
