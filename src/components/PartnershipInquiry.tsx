import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Dialog } from 'radix-ui'
import type { Lang } from '../hooks/useI18n'
import { experienceCopy } from '../i18n/experience'
import { inquiryInterests, type InquiryConfig, type InquiryInput, type InquiryInterest } from '../../shared/inquiry'
import { CopyEmail } from './Editorial'
import { getLenis } from '../lib/scroll'

interface TurnstileApi {
  render(element: HTMLElement, options: Record<string, unknown>): string
  remove(id: string): void
  reset(id: string): void
}

declare global {
  interface Window { turnstile?: TurnstileApi }
}

let turnstileLoading: Promise<void> | undefined
const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve()
  if (turnstileLoading) return turnstileLoading
  turnstileLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    const timeout = window.setTimeout(() => { script.remove(); turnstileLoading = undefined; reject(new Error('VERIFICATION_UNAVAILABLE')) }, 15000)
    script.onload = () => {
      window.clearTimeout(timeout)
      if (window.turnstile) resolve()
      else { script.remove(); turnstileLoading = undefined; reject(new Error('VERIFICATION_UNAVAILABLE')) }
    }
    script.onerror = () => { window.clearTimeout(timeout); script.remove(); turnstileLoading = undefined; reject(new Error('VERIFICATION_UNAVAILABLE')) }
    document.head.append(script)
  })
  return turnstileLoading
}

const interestKey = { challenge: 'partnerChallenge', programme: 'partnerProgramme', exhibit: 'partnerExhibit', support: 'partnerSupport' } as const

function Verification({ siteKey, lang, onToken, resetCount }: { siteKey: string; lang: Lang; onToken: (token: string) => void; resetCount: number }) {
  const container = useRef<HTMLDivElement>(null)
  const tokenCallback = useRef(onToken)
  tokenCallback.current = onToken
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  const copy = experienceCopy[lang]
  useEffect(() => {
    let cancelled = false
    let widget: string | undefined
    setFailed(false)
    tokenCallback.current('')
    loadTurnstile().then(() => {
      if (cancelled || !container.current || !window.turnstile) return
      widget = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action: 'partnership',
        size: 'flexible',
        theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
        language: lang === 'zh' ? 'zh-cn' : lang === 'zh-Hant' ? 'zh-tw' : 'en',
        callback: (token: string) => tokenCallback.current(token),
        'expired-callback': () => tokenCallback.current(''),
        'error-callback': () => { tokenCallback.current(''); setFailed(true) },
      })
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true; if (widget) window.turnstile?.remove(widget) }
  }, [siteKey, lang, retry, resetCount])
  return <div className="inquiry-verification"><div ref={container} />{failed && <p role="alert">{copy.verificationUnavailable} <button type="button" onClick={() => setRetry(value => value + 1)}>{copy.retry}</button></p>}</div>
}

