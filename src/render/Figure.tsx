import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Item, Slot } from '../game/data/items'
import { PALETTE } from '../game/data/palette'
import { applyWardrobe, disposeWardrobe } from './wardrobe3d'

type FigureProps = {
  equipped: Partial<Record<Slot, Item>>
}

function equippedColorString(equipped: FigureProps['equipped']) {
  const visibleItems = equipped.dress
    ? [equipped.dress, equipped.shoes, equipped.bag, equipped.jewelry]
    : [equipped.top, equipped.bottom, equipped.shoes, equipped.bag, equipped.jewelry]
  return visibleItems
    .filter((item): item is Item => Boolean(item))
    .map(item => PALETTE[item.color].hex)
    .join(',')
}

function rotateBoneInWorldSpace(bone: THREE.Object3D | null | undefined, axis: THREE.Vector3, angle: number) {
  if (!bone?.parent) return
  bone.parent.updateWorldMatrix(true, false)
  const parentWorld = bone.parent.getWorldQuaternion(new THREE.Quaternion())
  const localDelta = parentWorld
    .clone()
    .invert()
    .multiply(new THREE.Quaternion().setFromAxisAngle(axis, angle))
    .multiply(parentWorld)
  bone.quaternion.premultiply(localDelta)
}

function applyRelaxedPose(model: THREE.Object3D) {
  rotateBoneInWorldSpace(model.getObjectByName('RightArm'), new THREE.Vector3(0, 0, 1), 1.18)
  rotateBoneInWorldSpace(model.getObjectByName('LeftArm'), new THREE.Vector3(0, 0, 1), -1.18)
  model.updateMatrixWorld(true)
}

export function Figure({ equipped }: FigureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const colorString = useMemo(() => equippedColorString(equipped), [equipped])
  const equippedKey = useMemo(
    () => Object.entries(equipped).map(([slot, item]) => `${slot}:${item?.id ?? ''}`).sort().join('|'),
    [equipped],
  )

  useEffect(() => {
    if (!canvasRef.current || !stageRef.current || /jsdom/i.test(navigator.userAgent)) return

    const canvas = canvasRef.current
    const stage = stageRef.current
    let disposed = false
    let model: THREE.Object3D | undefined
    let frame = 0

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(24, 1, .1, 100)
    camera.position.set(0, .92, 4.45)
    camera.lookAt(0, .9, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap

    scene.add(new THREE.HemisphereLight(0xfff8ef, 0x8f817c, 2.15))
    const key = new THREE.DirectionalLight(0xffead6, 3.3)
    key.position.set(2.6, 4.8, 4)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xb9c7e4, 1.5)
    rim.position.set(-3, 2.5, -2)
    scene.add(rim)

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(.72, 64),
      new THREE.ShadowMaterial({ color: 0x8b6f66, opacity: .16 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -.005
    ground.receiveShadow = true
    scene.add(ground)

    const resize = () => {
      const width = Math.max(1, stage.clientWidth)
      const height = Math.max(1, stage.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)

    const loader = new GLTFLoader()
    loader.load(
      '/models/female-character.glb',
      (gltf) => {
        if (disposed) return
        model = gltf.scene
        const bounds = new THREE.Box3().setFromObject(model)
        const center = bounds.getCenter(new THREE.Vector3())
        model.position.x = -center.x
        model.position.z = -center.z
        applyRelaxedPose(model)
        applyWardrobe(model, equipped)
        scene.add(model)
        setLoaded(true)
      },
      undefined,
      () => {
        if (!disposed) setFailed(true)
      },
    )

    const start = performance.now()
    const render = (now: number) => {
      if (disposed) return
      if (model) model.rotation.y = Math.sin((now - start) * .00042) * .045
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      if (model) {
        disposeWardrobe(model)
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach(material => material.dispose())
        })
      }
      renderer.dispose()
    }
  }, [equippedKey])

  return (
    <div
      ref={stageRef}
      className="figure-3d-stage"
      role="img"
      aria-label="Styled 3D character"
      data-equipped-colors={colorString}
    >
      <canvas ref={canvasRef} className="figure-3d-canvas" />
      {!loaded && !failed && <div className="figure-loading micro-label">Preparing the model…</div>}
      {failed && <div className="figure-error micro-label">The 3D model could not load.</div>}
    </div>
  )
}
