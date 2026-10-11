import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Copy, Heading, Hero, Link, Page, type Translator } from '../components/Editorial'
import { LifeSupport, ParticipationAreas } from '../components/EventExperience'
import { WorkshopScene } from '../components/ExperienceIllustrations'
import { PartnershipInquiry } from '../components/PartnershipInquiry'
import { FollowUpdates } from '../components/FollowUpdates'
import { Sponsors } from '../components/Sponsors'
import { faqs } from '../i18n/faq'
import { polarisCopy } from '../i18n/polaris'
import { passportUrl } from '../lib/site'
import type { Lang } from '../hooks/useI18n'

const chapters = [
  ['days', 'daysLabel'], ['make', 'themeLabel'], ['challenges', 'challengeLabel'],
  ['programme', 'programmeLabel'], ['support', 'supportLabel'], ['join', 'applyLabel'],
] as const

function ChapterNav({ t }: { t: Translator }) {
  const [active, setActive] = useState<string>('days')
  const navigation = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = navigation.current
    const current = container?.querySelector('[aria-current]')
    if (!container || !current) return
    const parent = container.getBoundingClientRect()
    const item = current.getBoundingClientRect()
    if (item.left < parent.left || item.right > parent.right) container.scrollTo({ left: container.scrollLeft + item.left - parent.left - 20, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }, [active])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let next: string = 'days'
      for (const [id] of chapters) {
        if ((document.getElementById('polaris-' + id)?.getBoundingClientRect().top ?? Infinity) <= 190) next = id
      }
      setActive(next)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])
  return <nav className="chapter-nav" aria-label={t('contents')}><div className="wrap" ref={navigation}>{chapters.map(([id, key], i) => <a key={id} href={'#polaris-' + id} aria-current={active === id ? 'location' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{t(key)}</a>)}</div></nav>
}

function ChapterHead({ number, label, caption, title, children }: { number: string; label: string; caption?: string; title: string; children?: ReactNode }) {
  return <div className="pv-intro">
    <header className="pv-head"><p className="pv-label"><span>{number}</span>{label}{caption && <small>{caption}</small>}</p><h2>{title.split('\n').map(line => <span key={line}>{line}</span>)}</h2></header>
    {children && <div className="pv-intro-body">{children}</div>}
  </div>
}

function Steps({ text }: { text: string }) {
  return <ol className="pv-steps">{text.split('|').map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}</ol>
}

