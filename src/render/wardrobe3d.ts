import * as THREE from 'three'
import type { Item, Slot } from '../game/data/items'
import { PALETTE } from '../game/data/palette'

type Equipped = Partial<Record<Slot, Item>>
type Ring = [y: number, radiusX: number, radiusZ: number]
type FabricKind = 'silk' | 'knit' | 'denim' | 'wool' | 'leather' | 'velvet' | 'cotton' | 'metal'

type FabricPhysics = {
  weight: number
  stiffness: number
  stretch: number
  foldDepth: number
  clearance: number
  foldCount: number
}

const FABRIC_PHYSICS: Record<FabricKind, FabricPhysics> = {
  silk: { weight: 1.05, stiffness: .18, stretch: .08, foldDepth: .075, clearance: .008, foldCount: 7 },
  knit: { weight: .82, stiffness: .34, stretch: .16, foldDepth: .045, clearance: .006, foldCount: 8 },
  denim: { weight: .72, stiffness: .82, stretch: .025, foldDepth: .02, clearance: .014, foldCount: 5 },
  wool: { weight: .88, stiffness: .68, stretch: .035, foldDepth: .032, clearance: .016, foldCount: 6 },
  leather: { weight: .78, stiffness: .92, stretch: .018, foldDepth: .014, clearance: .019, foldCount: 4 },
  velvet: { weight: 1.12, stiffness: .44, stretch: .05, foldDepth: .052, clearance: .01, foldCount: 7 },
  cotton: { weight: .72, stiffness: .56, stretch: .045, foldDepth: .036, clearance: .011, foldCount: 6 },
  metal: { weight: 1.2, stiffness: .98, stretch: 0, foldDepth: 0, clearance: .012, foldCount: 4 },
}

function fabricFor(item: Item): FabricKind {
  if (item.color === 'silver' || item.color === 'gold' || item.slot === 'jewelry') return 'metal'
  if (item.id.includes('silk') || item.tmpl === 'slip' || item.tmpl === 'gown' || item.tmpl === 'sandal') return 'silk'
  if (item.id.includes('knit') || item.tmpl === 'midi') return 'knit'
  if (item.tmpl === 'jeans') return 'denim'
  if (item.id.includes('wool') || item.tmpl === 'coat') return 'wool'
  if (item.id.includes('leather') || item.tmpl === 'trench' || item.tmpl === 'boot' || item.tmpl === 'tote') return 'leather'
  if (item.id.includes('velvet')) return 'velvet'
  return 'cotton'
}

export function fabricPhysicsFor(item: Item): FabricPhysics {
  return FABRIC_PHYSICS[fabricFor(item)]
}

