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
    [1.08, .155, .112],
    [.98, .13, .098],
    [.90, .145, .108],
    [.81, .17, .126],
    [.66, .165, .12],
    [.48, .145, .108],
    [.28, .12, .095],
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
      const fold = (primaryFold + secondaryFold) * physics.foldDepth * (.02 + released * .98)
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

function roundedBagGeometry(width: number, height: number, depth: number, radius: number) {
  const halfWidth = width / 2
  const halfHeight = height / 2
  const shape = new THREE.Shape()
  shape.moveTo(-halfWidth + radius, -halfHeight)
  shape.lineTo(halfWidth - radius, -halfHeight)
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius)
  shape.lineTo(halfWidth, halfHeight - radius)
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - radius, halfHeight)
  shape.lineTo(-halfWidth + radius, halfHeight)
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius)
  shape.lineTo(-halfWidth, -halfHeight + radius)
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: Math.min(radius * .22, .008),
    bevelThickness: .006,
    curveSegments: 12,
  })
  geometry.translate(0, 0, -depth / 2)
  geometry.computeVertexNormals()
  return geometry
}

function addTube(
  group: THREE.Group,
  points: THREE.Vector3[],
  radius: number,
  material: THREE.Material,
  tubularSegments = 32,
) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, tubularSegments, radius, 8, false), material)
  tube.castShadow = true
  group.add(tube)
  return { curve, tube }
}

