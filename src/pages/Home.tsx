import { Page } from '../components/Editorial'
import { PolarisFeature } from '../components/home/PolarisFeature'
import { PassportBook } from '../components/home/PassportBook'
import { homeCopy } from '../i18n/home'
import { passportUrl } from '../lib/site'
import type { Lang } from '../hooks/useI18n'
import type { Translator } from '../components/Editorial'

const arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
const external = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

function HomeContent({ t, lang }: { t: Translator; lang: Lang }) {
  const c = homeCopy[lang]
  return (
    <>
      <PolarisFeature t={t} status={c.featureStatus} note={c.featureNote} />
      <div className="wrap hx-below">
        <div className="hx-grid">
          <section className="hx-passport" aria-labelledby="hx-passport-title">
            <div className="hx-passport-copy">
              <p className="hx-product">_entropy Passport</p>
              <h2 id="hx-passport-title">{c.passportTitle.split('\n').map(line => <span key={line}>{line}</span>)}</h2>
              <p className="hx-passport-body">{c.passportBody}</p>
              <a className="hx-button hx-button-paper" href="/passport.html"><span>{c.passportCta}</span>{arrow}</a>
              <a className="hx-passport-direct" href={passportUrl}><span>{c.passportDirect}</span>{external}</a>
            </div>
            <PassportBook holder={c.bookHolder} holderValue={c.bookHolderValue} issued={c.bookIssued} next={c.bookNext} label={c.bookAria} />
          </section>

          <div className="hx-side">
            <section className="hx-side-item" aria-labelledby="hx-partner-title">
              <h2 id="hx-partner-title">{c.partnerTitle}</h2>
              <p>{c.partnerBody}</p>
              <a className="hx-text-link" href="/polaris.html#polaris-partners"><span>{c.partnerCta}</span>{arrow}</a>
            </section>
            <section className="hx-side-item" aria-labelledby="hx-join-title">
              <h2 id="hx-join-title">{c.joinTitle}</h2>
              <p>{c.joinBody}</p>
              <a className="hx-text-link" href="mailto:hr@entropy.asia"><span>{c.joinCta}</span>{external}</a>
            </section>
          </div>
        </div>

        <p className="hx-whisper">{c.whisper}</p>
      </div>
    </>
  )
}

export function Home() {
  return <Page page="home">{(t, lang) => <HomeContent t={t} lang={lang} />}</Page>
}
