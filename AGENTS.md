# AGENTS.md

> Guidance for AI coding agents working in this repository.

---

## Project Overview

**entropy-homepage** is the official website for **Entropy (熵序)**, a team of young creators working across technology and art. It is a multi-page Vite + React + TypeScript site with dark/light themes and three languages. A small Cloudflare Worker serves the partnership enquiry endpoint alongside static assets.

The site currently has three pages:
- **Home** (`/`) — Event hero, organisation introduction, current project and join sections (no people or sponsor list)
- **About** (`/about`, built from `about.html`) — Organization introduction and the public list of twelve people. `/team`, `/team/`, and `/team.html` redirect here with HTTP 301.
- **Polaris** (`/polaris.html`, also `/polaris` and `/polaris/`) — Hackathon polaris 2027, a five-day Hong Kong event page in preparation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5.6 |
| Build Tool | Vite 6 |
| UI Primitives | Radix UI (`radix-ui` unified package, namespace imports like `Toggle.Root`) |
| Animations | GSAP 3 (ScrollTrigger, ScrollToPlugin) + Lenis (smooth scroll) |
| Styles | Pure CSS (no Tailwind, no CSS-in-JS). CSS files are ported from the original static site. |
| Icons | Inline SVG via `src/components/icons.tsx` |
| Linting | `npm run lint` checks the frontend and Worker TypeScript projects. There is no ESLint script or config in this repo. |
| Type Checking | TypeScript (`tsc --noEmit`; `npm run build` also runs `tsc -b`) |
| Package Manager | npm |

---

## Project Structure

```
entropy-homepage/
├── public/                 # Static assets (not processed by Vite)
│   ├── assets/
│   │   ├── sponsors/       # Sponsor logos organized by category (cloud/community/web3)
│   │   │   ├── cloud/      # Each sponsor has dark + light SVG variants
│   │   │   ├── community/
│   │   │   └── web3/
│   │   └── team/           # Team member avatar photos
│   ├── sponsor.json        # Sponsor data (name, url, dark/light logo paths)
│   ├── people.json         # Public people list (order, role, optional statement)
│   └── team.json           # Previous member file; not loaded by the public About page
├── src/
│   ├── components/         # Shared UI components
│   │   ├── Button.tsx      # Reusable button (as <a> or <button>)
│   │   ├── CookieConsent.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorPage.tsx
│   │   ├── Footer.tsx      # Site footer with language switcher
│   │   ├── Nav.tsx         # Navigation bar with mobile hamburger menu
│   │   ├── ScrollTop.tsx   # Scroll-to-top button (uses GSAP ScrollToPlugin)
│   │   ├── Toast.tsx       # Toast notification component
│   │   └── icons.tsx       # All SVG icons as React components
│   ├── hooks/              # Custom React hooks
│   │   ├── useI18n.ts      # Language detection, switching, t() translation function
│   │   ├── useLenis.ts     # Lenis smooth scroll initialization
│   │   ├── useRevealAnimations.ts  # GSAP ScrollTrigger reveal animations
│   │   ├── useScrollState.ts       # Scroll direction & progress tracking
│   │   └── useTheme.ts     # Dark/light theme with localStorage
│   ├── i18n/               # Translation dictionaries
│   │   ├── cookie.ts       # Cookie consent translations
│   │   ├── error.ts        # Error page translations
│   │   ├── editorial.ts    # Current Home, About and Polaris copy in three languages
│   │   ├── faq.ts          # Current Polaris FAQ in three languages
│   │   └── team.ts         # Team page translations
│   ├── lib/                # Utility modules
│   │   ├── consent.ts      # Google Consent Mode v2 integration
│   │   └── scroll.ts       # Scroll utility helpers
│   ├── pages/              # Page-level components
│   │   ├── Home.tsx
│   │   ├── Polaris.tsx
│   │   ├── About.tsx       # Current organisation and people page
│   │   └── Team.tsx        # Unused legacy entry
│   ├── styles/             # shared.css + editorial.css for current public pages; team.css for the unused legacy Team entry
│   │   ├── error.css
│   │   ├── editorial.css
│   │   ├── shared.css
│   │   └── team.css
│   ├── main-home.tsx       # Entry point for Home page
│   ├── main-polaris.tsx    # Entry point for Polaris page
│   ├── main-team.tsx       # Entry point for Team page
│   └── main-404.tsx        # Entry point for 404 page
├── index.html              # Home page HTML shell
├── about.html              # Current About HTML shell
├── team.html               # Legacy shell; production /team routes redirect to /about
├── polaris.html            # Polaris page HTML shell
├── 404.html                # 404 page HTML shell
├── vite.config.ts          # Vite MPA build config (rollupOptions.input)
├── tsconfig.json           # TypeScript config (ESNext, strict)
└── package.json
```

