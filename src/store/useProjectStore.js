import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultColumns } from '../data/cameraPresets'

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

const createDefaultProject = () => ({
  id: generateId(),
  name: 'Untitled Project',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  scenes: [],
  columns: defaultColumns.map(col => ({ ...col, sceneIds: [] })),
  canvasViewport: { x: 0, y: 0, zoom: 1 },
})

const createDefaultScene = (position) => ({
  id: generateId(),
  sceneNumber: 1,
  title: '',
  prompt: '',
  cameraPreset: 'static',
  duration: 5,
  aspectRatio: '16:9',
  style: 'cinematic',
  notes: '',
  referenceImages: [],
  status: 'concept',
  position: position || { x: 250, y: 150 },
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

const useProjectStore = create(
  persist(
    (set, get) => ({
      // State
      projects: [],
      activeProjectId: null,
      activeView: 'canvas', // 'canvas' | 'board'
      selectedSceneId: null,
      detailPanelOpen: false,

      // Getters
      getActiveProject: () => {
        const state = get()
        return state.projects.find(p => p.id === state.activeProjectId) || null
      },

      getScenes: () => {
        const project = get().getActiveProject()
        return project ? project.scenes : []
      },

      getSelectedScene: () => {
        const state = get()
        const project = state.getActiveProject()
        if (!project) return null
        return project.scenes.find(s => s.id === state.selectedSceneId) || null
      },

      // Project CRUD
      createProject: (name) => {
        const project = createDefaultProject()
        if (name) project.name = name
        set(state => ({
          projects: [...state.projects, project],
          activeProjectId: project.id,
        }))
        return project
      },

      setActiveProject: (projectId) => {
        set({ activeProjectId: projectId, selectedSceneId: null, detailPanelOpen: false })
      },

      updateProjectName: (projectId, name) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === projectId ? { ...p, name, updatedAt: Date.now() } : p
          ),
        }))
      },

      deleteProject: (projectId) => {
        set(state => {
          const newProjects = state.projects.filter(p => p.id !== projectId)
          return {
            projects: newProjects,
            activeProjectId: state.activeProjectId === projectId
              ? (newProjects[0]?.id || null)
              : state.activeProjectId,
            selectedSceneId: null,
            detailPanelOpen: false,
          }
        })
      },

      // Scene CRUD
      addScene: (position) => {
        const project = get().getActiveProject()
        if (!project) return null

        const scene = createDefaultScene(position)
        scene.sceneNumber = project.scenes.length + 1
        scene.title = `Scene ${scene.sceneNumber}`

        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== state.activeProjectId) return p
            const newColumns = p.columns.map((col, i) =>
              i === 0 ? { ...col, sceneIds: [...col.sceneIds, scene.id] } : col
            )
            return {
              ...p,
              scenes: [...p.scenes, scene],
              columns: newColumns,
              updatedAt: Date.now(),
            }
          }),
        }))
        return scene
      },

      updateScene: (sceneId, updates) => {
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== state.activeProjectId) return p
            return {
              ...p,
              scenes: p.scenes.map(s =>
                s.id === sceneId ? { ...s, ...updates, updatedAt: Date.now() } : s
              ),
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      deleteScene: (sceneId) => {
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== state.activeProjectId) return p
            return {
              ...p,
              scenes: p.scenes.filter(s => s.id !== sceneId),
              columns: p.columns.map(col => ({
                ...col,
                sceneIds: col.sceneIds.filter(id => id !== sceneId),
              })),
              updatedAt: Date.now(),
            }
          }),
          selectedSceneId: state.selectedSceneId === sceneId ? null : state.selectedSceneId,
          detailPanelOpen: state.selectedSceneId === sceneId ? false : state.detailPanelOpen,
        }))
      },

      // Scene position (for canvas nodes)
      updateScenePosition: (sceneId, position) => {
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== state.activeProjectId) return p
            return {
              ...p,
              scenes: p.scenes.map(s =>
                s.id === sceneId ? { ...s, position } : s
              ),
            }
          }),
        }))
      },

      // Board columns
      moveSceneToColumn: (sceneId, targetColumnId, targetIndex) => {
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== state.activeProjectId) return p
            // Remove scene from all columns
            const newColumns = p.columns.map(col => ({
              ...col,
              sceneIds: col.sceneIds.filter(id => id !== sceneId),
            }))
            // Add to target column at index
            const targetCol = newColumns.find(c => c.id === targetColumnId)
            if (targetCol) {
              const idx = typeof targetIndex === 'number' ? targetIndex : targetCol.sceneIds.length
              targetCol.sceneIds.splice(idx, 0, sceneId)
            }
            // Update scene status
            const newScenes = p.scenes.map(s =>
              s.id === sceneId ? { ...s, status: targetColumnId, updatedAt: Date.now() } : s
            )
            return { ...p, columns: newColumns, scenes: newScenes, updatedAt: Date.now() }
          }),
        }))
      },

      // Canvas viewport
      updateCanvasViewport: (viewport) => {
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== state.activeProjectId) return p
            return { ...p, canvasViewport: viewport }
          }),
        }))
      },

      // UI State
      setActiveView: (view) => set({ activeView: view }),
      selectScene: (sceneId) => set({ selectedSceneId: sceneId, detailPanelOpen: !!sceneId }),
      closeDetailPanel: () => set({ detailPanelOpen: false, selectedSceneId: null }),

      // Export
      exportProject: () => {
        const project = get().getActiveProject()
        if (!project) return null
        return JSON.stringify(project, null, 2)
      },

      // Import
      importProject: (jsonString) => {
        try {
          const project = JSON.parse(jsonString)
          project.id = generateId()
          project.importedAt = Date.now()
          set(state => ({
            projects: [...state.projects, project],
            activeProjectId: project.id,
          }))
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'scenecraft-storage',
      version: 1,
    }
  )
)

export default useProjectStore
