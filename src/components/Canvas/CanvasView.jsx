import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { HiOutlinePlus, HiOutlineSparkles } from 'react-icons/hi'
import SceneNode from './SceneNode'
import useProjectStore from '../../store/useProjectStore'
import './CanvasView.css'

const nodeTypes = { sceneNode: SceneNode }

function CanvasViewInner() {
  const project = useProjectStore(s => s.getActiveProject())
  const addScene = useProjectStore(s => s.addScene)
  const updateScenePosition = useProjectStore(s => s.updateScenePosition)
  const selectScene = useProjectStore(s => s.selectScene)
  const updateCanvasViewport = useProjectStore(s => s.updateCanvasViewport)
  const reactFlowInstance = useReactFlow()

  const scenes = project?.scenes || []

  // Pending connection state for the scene picker popup
  const [pendingConnection, setPendingConnection] = useState(null)
  const popupRef = useRef(null)
  const wrapperRef = useRef(null)

  const initialNodes = useMemo(() =>
    scenes.map(scene => ({
      id: scene.id,
      type: 'sceneNode',
      position: scene.position || { x: 0, y: 0 },
      data: {
        sceneId: scene.id,
        sceneNumber: scene.sceneNumber,
        title: scene.title,
        prompt: scene.prompt,
        cameraPreset: scene.cameraPreset,
        duration: scene.duration,
        aspectRatio: scene.aspectRatio,
        style: scene.style,
        status: scene.status,
        referenceImages: scene.referenceImages,
      },
    })),
    [scenes]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }, eds)),
    [setEdges]
  )

  const onNodeDragStop = useCallback((event, node) => {
    updateScenePosition(node.id, node.position)
  }, [updateScenePosition])

  const onNodeDoubleClick = useCallback((event, node) => {
    selectScene(node.id)
  }, [selectScene])

  // Helper to create a node from a scene object
  const createNodeFromScene = useCallback((scene) => ({
    id: scene.id,
    type: 'sceneNode',
    position: scene.position,
    data: {
      sceneId: scene.id,
      sceneNumber: scene.sceneNumber,
      title: scene.title,
      prompt: scene.prompt,
      cameraPreset: scene.cameraPreset,
      duration: scene.duration,
      aspectRatio: scene.aspectRatio,
      style: scene.style,
      status: scene.status,
      referenceImages: scene.referenceImages,
    },
  }), [])

  // Use a ref to always have the latest addScene and scenes available to
  // the native DOM event listener without re-binding
  const addSceneRef = useRef(addScene)
  const setNodesRef = useRef(setNodes)
  const createNodeRef = useRef(createNodeFromScene)
  const reactFlowRef = useRef(reactFlowInstance)

  useEffect(() => {
    addSceneRef.current = addScene
    setNodesRef.current = setNodes
    createNodeRef.current = createNodeFromScene
    reactFlowRef.current = reactFlowInstance
  })

  // Native double-click listener on the React Flow pane
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const handleDblClick = (e) => {
      // Only trigger on the pane itself, not on nodes or edges
      const target = e.target
      const isPane = target.classList.contains('react-flow__pane')
      if (!isPane) return

      const position = reactFlowRef.current.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      })
      const newScene = addSceneRef.current(position)
      if (newScene) {
        setNodesRef.current(nds => [...nds, createNodeRef.current(newScene)])
      }
    }

    wrapper.addEventListener('dblclick', handleDblClick)
    return () => wrapper.removeEventListener('dblclick', handleDblClick)
  }, [])

  // When a connector drag ends without connecting to a node
  const onConnectEnd = useCallback((event, connectionState) => {
    // If the connection was completed to a target, do nothing
    if (connectionState?.toNode) return

    const mouseEvent = event.changedTouches ? event.changedTouches[0] : event
    const { clientX, clientY } = mouseEvent

    setPendingConnection({
      sourceNodeId: connectionState?.fromNode?.id,
      sourceHandleId: connectionState?.fromHandle?.id,
      sourceHandleType: connectionState?.fromHandle?.type,
      screenX: clientX,
      screenY: clientY,
    })
  }, [])

  // Handle picking an existing scene from the popup
  const handlePickExistingScene = useCallback((targetSceneId) => {
    if (!pendingConnection) return

    const newEdge = {
      id: `e-${pendingConnection.sourceNodeId}-${targetSceneId}`,
      source: pendingConnection.sourceNodeId,
      target: targetSceneId,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }
    setEdges(eds => addEdge(newEdge, eds))
    setPendingConnection(null)
  }, [pendingConnection, setEdges])

  // Handle creating a new scene from the popup
  const handlePickNewScene = useCallback(() => {
    if (!pendingConnection) return

    const position = reactFlowInstance.screenToFlowPosition({
      x: pendingConnection.screenX,
      y: pendingConnection.screenY,
    })
    const newScene = addScene(position)
    if (newScene) {
      setNodes(nds => [...nds, createNodeFromScene(newScene)])

      const newEdge = {
        id: `e-${pendingConnection.sourceNodeId}-${newScene.id}`,
        source: pendingConnection.sourceNodeId,
        target: newScene.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      }
      setEdges(eds => addEdge(newEdge, eds))
    }
    setPendingConnection(null)
  }, [pendingConnection, reactFlowInstance, addScene, setNodes, setEdges, createNodeFromScene])

  // Close popup on Escape or click outside
  useEffect(() => {
    if (!pendingConnection) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPendingConnection(null)
    }
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPendingConnection(null)
      }
    }

    // Slight delay so the mouseup from the drag doesn't immediately close the popup
    const timeoutId = setTimeout(() => {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [pendingConnection])

  const handleAddScene = () => {
    const offsetX = 300 + (scenes.length % 5) * 280
    const offsetY = 100 + Math.floor(scenes.length / 5) * 250
    const newScene = addScene({ x: offsetX, y: offsetY })
    if (newScene) {
      setNodes(nds => [...nds, createNodeFromScene(newScene)])
    }
  }

  const handleAutoLayout = () => {
    setNodes(nds => nds.map((node, i) => ({
      ...node,
      position: {
        x: 100 + (i % 4) * 300,
        y: 100 + Math.floor(i / 4) * 280,
      },
    })))
  }

  // Filter scenes for the popup (exclude the source scene)
  const availableScenes = pendingConnection
    ? scenes.filter(s => s.id !== pendingConnection.sourceNodeId)
    : []

  return (
    <div className="canvas-view" ref={wrapperRef}>
      {scenes.length === 0 && (
        <div className="canvas-empty">
          <div className="canvas-empty-icon">🎬</div>
          <div className="canvas-empty-title">Start Your Storyboard</div>
          <div className="canvas-empty-subtitle">
            Double-click anywhere on the canvas to add your first scene
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        zoomOnDoubleClick={false}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--bg-primary)' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255, 255, 255, 0.05)"
        />
        <MiniMap
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.6)"
          style={{ background: 'var(--bg-secondary)' }}
        />
        <Controls />
      </ReactFlow>

      {/* Scene Picker Popup — appears when connector dragged to empty space */}
      {pendingConnection && (
        <div
          ref={popupRef}
          className="scene-picker-popup"
          style={{
            left: pendingConnection.screenX,
            top: pendingConnection.screenY,
          }}
        >
          <div className="scene-picker-header">Connect to…</div>
          <button
            className="scene-picker-item scene-picker-new"
            onClick={handlePickNewScene}
          >
            <span className="scene-picker-icon">＋</span>
            <span>New Scene</span>
          </button>
          {availableScenes.length > 0 && (
            <>
              <div className="scene-picker-divider" />
              <div className="scene-picker-list">
                {availableScenes.map(scene => (
                  <button
                    key={scene.id}
                    className="scene-picker-item"
                    onClick={() => handlePickExistingScene(scene.id)}
                  >
                    <span className="scene-picker-badge">{scene.sceneNumber}</span>
                    <span className="scene-picker-label">{scene.title || `Scene ${scene.sceneNumber}`}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="canvas-toolbar">
        <button className="btn btn-primary" onClick={handleAddScene}>
          <HiOutlinePlus /> Add Scene
        </button>
        <div className="divider" />
        <button className="btn btn-ghost" onClick={handleAutoLayout}>
          <HiOutlineSparkles /> Auto Layout
        </button>
      </div>
    </div>
  )
}

export default function CanvasView() {
  return (
    <ReactFlowProvider>
      <CanvasViewInner />
    </ReactFlowProvider>
  )
}
