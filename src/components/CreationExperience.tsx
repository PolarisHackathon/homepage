import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '../hooks/useI18n'
import { creationCopy } from '../i18n/creation'
import { Copy, type Translator } from './Editorial'

gsap.registerPlugin(ScrollTrigger)

export function ProjectRelations({ t, lang }: { t: Translator; lang: Lang }) {
  const root = useRef<HTMLElement>(null)
  const id = useId().replace(/:/g, '')
  const copy = creationCopy[lang]
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const element = root.current
      if (!element) return
      gsap.fromTo(element, { '--connection-reveal': .85, '--field-scale': .94 }, {
        '--creation-shift': '36px',
        '--field-scale': 1.06,
        '--connection-reveal': 0,
        ease: 'none',
        scrollTrigger: { trigger: element, start: 'top 90%', end: 'top 25%', scrub: .8 },
      })
      const project = element.querySelector('.creation-project')
      if (project) gsap.fromTo(project, { rotationY: -9, rotationZ: -3, scale: .96 }, {
        rotationY: 0, rotationZ: 0, scale: 1.03, ease: 'none',
        scrollTrigger: { trigger: element, start: 'top 80%', end: 'top 25%', scrub: .8 },
      })
    })
    return () => media.revert()
  }, [])
  return <figure className="creation-relation" ref={root} aria-label={copy.relationLabel}>
    <div className="creation-atmosphere" aria-hidden="true" />
    <svg className="creation-connections" viewBox="0 0 1240 650" fill="none" aria-hidden="true">
      <defs><linearGradient id={id + 'stream'} x1="0" y1="100" x2="850" y2="530" gradientUnits="userSpaceOnUse"><stop stopColor="#499bc7" stopOpacity="0" /><stop offset=".48" stopColor="#529aca" stopOpacity=".4" /><stop offset="1" stopColor="#8d95d0" stopOpacity=".06" /></linearGradient></defs>
      <g className="theme-streams"><path d="M-100 430C220 640 265-40 650 80S980 550 1360 340L1360 395C1000 620 950 225 650 158S250 730-100 510Z" fill={`url(#${id}stream)`} /><path d="M-100 338C205 525 245 40 610 140S1010 460 1360 220L1360 240C1010 500 960 340 610 185S190 630-100 390Z" fill={`url(#${id}stream)`} /></g>
      <g className="theme-contours">{[0, 1, 2, 3, 4, 5, 6].map(index => <path key={index} transform={`translate(0 ${index * 13})`} d="M-100 290C200 510 305-50 655 85S945 475 1360 230" />)}</g>
      <g className="challenge-connections"><path pathLength="1" d="M760 330H802Q836 330 836 360Q836 390 870 390H1032" /><path pathLength="1" d="M760 330H802Q836 330 836 382V410Q836 440 870 440H1032" /><path pathLength="1" d="M760 330H802Q836 330 836 382V460Q836 490 870 490H1032" /></g>
      <g className="problem-endpoints"><circle cx="1032" cy="390" r="5" /><circle cx="1032" cy="440" r="5" /><circle cx="1032" cy="490" r="5" /></g>
    </svg>
    <div className="creation-direction"><p className="creation-source">{t('themeLabel')}<span>{t('themeOwner')}</span></p><h3>{copy.direction}</h3><p>{copy.directionBody}</p></div>
    <div className="creation-project"><span className="project-frame-corner" aria-hidden="true" /><svg className="project-spectrum" viewBox="0 0 300 300" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="32" strokeOpacity=".09"><path d="M-70 260C70 15 160 265 370 45" /><path d="M-70 325C70 80 160 330 370 110" /></g><g stroke="currentColor" strokeWidth=".8" strokeOpacity=".25"><path d="M-70 244C70-1 160 249 370 29" /><path d="M-70 277C70 32 160 282 370 62" /><path d="M-70 309C70 64 160 314 370 94" /><path d="M-70 341C70 96 160 346 370 126" /></g></svg><p>{t('yourProject')}</p><span>{copy.projectJourney}</span></div>
    <div className="creation-problems"><p className="creation-source">{t('challengeLabel')}<span>{t('challengeOwner')}</span></p><h3>{copy.concreteProblems}</h3><p>{copy.problemsBody}</p></div>
    <figcaption>{copy.relationCaption}</figcaption>
  </figure>
}

export function ChallengeExplorer({ t, lang }: { t: Translator; lang: Lang }) {
  const copy = creationCopy[lang]
  return <div className="challenge-formats">
    <header className="formats-heading"><h3>{copy.formatsTitle}</h3><p>{copy.formatsBody}</p></header>
    <div className="challenge-format-pair">{(['sailboat', 'cruise'] as const).map(key => <article className={`challenge-format format-${key}`} key={key}>
      <header><h4>{key === 'sailboat' ? 'Sailboat' : 'Cruise'}</h4><p>{copy[key === 'sailboat' ? 'sailboatName' : 'cruiseName']}</p></header>
      <h5>{t(key + 'Lead' as 'sailboatLead' | 'cruiseLead')}</h5>
      <Copy text={t(key + 'Body' as 'sailboatBody' | 'cruiseBody')} />
      <div className="format-participation"><p>{copy.process}</p><ol>{t(key + 'Process' as 'sailboatProcess' | 'cruiseProcess').split('|').map((step, index) => <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol></div>
    </article>)}</div>
    <details className="challenge-brief"><summary>{copy.briefToggle}<span aria-hidden="true">+</span></summary><div className="brief-fields">{(['Problem', 'Resources', 'Submission'] as const).map(key => <div key={key}><h4>{copy[`brief${key}`]}</h4><p>{copy[`brief${key}Body`]}</p></div>)}</div><p className="note">{copy.briefNote}</p></details>
  </div>
}
