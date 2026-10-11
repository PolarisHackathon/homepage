import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function applyReducedMotion() {
  gsap.globalTimeline.timeScale(0);
  gsap.set('.reveal', { opacity: 1, y: 0 });
}

export function useHomeAnimations() {
  useEffect(() => {
    if (prefersReducedMotion) {
      applyReducedMotion();
      return;
    }

    const ctx = gsap.context(() => {
      const heroEls = document.querySelectorAll('.hero .reveal');
      gsap
        .timeline({ delay: 0.2 })
        .fromTo(
          heroEls,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }
        );

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        if (el.closest('.hero')) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.origin-content').forEach((wrap) => {
        gsap.fromTo(
          wrap.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
            scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
}

export function usePolarisAnimations() {
  useEffect(() => {
    if (prefersReducedMotion) {
      applyReducedMotion();
      return;
    }

    const ctx = gsap.context(() => {
      const heroEls = document.querySelectorAll('.polaris-hero .reveal');
      gsap
        .timeline({ delay: 0.2 })
        .fromTo(
          heroEls,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }
        );

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        if (el.closest('.polaris-hero')) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.polaris-stagger').forEach((wrap) => {
        gsap.fromTo(
          wrap.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
            scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
}

export function useSponsorGridReveal(ready: boolean) {
  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.polaris-sponsors').forEach((wrap) => {
        const items = wrap.querySelectorAll('.polaris-sponsor-group-title, .polaris-sponsor-card');
        gsap.fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.055,
            scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
          }
        );
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [ready]);
}

export function useTeamAnimations(memberCount = 0) {
  useEffect(() => {
    if (prefersReducedMotion) {
      applyReducedMotion();
      return;
    }

    const ctx = gsap.context(() => {
      const heroEls = document.querySelectorAll('.team-hero .reveal');
      gsap
        .timeline({ delay: 0.2 })
        .fromTo(
          heroEls,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }
        );

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        if (el.closest('.team-hero') || el.classList.contains('team-card')) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.team-grid').forEach((grid) => {
        gsap.fromTo(
          grid.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.055,
            scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
          }
        );
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [memberCount]);
}
