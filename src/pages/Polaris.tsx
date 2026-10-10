import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Copy, Heading, Hero, Link, Page, type Translator } from '../components/Editorial'
import { LifeSupport, ParticipationAreas } from '../components/EventExperience'
import { ChallengeExplorer, ProjectRelations } from '../components/CreationExperience'
import { WorkshopScene } from '../components/ExperienceIllustrations'
import { PartnershipInquiry } from '../components/PartnershipInquiry'
import { FollowUpdates } from '../components/FollowUpdates'
import { FiveDayJourney } from '../components/FiveDayJourney'
import { useChapterMotion } from '../hooks/useChapterMotion'
import { faqs } from '../i18n/faq'
import { localized, type LocalizedText } from '../lib/locale'
import { passportUrl } from '../lib/site'
import type { Lang } from '../hooks/useI18n'

interface SponsorCategory {
  category: LocalizedText
  sponsors: { name: string; url?: string; logo: { dark: string; light: string }; edition?: string; confirmedForEdition?: boolean }[]
}

function Sponsors({ lang }: { lang: Lang }) {
  const [categories, setCategories] = useState<SponsorCategory[]>([])
  useEffect(() => {
    const controller = new AbortController()
    fetch('/sponsor.json', { signal: controller.signal }).then(response => response.ok ? response.json() : []).then((data: SponsorCategory[]) => {
      if (Array.isArray(data)) setCategories(data)
    }).catch(() => {})
    return () => controller.abort()
  }, [])
  return <div className="sponsors">{categories.map(category => {
    const confirmed = category.sponsors.filter(sponsor => sponsor.edition === 'polaris-2027' && sponsor.confirmedForEdition === true)
    if (!confirmed.length) return null
    return <div key={category.category.zh}><h3>{localized(category.category, lang)}</h3><div className="sponsor-logos">{confirmed.map(sponsor => <a key={sponsor.name} href={sponsor.url} target="_blank" rel="noopener noreferrer"><img className="dark-logo" src={sponsor.logo.dark} alt={sponsor.name} loading="lazy" /><img className="light-logo" src={sponsor.logo.light} alt={sponsor.name} loading="lazy" /></a>)}</div></div>
  })}</div>
}

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

function FeatureHeading({ number, label, caption, title }: { number: string; label: string; caption: string; title: string }) {
  const lines = title.split('\n')
  const style = { '--title-characters': Math.max(...lines.map(line => Array.from(line).length)) } as CSSProperties
  return <header className="feature-heading" data-motion="title" data-script={/[\u3400-\u9fff]/.test(title) ? 'han' : 'latin'} style={style}><p className="feature-label"><span>{number}</span>{label}<small>{caption}</small></p><h2>{lines.map(line => <span key={line}>{line}</span>)}</h2></header>
}

