import { useEffect, useRef } from 'react'

type Ribbon = { y: number; amp: number; freq: number; speed: number; width: number; hue: number; phase: number }

// Live aurora ribbons for the event hero; one static frame under reduced motion.
export function AuroraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let frame = 0
    let visible = true
    let light = document.documentElement.getAttribute('data-theme') === 'light'
    const pointer = { x: 0.6, tx: 0.6 }

    const ribbons: Ribbon[] = [
      { y: 0.22, amp: 0.09, freq: 1.3, speed: 0.00011, width: 0.34, hue: 205, phase: 0 },
      { y: 0.3, amp: 0.12, freq: 0.9, speed: 0.00008, width: 0.28, hue: 214, phase: 1.7 },
      { y: 0.16, amp: 0.07, freq: 1.9, speed: 0.00014, width: 0.2, hue: 196, phase: 3.1 },
      { y: 0.38, amp: 0.1, freq: 1.1, speed: 0.00006, width: 0.24, hue: 226, phase: 4.4 },
    ]

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = light ? 'multiply' : 'lighter'
      pointer.x += (pointer.tx - pointer.x) * 0.03
      const lean = (pointer.x - 0.5) * 0.25
      for (const r of ribbons) {
        const steps = 72
        for (let s = 0; s < steps; s++) {
          const u = s / (steps - 1)
          const x = (u * 1.3 - 0.15) * w
          const t = time * r.speed
          const yMid = (r.y + Math.sin(u * r.freq * Math.PI * 2 + t * 6 + r.phase) * r.amp + Math.sin(u * 7 + t * 9) * 0.015) * h
          const len = (r.width + Math.sin(u * 5 + t * 4 + r.phase) * 0.08) * h
          const sway = lean * len
          const alpha = (light ? 0.04 : 0.068) * Math.sin(u * Math.PI) * (0.7 + 0.3 * Math.sin(t * 5 + u * 3 + r.phase))
          const g = ctx.createLinearGradient(x, yMid - len * 0.15, x + sway, yMid + len)
          const col = light ? `hsla(${r.hue}, 70%, 55%,` : `hsla(${r.hue}, 95%, 68%,`
          g.addColorStop(0, `${col} 0)`)
          g.addColorStop(0.18, `${col} ${alpha * 2.2})`)
          g.addColorStop(0.5, `${col} ${alpha})`)
          g.addColorStop(1, `${col} 0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.moveTo(x - w * 0.035, yMid - len * 0.15)
          ctx.lineTo(x + w * 0.035, yMid - len * 0.15)
          ctx.lineTo(x + w * 0.035 + sway, yMid + len)
          ctx.lineTo(x - w * 0.035 + sway, yMid + len)
          ctx.closePath()
          ctx.fill()
        }
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (time: number) => {
      if (visible) draw(time)
      frame = requestAnimationFrame(loop)
    }

    resize()
    draw(4000)
    if (!still) frame = requestAnimationFrame(loop)

    const onMove = (event: PointerEvent) => { if (event.pointerType === 'mouse') pointer.tx = event.clientX / window.innerWidth }
    const ro = new ResizeObserver(() => { resize(); draw(performance.now() + 4000) })
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    const mo = new MutationObserver(() => { light = document.documentElement.getAttribute('data-theme') === 'light'; if (still) draw(4000) })
    ro.observe(canvas)
    io.observe(canvas)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="nx-aurora" aria-hidden="true" />
}
