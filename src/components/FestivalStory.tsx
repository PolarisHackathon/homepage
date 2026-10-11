import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../hooks/useI18n'
import { creationCopy } from '../i18n/creation'
import { experienceCopy } from '../i18n/experience'
import { Copy, type Translator } from './Editorial'

const phases = ['day1', 'day2', 'day5'] as const
const dayLabels = ['Day 1', 'Day 2—4', 'Day 5']

function MakerMark({ phase = 2 }: { phase?: number }) {
  return <svg className="maker-mark" data-phase={phase} viewBox="0 0 640 560" fill="none" aria-hidden="true">
    <g className="maker-registration" stroke="currentColor" strokeWidth="1">
      <path d="M38 64h20M48 54v20M582 64h20M592 54v20M38 496h20M48 486v20M582 496h20M592 486v20" />
      <path d="M320 62v436M94 280h452" strokeDasharray="3 7" />
      <circle cx="320" cy="280" r="178" strokeDasharray="3 7" />
    </g>
    <g transform="translate(320 280)">
      <g className="maker-part maker-part-a"><path d="M-174 0 0-174 54-120-120 54Z" fill="var(--print-cobalt)" /><path d="m-147 27 174-174" stroke="var(--print-paper)" strokeWidth="1" /></g>
      <g className="maker-part maker-part-b"><path d="M0-174 174 0 120 54-54-120Z" fill="var(--print-blue)" /><path d="m-27-147 174 174" stroke="var(--print-paper)" strokeWidth="1" /></g>
      <g className="maker-part maker-part-c"><path d="M174 0 0 174-54 120 120-54Z" fill="var(--print-cobalt)" /><path d="m147-27-174 174" stroke="var(--print-paper)" strokeWidth="1" /></g>
      <g className="maker-part maker-part-d"><path d="M0 174-174 0-120-54 54 120Z" fill="var(--print-blue)" /><path d="m27 147-174-174" stroke="var(--print-paper)" strokeWidth="1" /></g>
      <g className="maker-core"><path d="M0-52 52 0 0 52-52 0Z" fill="var(--print-orange)" /><path d="M-26 0h52M0-26v52" stroke="var(--print-paper)" strokeWidth="1.5" /></g>
    </g>
  </svg>
}

function Journey({ t, lang }: { t: Translator; lang: Lang }) {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const manualPreview = useRef(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    const update = () => {
      frame = 0
      if (!query.matches || manualPreview.current) return
      const rows = Array.from(root.current?.querySelectorAll<HTMLElement>('.festival-day') ?? [])
      if (!rows.length) return
      const marker = window.innerHeight * .55
      let next = 0
      rows.forEach((row, index) => { if (row.getBoundingClientRect().top < marker) next = index })
      setActive(next)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    const resume = () => { manualPreview.current = false }
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key) && !(event.target instanceof HTMLElement && event.target.closest('button, input, textarea, select, [contenteditable]'))) resume()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', resume, { passive: true })
    window.addEventListener('touchstart', resume, { passive: true })
    window.addEventListener('keydown', onKey)
    query.addEventListener('change', update)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', resume)
      window.removeEventListener('touchstart', resume)
      window.removeEventListener('keydown', onKey)
      query.removeEventListener('change', update)
      cancelAnimationFrame(frame)
    }
  }, [lang])
  return <div className="festival-journey" ref={root}>
    <div className="festival-print-column"><figure className="festival-print">
      <div className="print-masthead"><span>polaris.27</span><span>{dayLabels[active]}</span></div>
      <MakerMark phase={active} />
      <figcaption><span>{t(phases[active])}</span><small>{experienceCopy[lang].conceptVisual}</small></figcaption>
      <div className="print-selector" role="group" aria-label={t('timelineTitle')}>{dayLabels.map((day, index) => <button type="button" key={day} aria-pressed={active === index} onClick={() => { manualPreview.current = true; setActive(index) }}><span>{day}</span><span aria-hidden="true">{active === index ? '↗' : '＋'}</span></button>)}</div>
    </figure></div>
    <div className="festival-days-ledger"><h3 className="festival-timeline-title">{t('timelineTitle')}</h3>{phases.map((key, index) => <article className="festival-day" data-active={active === index} key={key}>
      <p className="festival-day-index"><span>{dayLabels[index]}</span><span aria-hidden="true">{['01', '02—04', '05'][index]}</span></p>
      <h4>{t(key)}</h4><Copy text={t(key + 'Body' as 'day1Body' | 'day2Body' | 'day5Body')} />
    </article>)}<p className="note">{t('daysNote')}</p></div>
  </div>
}

