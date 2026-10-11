import { mkdir, writeFile } from 'node:fs/promises'
import { sceneGeometry } from '../src/lib/sceneGeometry.ts'

const directory = new URL('../public/assets/models/', import.meta.url)
await mkdir(directory, { recursive: true })
for (const kind of ['room', 'workbench', 'meal', 'demo']) {
  const vertices = sceneGeometry(kind)
  if (![...vertices].every(Number.isFinite)) throw new Error(`Invalid geometry: ${kind}`)
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (let index = 0; index < vertices.length; index += 9) for (let axis = 0; axis < 3; axis++) {
    min[axis] = Math.min(min[axis], vertices[index + axis])
    max[axis] = Math.max(max[axis], vertices[index + axis])
  }
  const count = vertices.length / 9
  const document = {
    asset: { version: '2.0', generator: 'entropy-homepage procedural scene exporter' },
    scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: kind }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1, COLOR_0: 2 }, material: 0 }] }],
    materials: [{ pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: .8 }, doubleSided: true }],
    buffers: [{ byteLength: vertices.byteLength }],
    bufferViews: [{ buffer: 0, byteLength: vertices.byteLength, byteStride: 36, target: 34962 }],
    accessors: [
      { bufferView: 0, byteOffset: 0, componentType: 5126, count, type: 'VEC3', min, max },
      { bufferView: 0, byteOffset: 12, componentType: 5126, count, type: 'VEC3' },
      { bufferView: 0, byteOffset: 24, componentType: 5126, count, type: 'VEC3' },
    ],
    extras: { purpose: 'Original concept illustration; not a confirmed venue, menu or equipment inventory.' },
  }
  const json = Buffer.from(JSON.stringify(document))
  const paddedJson = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20)
  json.copy(paddedJson)
  const binary = Buffer.from(vertices.buffer)
  const header = Buffer.alloc(12), jsonHeader = Buffer.alloc(8), binaryHeader = Buffer.alloc(8)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(28 + paddedJson.length + binary.length, 8)
  jsonHeader.writeUInt32LE(paddedJson.length, 0)
  jsonHeader.writeUInt32LE(0x4e4f534a, 4)
  binaryHeader.writeUInt32LE(binary.length, 0)
  binaryHeader.writeUInt32LE(0x004e4942, 4)
  await writeFile(new URL(`${kind}.glb`, directory), Buffer.concat([header, jsonHeader, paddedJson, binaryHeader, binary]))
  process.stdout.write(`${kind}: ${count / 3} triangles\n`)
}
