import { useRef, useState } from 'react'
import { Popover } from 'radix-ui'
import type { Lang } from '../hooks/useI18n'
import { layoutCopy } from '../i18n/layout'

const channels = ['instagram', 'x', 'wechat', 'newsletter'] as const
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL as string | undefined
const newsletterUrl = import.meta.env.VITE_NEWSLETTER_URL as string | undefined
const validLink = (value?: string) => value && /^https:\/\//.test(value) ? value : undefined

export function FollowUpdates({ lang, label }: { lang: Lang; label: string }) {
  const [channel, setChannel] = useState<typeof channels[number]>('x')
  const opener = useRef<HTMLButtonElement>(null)
  const copy = layoutCopy[lang]
  const names = ['Instagram', 'X', copy.wechat, 'Newsletter']
  return <Popover.Root><Popover.Trigger asChild><button ref={opener} type="button" className="action secondary follow-trigger">{label}<span aria-hidden="true">+</span></button></Popover.Trigger>
    <Popover.Portal><Popover.Content className="follow-menu" data-lenis-prevent side="top" align="start" sideOffset={16} collisionPadding={20} onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus() }}>
      <div className="follow-heading"><h3>{copy.followTitle}</h3><Popover.Close className="follow-close" aria-label={copy.followClose}>×</Popover.Close></div>
      <div className="follow-channels" role="group" aria-label={copy.followChannels}>{channels.map((value, index) => <button key={value} type="button" aria-pressed={channel === value} onClick={() => setChannel(value)}>{names[index]}</button>)}</div>
      <div className="follow-content" aria-live="polite">{channel === 'x' ? <a href="https://x.com/_entropyhq" target="_blank" rel="noopener noreferrer">{copy.visitX}<span aria-hidden="true">↗</span></a> : channel === 'instagram' ? validLink(instagramUrl) ? <a href={instagramUrl} target="_blank" rel="noopener noreferrer">{copy.visitInstagram}<span aria-hidden="true">↗</span></a> : <p>{copy.channelSoon}</p> : channel === 'newsletter' ? validLink(newsletterUrl) ? <a href={newsletterUrl} target="_blank" rel="noopener noreferrer">{copy.newsletterLink}<span aria-hidden="true">↗</span></a> : <p>{copy.newsletterSoon}</p> : <div className="follow-wechat"><img src="/assets/wechat-qrcode.png" width="156" height="156" alt={copy.wechatHint} /><div><p>{copy.wechatHint}</p><a href="https://weixin.qq.com/r/mp/4CACGj7EeWMGrXp593Xy" target="_blank" rel="noopener noreferrer">{copy.wechatLink}<span aria-hidden="true">↗</span></a></div></div>}</div>
    </Popover.Content></Popover.Portal>
  </Popover.Root>
}
