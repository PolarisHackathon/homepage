import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Lang } from '../hooks/useI18n'
import type { SceneKind } from '../lib/sceneGeometry'
import { layoutCopy } from '../i18n/layout'

const SceneCanvas = lazy(() => import('./SceneCanvas'))

export function SceneVisual({ kind, lang, children }: { kind: SceneKind; lang: Lang; children: ReactNode }) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d')
  const [visible, setVisible] = useState(false)
  const [available, setAvailable] = useState(true)
  const root = useRef<HTMLDivElement>(null)
  const copy = layoutCopy[lang]
  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) setVisible(true) }, { rootMargin: '100px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const fallback = <div className="scene-fallback">{children}</div>
  return <div className={`scene-visual scene-visual-${kind}`} ref={root}>
    <div className="scene-toolbar"><p>{copy.illustration}</p><div role="group" aria-label={copy.visualMode}>{(['3d', '2d'] as const).map(value => <button type="button" key={value} aria-pressed={(available ? mode : '2d') === value} disabled={value === '3d' && !available} onClick={() => setMode(value)}>{value.toUpperCase()}</button>)}</div></div>
    <div className="scene-body">{mode === '3d' && visible && available ? <Suspense fallback={fallback}><SceneCanvas kind={kind} lang={lang} onUnavailable={() => setAvailable(false)} /></Suspense> : fallback}</div>
    {!available && <p className="scene-unavailable">{copy.modelUnavailable}</p>}
  </div>
}