export function PartnershipInquiry({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<InquiryConfig | null>(null)
  const [interests, setInterests] = useState<InquiryInterest[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const [token, setToken] = useState('')
  const [resetCount, setResetCount] = useState(0)
  const [draft, setDraft] = useState({ name: '', organisation: '', email: '', message: '', website: '' })
  const opener = useRef<HTMLButtonElement | null>(null)
  const copy = experienceCopy[lang]
  useEffect(() => {
    if (!open) return
    getLenis()?.stop()
    const controller = new AbortController()
    const timeout = window.setTimeout(() => { controller.abort(); setConfig({ enabled: false }) }, 10000)
    fetch('/api/partnership/config', { signal: controller.signal, headers: { Accept: 'application/json' } }).then(async response => {
      if (!response.ok) throw new Error('CONFIG_UNAVAILABLE')
      const data: InquiryConfig = await response.json()
      setConfig(data.enabled === true && typeof data.siteKey === 'string' ? data : { enabled: false })
    }).catch(() => { if (!controller.signal.aborted) setConfig({ enabled: false }) }).finally(() => window.clearTimeout(timeout))
    return () => { window.clearTimeout(timeout); controller.abort(); getLenis()?.start() }
  }, [open])
  const start = (button: HTMLButtonElement, interest?: InquiryInterest) => {
    opener.current = button
    if (interest) setInterests(previous => previous.includes(interest) ? previous : [...previous, interest])
    setError('')
    setReference('')
    setConfig(null)
    setOpen(true)
  }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    if (!token) { setError(copy.verify); return }
    if (!config?.enabled) { setError(copy.notAvailable); return }
    setSending(true)
    setError('')
    try {
      const payload: InquiryInput = { ...draft, interests, lang, token }
      const response = await fetch('/api/partnership', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(25000) })
      const data: { reference?: string; code?: string } = await response.json()
      if (!response.ok || !data.reference) {
        const messages: Record<string, string> = { VERIFICATION_FAILED: copy.verifyFailed, RATE_LIMITED: copy.rateLimited, INVALID_INPUT: copy.invalid, UNAVAILABLE: copy.notAvailable }
        throw new Error(messages[data.code || ''] || copy.failed)
      }
      setReference(data.reference)
      setDraft({ name: '', organisation: '', email: '', message: '', website: '' })
    } catch (failure) { setError(failure instanceof Error && Object.values(copy).includes(failure.message) ? failure.message : copy.failed) }
    finally { setSending(false); setToken(''); setResetCount(value => value + 1) }
  }
  return <Dialog.Root open={open} onOpenChange={value => { if (!sending) setOpen(value) }}>
    <div className="partner-directions">{inquiryInterests.map((interest, index) => <article key={interest}><p className="partner-index">0{index + 1}</p><h3>{copy[interestKey[interest]]}</h3><p>{copy[(interestKey[interest] + 'Body') as 'partnerChallengeBody' | 'partnerProgrammeBody' | 'partnerExhibitBody' | 'partnerSupportBody']}</p><button type="button" onClick={event => start(event.currentTarget, interest)}>{copy.propose}<span aria-hidden="true">↗</span></button></article>)}</div>
    <div className="partner-contact"><button type="button" className="action" onClick={event => start(event.currentTarget)}>{copy.inquiryTitle}<span aria-hidden="true">→</span></button><CopyEmail email="support@entropy.asia" lang={lang} /></div>
    <Dialog.Portal><Dialog.Overlay className="inquiry-overlay" /><Dialog.Content className="inquiry-dialog" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus() }} onEscapeKeyDown={event => { if (sending) event.preventDefault() }} onPointerDownOutside={event => { if (sending) event.preventDefault() }}>
      <Dialog.Close className="inquiry-close" aria-label={copy.close} disabled={sending}>×</Dialog.Close>
      <Dialog.Title>{reference ? copy.sent : copy.inquiryTitle}</Dialog.Title><Dialog.Description>{reference ? copy.sentBody : copy.inquiryLead}</Dialog.Description>
      {reference ? <div className="inquiry-success"><p>{copy.reference}</p><strong>{reference}</strong><Dialog.Close className="action">{copy.close}</Dialog.Close></div> : <form onSubmit={submit}>
        <fieldset className="inquiry-interests"><legend>{copy.interest}</legend>{inquiryInterests.map(interest => <label key={interest}><input type="checkbox" checked={interests.includes(interest)} disabled={sending} onChange={() => setInterests(previous => previous.includes(interest) ? previous.filter(item => item !== interest) : [...previous, interest])} /><span>{copy[interestKey[interest]]}</span></label>)}</fieldset>
        <div className="inquiry-fields"><label>{copy.name}<input name="name" autoComplete="name" required maxLength={120} value={draft.name} disabled={sending} onChange={event => setDraft(previous => ({ ...previous, name: event.target.value }))} /></label><label>{copy.organisation}<input name="organisation" autoComplete="organization" maxLength={160} value={draft.organisation} disabled={sending} onChange={event => setDraft(previous => ({ ...previous, organisation: event.target.value }))} /></label></div>
        <label>{copy.email}<input name="email" type="email" autoComplete="email" required maxLength={254} value={draft.email} disabled={sending} onChange={event => setDraft(previous => ({ ...previous, email: event.target.value }))} /></label>
        <label>{copy.message}<textarea name="message" required maxLength={3000} rows={4} placeholder={copy.messageHint} value={draft.message} disabled={sending} onChange={event => setDraft(previous => ({ ...previous, message: event.target.value }))} /></label>
        <div className="inquiry-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={draft.website} onChange={event => setDraft(previous => ({ ...previous, website: event.target.value }))} /></label></div>
        <p className="inquiry-notice">{copy.inquiryNotice}</p>
        {config?.enabled && config.siteKey && <Verification siteKey={config.siteKey} lang={lang} onToken={setToken} resetCount={resetCount} />}
        {config?.preview && <p className="inquiry-notice">{copy.previewNotice}</p>}
        {config && !config.enabled && <p className="inquiry-notice">{copy.notAvailable}</p>}
        {error && <p className="inquiry-error" role="alert">{error}</p>}
        <div className="inquiry-submit"><button className="action" type="submit" disabled={sending || !config?.enabled}>{sending ? copy.sending : copy.send}</button><CopyEmail email="support@entropy.asia" lang={lang} /></div>
      </form>}
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
