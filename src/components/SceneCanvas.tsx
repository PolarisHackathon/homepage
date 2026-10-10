import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Lang } from '../hooks/useI18n'
import { layoutCopy } from '../i18n/layout'
import { sceneGeometry, type SceneKind } from '../lib/sceneGeometry'

const initial = { yaw: -.48, tilt: .61 }
const vertexSource = `
attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;
uniform vec2 angles;
uniform vec2 fit;
uniform vec2 center;
varying vec3 tint;
vec3 rotate(vec3 p) {
  float a = cos(angles.x), b = sin(angles.x), c = cos(angles.y), d = sin(angles.y);
  vec3 q = vec3(a*p.x+b*p.z, p.y, -b*p.x+a*p.z);
  return vec3(q.x, c*q.y-d*q.z, d*q.y+c*q.z);
}
void main() {
  vec3 p = rotate(position);
  gl_Position = vec4((p.x-center.x)*fit.x, (p.y-center.y)*fit.y, -p.z/8.0, 1.0);
  float light = 0.57+0.43*max(dot(normalize(rotate(normal)), normalize(vec3(-0.4,0.85,0.6))),0.0);
  tint = color*light;
}`
const fragmentSource = `
precision mediump float;
varying vec3 tint;
void main() { gl_FragColor = vec4(tint,1.0); }`

export default function SceneCanvas({ kind, lang, onUnavailable }: { kind: SceneKind; lang: Lang; onUnavailable: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const draw = useRef<(() => void) | null>(null)
  const pose = useRef({ ...initial })
  const pointer = useRef<{ x: number; y: number; id: number; touch: boolean } | null>(null)
  const unavailable = useRef(onUnavailable)
  unavailable.current = onUnavailable
  const [ready, setReady] = useState(false)
  const copy = layoutCopy[lang]
  const caption = copy[kind === 'room' ? 'modelRoom' : kind === 'meal' ? 'modelMeal' : kind === 'demo' ? 'modelDemo' : 'modelWorkbench']
  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const gl = element.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) { unavailable.current(); return }
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('NO_SHADER')
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw new Error('SHADER_FAILED') }
      return shader
    }
    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    let vertex: WebGLShader | null = null
    let fragment: WebGLShader | null = null
    let resize: ResizeObserver | null = null
    let theme: MutationObserver | null = null
    const lost = (event: Event) => { event.preventDefault(); unavailable.current() }
    const dispose = () => {
      resize?.disconnect()
      theme?.disconnect()
      element.removeEventListener('webglcontextlost', lost)
      draw.current = null
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
    }
    try {
      vertex = compile(gl.VERTEX_SHADER, vertexSource)
      fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
      program = gl.createProgram()
      buffer = gl.createBuffer()
      if (!program || !buffer) throw new Error('NO_PROGRAM')
      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('LINK_FAILED')
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      for (const [index, name] of ['position', 'normal', 'color'].entries()) {
        const location = gl.getAttribLocation(program, name)
        gl.enableVertexAttribArray(location)
        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 36, index * 12)
      }
      const angles = gl.getUniformLocation(program, 'angles')
      const fit = gl.getUniformLocation(program, 'fit')
      const center = gl.getUniformLocation(program, 'center')
      let count = 0
      let corners: number[][] = []
      const updateGeometry = () => {
        const vertices = sceneGeometry(kind, document.documentElement.dataset.theme === 'light')
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        count = vertices.length / 9
        const minimum = [Infinity, Infinity, Infinity], maximum = [-Infinity, -Infinity, -Infinity]
        for (let i = 0; i < vertices.length; i += 9) for (let axis = 0; axis < 3; axis++) {
          minimum[axis] = Math.min(minimum[axis], vertices[i + axis])
          maximum[axis] = Math.max(maximum[axis], vertices[i + axis])
        }
        corners = [minimum[0], maximum[0]].flatMap(x => [minimum[1], maximum[1]].flatMap(y => [minimum[2], maximum[2]].map(z => [x, y, z])))
      }
      draw.current = () => {
        const bounds = element.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return
        const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
        element.width = Math.round(bounds.width * ratio)
        element.height = Math.round(bounds.height * ratio)
        gl.viewport(0, 0, element.width, element.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST)
        const aspect = bounds.width / bounds.height
        const a = Math.cos(pose.current.yaw), b = Math.sin(pose.current.yaw), c = Math.cos(pose.current.tilt), d = Math.sin(pose.current.tilt)
        const projected = corners.map(([x, y, z]) => [a * x + b * z, c * y - d * (-b * x + a * z)])
        const left = Math.min(...projected.map(p => p[0])), right = Math.max(...projected.map(p => p[0]))
        const bottom = Math.min(...projected.map(p => p[1])), top = Math.max(...projected.map(p => p[1]))
        const extent = Math.max(.1, (top - bottom) * .59, (right - left) * .59 / aspect)
        gl.uniform2f(angles, pose.current.yaw, pose.current.tilt)
        gl.uniform2f(center, (left + right) / 2, (bottom + top) / 2)
        gl.uniform2f(fit, 1 / (extent * aspect), 1 / extent)
        gl.drawArrays(gl.TRIANGLES, 0, count)
      }
      updateGeometry()
      draw.current()
      setReady(true)
      resize = new ResizeObserver(() => draw.current?.())
      resize.observe(element)
      theme = new MutationObserver(() => { updateGeometry(); draw.current?.() })
      theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      element.addEventListener('webglcontextlost', lost)
    } catch {
      dispose()
      unavailable.current()
    }
    return dispose
  }, [kind])
  const rotate = (yaw: number, tilt = 0) => {
    pose.current.yaw += yaw
    pose.current.tilt = Math.min(1.05, Math.max(.25, pose.current.tilt + tilt))
    draw.current?.()
  }
  const onMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const previous = pointer.current
    if (!previous || previous.id !== event.pointerId) return
    const dx = event.clientX - previous.x, dy = event.clientY - previous.y
    if (previous.touch && Math.abs(dx) < Math.abs(dy)) return
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId)
    rotate(dx * .008, previous.touch ? 0 : dy * .005)
    pointer.current = { ...previous, x: event.clientX, y: event.clientY }
  }
  const onKey = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') { pose.current = { ...initial }; draw.current?.() }
    else rotate(event.key === 'ArrowLeft' ? -.18 : event.key === 'ArrowRight' ? .18 : 0, event.key === 'ArrowUp' ? .08 : event.key === 'ArrowDown' ? -.08 : 0)
  }
  return <div className="scene-canvas-wrap"><canvas ref={canvas} role="img" aria-label={`${caption}. ${copy.modelHelp}`} tabIndex={0} data-ready={ready} onKeyDown={onKey} onPointerDown={event => { if (event.button === 0) pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId, touch: event.pointerType === 'touch' } }} onPointerMove={onMove} onPointerUp={() => { pointer.current = null }} onPointerCancel={() => { pointer.current = null }} />
    <div className="scene-controls"><p>{copy.modelHelp}</p><div><button type="button" aria-label={copy.modelLeft} onClick={() => rotate(-.3)}>←</button><button type="button" aria-label={copy.modelReset} onClick={() => { pose.current = { ...initial }; draw.current?.() }}>↺</button><button type="button" aria-label={copy.modelRight} onClick={() => rotate(.3)}>→</button></div></div>
  </div>
}