---

## Architecture Patterns

### Multi-Page Application (MPA)

This is **not** a SPA. Each page has its own HTML file and entry point (`main-*.tsx`). Vite's `rollupOptions.input` explicitly lists all HTML entries. When adding a new page:
1. Create a new `.html` file at project root
2. Create a corresponding `src/main-*.tsx` entry
3. Add the HTML file to `rollupOptions.input` in `vite.config.ts`

### Theme System

- Theme state is managed via `data-theme` attribute on `<html>`, toggled by the `useTheme` hook.
- Themes: `dark` (default) and `light`. CSS uses `[data-theme="dark"]` / `[data-theme="light"]` selectors.
- Preference persists in `localStorage` key `themePref`. An inline script in each HTML file applies it before paint. The site does not follow `prefers-color-scheme`.
- All theme-aware CSS should use CSS custom properties defined in `shared.css`.

### Internationalization (i18n)

- No external i18n library. Translations are plain TypeScript dictionaries in `src/i18n/`.
- Languages are `zh` (简体中文, `html lang="zh-CN"`), `zh-Hant` (繁體中文, `html lang="zh-HK"`), and `en`.
- `useI18n` resolves language in this order: `?lang=` (`zh`, `zh-CN`, `zh-Hans`, `en`, `zh-Hant`, `zh-HK`, `zh-TW`, and `en-*`), then `localStorage` key `langPref` (legacy `zh` and `en` still work), then `navigator.languages`, then `zh`.
- Choosing a language writes `langPref` and sets `?lang=` on the current URL with `replaceState`. Other pages keep the choice through `localStorage` even when the link has no query. HTML shells contain the simplified Chinese search baseline. Current pages also update document title and description/social metadata for the selected language; this client-side update does not provide separately prerendered language URLs for crawlers.
- Shared controls (language menu, theme labels, navigation labels) live in `src/i18n/ui.ts`. Page copy stays in the page dictionary.
- The `t(key)` function accepts dictionary keys. When adding translatable content, add `zh`, `zh-Hant`, and `en`.
- `team.json` and `sponsor.json` category labels may include `zh-Hant`. Missing traditional text falls back to simplified, then English. Do not invent a Chinese name for a Latin nickname.

### Data Flow for Sponsors & Team

- The public About page reads `public/people.json` at build time. Order is the `order` field. Do not sort that list by pinyin. `public` false hides a person. `statementConfirmed` must be true before a statement is shown. Avatars are omitted until the file and its permission are confirmed. To add, remove, retitle, or reorder someone, edit `people.json` and redeploy. A Feishu account does not publish a person.
- `team.json` remains in the repo and is not rendered.
- Sponsor data is fetched at runtime. A sponsor is shown on the Polaris page only when `edition` is `polaris-2027` and `confirmedForEdition` is `true`. Entries without that confirmation stay in the file and are not rendered. The homepage does not read this file.

### Animation System

- Legacy reveal hooks remain for the unused Team entry. Current public pages keep copy visible without opacity reveals. Home and Polaris use useChapterMotion for small scroll-linked title and graphic movements; all return to static layouts with reduced motion. The approved heroes retain their reduced-motion-aware CSS animation.
- Lenis for smooth scrolling (`useLenis` hook). Must be initialized per-page.
- GSAP plugins must be registered before use: `gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)`.
- Animation class names follow the pattern `.reveal-*` in CSS.

### CSS Conventions