function createFabricTexture(item: Item): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const color = PALETTE[item.color].hex
  const fabric = fabricFor(item)

  ctx.fillStyle = color
  ctx.fillRect(0, 0, 256, 256)

  if (fabric === 'leather') {
    const gradient = ctx.createLinearGradient(0, 0, 256, 256)
    gradient.addColorStop(0, 'rgba(255,255,255,.04)')
    gradient.addColorStop(.46, 'rgba(255,255,255,.1)')
    gradient.addColorStop(.62, 'rgba(0,0,0,.05)')
    gradient.addColorStop(1, 'rgba(0,0,0,.12)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
  }

  if (fabric === 'silk') {
    ctx.strokeStyle = 'rgba(255,255,255,.08)'
    ctx.lineWidth = 1
    for (let x = 0; x <= 256; x += 5) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + 18, 256)
      ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(0,0,0,.035)'
    for (let y = 0; y <= 256; y += 9) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(256, y + 3)
      ctx.stroke()
    }
  } else if (fabric === 'velvet') {
    const image = ctx.getImageData(0, 0, 256, 256)
    for (let i = 0; i < image.data.length; i += 4) {
      const nap = (Math.random() - .5) * 13
      image.data[i] = Math.max(0, Math.min(255, image.data[i] + nap))
      image.data[i + 1] = Math.max(0, Math.min(255, image.data[i + 1] + nap))
      image.data[i + 2] = Math.max(0, Math.min(255, image.data[i + 2] + nap))
    }
    ctx.putImageData(image, 0, 0)
  } else if (fabric === 'knit') {
    ctx.strokeStyle = 'rgba(30,20,24,.16)'
    ctx.lineWidth = 2
    for (let x = 0; x <= 256; x += 10) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      for (let y = 0; y <= 256; y += 8) ctx.quadraticCurveTo(x + 5, y + 4, x, y + 8)
      ctx.stroke()
    }
  } else if (fabric === 'denim') {
    ctx.strokeStyle = 'rgba(255,255,255,.12)'
    ctx.lineWidth = 1
    for (let n = -256; n < 512; n += 8) {
      ctx.beginPath()
      ctx.moveTo(n, 0)
      ctx.lineTo(n - 256, 256)
      ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(20,20,35,.14)'
    for (let n = 0; n < 512; n += 12) {
      ctx.beginPath()
      ctx.moveTo(n, 0)
      ctx.lineTo(n - 256, 256)
      ctx.stroke()
    }
  } else if (fabric === 'wool' || fabric === 'cotton') {
    const image = ctx.getImageData(0, 0, 256, 256)
    for (let i = 0; i < image.data.length; i += 4) {
      const grain = (Math.random() - .5) * (fabric === 'wool' ? 20 : 8)
      image.data[i] = Math.max(0, Math.min(255, image.data[i] + grain))
      image.data[i + 1] = Math.max(0, Math.min(255, image.data[i + 1] + grain))
      image.data[i + 2] = Math.max(0, Math.min(255, image.data[i + 2] + grain))
    }
    ctx.putImageData(image, 0, 0)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(fabric === 'knit' ? 3 : fabric === 'silk' ? 2 : 4, fabric === 'knit' ? 5 : fabric === 'silk' ? 3 : 6)
  texture.anisotropy = 8
  return texture
}

function createFabricMaterial(item: Item): THREE.MeshPhysicalMaterial {
  const fabric = fabricFor(item)
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: createFabricTexture(item),
    roughness: fabric === 'silk' ? .28 : fabric === 'leather' ? .32 : fabric === 'metal' ? .2 : fabric === 'velvet' ? .72 : .82,
    metalness: fabric === 'metal' ? .72 : 0,
    clearcoat: fabric === 'leather' ? .38 : fabric === 'silk' ? .12 : 0,
    clearcoatRoughness: .28,
    sheen: fabric === 'velvet' || fabric === 'silk' ? .55 : 0,
    sheenColor: new THREE.Color(PALETTE[item.color].hex),
    side: THREE.DoubleSide,
  })
}

function bodyEnvelope(y: number): [radiusX: number, radiusZ: number] {
  const points: Ring[] = [
    [1.38, .205, .13],
    [1.25, .255, .15],
    [1.05, .19, .125],
    [.94, .205, .14],
    [.82, .245, .158],
    [.66, .225, .145],
    [.48, .19, .125],
    [.28, .145, .105],
    [.08, .11, .085],
  ]
  if (y >= points[0][0]) return [points[0][1], points[0][2]]
  if (y <= points[points.length - 1][0]) return [points[points.length - 1][1], points[points.length - 1][2]]
  for (let index = 0; index < points.length - 1; index++) {
    const upper = points[index]
    const lower = points[index + 1]
    if (y <= upper[0] && y >= lower[0]) {
      const t = (upper[0] - y) / (upper[0] - lower[0])
      return [
        THREE.MathUtils.lerp(upper[1], lower[1], t),
        THREE.MathUtils.lerp(upper[2], lower[2], t),
      ]
    }
  }
  return [.18, .12]
}

function garmentSurface(rings: Ring[], item: Item, segments = 64): THREE.BufferGeometry {
  const vertices: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const physics = fabricPhysicsFor(item)
  const lastRing = Math.max(1, rings.length - 1)
  const phase = (item.id.length % 11) * .37

  rings.forEach(([y, rx, rz], ringIndex) => {
    const progress = ringIndex / lastRing
    const released = progress * progress * (3 - 2 * progress)
    const [bodyX, bodyZ] = bodyEnvelope(y)
    const collisionX = bodyX + physics.clearance
    const collisionZ = bodyZ + physics.clearance

    for (let segment = 0; segment <= segments; segment++) {
      const angle = (segment / segments) * Math.PI * 2
      const primaryFold = Math.sin(angle * physics.foldCount + phase)
      const secondaryFold = Math.sin(angle * (physics.foldCount + 3) - phase * .7) * .38
      const fold = (primaryFold + secondaryFold) * physics.foldDepth * (.18 + released * .82)
      const ease = physics.stretch * released * .018
      const radiusX = Math.max(collisionX, rx + fold + ease)
      const radiusZ = Math.max(collisionZ, rz + fold * .72 + ease * .55)

      // Gravity pulls unsupported fabric down most strongly between folds and at the hem.
      const unsupported = .55 + .45 * Math.abs(Math.cos(angle * physics.foldCount + phase))
      const gravitySag = physics.weight * released * released * .014 * unsupported
      const hemRipple = ringIndex === rings.length - 1
        ? Math.sin(angle * physics.foldCount + phase) * physics.foldDepth * .16
        : 0
      const x = Math.cos(angle) * radiusX
      const z = Math.sin(angle) * radiusZ
      vertices.push(x, y - gravitySag + hemRipple, z)
      uvs.push(segment / segments, ringIndex / Math.max(1, rings.length - 1))
    }
  })

  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const a = ring * (segments + 1) + segment
      const b = a + segments + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function addSurface(group: THREE.Group, rings: Ring[], item: Item): THREE.Mesh {
  const mesh = new THREE.Mesh(garmentSurface(rings, item), createFabricMaterial(item))
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.renderOrder = 3
  mesh.userData.fabricPhysics = fabricPhysicsFor(item)
  group.add(mesh)
  return mesh
}

function addCylinderBetween(
  group: THREE.Group,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radiusTop: number,
  radiusBottom: number,
  material: THREE.Material,
) {
  const direction = end.clone().sub(start)
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusBottom, radiusTop, direction.length(), 24, 5, true),
    material,
  )
  mesh.position.copy(start).add(end).multiplyScalar(.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
  mesh.castShadow = true
  group.add(mesh)
  return mesh
}

