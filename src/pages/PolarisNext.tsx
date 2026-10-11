import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { Copy, Link, Page, type Translator } from '../components/Editorial'
import { PartnershipInquiry } from '../components/PartnershipInquiry'
import { FollowUpdates } from '../components/FollowUpdates'
import { Sponsors } from '../components/Sponsors'
import { AuroraCanvas } from '../components/polaris/AuroraCanvas'
import { faqs } from '../i18n/faq'
import { experienceCopy } from '../i18n/experience'
import { layoutCopy } from '../i18n/layout'
import { filmCopy, type FilmCopy } from '../i18n/polarisFilm'
import { passportUrl } from '../lib/site'
import type { Lang } from '../hooks/useI18n'

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const lines = (text: string) => text.split('\n').map(line => <span key={line}>{line}</span>)
const vars = (o: Record<string, number | string>) => o as CSSProperties
const chapterIds = ['fs-days', 'fs-who', 'fs-make', 'fs-site', 'fs-life', 'fs-join']

// One motion system for the whole page: [data-reveal] fades in once, [data-progress] gets --p from 0 to 1 as it crosses the viewport.
function useMotion(root: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const reveals = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
    const tracks = Array.from(el.querySelectorAll<HTMLElement>('[data-progress]'))
    const hero = el.querySelector<HTMLElement>('.fs-hero')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-still')
      reveals.forEach(r => r.classList.add('is-in'))
      tracks.forEach(t => { t.style.setProperty('--p', '1'); t.querySelectorAll('[data-hours]').forEach(h => { h.textContent = '120' }) })
      return
    }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target) }
    }), { rootMargin: '0px 0px -12% 0px' })
    reveals.forEach(r => io.observe(r))
    let frame = 0
    const update = () => {
      frame = 0
      const vh = innerHeight
      for (const t of tracks) {
        const r = t.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) continue
        const p = clamp((vh * 0.85 - r.top) / (vh * 0.55))
        t.style.setProperty('--p', p.toFixed(4))
        const hours = t.querySelector('[data-hours]')
        if (hours) hours.textContent = String(Math.round(p * 120))
      }
      if (hero) el.style.setProperty('--hp', clamp(scrollY / (hero.offsetHeight * 0.85)).toFixed(4))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(frame) }
  }, [root])
}

// Floating chapter index; shows after the hero and marks the chapter in view.
function ChapterIndex({ labels, label }: { labels: string[]; label: string }) {
  const [active, setActive] = useState(-1)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let next = -1
      chapterIds.forEach((id, i) => { if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= innerHeight * 0.45) next = i })
      setActive(next)
      const end = document.getElementById('fs-faq')?.getBoundingClientRect().top ?? Infinity
      setShown(scrollY > innerHeight * 0.8 && end > innerHeight * 0.6)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])
  return <nav className={`fs-index${shown ? ' is-shown' : ''}`} aria-label={label}>{labels.map((text, i) => <a key={text} href={'#' + chapterIds[i]} aria-current={active === i ? 'location' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{text}</a>)}</nav>
}

function Chapter({ id, n, label, title, intro, children }: { id: string; n: number; label: string; title: string; intro?: string; children: ReactNode }) {
  return <section id={id} className="fs-chapter"><div className="wrap">
    <header className="fs-head" data-reveal>
      <p className="fs-num"><span>{String(n).padStart(2, '0')}</span>{label}</p>
      <h2>{title}</h2>
      {intro && <Copy text={intro} className="fs-intro" />}
    </header>
    {children}
  </div></section>
}

