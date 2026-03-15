import { useEffect } from 'react'
import { HiOutlineViewGrid, HiOutlineMap, HiOutlinePlus } from 'react-icons/hi'
import Sidebar from './components/Sidebar'
import CanvasView from './components/Canvas/CanvasView'
import BoardView from './components/Board/BoardView'
import SceneDetailPanel from './components/SceneDetail/SceneDetailPanel'
import useProjectStore from './store/useProjectStore'

export default function App() {
  const projects = useProjectStore(s => s.projects)
  const activeProjectId = useProjectStore(s => s.activeProjectId)
  const activeView = useProjectStore(s => s.activeView)
  const setActiveView = useProjectStore(s => s.setActiveView)
  const createProject = useProjectStore(s => s.createProject)
  const getActiveProject = useProjectStore(s => s.getActiveProject)
  const updateProjectName = useProjectStore(s => s.updateProjectName)

  const activeProject = getActiveProject()

  // Auto-create first project if none exist
  useEffect(() => {
    if (projects.length === 0) {
      createProject('My First Storyboard')
    }
  }, [])

  // Auto-select first project if none selected
  useEffect(() => {
    if (!activeProjectId && projects.length > 0) {
      useProjectStore.getState().setActiveProject(projects[0].id)
    }
  }, [projects, activeProjectId])

  const sceneCount = activeProject?.scenes?.length || 0

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        {activeProject ? (
          <>
            <div className="top-bar">
              <div className="top-bar-left">
                <input
                  className="project-title"
                  value={activeProject.name}
                  onChange={(e) => updateProjectName(activeProject.id, e.target.value)}
                  spellCheck={false}
                />
                <span className="scene-count">
                  {sceneCount} {sceneCount === 1 ? 'scene' : 'scenes'}
                </span>
              </div>

              <div className="top-bar-right">
                <div className="view-switcher">
                  <button
                    className={`view-switcher-btn ${activeView === 'canvas' ? 'active' : ''}`}
                    onClick={() => setActiveView('canvas')}
                  >
                    <HiOutlineMap /> Canvas
                  </button>
                  <button
                    className={`view-switcher-btn ${activeView === 'board' ? 'active' : ''}`}
                    onClick={() => setActiveView('board')}
                  >
                    <HiOutlineViewGrid /> Board
                  </button>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              {activeView === 'canvas' ? <CanvasView /> : <BoardView />}
            </div>
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon">🎬</div>
              <h1 className="welcome-title">Welcome to SceneCraft</h1>
              <p className="welcome-subtitle">
                Plan and storyboard your AI-generated videos with an infinite canvas and Trello-style boards.
              </p>
              <button className="btn btn-primary" onClick={() => createProject()}>
                <HiOutlinePlus /> Create Your First Project
              </button>
            </div>
          </div>
        )}
      </div>

      <SceneDetailPanel />
    </div>
  )
}