function addDressSkirt(group: THREE.Group, item: Item) {
  let rings: Ring[]

  if (item.id === 'midnight-gown') {
    rings = [
      [1.01, .185, .13],
      [.92, .215, .145],
      [.81, .25, .16],
      [.66, .245, .158],
      [.48, .265, .17],
      [.27, .315, .20],
      [.08, .37, .23],
    ]
  } else if (item.id === 'ivory-column') {
    rings = [
      [1.01, .185, .13],
      [.92, .215, .145],
      [.81, .25, .16],
      [.66, .232, .15],
      [.48, .21, .14],
      [.27, .205, .138],
      [.08, .225, .15],
    ]
  } else if (item.tmpl === 'cocktail') {
    rings = [
      [1.01, .185, .13],
      [.91, .215, .145],
      [.80, .25, .16],
      [.69, .26, .17],
      [.62, .285, .18],
    ]
  } else if (item.tmpl === 'slip') {
    rings = [
      [1.01, .18, .128],
      [.91, .212, .143],
      [.80, .248, .158],
      [.65, .23, .148],
      [.48, .22, .145],
      [.31, .255, .165],
    ]
  } else {
    rings = [
      [1.01, .185, .13],
      [.91, .215, .145],
      [.80, .25, .16],
      [.64, .245, .16],
      [.46, .275, .175],
      [.34, .31, .19],
    ]
  }

  const skirt = addSurface(group, rings, item)
  const material = skirt.material as THREE.MeshPhysicalMaterial
  material.polygonOffset = true
  material.polygonOffsetFactor = -1
}

function addDressBodice(group: THREE.Group, item: Item) {
  addSurface(group, [
    [1.38, .205, .132],
    [1.29, .245, .15],
    [1.18, .25, .155],
    [1.07, .205, .135],
    [1.00, .185, .13],
  ], item)

  const material = createFabricMaterial(item)
  const strapRadius = item.tmpl === 'slip' ? .009 : .013
  addCylinderBetween(group, new THREE.Vector3(-.155, 1.365, .015), new THREE.Vector3(-.19, 1.48, -.002), strapRadius, strapRadius, material)
  addCylinderBetween(group, new THREE.Vector3(.155, 1.365, .015), new THREE.Vector3(.19, 1.48, -.002), strapRadius, strapRadius, material)
}

function addCami(group: THREE.Group, item: Item) {
  addSurface(group, [[1.38, .205, .13], [1.25, .265, .15], [1.04, .205, .135], [.9, .25, .15]], item)
  const material = createFabricMaterial(item)
  addCylinderBetween(group, new THREE.Vector3(-.16, 1.38, 0), new THREE.Vector3(-.19, 1.48, 0), .018, .018, material)
  addCylinderBetween(group, new THREE.Vector3(.16, 1.38, 0), new THREE.Vector3(.19, 1.48, 0), .018, .018, material)
}

function addBottom(group: THREE.Group, item: Item) {
  if (item.tmpl === 'skirt' || item.tmpl === 'pencil') {
    const flare = item.tmpl === 'skirt' ? .31 : .24
    const hem = item.tmpl === 'skirt' ? .58 : .53
    const skirt = addSurface(group, [[.96, .175, .125], [.82, .225, .15], [hem, flare, .18]], item)
    if (item.tmpl === 'skirt') {
      const material = skirt.material as THREE.MeshPhysicalMaterial
      material.flatShading = true
    }
    return
  }

  const wide = item.tmpl === 'wide'
  const material = createFabricMaterial(item)
  addSurface(group, [[.98, .17, .12], [.89, .21, .145], [.76, .195, .135]], item)
  addCylinderBetween(group, new THREE.Vector3(-.09, .78, 0), new THREE.Vector3(-.09, .12, 0), wide ? .09 : .074, wide ? .115 : .068, material)
  addCylinderBetween(group, new THREE.Vector3(.09, .78, 0), new THREE.Vector3(.09, .12, 0), wide ? .09 : .074, wide ? .115 : .068, material)
}

