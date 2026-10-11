import { useEffect, useRef } from 'react'

type Props = { holder: string; holderValue: string; issued: string; next: string; label: string; autoOpen?: boolean }

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => 1 - Math.pow(1 - v, 3)

// Passport booklet that opens on scroll (or on load with autoOpen) and receives the Polaris stamp.
export function PassportBook({ holder, holderValue, issued, next, label, autoOpen = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.setProperty('--open', '1')
      root.classList.add('is-stamped')
      return
    }

    let frame = 0
    let tiltX = 0
    let tiltY = 0
    let targetX = 0
    let targetY = 0
    let stamped = false
    const startedAt = performance.now()

    const update = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = autoOpen
        ? clamp((performance.now() - startedAt - 500) / 1300)
        : clamp((vh * 0.95 - rect.top) / (vh * 0.42))
      root.style.setProperty('--open', ease(progress).toFixed(4))
      if (progress > 0.86 && !stamped) { stamped = true; root.classList.add('is-stamped') }
      if (!autoOpen && progress < 0.2 && stamped) { stamped = false; root.classList.remove('is-stamped') }
      tiltX += (targetX - tiltX) * 0.08
      tiltY += (targetY - tiltY) * 0.08
      root.style.setProperty('--tx', tiltX.toFixed(3))
      root.style.setProperty('--ty', tiltY.toFixed(3))
      frame = requestAnimationFrame(update)
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = root.getBoundingClientRect()
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const onLeave = () => { targetX = 0; targetY = 0 }

    frame = requestAnimationFrame(update)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [autoOpen])

  return (
    <div className="hx-book" ref={rootRef} role="img" aria-label={label}>
      <div className="hx-book-body">
        <div className="hx-page">
          <div className="hx-page-head">
            <img src="/assets/entropy_logo.svg" alt="" className="hx-page-logo" />
            <span>Passport</span>
          </div>
          <dl className="hx-page-fields">
            <div><dt>{holder}</dt><dd>{holderValue}</dd></div>
            <div><dt>{issued}</dt><dd>2026</dd></div>
          </dl>
          <div className="hx-stamps">
            <div className="hx-stamp">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs><path id="hx-stamp-arc" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
                <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <text fontSize="10.5" letterSpacing="2.6" fill="currentColor"><textPath href="#hx-stamp-arc">HACKATHON POLARIS · HONG KONG ·</textPath></text>
                <path d="M60 36 L62.2 50.8 L77 53 L62.2 55.2 L60 70 L57.8 55.2 L43 53 L57.8 50.8 Z" fill="currentColor" />
              </svg>
              <span>2027</span>
            </div>
            <div className="hx-stamp-slot"><span>{next}</span></div>
          </div>
          <div className="hx-page-mrz" aria-hidden="true">P&lt;ENTROPY&lt;&lt;POLARIS&lt;2027&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
        </div>
        <div className="hx-cover">
          <div className="hx-cover-front">
            <img src="/assets/entropy_logo.svg" alt="" className="hx-cover-logo" />
            <svg className="hx-cover-mark" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth=".8" />
              <path d="M50 26 L52 48 L74 50 L52 52 L50 74 L48 52 L26 50 L48 48 Z" fill="currentColor" />
            </svg>
            <span className="hx-cover-word">PASSPORT</span>
          </div>
          <div className="hx-cover-back" />
        </div>
      </div>
    </div>
  )
}