function Steps({ text, at = 0 }: { text: string; at?: number }) {
  return <ol className="fs-steps">{text.split('|').map((step, i) => <li key={step} style={vars({ '--at': at + i * 0.18 })}><span>{String(i + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
}

// Seven small clusters inside the box; each dot drifts from a scattered start into its team.
const people = Array.from({ length: 30 }, (_, i) => {
  const seed = Math.sin(i * 91.7) * 10000
  const r = (n: number) => { const v = Math.sin(seed + n) * 10000; return v - Math.floor(v) }
  const team = i % 6
  const cx = [20, 50, 80, 22, 52, 80][team]
  const cy = [30, 26, 32, 72, 76, 70][team]
  const angle = (i / 6) * 2.1 + team
  return { x0: r(1) * 90 + 5, y0: r(2) * 84 + 8, x1: cx + Math.cos(angle) * 7, y1: cy + Math.sin(angle) * 9, d: r(3) * 0.3 }
})

function FilmContent({ t, lang }: { t: Translator; lang: Lang }) {
  const c: FilmCopy = filmCopy[lang]
  const x = experienceCopy[lang]
  const l = layoutCopy[lang]
  const root = useRef<HTMLDivElement>(null)
  const hero = useRef<HTMLElement>(null)
  useMotion(root)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => hero.current?.classList.add('is-lit')))
    return () => cancelAnimationFrame(id)
  }, [])
  const slogan = t('slogan').split('\n')
  const latin = /^[A-Za-z]/.test(slogan[0])
  const mainText = slogan.slice(1).join(latin ? ' ' : '')
  const units = latin ? mainText.split(/(\s+)/) : Array.from(mainText)
  const dayAt = [0.04, 0.26, 0.78]
  const zones = [
    { key: 'is-public', name: x.publicArea, rule: l.publicRule, state: c.zoneStates[0] },
    { key: 'is-build', name: x.buildArea, rule: l.buildRule, state: c.zoneStates[1] },
    { key: 'is-rest', name: x.restArea, rule: l.restRule, state: c.zoneStates[2] },
  ]

  return <div className="fs" ref={root}>
    <div className="fs-sky" aria-hidden="true" />
    <ChapterIndex labels={c.chapters} label={t('contents')} />

    <section className="fs-hero" ref={hero}>
      <AuroraCanvas />
      <div className="wrap fs-hero-inner">
        <div className="fs-event fs-in" style={{ transitionDelay: '200ms' }}><img src="/assets/polaris27.svg" alt="" /><div><p>Hackathon polaris 2027</p><p>{t('event')}</p></div></div>
        <h1 className="fs-slogan" aria-label={slogan.join(latin ? ' ' : '')}>
          <span className="fs-slogan-0" aria-hidden="true">{slogan[0]}</span>
          <span className="fs-slogan-main" aria-hidden="true">{units.map((u, i) => /^\s+$/.test(u) ? ' ' : <span key={i} style={{ transitionDelay: `${520 + i * (latin ? 90 : 55)}ms` }}>{u}</span>)}</span>
        </h1>
        <div className="fs-in" style={{ transitionDelay: `${720 + units.length * (latin ? 90 : 55)}ms` }}>
          <p className="fs-facts">{t('facts')}</p>
          <p className="fs-lead">{c.lead}</p>
          <div className="actions"><Link href="#fs-days">{c.ctaStart}</Link><Link secondary href="#fs-partners">{c.ctaPartner}</Link></div>
          <p className="fs-status"><span><i aria-hidden="true" />{c.status}</span>{c.statusNote}</p>
        </div>
      </div>
      <p className="fs-coordinate" aria-hidden="true">HONG KONG <span>2027</span></p>
    </section>

    <section className="fs-glance"><div className="wrap"><ul>{c.glance.map((item, i) => <li key={item.big} data-reveal style={vars({ '--i': i })}><b>{item.big}</b><span>{item.small}</span></li>)}</ul></div></section>

    <Chapter id="fs-days" n={1} label={c.chapters[0]} title={c.daysHead} intro={c.daysSub}>
      <div className="fs-timeline" data-progress>
        <div className="fs-axis" aria-hidden="true">
          {[1, 2, 3, 4, 5].map(n => <span key={n} style={vars({ '--at': (n - 1) / 5 })}>Day {n}</span>)}
          <i className="fs-axis-fill" />
          <b className="fs-cursor"><em data-hours>0</em>h <small>/ 120h</small></b>
        </div>
        <p className="fs-sr">{c.hoursLabel}: 120h</p>
        <ol className="fs-plan">{c.dayPlans.map((day, i) => <li key={day.label} className={`is-d${i}`} style={vars({ '--at': dayAt[i] })}>
          <span className="fs-plan-label">{day.label}</span>
          <h3>{day.title}</h3>
          <ul>{day.items.map((item, k) => <li key={item} style={vars({ '--k': k })}>{item}</li>)}</ul>
        </li>)}</ol>
        <div className="fs-tracks"><p>{c.tracksTitle}</p><ul>{c.tracks.map((track, i) => <li key={track.name} style={vars({ '--i': i })}><i aria-hidden="true" /><b>{track.name}</b><span>{track.note}</span></li>)}</ul></div>
        <p className="fs-note">{t('daysNote')}</p>
      </div>
      <div className="fs-row">
        <article className="fs-card" data-reveal><p className="fs-kicker">{t('cityCaption')}</p><h3>{t('cityTitle')}</h3><p>{c.leaveNote}</p></article>
        <article className="fs-card" data-reveal style={vars({ '--i': 1 })}><p className="fs-kicker">{c.daysTagsLabel}</p><ul className="fs-tags">{c.daysTags.map(tag => <li key={tag}>{tag}</li>)}</ul><p>{t('openCreationBody')}</p></article>
      </div>
    </Chapter>

    <Chapter id="fs-who" n={2} label={c.chapters[1]} title={c.whoHead}>
      <div className="fs-who">
        <ul className="fs-who-list">{c.whoCards.map((card, i) => <li key={card.big} data-reveal style={vars({ '--i': i })}><h3>{card.big}</h3><p>{card.small}</p></li>)}</ul>
        <figure className="fs-teams" data-progress>
          <div aria-hidden="true">{people.map((p, i) => <i key={i} style={vars({ '--x0': `${p.x0}%`, '--y0': `${p.y0}%`, '--x1': `${p.x1}%`, '--y1': `${p.y1}%`, '--d': p.d })} />)}</div>
          <figcaption>{c.teamCaption}</figcaption>
        </figure>
      </div>
      <div className="fs-apply-flow" data-progress>
        <h3>{c.applyStepsTitle}</h3>
        <Steps text={c.applySteps} at={0.1} />
        <p className="fs-note">{t('applyNote')}</p>
      </div>
      <div className="fs-row">
        <article className="fs-card" data-reveal><p className="fs-kicker">{t('applicantEntry')}</p><p>{t('applicantSummary')}</p></article>
        <article className="fs-card" data-reveal style={vars({ '--i': 1 })}><p className="fs-kicker">{t('visitorEntry')}</p><p>{t('visitorSummary')}</p></article>
      </div>
    </Chapter>

    <Chapter id="fs-make" n={3} label={c.chapters[2]} title={c.makeHead} intro={c.makeSub}>
      <div className="fs-halves" data-progress>
        <article className="is-left">
          <div className="fs-half-top"><h3>{c.theme.title}</h3><span className="fs-pill">{c.theme.status}</span></div>
          <p className="fs-owner">{c.theme.owner}</p>
          <Copy text={t('themeBody')} />
          <div className="fs-sub-card"><h4>{t('openCreationTitle')}</h4><p>{t('openCreationBody')}</p></div>
        </article>
        <article className="is-right">
          <div className="fs-half-top"><h3>{c.challenge.title}</h3><span className="fs-pill">{c.challenge.status}</span></div>
          <p className="fs-owner">{c.challenge.owner}</p>
          <p>{t('challengeBody').split('\n\n')[0]}</p>
          {(['sailboat', 'cruise'] as const).map(key => <div key={key} className="fs-sub-card">
            <h4>{t(key)}</h4>
            <p>{t(`${key}Body` as 'sailboatBody' | 'cruiseBody')}</p>
            <p className="fs-flow">{t(`${key}Process` as 'sailboatProcess' | 'cruiseProcess').split('|').map((s, i) => <span key={s}>{i > 0 && <i aria-hidden="true">→</i>}{s}</span>)}</p>
          </div>)}
        </article>
        <p className="fs-merge">{c.merge}</p>
      </div>
      <div className="fs-row">
        <article className="fs-card" data-reveal><p className="fs-kicker">Challenge Station</p><h3>{t('stationTitle')}</h3><p>{t('stationBody')}</p></article>
        <article className="fs-card" data-reveal style={vars({ '--i': 1 })}><p className="fs-kicker">{t('challengeLabel')}</p><p>{c.challengeNote}</p></article>
      </div>
    </Chapter>

    <Chapter id="fs-site" n={4} label={c.chapters[3]} title={c.siteHead} intro={t('programmeBody')}>
      <ul className="fs-programme">{(['talks', 'workshops', 'mentors', 'demos'] as const).map((key, i) => <li key={key} data-reveal style={vars({ '--i': i })}>
        <span>{String(i + 1).padStart(2, '0')}</span>
        <h3>{t(key)}</h3>
        <p>{t(`${key}Body` as 'talksBody' | 'workshopsBody' | 'mentorsBody' | 'demosBody')}</p>
        {key === 'workshops' && <p className="fs-flow">{t('workshopProcess').split('|').map((s, k) => <span key={s}>{k > 0 && <i aria-hidden="true">→</i>}{s}</span>)}</p>}
      </li>)}</ul>
      <p className="fs-note">{t('programmeNote')}</p>
      <div className="fs-zones" data-progress>
        <div className="fs-zones-head"><h3>{c.zonesTitle}</h3><Copy text={t('visitorsBody')} /></div>
        <div className="fs-plan-map">
          {zones.map((zone, i) => <div key={zone.key} className={`fs-zone ${zone.key}`} style={vars({ '--at': 0.15 + i * 0.28 })}>
            <span className="fs-zone-state">{zone.state}</span>
            <h4>{zone.name}</h4>
            <p>{zone.rule}</p>
          </div>)}
          <i className="fs-walker" aria-hidden="true" />
        </div>
      </div>
    </Chapter>

    <Chapter id="fs-life" n={5} label={c.chapters[4]} title={c.lifeHead} intro={t('supportBody')}>
      <div className="fs-life">
        <article className="fs-card fs-life-card" data-progress>
          <p className="fs-kicker">{t('sleep')}</p>
          <h3>{x.twoPeople}</h3>
          <div className="fs-slot" aria-hidden="true"><div className="fs-slot-bar"><i /></div><div className="fs-slot-scale"><span>{x.locked} · 0h</span><span>6h</span><span>{x.slotEnds} · 12h</span></div></div>
          <Copy text={t('sleepBody')} />
          <p className="fs-fine">{c.sleepExtra}</p>
        </article>
        <article className="fs-card fs-life-card" data-progress>
          <p className="fs-kicker">{t('food')}</p>
          <h3>{x.mealTitle}</h3>
          <ul className="fs-meals">{x.mealChoices.split('|').map((m, i) => <li key={m} style={vars({ '--at': 0.1 + i * 0.2 })}>{m}</li>)}</ul>
          <Copy text={t('foodBody')} />
          <p className="fs-fine">{c.foodExtra}</p>
        </article>
        <article className="fs-card fs-life-card is-travel" data-progress>
          <p className="fs-kicker">{t('travel')}</p>
          <h3>{x.travelTitle}</h3>
          <p className="fs-route"><span>{t('usualResidence')}</span><i aria-hidden="true"><b /></i><strong>{x.venue}</strong></p>
          <Steps text={x.travelSteps} at={0.2} />
          <div className="fs-travel-text"><Copy text={t('travelBody')} /><p className="fs-fine">{c.travelExtra}</p></div>
        </article>
      </div>
    </Chapter>

    <section id="fs-join" className="fs-apply"><div className="wrap" data-reveal>
      <p className="fs-num"><span>06</span>{c.chapters[5]}</p>
      <h2 className="fs-statement">{lines(c.applyTitle)}</h2>
      <p className="fs-sub">{c.applyBody}</p>
      <div className="participation-actions"><Link href={passportUrl}>{t('passportLink')}</Link><FollowUpdates lang={lang} label={t('follow')} /></div>
    </div></section>

    <section id="fs-faq" className="fs-section"><div className="wrap fs-faq">
      <header data-reveal><p className="fs-kicker">FAQ</p><h2>{c.faqTitle}</h2></header>
      <div className="faq-list">{faqs[lang].map((item, i) => <details key={item.q} data-reveal style={vars({ '--i': Math.min(i, 5) })}><summary>{item.q}</summary><Copy text={item.a} /></details>)}</div>
    </div></section>

    <section id="fs-partners" className="fs-section"><div className="wrap">
      <div className="fs-partner" data-reveal><div><p className="fs-kicker">{t('partnersLabel')}</p><h2>{c.partnerTitle}</h2></div><Copy text={t('partnersBody')} /></div>
      <PartnershipInquiry lang={lang} />
      <Sponsors lang={lang} />
    </div></section>

    <section className="fs-origin"><div className="wrap"><h2>{t('by')}</h2><div className="actions"><Link secondary href="/about">{t('meet')}</Link><Link secondary href="mailto:hr@entropy.asia">{t('joinLink')}</Link></div></div></section>
  </div>
}

export function PolarisNext() {
  return <Page page="polaris">{(t, lang) => <FilmContent t={t} lang={lang} />}</Page>
}
