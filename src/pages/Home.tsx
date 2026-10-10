import { Copy, Heading, Hero, Link, Page } from '../components/Editorial'
import { OrganiseScene } from '../components/ExperienceIllustrations'
import { useChapterMotion } from '../hooks/useChapterMotion'
import type { Lang } from '../hooks/useI18n'
import type { Translator } from '../components/Editorial'

function HomeContent({ t, lang }: { t: Translator; lang: Lang }) {
  const motion = useChapterMotion(lang)
  return <>
    <Hero t={t} home />
    <div className="home-story" ref={motion}>
    <section className="chapter home-introduction"><div className="wrap"><div data-motion="title"><Heading label={t('orgLabel')} title={t('orgTitle')} /></div><div className="home-intro-body"><Copy text={t('orgBody')} /><Link secondary href="/about">{t('about')}</Link></div></div></section>
    <section className="home-project"><div className="wrap"><div className="organise-art" data-motion="graphic"><OrganiseScene lang={lang} /></div><div className="project-copy"><div data-motion="title"><Heading label={t('projectLabel')} title={t('projectTitle')} /></div><div><Copy text={t('projectBody')} /><Link href="/polaris.html">{t('projectLink')}</Link></div></div></div></section>
    <section className="chapter join-chapter"><div className="wrap join-layout"><Heading label={t('joinLabel')} title={t('joinTitle')} /><div><Copy text={t('joinBody')} /><Link href="mailto:hr@entropy.asia">{t('joinLink')}</Link></div></div></section>
    </div>
  </>
}

export function Home() {
  return <Page page="home">{(t, lang) => <HomeContent t={t} lang={lang} />}</Page>
}
