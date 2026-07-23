import * as THREE from 'three'
import type { Item, Slot } from '../game/data/items'
import { PALETTE } from '../game/data/palette'

type Equipped = Partial<Record<Slot, Item>>
type Ring = [y: number, radiusX: number, radiusZ: number]

function fabricFor(item: Item): 'silk' | 'knit' | 'denim' | 'wool' | 'leather' | 'velvet' | 'cotton' | 'metal' {
  if (item.color === 'silver' || item.color === 'gold' || item.slot === 'jewelry') return 'metal'
  if (item.id.includes('silk') || item.tmpl === 'slip' || item.tmpl === 'gown' || item.tmpl === 'sandal') return 'silk'
  if (item.id.includes('knit') || item.tmpl === 'midi') return 'knit'
  if (item.tmpl === 'jeans') return 'denim'
  if (item.id.includes('wool') || item.tmpl === 'coat') return 'wool'
  if (item.id.includes('leather') || item.tmpl === 'trench' || item.tmpl === 'boot' || item.tmpl === 'tote') return 'leather'
  if (item.id.includes('velvet')) return 'velvet'
  return 'cotton'
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

function garmentSurface(rings: Ring[], segments = 40): THREE.BufferGeometry {
  const vertices: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  rings.forEach(([y, rx, rz], ringIndex) => {
    for (let segment = 0; segment <= segments; segment++) {
      const angle = (segment / segments) * Math.PI * 2
      vertices.push(Math.cos(angle) * rx, y, Math.sin(angle) * rz)
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
  const mesh = new THREE.Mesh(garmentSurface(rings), createFabricMaterial(item))
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.renderOrder = 3
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
  const hem = item.tmpl === 'gown' ? .08 : item.tmpl === 'cocktail' ? .66 : item.tmpl === 'slip' ? .42 : .38
  const flare = item.tmpl === 'gown' ? .39 : item.tmpl === 'cocktail' ? .31 : item.tmpl === 'slip' ? .28 : .33
  const skirt = addSurface(group, [
    [.99, .17, .12],
    [.90, .205, .14],
    [.78, .25, .16],
    [Math.max(hem + .1, .54), item.tmpl === 'gown' ? .29 : flare * .96, item.tmpl === 'gown' ? .185 : .17],
    [hem, flare, item.tmpl === 'gown' ? .23 : .18],
  ], item)
  const material = skirt.material as THREE.MeshPhysicalMaterial
  material.polygonOffset = true
  material.polygonOffsetFactor = -1
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
    if (shirt) replaceMeshMaterial(shirt, equipped.dress)
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
