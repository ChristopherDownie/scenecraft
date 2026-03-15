import { useState, useCallback } from 'react'
import { HiOutlinePlus } from 'react-icons/hi'
import BoardCard from './BoardCard'
import useProjectStore from '../../store/useProjectStore'
import './BoardView.css'

export default function BoardView() {
  const project = useProjectStore(s => s.getActiveProject())
  const addScene = useProjectStore(s => s.addScene)
  const moveSceneToColumn = useProjectStore(s => s.moveSceneToColumn)

  const [draggedScene, setDraggedScene] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  const columns = project?.columns || []
  const scenes = project?.scenes || []

  const getSceneById = (id) => scenes.find(s => s.id === id)

  const handleDragStart = (e, sceneId) => {
    setDraggedScene(sceneId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', sceneId)
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    const sceneId = e.dataTransfer.getData('text/plain')
    if (sceneId) {
      moveSceneToColumn(sceneId, columnId)
    }
    setDraggedScene(null)
    setDragOverColumn(null)
  }

  const handleAddSceneToColumn = (columnId) => {
    const scene = addScene()
    if (scene) {
      moveSceneToColumn(scene.id, columnId)
    }
  }

  return (
    <div className="board-view">
      {columns.map(column => {
        const columnScenes = column.sceneIds
          .map(id => getSceneById(id))
          .filter(Boolean)

        return (
          <div key={column.id} className="board-column">
            <div className="board-column-header">
              <div className="board-column-title-group">
                <div className="board-column-dot" style={{ background: column.color }} />
                <span className="board-column-title">{column.title}</span>
              </div>
              <span className="board-column-count">{columnScenes.length}</span>
            </div>

            <div
              className={`board-column-body ${dragOverColumn === column.id ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {columnScenes.length === 0 && (
                <div className="board-column-empty">
                  Drop scenes here
                </div>
              )}
              {columnScenes.map(scene => (
                <div
                  key={scene.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, scene.id)}
                >
                  <BoardCard
                    scene={scene}
                    isDragging={draggedScene === scene.id}
                  />
                </div>
              ))}
            </div>

            <div className="board-column-footer">
              <button
                className="board-add-card-btn"
                onClick={() => handleAddSceneToColumn(column.id)}
              >
                <HiOutlinePlus /> Add Scene
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
