import { Copy, Heading, Link, Page } from '../components/Editorial'
import { localized, type LocalizedText } from '../lib/locale'
import peopleJson from '../../public/people.json'

interface Person {
  id: string
  name: LocalizedText
  role: LocalizedText
  url?: string
  statement?: LocalizedText
  statementConfirmed?: boolean
  featured?: boolean
  order: number
  public?: boolean
  avatar?: string
  avatarConfirmed?: boolean
}
const people = (peopleJson as Person[]).filter(person => person.public !== false).sort((a, b) => a.order - b.order)

export function About() {
  return <Page page="about">{(t, lang) => <>
    <section className="about-opening chapter"><div className="wrap"><p className="chapter-label">{t('about')}</p><h1>{t('aboutTitle')}</h1><Copy text={t('aboutIntro')} /><div className="about-interests">{(['technology', 'design', 'art'] as const).map(key => <span key={key}>{t(key)}</span>)}</div></div></section>
    <section className="chapter about-project"><div className="wrap project-copy"><Heading label={t('doingLabel')} title={t('doingTitle')} /><div><Copy text={t('doingBody')} /><Link href="/polaris.html">{t('doingLink')}</Link></div></div></section>
    <section className="chapter"><div className="wrap about-work"><div><Heading label={t('whyLabel')} title={t('whyTitle')} /><Copy text={t('whyBody')} /></div><div><Heading label={t('workLabel')} title={t('workTitle')} /><Copy text={t('workBody')} /></div></div></section>
    <section className="chapter people-chapter"><div className="wrap"><Heading label="People" title={t('peopleTitle')} />
      <ul className="people-list">{people.map(person => <li key={person.id} className={person.featured ? 'person featured-person' : 'person'}>
        {person.avatarConfirmed && person.avatar && <img className="person-avatar" src={person.avatar} alt="" width="48" height="48" loading="lazy" />}
        <div><h3>{localized(person.name, lang)}</h3><p className="person-role">{localized(person.role, lang)}</p></div>
        {person.statementConfirmed && person.statement && <p className="person-statement">{localized(person.statement, lang)}</p>}
        {person.url && <a className="person-link" href={person.url} target="_blank" rel="noopener noreferrer" aria-label={`${localized(person.name, lang)} · ${t('profile')}`}>{t('profile')} ↗</a>}
      </li>)}</ul>
    </div></section>
    <section id="become-dreamer" className="chapter join-chapter"><div className="wrap join-layout"><Heading label={t('joinLabel')} title={t('aboutJoinTitle')} /><div><Copy text={t('aboutJoinBody')} /><p className="mail">hr@entropy.asia</p><Link href="mailto:hr@entropy.asia">{t('write')}</Link></div></div></section>
  </>}</Page>
}
