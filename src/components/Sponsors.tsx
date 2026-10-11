import { useEffect, useState } from 'react'
import { localized, type LocalizedText } from '../lib/locale'
import type { Lang } from '../hooks/useI18n'

interface SponsorCategory {
  category: LocalizedText
  sponsors: { name: string; url?: string; logo: { dark: string; light: string }; edition?: string; confirmedForEdition?: boolean }[]
}

export function Sponsors({ lang }: { lang: Lang }) {
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
