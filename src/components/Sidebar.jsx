import { useState } from 'react'
import { HiOutlineFilm, HiOutlinePlus, HiOutlineTrash, HiOutlineDownload, HiOutlineUpload } from 'react-icons/hi'
import useProjectStore from '../store/useProjectStore'
import './Sidebar.css'

export default function Sidebar() {
  const projects = useProjectStore(s => s.projects)
  const activeProjectId = useProjectStore(s => s.activeProjectId)
  const createProject = useProjectStore(s => s.createProject)
  const setActiveProject = useProjectStore(s => s.setActiveProject)
  const deleteProject = useProjectStore(s => s.deleteProject)
  const exportProject = useProjectStore(s => s.exportProject)
  const importProject = useProjectStore(s => s.importProject)

  const handleExport = () => {
    const json = exportProject()
    if (!json) return
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scenecraft-project.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        importProject(ev.target.result)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎬</div>
          <span className="sidebar-logo-text">SceneCraft</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Projects</div>
      </div>

      <div className="sidebar-projects">
        <div className="project-list">
          {projects.map(project => (
            <div
              key={project.id}
              className={`project-item ${project.id === activeProjectId ? 'active' : ''}`}
              onClick={() => setActiveProject(project.id)}
            >
              <span className="project-item-icon">
                <HiOutlineFilm />
              </span>
              <span className="project-item-name">{project.name}</span>
              <span className="project-item-count">{project.scenes.length}</span>
              <button
                className="project-item-delete"
                onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }}
                title="Delete project"
              >
                <HiOutlineTrash />
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <div style={{ padding: '12px', color: 'var(--text-muted)', fontSize: 'var(--font-sm)', textAlign: 'center' }}>
              No projects yet
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-actions">
        <button className="sidebar-action-btn" onClick={handleExport}>
          <HiOutlineDownload /> Export Project
        </button>
        <button className="sidebar-action-btn" onClick={handleImport}>
          <HiOutlineUpload /> Import Project
        </button>
      </div>

      <div className="sidebar-footer">
        <button className="new-project-btn" onClick={() => createProject()}>
          <HiOutlinePlus /> New Project
        </button>
      </div>
    </aside>
  )
}
