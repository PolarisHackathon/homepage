import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Lang } from '../hooks/useI18n'
import { experienceCopy } from '../i18n/experience'
import { layoutCopy } from '../i18n/layout'
import { Copy, type Translator } from './Editorial'
import { MealScene } from './ExperienceIllustrations'

const supportKeys = ['sleep', 'food', 'travel'] as const

export function ParticipationAreas({ lang }: { lang: Lang }) {
  const copy = experienceCopy[lang]
  const layout = layoutCopy[lang]
  return <div className="participation-areas"><div className="access-heading"><p className="chapter-label">{copy.accessVisual}</p></div>
    <div className="access-plan"><div className="access-zone access-public"><div className="public-model" aria-hidden="true"><i /><span /><span /><span /></div><h4>{copy.publicArea}</h4><p>{layout.publicRule}</p></div><div className="access-zone access-build"><div className="build-model" aria-hidden="true">{[0, 1, 2].map(index => <span key={index}><i /><i /></span>)}</div><h4>{copy.buildArea}</h4><p>{layout.buildRule}</p></div><div className="access-zone access-rest"><div className="rest-model" aria-hidden="true"><i /><i /></div><h4>{copy.restArea}</h4><p>{layout.restRule}</p></div></div>
  </div>
}

export function LifeSupport({ t, lang }: { t: Translator; lang: Lang }) {
  const [selected, setSelected] = useState<typeof supportKeys[number]>('sleep')
  const id = useId()
  const copy = experienceCopy[lang]
  const changeWithKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3
    setSelected(supportKeys[next])
    document.getElementById(`${id}-${supportKeys[next]}-tab`)?.focus()
  }
  return <div className="life-support">
    <div className="support-tablist" role="tablist" aria-label={copy.supportTabs}>{supportKeys.map((key, index) => <button type="button" role="tab" key={key} id={`${id}-${key}-tab`} aria-controls={`${id}-${key}-panel`} aria-selected={selected === key} tabIndex={selected === key ? 0 : -1} onKeyDown={event => changeWithKey(event, index)} onClick={() => setSelected(key)}><span>0{index + 1}</span>{t(key)}</button>)}</div>
    {supportKeys.map(key => <div key={key} className={`support-panel support-panel-${key}`} role="tabpanel" id={`${id}-${key}-panel`} aria-labelledby={`${id}-${key}-tab`} hidden={selected !== key} tabIndex={0}>
      <div className="support-detail"><p className="chapter-label">{t(key)}</p><h3>{t(key + 'Title' as 'sleepTitle' | 'foodTitle' | 'travelTitle')}</h3><Copy text={t(key + 'Body' as 'sleepBody' | 'foodBody' | 'travelBody')} /></div>
      <div className={`support-stage support-stage-${key}`}>
        {key === 'sleep' ? <><p className="stage-kicker">{copy.rotateCaption}</p><h4>{copy.twoPeople}</h4><p className="rest-rule">{copy.restRule}</p><div className="room-model" aria-hidden="true"><div className="bed"><span /></div><div className="bed"><span /></div><div className="room-door" /></div><div className="room-slot"><span>{copy.locked}<small>+ 0h</small></span><span className="slot-duration">12h</span><span>{copy.slotEnds}<small>+ 12h</small></span></div><p className="stage-note">{t('roomClock')}</p></> : key === 'food' ? <><p className="stage-kicker">{copy.mealIncluded}</p><h4>{t('mealGraphic')}</h4><MealScene lang={lang} /></> : <><p className="stage-kicker">{copy.returnTrip}</p><h4>{copy.travelTitle}</h4><div className="return-route"><span>{t('usualResidence')}</span><svg viewBox="0 0 160 38" fill="none" aria-hidden="true"><path d="M2 11h152m-9-7 10 7-10 7M158 28H6m9-7L5 28l10 7" stroke="currentColor" strokeWidth="1.5" /></svg><strong>{copy.venue}</strong></div><ol className="travel-stages">{copy.travelSteps.split('|').map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol><p className="stage-note">{t('routeApproval')}</p></>}
      </div>
    </div>)}
    <p className="support-essential">{copy.restRule}<span>·</span>{copy.mealIncluded}<span>·</span>{t('routeApproval')}</p>
  </div>
}
