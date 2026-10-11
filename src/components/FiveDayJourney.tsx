import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '../hooks/useI18n'
import { getLenis, scrollToTarget } from '../lib/scroll'
import { experienceCopy } from '../i18n/experience'
import { creationCopy } from '../i18n/creation'
import { BuildScene, DemoScene } from './ExperienceIllustrations'
import { Copy, type Translator } from './Editorial'

gsap.registerPlugin(ScrollTrigger)

const phases = ['day1', 'day2', 'day5'] as const
const days = ['Day 1', 'Day 2—4', 'Day 5']

function MeetingScene({ lang }: { lang: Lang }) {
  return <figure className="meeting-scene experience-scene"><svg viewBox="0 0 740 430" fill="none" aria-hidden="true">
    <g stroke="var(--scene-line)" strokeWidth="1.5"><path d="M90 145H230Q270 145 270 190V215M120 329H230Q270 329 270 284V258M645 198H512Q480 198 480 228V245" /><circle cx="90" cy="145" r="26" /><circle cx="120" cy="329" r="26" /><circle cx="645" cy="198" r="26" /></g>
    <g transform="translate(258 65) rotate(-7 112 150)"><rect width="224" height="300" rx="4" fill="var(--scene-paper)" stroke="var(--scene-edge)" /><path d="M28 39h96M28 54h157M28 242h166M28 257h117" stroke="var(--scene-muted)" strokeWidth="3" /><rect x="28" y="86" width="167" height="119" rx="3" stroke="var(--scene-line)" /><path d="m48 179 45-60 39 37 44-48" stroke="var(--scene-accent)" strokeWidth="2" /><circle cx="176" cy="108" r="8" fill="var(--scene-accent)" /></g>
    <g stroke="var(--scene-accent)" strokeWidth="1.5" strokeLinejoin="round" fill="var(--scene-deep)"><path d="m197 174 7 30 8-11 12-2Z" /><path d="m538 283-29 10 13 6 5 12Z" /></g>
    <path d="M593 335v-19m-9 9h18M179 63v-15m-7 8h14" stroke="var(--scene-muted)" />
  </svg><figcaption>{experienceCopy[lang].conceptVisual}</figcaption></figure>
}

export function FiveDayJourney({ t, lang }: { t: Translator; lang: Lang }) {
  const root = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const scroll = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const [staticReading, setStaticReading] = useState(false)
  const [canMove, setCanMove] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia('(min-width: 1000px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)')
    const update = () => setCanMove(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (staticReading) return
    const media = gsap.matchMedia()
    let disposed = false
    media.add('(min-width: 1000px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)', () => {
      const element = root.current
      const track = rail.current
      if (!element || !track) return
      element.classList.add('is-journey-motion')
      const movement = gsap.to(track, { x: () => -(track.scrollWidth - element.clientWidth), ease: 'none' })
      const trigger = ScrollTrigger.create({
        trigger: element,
        animation: movement,
        start: 'top 130px',
        end: () => '+=' + Math.round(window.innerHeight * 1.2),
        pin: true,
        scrub: .65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: state => setActive(Math.round(state.progress * 2)),
      })
      scroll.current = trigger
      void document.fonts.ready.then(() => {
        if (disposed) return
        ScrollTrigger.refresh()
        getLenis()?.resize()
      })
      return () => {
        scroll.current = null
        element.classList.remove('is-journey-motion')
      }
    })
    return () => { disposed = true; media.revert() }
  }, [lang, staticReading])
  useEffect(() => {
    if (canMove && !staticReading) return
    let frame = 0
    const update = () => {
      frame = 0
      const panels = Array.from(rail.current?.children ?? [])
      let next = 0
      panels.forEach((panel, index) => {
        if (panel.getBoundingClientRect().top <= 200) next = index
      })
      setActive(next)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [canMove, staticReading, lang])
  const goTo = (index: number) => {
    const trigger = scroll.current
    if (trigger) scrollToTarget(trigger.start + (trigger.end - trigger.start) * index / 2)
    else {
      const panel = rail.current?.children[index]
      if (panel instanceof HTMLElement) scrollToTarget(panel)
      setActive(index)
    }
  }
  return <div className="five-day-story">
    <div className="journey-heading-row"><h3 className="journey-heading">{t('timelineTitle')}</h3>{canMove && <button className="journey-reading" type="button" aria-pressed={staticReading} onClick={() => setStaticReading(value => !value)}>{creationCopy[lang][staticReading ? 'animatedJourney' : 'staticReading']}<span aria-hidden="true">{staticReading ? '↔' : '↓'}</span></button>}</div>
    <div className="journey-viewport" ref={root}>
      <div className="journey-controls" role="group" aria-label={t('timelineTitle')}>{days.map((day, index) => <button key={day} type="button" aria-current={active === index ? 'step' : undefined} onClick={() => goTo(index)}><span>{day}</span><i aria-hidden="true" /></button>)}</div>
      <div className="journey-track" ref={rail}>{phases.map((key, index) => <article className={`journey-panel journey-phase-${index}`} key={key}>
        <div className="journey-copy"><p className="journey-day">{days[index]}</p><h4>{t(key)}</h4><Copy text={t(key + 'Body' as 'day1Body' | 'day2Body' | 'day5Body')} /></div>
        <div className="journey-art"><span className="journey-numeral" aria-hidden="true">{['01', '02—04', '05'][index]}</span>{index === 0 ? <MeetingScene lang={lang} /> : index === 1 ? <BuildScene lang={lang} /> : <DemoScene lang={lang} />}</div>
      </article>)}</div>
    </div>
    <p className="note">{t('daysNote')}</p>
  </div>
}