- The 2026-10-10 review rejected the default 3D scenes and then the flat below-hero layout. The current local sample uses FestivalStory for the five-day experience, themes and challenges: one evolving 2D print, an always-readable schedule, a continuous relationship diagram and equal challenge formats. Later sections retain the fifth-pass layout. Preserve the approved heroes and original 2D graphics. Public copy describes a small set of themes without a fixed count or a numeric range. Open creation uses a natural description, without an isolated Nobody Asked label. Review records are in review/website-sixth-pass and docs/website-redesign-plan.md. The fifth-pass snapshot remains in Git.
- Pure CSS only. **No Tailwind, no CSS modules, no styled-components.**
- Home and Polaris import adventure.css after shared.css, editorial.css, experience.css and layout.css. About retains the four baseline files. Polaris additionally imports festival.css, scoped to the first three chapters in FestivalStory.tsx; Home does not load that sample stylesheet. adventure.css isolates the current review design: 7:5 heading-to-body columns, 5:7 practical explanation columns and full-width visual scenes, with a shared 1240px maximum content width. Mobile layouts switch to one column below 700px. Chinese feature headings fit complete desktop lines and balance each phrase separately on mobile; English theme/challenge headings have a separate narrow-screen scale.
- Shared layout and the brand-light hero live in src/components/Editorial.tsx. Public pages use the original SVG and CSS illustrations from ExperienceIllustrations.tsx. SceneVisual.tsx and the procedural models are retained as unused experiments and default to 2D; see docs/scene-models.md. Illustrations must not imply confirmed venues, equipment or menus. Do not replace them with unrelated city photos.
- FestivalStory.tsx explains theme directions, one coherent project and specific challenge problems. CreationExperience.tsx is retained as the previous implementation. It does not invent or select unpublished briefs. Sailboat and Cruise address different task requirements and participation processes; both are introduced openly with equal visual weight. Do not describe them as levels of technical support or as the only two individual challenges. Only supplementary challenge guidance is folded. Actual project editing belongs to Passport.
- FestivalStory.tsx keeps Day 1, Day 2–4 and Day 5 readable together. On screens at least 900px wide and 720px high, with motion enabled, a CSS-sticky illustration assembles as the reader scrolls through the schedule. Stage buttons hold a manual preview until the next scroll intent. Mobile, short windows and reduced motion use normal flow; reduced motion also disables transforms transitioning. FiveDayJourney.tsx is retained as the previous pinned implementation and is not rendered by the sample.
- EventExperience.tsx contains static participation-area rules and life-support tabs. Keep the two-person, 12-hour accommodation rule visible outside the hidden panels as well.
- FollowUpdates.tsx opens a horizontal channel chooser instead of immediately navigating to WeChat. X and WeChat have confirmed destinations. VITE_INSTAGRAM_URL and VITE_NEWSLETTER_URL accept actual HTTPS destinations; unset channels show their unpublished state without fake subscriptions.
- PartnershipInquiry.tsx uses a Radix modal, multiple cooperation directions and server-verified Turnstile. Emails are copied with CopyEmail; partnership controls do not launch a mail client. About is available in the footer instead of the top navigation.
- The public pages link to _entropy Passport through src/lib/site.ts. VITE_PASSPORT_URL can select a separate preview destination; it defaults to https://passport.entropy.asia/. There is no live Passport content feed or website publication editor connected yet. Application status remains the confirmed preparation baseline until that integration is implemented and reviewed.
- Design tokens (colors, spacing) are defined as CSS custom properties in `shared.css`.
- Theme-specific overrides use `[data-theme="dark"]` / `[data-theme="light"]` attribute selectors.
- Responsive breakpoints use standard media queries.

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Type check
npm run lint

# Production build
npm run build

# Preview production build locally
npm run preview

# Start the local Worker on port 8787 (Vite proxies partnership requests here)
npm run dev:worker

# Check enquiry validation, verification and email delivery failures
npm run test:inquiry

# Check scene geometry and both theme palettes
npm run test:scenes

