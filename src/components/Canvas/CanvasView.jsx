import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { HiOutlinePlus, HiOutlineSparkles } from 'react-icons/hi'
import SceneNode from './SceneNode'
import useProjectStore from '../../store/useProjectStore'
import './CanvasView.css'

const nodeTypes = { sceneNode: SceneNode }

export default function CanvasView() {
  const project = useProjectStore(s => s.getActiveProject())
  const addScene = useProjectStore(s => s.addScene)
  const updateScenePosition = useProjectStore(s => s.updateScenePosition)
  const selectScene = useProjectStore(s => s.selectScene)
  const updateCanvasViewport = useProjectStore(s => s.updateCanvasViewport)

  const scenes = project?.scenes || []

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

  const handleAddScene = () => {
    const viewport = project?.canvasViewport || { x: 0, y: 0, zoom: 1 }
    const offsetX = 300 + (scenes.length % 5) * 280
    const offsetY = 100 + Math.floor(scenes.length / 5) * 250
    const newScene = addScene({ x: offsetX, y: offsetY })
    if (newScene) {
      setNodes(nds => [...nds, {
        id: newScene.id,
        type: 'sceneNode',
        position: newScene.position,
        data: {
          sceneId: newScene.id,
          sceneNumber: newScene.sceneNumber,
          title: newScene.title,
          prompt: newScene.prompt,
          cameraPreset: newScene.cameraPreset,
          duration: newScene.duration,
          aspectRatio: newScene.aspectRatio,
          style: newScene.style,
          status: newScene.status,
          referenceImages: newScene.referenceImages,
        },
      }])
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

  return (
    <div className="canvas-view">
      {scenes.length === 0 && (
        <div className="canvas-empty">
          <div className="canvas-empty-icon">🎬</div>
          <div className="canvas-empty-title">Start Your Storyboard</div>
          <div className="canvas-empty-subtitle">
            Add your first scene to begin planning your AI video on the infinite canvas
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
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