function PolarisContent({ t, lang }: { t: Translator; lang: Lang }) {
  const p = polarisCopy[lang]
  const days = [['day1', 'day1Body'], ['day2', 'day2Body'], ['day5', 'day5Body']] as const
  return <>
    <Hero t={t} />
    <ChapterNav t={t} />
    <div className="pv">

    <section className="pv-facts" aria-label={p.factsLabel}><div className="wrap">
      <ul>{p.facts.map(fact => <li key={fact.title}><h3>{fact.title}</h3><p>{fact.body}</p></li>)}</ul>
      <a className="pv-facts-link" href="#polaris-support">{p.factsLink}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
    </div></section>

    <section id="polaris-days" className="pv-chapter"><div className="wrap">
      <ChapterHead number="01" label={t('daysLabel')} caption={t('daysCaption')} title={t('daysTitle')}><Copy text={t('daysBody')} /></ChapterHead>
      <div className="pv-timeline">
        <p className="pv-timeline-title">{t('timelineTitle')}</p>
        <ol>{days.map(([title, body], i) => <li key={title} className={i === 1 ? 'is-wide' : undefined}><span className="pv-day">{p.dayLabels[i]}</span><h3>{t(title)}</h3><p>{t(body)}</p></li>)}</ol>
        <p className="pv-timeline-note">{t('daysNote')}</p>
      </div>
      <div className="pv-row">
        <div><p className="pv-kicker">{t('cityCaption')}</p><h3>{t('cityTitle')}</h3></div>
        <Copy text={t('cityBody')} />
      </div>
    </div></section>

    <section id="polaris-make" className="pv-chapter"><div className="wrap">
      <ChapterHead number="02" label={t('themeLabel')} caption={t('themeOwner')} title={t('themeTitle')}><Copy text={t('themeBody')} /></ChapterHead>
      <div className="pv-row pv-panel">
        <div><h3>{t('openCreationTitle')}</h3></div>
        <Copy text={t('openCreationBody')} />
      </div>
    </div></section>

    <section id="polaris-challenges" className="pv-chapter"><div className="wrap">
      <ChapterHead number="03" label={t('challengeLabel')} caption={t('challengeOwner')} title={t('challengeTitle')}><Copy text={t('challengeBody')} /></ChapterHead>
      <div className="pv-formats">
        {(['sailboat', 'cruise'] as const).map(key => <article key={key} className="pv-panel">
          <p className="pv-kicker">{t(key)}</p>
          <h3>{t(key + 'Lead' as 'sailboatLead' | 'cruiseLead')}</h3>
          <Copy text={t(key + 'Body' as 'sailboatBody' | 'cruiseBody')} />
          <Steps text={t(key + 'Process' as 'sailboatProcess' | 'cruiseProcess')} />
        </article>)}
      </div>
      <div className="pv-row">
        <div><p className="pv-kicker">Challenge Station</p><h3>{t('stationTitle')}</h3></div>
        <Copy text={t('stationBody')} />
      </div>
    </div></section>

    <section id="polaris-programme" className="pv-chapter"><div className="wrap">
      <ChapterHead number="04" label={t('programmeLabel')} caption={t('programmeOwner')} title={t('programmeTitle')}><Copy text={t('programmeBody')} /></ChapterHead>
      <div className="pv-programme">
        <article className="pv-panel pv-workshop"><p className="pv-kicker">Workshop</p><h3>{t('workshops')}</h3><div className="pv-art"><WorkshopScene lang={lang} /></div><Copy text={t('workshopsBody')} /><Steps text={t('workshopProcess')} /></article>
        <div className="pv-stack">{(['talks', 'mentors', 'demos'] as const).map(key => <article key={key}><h3>{t(key)}</h3><Copy text={t(key + 'Body' as 'talksBody' | 'mentorsBody' | 'demosBody')} /></article>)}</div>
      </div>
      <p className="note">{t('programmeNote')}</p>
      <div className="pv-row">
        <div><p className="pv-kicker">{t('visitorEntry')}</p><h3>{t('visitorsTitle')}</h3></div>
        <Copy text={t('visitorsBody')} />
      </div>
      <ParticipationAreas lang={lang} />
    </div></section>

    <section id="polaris-support" className="pv-chapter"><div className="wrap">
      <ChapterHead number="05" label={t('supportLabel')} caption={t('supportCaption')} title={t('supportTitle')}><Copy text={t('supportBody')} /></ChapterHead>
      <LifeSupport t={t} lang={lang} />
    </div></section>

    <section id="polaris-join" className="pv-chapter"><div className="wrap">
      <ChapterHead number="06" label={t('applyLabel')} caption={t('applyCaption')} title={t('applyTitle')}><Copy text={t('applyBody')} /><p className="note">{t('applyNote')}</p></ChapterHead>
      <div className="pv-paths">
        <article className="pv-panel"><svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m5 24 13-13m-7-3 5-5 13 13-5 5ZM3 26l3 3 6-6-3-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg><h3>{t('applicantEntry')}</h3><Copy text={t('applicantSummary')} /></article>
        <article className="pv-panel"><svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" /><path d="m20 12-2 6-6 2 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg><h3>{t('visitorEntry')}</h3><Copy text={t('visitorSummary')} /></article>
      </div>
      <div className="participation-actions"><Link href={passportUrl}>{t('passportLink')}</Link><FollowUpdates lang={lang} label={t('follow')} /></div>
    </div></section>

    <section id="polaris-faq" className="pv-chapter"><div className="wrap faq-layout"><Heading label="FAQ" title={t('faqTitle')} /><div className="faq-list">{faqs[lang].map(item => <details key={item.q}><summary>{item.q}</summary><Copy text={item.a} /></details>)}</div></div></section>
    <section id="polaris-partners" className="pv-chapter"><div className="wrap"><div className="partners-layout"><Heading label={t('partnersLabel')} title={t('partnersTitle')} /><Copy text={t('partnersBody')} /></div><PartnershipInquiry lang={lang} /><Sponsors lang={lang} /></div></section>
    <section className="origin"><div className="wrap"><h2>{t('by')}</h2><div className="actions"><Link secondary href="/about">{t('meet')}</Link><Link secondary href="mailto:hr@entropy.asia">{t('joinLink')}</Link></div></div></section>
    </div>
  </>
}

export function Polaris() {
  return <Page page="polaris">{(t, lang) => <PolarisContent t={t} lang={lang} />}</Page>
}
