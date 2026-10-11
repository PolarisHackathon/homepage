import { Page } from '../components/Editorial'
import { PassportBook } from '../components/home/PassportBook'
import { passportCopy } from '../i18n/passport'
import { passportUrl } from '../lib/site'
import type { Lang } from '../hooks/useI18n'

const external = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

function PassportContent({ lang }: { lang: Lang }) {
  const c = passportCopy[lang]
  const lines = (text: string) => text.split('\n').map(line => <span key={line}>{line}</span>)
  return (
    <div className="px">
      <div className="wrap">
        <section className="px-hero" aria-labelledby="px-title">
          <div className="px-hero-copy">
            <p className="hx-product">_entropy Passport</p>
            <h1 id="px-title">{lines(c.title)}</h1>
            <p className="px-lead">{c.body}</p>
            <a className="hx-button hx-button-paper" href={passportUrl}><span>{c.go}</span>{external}</a>
            <p className="px-note">{c.note}</p>
          </div>
          <PassportBook autoOpen holder={c.bookHolder} holderValue={c.bookHolderValue} issued={c.bookIssued} next={c.bookNext} label={c.bookAria} />
        </section>

        <section className="px-features" aria-labelledby="px-features-title">
          <h2 id="px-features-title">{c.featuresTitle}</h2>
          <ul>
            {c.features.map(f => (
              <li key={f.title}><h3>{f.title}</h3><p>{f.body}</p></li>
            ))}
          </ul>
        </section>

        <section className="px-closing" aria-labelledby="px-closing-title">
          <h2 id="px-closing-title">{lines(c.closingTitle)}</h2>
          <div>
            <p>{c.closingBody}</p>
            <a className="hx-button" href={passportUrl}><span>{c.go}</span>{external}</a>
          </div>
        </section>
      </div>
    </div>
  )
}

export function PassportIntro() {
  return <Page page="passport">{(_t, lang) => <PassportContent lang={lang} />}</Page>
}