function addOuterwear(group: THREE.Group, item: Item) {
  if (item.tmpl === 'cape') {
    addSurface(group, [[1.28, .23, .16], [1.18, .32, .19], [.70, .43, .25]], item)
    return
  }
  const hem = item.tmpl === 'jacket' ? .82 : item.tmpl === 'trench' ? .38 : .53
  const flare = item.tmpl === 'jacket' ? .23 : .29
  addSurface(group, [[1.01, .18, .13], [.91, .22, .15], [hem, flare, .18]], item)
}

function addBag(group: THREE.Group, item: Item) {
  const material = createFabricMaterial(item)
  const clutch = item.tmpl === 'clutch' || item.tmpl === 'minaudiere'
  const width = clutch ? .24 : .32
  const height = clutch ? .16 : .30
  const bag = new THREE.Mesh(new THREE.BoxGeometry(width, height, .095, 4, 4, 2), material)
  bag.position.set(.49, .61, .08)
  bag.castShadow = true
  group.add(bag)

  if (!clutch) {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(width * .32, .014, 8, 32, Math.PI), material)
    handle.position.set(.49, .61 + height * .48, .08)
    handle.rotation.z = Math.PI
    group.add(handle)
  }
}

function addJewelry(group: THREE.Group, item: Item) {
  const material = createFabricMaterial(item)
  const necklace = new THREE.Mesh(new THREE.TorusGeometry(.105, item.tmpl === 'collar' ? .016 : .006, 10, 40, Math.PI), material)
  necklace.position.set(0, 1.25, .15)
  necklace.rotation.z = Math.PI
  group.add(necklace)
  const pendant = new THREE.Mesh(new THREE.OctahedronGeometry(item.tmpl === 'collar' ? .035 : .022), material)
  pendant.position.set(0, 1.145, .165)
  group.add(pendant)
}

function replaceMeshMaterial(mesh: THREE.Mesh, item: Item) {
  mesh.material = createFabricMaterial(item)
  mesh.castShadow = true
}

export function applyWardrobe(model: THREE.Object3D, equipped: Equipped): THREE.Group {
  const wardrobe = new THREE.Group()
  wardrobe.name = 'GeneratedWardrobe'
  model.add(wardrobe)

  let shirt: THREE.Mesh | undefined
  let shorts: THREE.Mesh | undefined
  let shoes: THREE.Mesh | undefined

  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.castShadow = true
    object.receiveShadow = true
    if (object.name === 'Female_tshirt') shirt = object
    if (object.name === 'Female_shorts') shorts = object
    if (object.name === 'Female_shoes') shoes = object
  })

  if (equipped.dress) {
    if (shorts) shorts.visible = false
    if (equipped.dress.tmpl === 'midi') {
      if (shirt) replaceMeshMaterial(shirt, equipped.dress)
    } else {
      if (shirt) shirt.visible = false
      addDressBodice(wardrobe, equipped.dress)
    }
    addDressSkirt(wardrobe, equipped.dress)
  } else {
    if (equipped.top) {
      if (equipped.top.tmpl === 'cami') {
        if (shirt) shirt.visible = false
        addCami(wardrobe, equipped.top)
      } else if (shirt) {
        replaceMeshMaterial(shirt, equipped.top)
      }
    }
    if (equipped.bottom) {
      if (shorts) shorts.visible = false
      addBottom(wardrobe, equipped.bottom)
    }
  }

  if (equipped.shoes && shoes) replaceMeshMaterial(shoes, equipped.shoes)
  if (equipped.outerwear) {
    if (shirt) replaceMeshMaterial(shirt, equipped.outerwear)
    addOuterwear(wardrobe, equipped.outerwear)
  }
  if (equipped.bag) addBag(wardrobe, equipped.bag)
  if (equipped.jewelry) addJewelry(wardrobe, equipped.jewelry)

  return wardrobe
}

export function disposeWardrobe(model: THREE.Object3D) {
  const wardrobe = model.getObjectByName('GeneratedWardrobe')
  if (wardrobe) {
    wardrobe.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) material.map?.dispose()
        material.dispose()
      })
    })
    wardrobe.removeFromParent()
  }
}