function PolarisContent({ t, lang }: { t: Translator; lang: Lang }) {
  const motion = useChapterMotion(lang)
  return <>
    <Hero t={t} />
    <ChapterNav t={t} />
    <div className="event-story" ref={motion}>
    <section id="polaris-days" className="chapter days-chapter"><div className="wrap">
      <div className="feature-intro days-intro"><FeatureHeading number="01" label={t('daysLabel')} caption={t('daysCaption')} title={t('daysTitle')} /><Copy text={t('daysBody')} /><span className="days-scale" aria-hidden="true">5</span></div>
      <FiveDayJourney t={t} lang={lang} />
      <div className="city-exploration"><div><p className="chapter-label">{t('cityCaption')}</p><h3>{t('cityTitle')}</h3></div><Copy text={t('cityBody')} /></div>
    </div>
    </section>
    <section id="polaris-make" className="chapter theme-chapter"><div className="wrap">
      <div className="creation-opener"><header className="creation-title" data-motion="title"><p className="creation-index">02 · Theme</p><h2>{t('themeLabel')}</h2><p className="creation-owner">{t('themeOwner')}</p><p className="creation-lead">{t('themeTitle')}</p></header><Copy text={t('themeBody')} /></div>
      <div className="project-direction-story"><ProjectRelations t={t} lang={lang} /></div>
      <article className="open-creation"><h3>{t('openCreationTitle')}</h3><Copy text={t('openCreationBody')} /></article>
    </div></section>
    <section id="polaris-challenges" className="chapter challenge-chapter"><div className="wrap">
      <div className="creation-opener"><header className="creation-title" data-motion="title"><p className="creation-index">03 · Challenge</p><h2>{t('challengeLabel')}</h2><p className="creation-owner">{t('challengeOwner')}</p><p className="creation-lead">{t('challengeTitle')}</p></header><Copy text={t('challengeBody')} /></div>
      <ChallengeExplorer t={t} lang={lang} />
      <aside className="station"><p className="chapter-label">Challenge Station</p><div><h3>{t('stationTitle')}</h3><Copy text={t('stationBody')} /></div></aside>
    </div></section>
    <section id="polaris-programme" className="chapter programme-chapter"><div className="wrap">
      <div className="feature-intro"><FeatureHeading number="04" label={t('programmeLabel')} caption={t('programmeOwner')} title={t('programmeTitle')} /><Copy text={t('programmeBody')} /></div>
      <div className="programme-layout">
        <article className="programme-workshop"><p className="chapter-label">Workshop</p><h3>{t('workshops')}</h3><div className="workshop-art" data-motion="graphic"><WorkshopScene lang={lang} /></div><Copy text={t('workshopsBody')} /><div className="workshop-process">{t('workshopProcess').split('|').map((step, i) => <span key={step}><small>0{i + 1}</small>{step}</span>)}</div></article>
        <div className="programme-conversations">{(['talks', 'mentors'] as const).map(key => <article key={key}><p className="chapter-label">{key === 'talks' ? 'Talks & conversations' : 'Mentoring'}</p><h3>{t(key)}</h3><Copy text={t(key + 'Body' as 'talksBody' | 'mentorsBody')} /></article>)}</div>
        <article className="programme-demos"><p className="programme-word" aria-hidden="true">Demo<span>↗</span></p><div><h3>{t('demos')}</h3><Copy text={t('demosBody')} /></div></article>
      </div>
      <p className="note">{t('programmeNote')}</p>
      <div className="visitor-story"><div><p className="chapter-label">{t('visitorEntry')}</p><h3>{t('visitorsTitle')}</h3></div><Copy text={t('visitorsBody')} /></div>
      <ParticipationAreas lang={lang} />
    </div></section>
    <section id="polaris-support" className="chapter support-chapter"><div className="wrap">
      <div className="feature-intro"><FeatureHeading number="05" label={t('supportLabel')} caption={t('supportCaption')} title={t('supportTitle')} /><Copy text={t('supportBody')} /></div>
      <LifeSupport t={t} lang={lang} />
    </div></section>
    <section id="polaris-join" className="chapter apply-chapter"><div className="wrap">
      <div className="feature-intro"><FeatureHeading number="06" label={t('applyLabel')} caption={t('applyCaption')} title={t('applyTitle')} /><div><Copy text={t('applyBody')} /><p className="note">{t('applyNote')}</p></div></div>
      <div className="participation-paths"><article><svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m5 24 13-13m-7-3 5-5 13 13-5 5ZM3 26l3 3 6-6-3-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg><h3>{t('applicantEntry')}</h3><Copy text={t('applicantSummary')} /></article><article><svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" /><path d="m20 12-2 6-6 2 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg><h3>{t('visitorEntry')}</h3><Copy text={t('visitorSummary')} /></article></div>
      <div className="participation-actions"><Link href={passportUrl}>{t('passportLink')}</Link><FollowUpdates lang={lang} label={t('follow')} /></div>
    </div></section>
    <section id="polaris-faq" className="chapter faq-chapter"><div className="wrap faq-layout"><Heading label="FAQ" title={t('faqTitle')} /><div className="faq-list">{faqs[lang].map(item => <details key={item.q}><summary>{item.q}</summary><Copy text={item.a} /></details>)}</div></div></section>
    <section id="polaris-partners" className="chapter partners-chapter"><div className="wrap"><div className="partners-layout"><Heading label={t('partnersLabel')} title={t('partnersTitle')} /><Copy text={t('partnersBody')} /></div><PartnershipInquiry lang={lang} /><Sponsors lang={lang} /></div></section>
    <section className="origin"><div className="wrap"><h2>{t('by')}</h2><div className="actions"><Link secondary href="/about">{t('meet')}</Link><Link secondary href="mailto:hr@entropy.asia">{t('joinLink')}</Link></div></div></section>
    </div>
  </>
}

export function Polaris() {
  return <Page page="polaris">{(t, lang) => <PolarisContent t={t} lang={lang} />}</Page>
}
