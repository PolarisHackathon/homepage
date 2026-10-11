import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sceneGeometry } from '../src/lib/sceneGeometry.ts'

for (const kind of ['room', 'workbench', 'meal', 'demo']) test(`${kind} has finite positions, valid normals and two complete palettes`, () => {
  for (const light of [true, false]) {
    const vertices = sceneGeometry(kind, light)
    assert.equal(vertices.length % 27, 0)
    assert.ok(vertices.length > 100)
    assert.ok([...vertices].every(Number.isFinite))
    for (let index = 0; index < vertices.length; index += 9) {
      assert.ok(Math.abs(Math.hypot(vertices[index + 3], vertices[index + 4], vertices[index + 5]) - 1) < .0001)
      assert.ok(Math.abs(vertices[index]) <= 3 && Math.abs(vertices[index + 1]) <= 2 && Math.abs(vertices[index + 2]) <= 3)
      assert.ok(vertices.slice(index + 6, index + 9).every(value => value >= 0 && value <= 1))
    }
  }
})