# Regenerate standalone models from the procedural geometry
npm run models:export
```

---

## CI/CD

- **Platform**: GitHub Actions (`.github/workflows/ci.yml`)
- **Triggers**: Push to `main` and all Pull Requests targeting `main`
- **Pipeline steps**: `npm ci` → `npm run lint` → `npm run test:inquiry` → `npm run test:scenes` → `npm run build`
- **Node.js version**: 24
- `npm run lint` is typecheck only (frontend and `tsconfig.worker.json`)
- Additional checks on PRs: CodeRabbit, CodeQL (must all pass before merge)

---

## Code Style

- **No semicolons** at end of statements (the codebase consistently omits them).
- **Single quotes** for strings.
- **2-space indentation**.
- **Trailing commas** in multiline structures.
- **Arrow functions** preferred for components and callbacks.
- TypeScript `strict` mode is enabled — all types must be explicit where inference is insufficient.
- React components use named function exports: `export default function PageName() { ... }`.
- Hooks follow standard naming: `useXxx`.
- There is no ESLint configuration. Observe React Hooks rules during review; `npm run lint` performs TypeScript checking only.

### Partnership Backend

- worker/index.ts accepts same-origin JSON at `/api/partnership`. It validates body size and fields, applies IP/email rate limits, and checks Turnstile success, hostname and action before sending.
- Cloudflare EMAIL is restricted by its binding; sender and recipient come from server configuration. The submitted address is Reply-To only. Do not expose secrets or let clients select a delivery destination.
- The tracked wrangler.jsonc keeps online sending disabled until its own sender, recipient and Turnstile configuration are provisioned. Missing configuration, verification errors and rejected mail must never show success. Sending succeeds only after the email service returns a message identifier.
- `.dev.vars*`, `.wrangler/`, local review configuration and review evidence are ignored. Never commit verification secrets or test recipient configuration. The separate review deployment is not the production site.

---

## Organization Rules (熵序 Code Contribution Policy)

These rules are **mandatory** for all contributors (human and AI-assisted) in this repository.

### AI-Generated Code Policy

Most of the code in _entropy 熵序_ is generated through AI. We do not prohibit you from using any AI to generate, edit, or delete existing code. However, we require the following:

1. **Manual Testing Required**: After AI generates code, you **must** manually test it — run the full business flow of the affected feature end-to-end, and confirm there are no visual glitches, broken interactions, or unexpected behavior before committing.
2. **No Blind Commits**: Never commit AI-generated code without verifying it works correctly in the browser.

### Code Comment Style

> **Before asking AI to modify program files, always include this instruction:**
>
> "请尽量不要添加连续多行的注释，禁止使用 `======xxx======` 之类格式的分割注释；仅在必要情况下使用 `//` 双斜杠简要一句话注释即可。"

- **No multi-line comment blocks** — avoid adding consecutive lines of comments.
- **No decorative divider comments** — patterns like `// ====== Section Name ======` are forbidden.
- **Single-line `//` comments only** — and only when truly necessary for clarity. Keep them brief (one sentence).
- The code should speak for itself; excessive comments make it indistinguishable from raw vibe-coded output.

### Git Commit Convention

- Follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification.
- Commit messages **must be written in fluent English**.
- Format: `<type>(<scope>): <description>` (e.g., `feat(home): add sponsor carousel`, `fix(team): correct avatar loading on Safari`).
- Common types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `perf`, `ci`.
- If unsure how to write a commit message, consult your AI assistant.

### Branch & PR Workflow

1. **Never commit unreviewed code directly to `main`/`master`** (unless explicitly exempted for trivial changes).
2. Create a feature/fix branch (`feat/xxx`, `fix/xxx`, etc.) or fork to your personal repository.
3. Commit your changes on that branch.
4. Open a **Pull Request** on GitHub targeting `main`.
5. The PR must pass **all checks** before merge:
   - CodeRabbit review
   - CodeQL analysis
   - CI build (lint + build must be green)
6. A repository admin or primary contributor must **approve the review** before merging.

### AI Agent Restrictions

- **Do NOT let AI agents commit on your behalf.** You are responsible for every commit.
- **AI accounts must NOT appear** in the collaborator list or author/contributor fields of any commit.

---

## Key Files Quick Reference

| Purpose | File |
|---|---|
| Vite MPA config | `vite.config.ts` |
| TypeScript config | `tsconfig.json` |
| CI pipeline | `.github/workflows/ci.yml` |
| Sponsor data | `public/sponsor.json` |
| Public people | `public/people.json` |
| Theme & shared CSS | `src/styles/shared.css` |
| i18n hook | `src/hooks/useI18n.ts` |
| Theme hook | `src/hooks/useTheme.ts` |
| Animation hook | `src/hooks/useRevealAnimations.ts` |
| Smooth scroll hook | `src/hooks/useLenis.ts` |
| Google consent | `src/lib/consent.ts` |
| Navigation component | `src/components/Nav.tsx` |
| Footer component | `src/components/Footer.tsx` |