function CreationMap({ t, lang }: { t: Translator; lang: Lang }) {
  const copy = creationCopy[lang]
  return <figure className="festival-map" aria-label={copy.relationLabel}>
    <div className="map-direction"><span className="festival-eyebrow">Theme</span><h3>{copy.direction}</h3><p>{copy.directionBody}</p></div>
    <div className="map-field">
      <div className="map-orbits" aria-hidden="true"><i /><i /><i /></div>
      <div className="map-project"><MakerMark /><p>{t('yourProject')}</p><span>{copy.projectJourney}</span></div>
      <div className="map-problem"><span className="festival-eyebrow">Challenge</span><h3>{copy.concreteProblems}</h3><p>{copy.problemsBody}</p></div>
      <svg className="map-connector" viewBox="0 0 800 500" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M270 320V382Q270 400 288 400H480" stroke="currentColor" strokeWidth="1.5" /><path d="m472 394 8 6-8 6" stroke="currentColor" strokeWidth="1.5" /></svg>
    </div>
    <figcaption>{copy.relationCaption}</figcaption>
  </figure>
}

function ChallengeFormats({ t, lang }: { t: Translator; lang: Lang }) {
  const copy = creationCopy[lang]
  return <div className="festival-formats">
    <header><h3>{copy.formatsTitle}</h3><p>{copy.formatsBody}</p></header>
    <div className="festival-format-pair">{(['sailboat', 'cruise'] as const).map(key => <article className="festival-format" key={key}>
      <div className="format-name"><h4>{key === 'sailboat' ? 'Sailboat' : 'Cruise'}</h4><span>{copy[key === 'sailboat' ? 'sailboatName' : 'cruiseName']}</span></div>
      <h5>{t(key + 'Lead' as 'sailboatLead' | 'cruiseLead')}</h5>
      <Copy text={t(key + 'Body' as 'sailboatBody' | 'cruiseBody')} />
      <p className="format-process-label">{copy.process}</p>
      <ol>{t(key + 'Process' as 'sailboatProcess' | 'cruiseProcess').split('|').map((step, index) => <li key={step}><span aria-hidden="true">{index + 1}</span>{step}</li>)}</ol>
    </article>)}</div>
    <details className="festival-brief"><summary>{copy.briefToggle}<span aria-hidden="true">＋</span></summary><div>{(['Problem', 'Resources', 'Submission'] as const).map(key => <article key={key}><h4>{copy[`brief${key}`]}</h4><p>{copy[`brief${key}Body`]}</p></article>)}</div><p>{copy.briefNote}</p></details>
  </div>
}

export function FestivalStory({ t, lang }: { t: Translator; lang: Lang }) {
  return <div className="festival">
    <section className="festival-days" id="polaris-days"><div className="wrap">
      <p className="festival-section-label"><span>01 / {t('daysLabel')}</span><span>Hong Kong · 2027</span></p>
      <header className="festival-opening"><h2>{t('daysTitle')}</h2><div><span className="festival-duration" aria-hidden="true">05<span> / DAYS</span></span><Copy text={t('daysBody')} /></div></header>
      <Journey t={t} lang={lang} />
      <aside className="festival-city"><span className="city-arrow" aria-hidden="true">↗</span><div><p className="festival-eyebrow">{t('cityCaption')}</p><h3>{t('cityTitle')}</h3></div><Copy text={t('cityBody')} /></aside>
    </div></section>
    <section className="festival-creation" id="polaris-make"><div className="wrap">
      <p className="festival-section-label"><span>02 / Theme</span><span>{t('themeOwner')}</span></p>
      <header className="festival-creation-title"><h2>{t('themeLabel')}<span aria-hidden="true">↘</span></h2><p>{t('themeTitle')}</p></header>
      <CreationMap t={t} lang={lang} />
      <div className="festival-theme-details"><Copy text={t('themeBody')} /><aside><h3>{t('openCreationTitle')}</h3><Copy text={t('openCreationBody')} /></aside></div>
      <div className="festival-challenges" id="polaris-challenges">
        <p className="festival-section-label"><span>03 / Challenge</span><span>{t('challengeOwner')}</span></p>
        <header className="festival-challenge-title"><h2>{t('challengeLabel')}<span aria-hidden="true">↗</span></h2><Copy text={t('challengeBody')} /></header>
        <ChallengeFormats t={t} lang={lang} />
        <aside className="festival-station"><span>Challenge<br />Station</span><div><h3>{t('stationTitle')}</h3><Copy text={t('stationBody')} /></div></aside>
      </div>
    </div></section>
  </div>
}