function addDressSkirt(group: THREE.Group, item: Item) {
  let rings: Ring[]

  if (item.id === 'midnight-gown') {
    rings = [
      [1.01, .135, .102],
      [.92, .15, .11],
      [.81, .175, .128],
      [.66, .19, .135],
      [.48, .235, .155],
      [.27, .30, .19],
      [.08, .35, .22],
    ]
  } else if (item.id === 'ivory-column') {
    rings = [
      [1.01, .135, .102],
      [.92, .15, .11],
      [.81, .175, .128],
      [.66, .172, .124],
      [.48, .165, .12],
      [.27, .17, .122],
      [.08, .195, .138],
    ]
  } else if (item.tmpl === 'cocktail') {
    rings = [
      [1.01, .135, .102],
      [.91, .15, .11],
      [.80, .175, .128],
      [.69, .19, .14],
      [.62, .22, .155],
    ]
  } else if (item.tmpl === 'slip') {
    rings = [
      [1.01, .132, .10],
      [.91, .148, .108],
      [.80, .173, .126],
      [.65, .174, .126],
      [.48, .18, .13],
      [.31, .215, .15],
    ]
  } else {
    rings = [
      [1.01, .135, .102],
      [.91, .15, .11],
      [.80, .175, .128],
      [.64, .185, .135],
      [.46, .22, .15],
      [.34, .26, .17],
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
    [1.08, .16, .115],
    [1.00, .135, .102],
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
  addSurface(group, [
    [.99, .132, .10],
    [.93, .14, .106],
    [.86, .16, .12],
    [.78, .168, .125],
    [.73, .148, .116],
  ], item)
  const legCenter = wide ? .068 : .063
  const upperLeg = wide ? .067 : .06
  const hem = wide ? .108 : item.tmpl === 'jeans' ? .063 : .069
  addCylinderBetween(group, new THREE.Vector3(-legCenter, .75, 0), new THREE.Vector3(-legCenter, .12, 0), upperLeg, hem, material)
  addCylinderBetween(group, new THREE.Vector3(legCenter, .75, 0), new THREE.Vector3(legCenter, .12, 0), upperLeg, hem, material)
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
  const clutch = item.tmpl === 'clutch'
  const minaudiere = item.tmpl === 'minaudiere'
  const shoulder = item.tmpl === 'shoulder'
  const tote = item.tmpl === 'tote'
  const width = minaudiere ? .145 : clutch ? .18 : shoulder ? .185 : .22
  const height = minaudiere ? .09 : clutch ? .105 : shoulder ? .145 : item.id === 'woven-basket' ? .175 : .20
  const depth = minaudiere ? .07 : clutch ? .052 : .075
  const position = shoulder
    ? new THREE.Vector3(.285, .57, .10)
    : clutch || minaudiere
      ? new THREE.Vector3(.335, .47, .075)
      : new THREE.Vector3(.34, .49, .085)

  const bag = new THREE.Mesh(roundedBagGeometry(width, height, depth, Math.min(width, height) * .18), material)
  bag.position.copy(position)
  bag.rotation.y = -.08
  bag.rotation.z = shoulder ? -.025 : clutch || minaudiere ? -.035 : .015
  bag.castShadow = true
  bag.receiveShadow = true
  group.add(bag)

  if (minaudiere) {
    const clasp = new THREE.Mesh(new THREE.SphereGeometry(.013, 16, 10), material)
    clasp.position.set(position.x, position.y + height * .55, position.z)
    clasp.castShadow = true
    group.add(clasp)
  } else if (clutch) {
    const flap = new THREE.Mesh(roundedBagGeometry(width * .92, height * .43, depth * .16, .012), material)
    flap.position.set(position.x, position.y + height * .18, position.z + depth * .54)
    flap.rotation.z = bag.rotation.z
    group.add(flap)
  } else if (shoulder) {
    addTube(group, [
      new THREE.Vector3(.17, 1.35, .13),
      new THREE.Vector3(.205, 1.02, .16),
      new THREE.Vector3(.265, .73, .15),
      new THREE.Vector3(position.x - width * .34, position.y + height * .42, position.z),
    ], .006, material, 44)
    const flap = new THREE.Mesh(roundedBagGeometry(width * .94, height * .44, depth * .16, .012), material)
    flap.position.set(position.x, position.y + height * .18, position.z + depth * .54)
    group.add(flap)
  } else if (tote) {
    addTube(group, [
      new THREE.Vector3(position.x - width * .29, position.y + height * .46, position.z),
      new THREE.Vector3(position.x - width * .20, position.y + height * .78, position.z),
      new THREE.Vector3(position.x + width * .20, position.y + height * .78, position.z),
      new THREE.Vector3(position.x + width * .29, position.y + height * .46, position.z),
    ], .008, material, 28)
  }
}

function addJewelry(group: THREE.Group, item: Item) {
  const material = createFabricMaterial(item)
  if (item.id === 'diamond-drops') {
    for (const side of [-1, 1]) {
      const x = side * .205
      const stud = new THREE.Mesh(new THREE.SphereGeometry(.009, 14, 10), material)
      stud.position.set(x, 1.49, .018)
      group.add(stud)
      addCylinderBetween(
        group,
        new THREE.Vector3(x, 1.482, .018),
        new THREE.Vector3(x, 1.435, .025),
        .0025,
        .0025,
        material,
      )
      const drop = new THREE.Mesh(new THREE.OctahedronGeometry(.014, 0), material)
      drop.scale.set(.7, 1.35, .7)
      drop.position.set(x, 1.423, .028)
      drop.castShadow = true
      group.add(drop)
    }
    return
  }

  const collar = item.tmpl === 'collar'
  const necklacePoints = [
    new THREE.Vector3(-.105, 1.305, .125),
    new THREE.Vector3(-.082, 1.255, .153),
    new THREE.Vector3(0, collar ? 1.185 : 1.205, .17),
    new THREE.Vector3(.082, 1.255, .153),
    new THREE.Vector3(.105, 1.305, .125),
  ]
  const curve = new THREE.CatmullRomCurve3(necklacePoints, false, 'centripetal')

  if (item.tmpl === 'pearl') {
    const pearlGeometry = new THREE.SphereGeometry(.009, 14, 10)
    curve.getPoints(18).forEach((point) => {
      const pearl = new THREE.Mesh(pearlGeometry, material)
      pearl.position.copy(point)
      pearl.castShadow = true
      group.add(pearl)
    })
  } else {
    addTube(group, necklacePoints, collar ? .008 : .0035, material, 40)
  }

  if (item.id === 'gold-chain') {
    const pendant = new THREE.Mesh(new THREE.OctahedronGeometry(.014, 0), material)
    pendant.scale.set(.78, 1.2, .55)
    pendant.position.set(0, 1.185, .175)
    pendant.castShadow = true
    group.add(pendant)
  } else if (collar) {
    const center = new THREE.Mesh(new THREE.ConeGeometry(.024, .045, 3), material)
    center.position.set(0, 1.16, .177)
    center.rotation.z = Math.PI
    center.castShadow = true
    group.add(center)
  }
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
