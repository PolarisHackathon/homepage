import { useEffect, useRef } from 'react'
import { Copy, Link, type Translator } from '../Editorial'

type Props = { t: Translator; status: string; note: string }

// Approved home hero markup and styles, with an entrance sequence and a preparation badge.
export function PolarisFeature({ t, status, note }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const start = requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-lit')))
    return () => cancelAnimationFrame(start)
  }, [])

  const slogan = t('slogan').split('\n')
  const latin = /^[A-Za-z]/.test(slogan[0])

  return (
    <section className="home-hero hx-hero" ref={rootRef}>
      <div className="wrap hero-panel">
        <picture className="hero-light" aria-hidden="true"><source srcSet="/assets/polaris-light-900.webp 900w, /assets/polaris-light-1800.webp 1800w" type="image/webp" /><img src="/assets/polaris.png" alt="" width="1800" height="600" /></picture>
        <div className="hero-copy">
          <div className="event-name hx-in" style={{ transitionDelay: '250ms' }}><img src="/assets/polaris27.svg" alt="" /><div><p>Hackathon polaris 2027</p><p>{t('event')}</p></div></div>
          <h1>
            <span className="hero-line hero-line-0"><span className="hx-rise" style={{ transitionDelay: '420ms' }}>{slogan[0]}</span></span>
            {latin && ' '}
            <span className="hero-line hero-line-main"><span className="hx-rise" style={{ transitionDelay: '540ms' }}>{slogan.slice(1).join(latin ? ' ' : '')}</span></span>
          </h1>
          <p className="hero-facts hx-in" style={{ transitionDelay: '760ms' }}>{t('facts')}</p>
          <div className="hx-in" style={{ transitionDelay: '860ms' }}><Copy text={t('homeIntro')} /></div>
          <div className="actions hx-in" style={{ transitionDelay: '960ms' }}><Link href="/polaris.html">{t('explore')}</Link></div>
          <p className="note hx-status-line hx-in" style={{ transitionDelay: '1060ms' }}><span className="hx-status"><i aria-hidden="true" />{status}</span><span>{note}</span></p>
        </div>
        <p className="hero-coordinate hx-in" style={{ transitionDelay: '1200ms' }} aria-hidden="true">HONG KONG <span>2027</span></p>
      </div>
    </section>
  )
}
