# Polaris opening chapters: editorial sample

2026-10-11. Local visual review only; this sample has not been committed, pushed or deployed. The prior reviewed version remains at team branch commit `c50ad7be872f176a187f616af58abac731407024`.

## Scope

`FestivalStory.tsx` replaces the rendered five-day, themes and challenges sections. `festival.css` is loaded only by the Polaris entry and is scoped to those sections. Both approved heroes, Home, About, people data, later event sections and the partnership endpoint are unchanged. The previous components and original illustrations remain available in source.

- The schedule stays visible while one original abstract illustration progresses from separated parts to an assembled form. It represents the making process, not a real project or confirmed venue. Stage controls change the figure and its caption.
- CSS sticky positioning is limited to sufficiently large windows. Mobile, short windows and reduced motion use ordinary document flow. No text is hidden by animation, and there is no pinned horizontal scroll or added scroll distance.
- Themes and challenges share a continuous composition. Themes form the context around one project; the challenge annotation identifies concrete problems. The caption explicitly allows multiple themes and challenges. There are no fabricated briefs or selectable placeholder challenges.
- Sailboat and Cruise have equal widths and typography below the main challenge introduction. Their existing participation explanations remain visible, with only supplementary guidance folded.
- No substantive public copy, eligibility, dates, fees or event rules were added. Existing translations were reused. Decorative chapter identifiers and arrows are not application controls.

## Verification

- Frontend and Worker type checks and production build passed.
- Browser layout inspection covered 320, 390, 820 and 1198px widths, simplified Chinese, Hong Kong traditional Chinese and English, in both themes. All 24 combinations had no page overflow or clipped sample text/buttons.
- Desktop and mobile stage buttons, keyboard activation, scroll resumption, chapter navigation, language/theme changes, and challenge guidance expansion/collapse were exercised. Both challenge formats use equal 32px names and equal desktop column widths.
- The 1198×600 short-window fallback uses normal flow with all three schedule entries visible. Reduced-motion rules were checked in source; this browser exposes no OS preference emulation. Physical-device touch testing has not been performed.
- No browser console errors were reported. No backend changes or live form submissions were made in this pass.

Local screenshots and the layout matrix are in ignored `review/website-sixth-pass/`. A small source backup and the baseline commit are in its `before/` directory. Technical verification is separate from visual approval.
