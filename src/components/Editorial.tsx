import { useEffect, type ReactNode } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { CookieConsent } from './CookieConsent'
import { ScrollTop } from './ScrollTop'
import { useI18n } from '../hooks/useI18n'
import { useTheme } from '../hooks/useTheme'
import { useLenis } from '../hooks/useLenis'
import { useScrollState } from '../hooks/useScrollState'
import { editorial, type CopyKey } from '../i18n/editorial'
import { themeLabel, uiI18n } from '../i18n/ui'
import { useToast } from './Toast'
import { experienceCopy } from '../i18n/experience'
import { getLenis } from '../lib/scroll'

export const useCopy = () => useI18n(editorial)
export type Translator = (key: CopyKey) => string

export function Page({ page, children }: { page: 'home' | 'about' | 'polaris' | 'passport'; children: (t: Translator, lang: ReturnType<typeof useCopy>['lang']) => ReactNode }) {
  const { t, lang, setLang } = useCopy()
  const { isLight, toggleTheme } = useTheme()
  const { scrolled, showScrollTop } = useScrollState(false)
  useLenis()
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    let frame = 0
    let interrupted = false
    const interrupt = () => { interrupted = true }
    const align = () => {
      if (interrupted || window.location.hash !== hash) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (interrupted) return
        const target = document.getElementById(hash.slice(1))
        if (!target) return
        const lenis = getLenis()
        if (lenis) {
          lenis.resize()
          lenis.scrollTo(target, { immediate: true, force: true })
        } else target.scrollIntoView({ behavior: 'instant', block: 'start' })
      })
    }
    align()
    void document.fonts.ready.then(align)
    const events = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const
    events.forEach(event => window.addEventListener(event, interrupt, { once: true, passive: true }))
    return () => {
      interrupted = true
      cancelAnimationFrame(frame)
      events.forEach(event => window.removeEventListener(event, interrupt))
    }
  }, [page])
  useEffect(() => {
    document.title = t(`${page}Meta`)
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"], meta[itemprop="description"]').forEach(meta => meta.setAttribute('content', t(`${page}Description`)))
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"], meta[itemprop="name"]').forEach(meta => meta.setAttribute('content', t(`${page}Meta`)))
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'en' ? 'en_GB' : lang === 'zh-Hant' ? 'zh_HK' : 'zh_CN')
  }, [page, t, lang])
  return <>
    <Nav logoHref="/" scrolled={scrolled} activeSection={page} links={[
      { href: '/', label: uiI18n[lang].home, sectionId: 'home' },
      { href: '/polaris.html', label: uiI18n[lang].polaris, sectionId: 'polaris' },
      { href: '/passport.html', label: '_entropy Passport', sectionId: 'passport' },
    ]} lang={lang} onSelectLang={setLang} themePressed={isLight} themeLabel={themeLabel(lang, isLight)} onToggleTheme={toggleTheme} />
    <main className={`editorial ${page}-edition`} id="home">{children(t, lang)}</main>
    <Footer cookieSettingsLabel={t('cookies')} aboutLabel={uiI18n[lang].about} />
    <ScrollTop visible={showScrollTop} label={uiI18n[lang].scrollTop} />
    <CookieConsent lang={lang} />
  </>
}

export function Copy({ text, className = '' }: { text: string; className?: string }) {
  return <div className={`prose ${className}`}>{text.split('\n\n').map(p => <p key={p}>{p}</p>)}</div>
}

export function Link({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  const external = href.startsWith('https:') || href.startsWith('mailto:')
  return <a className={`action${secondary ? ' secondary' : ''}`} href={href}>{children}<svg className="action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={external ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15M13 6l6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
}

export function Heading({ n, label, title }: { n?: string; label: string; title: string }) {
  return <header className="chapter-heading"><p className="chapter-label">{n && <span>{n}</span>}{label}</p><h2>{title}</h2></header>
}

export function Hero({ t, home = false }: { t: Translator; home?: boolean }) {
  const slogan = t('slogan').split('\n')
  return <section className={home ? 'home-hero' : 'event-hero'}><div className={home ? 'wrap hero-panel' : 'hero-panel'}>
    <picture className="hero-light" aria-hidden="true"><source srcSet="/assets/polaris-light-900.webp 900w, /assets/polaris-light-1800.webp 1800w" type="image/webp" /><img src="/assets/polaris.png" alt="" width="1800" height="600" /></picture>
    <div className="hero-copy">
    <div className="event-name"><img src="/assets/polaris27.svg" alt="" /><div><p>Hackathon polaris 2027</p><p>{t('event')}</p></div></div>
    <h1><span className="hero-line hero-line-0">{slogan[0]}</span>{/^[A-Za-z]/.test(slogan[0]) && ' '}<span className="hero-line hero-line-main">{slogan.slice(1).join(/^[A-Za-z]/.test(slogan[0]) ? ' ' : '')}</span></h1>
    <p className="hero-facts">{t('facts')}</p>
    <Copy text={t(home ? 'homeIntro' : 'heroLead')} />
    {!home && <Copy text={t('heroBody')} className="hero-description" />}
    <div className="actions"><Link href={home ? '/polaris.html' : '#polaris-days'}>{t(home ? 'explore' : 'experienceLink')}</Link>{!home && <Link secondary href="#polaris-partners">{t('partnerLink')}</Link>}</div>
    <p className="note">{t(home ? 'homeNote' : 'heroNote')}</p>
  </div><p className="hero-coordinate" aria-hidden="true">HONG KONG <span>2027</span></p></div></section>
}

export function SectionTitle({ number, title, caption, lead }: { number: string; title: string; caption: string; lead: string }) {
  return <header className="section-title-group"><p className="section-index">{number} <span>{caption}</span></p><h2>{title}</h2><p className="section-lead">{lead}</p></header>
}

export function CopyEmail({ email, lang }: { email: string; lang: ReturnType<typeof useCopy>['lang'] }) {
  const { showToast } = useToast()
  const copy = experienceCopy[lang]
  return <button className="copy-email" type="button" onClick={async () => {
    try { await navigator.clipboard.writeText(email); showToast(copy.emailCopied) }
    catch { showToast(copy.copyFailed) }
  }}><span>{email}</span><span>{copy.copyEmail}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M15 4H6a2 2 0 0 0-2 2v9" stroke="currentColor" strokeWidth="1.5" /></svg></button>
}
