import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from './useI18n'

gsap.registerPlugin(ScrollTrigger)

export function useChapterMotion(lang: Lang) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const element = root.current
      if (!element) return
      element.querySelectorAll<HTMLElement>('[data-motion="title"]').forEach(title => {
        gsap.fromTo(title, { y: 24 }, { y: 0, ease: 'none', scrollTrigger: { trigger: title, start: 'top 95%', end: 'top 45%', scrub: .8 } })
      })
      element.querySelectorAll<HTMLElement>('[data-motion="graphic"]').forEach(graphic => {
        gsap.fromTo(graphic, { y: 30, rotate: -2 }, { y: -12, rotate: 0, ease: 'none', scrollTrigger: { trigger: graphic, start: 'top 90%', end: 'bottom 25%', scrub: .8 } })
      })
    }, root)
    return () => media.revert()
  }, [lang])
  return root
}
