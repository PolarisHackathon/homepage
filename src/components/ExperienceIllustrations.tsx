import { useId } from 'react'
import type { Lang } from '../hooks/useI18n'
import { experienceCopy } from '../i18n/experience'

export function BuildScene({ lang }: { lang: Lang }) {
  const id = useId().replace(/:/g, '')
  const copy = experienceCopy[lang]
  return <figure className="experience-scene build-scene"><svg viewBox="0 0 960 410" fill="none" aria-hidden="true">
    <defs><linearGradient id={id} x1="220" y1="60" x2="600" y2="330" gradientUnits="userSpaceOnUse"><stop stopColor="var(--scene-surface)" /><stop offset="1" stopColor="var(--scene-deep)" /></linearGradient></defs>
    <path d="M70 346H890" stroke="var(--scene-line)" />
    <g transform="translate(92 55) rotate(-9 78 105)"><rect width="155" height="218" rx="3" fill="var(--scene-paper)" stroke="var(--scene-line)" /><path d="M21 27h67M21 40h111M21 182h111M21 194h64" stroke="var(--scene-muted)" strokeWidth="2" /><rect x="21" y="65" width="113" height="89" rx="2" stroke="var(--scene-muted)" /><path d="m33 133 25-36 17 19 25-39 23 56H33Z" fill="var(--scene-accent)" fillOpacity=".18" stroke="var(--scene-accent)" /><circle cx="115" cy="85" r="5" stroke="var(--scene-accent)" /></g>
    <g><rect x="279" y="58" width="414" height="253" rx="13" fill={`url(#${id})`} stroke="var(--scene-edge)" strokeWidth="2" /><rect x="290" y="70" width="392" height="226" rx="5" fill="var(--scene-deep)" /><path d="M291 95h390M380 96v199" stroke="var(--scene-line)" /><circle cx="307" cy="82" r="3" fill="var(--scene-muted)" /><circle cx="319" cy="82" r="3" fill="var(--scene-muted)" /><circle cx="331" cy="82" r="3" fill="var(--scene-muted)" /><path d="M307 118h48M307 132h35M307 159h48M307 173h40M307 187h32" stroke="var(--scene-muted)" strokeWidth="3" /><rect x="402" y="116" width="256" height="150" rx="4" fill="var(--scene-surface)" stroke="var(--scene-line)" /><path d="M402 238h256M422 146h53M422 158h81" stroke="var(--scene-line)" strokeWidth="3" /><path d="m504 218 28-38 32 19 24-56 50 75H504Z" fill="var(--scene-accent)" fillOpacity=".16" stroke="var(--scene-accent)" strokeWidth="1.5" /><circle cx="619" cy="142" r="7" fill="var(--scene-accent)" fillOpacity=".5" /><path d="m279 311-46 26c-5 3-2 9 4 9h499c6 0 9-6 4-9l-47-26H279Z" fill="var(--scene-surface)" stroke="var(--scene-edge)" strokeWidth="2" /><path d="M462 311h48l13 14h-73l12-14Z" fill="var(--scene-deep)" /></g>
    <g transform="translate(736 180) rotate(7 69 65)"><rect width="139" height="112" rx="9" fill="var(--scene-surface)" stroke="var(--scene-edge)" /><rect x="14" y="15" width="111" height="81" rx="4" fill="var(--scene-deep)" stroke="var(--scene-line)" /><rect x="46" y="34" width="43" height="41" rx="4" fill="var(--scene-surface)" stroke="var(--scene-accent)" /><path d="M49 28v-9m12 9v-9m12 9v-9m12 9v-9M49 80v10m12-10v10m12-10v10m12-10v10M41 39H22m19 13H22m19 13H22m73-26h22m-22 13h22m-22 13h22" stroke="var(--scene-accent)" /><circle cx="113" cy="83" r="3" fill="var(--scene-accent)" /></g>
    <path d="M733 267c-37 0-30 55-4 55h95" stroke="var(--scene-muted)" strokeWidth="2" /><path d="m197 309 37-66 5 4-34 68-8-6Z" fill="var(--scene-paper)" stroke="var(--scene-edge)" />
  </svg><figcaption><span>{copy.buildVisual}</span><span>{copy.conceptVisual}</span></figcaption></figure>
}

export function WorkshopScene({ lang }: { lang: Lang }) {
  const copy = experienceCopy[lang]
  return <figure className="experience-scene workshop-scene"><svg viewBox="0 0 620 300" fill="none" aria-hidden="true">
    <rect x="34" y="26" width="183" height="228" rx="4" fill="var(--scene-paper)" stroke="var(--scene-line)" /><path d="M55 51h74M55 68h135" stroke="var(--scene-muted)" strokeWidth="3" />
    {[0, 1, 2].map(index => <g key={index} transform={`translate(55 ${95 + index * 48})`}><circle cx="11" cy="10" r="10" stroke="var(--scene-accent)" /><path d="M35 6h97M35 17h64" stroke="var(--scene-muted)" strokeWidth="2" /></g>)}
    <rect x="252" y="48" width="330" height="200" rx="9" fill="var(--scene-deep)" stroke="var(--scene-edge)" strokeWidth="2" /><path d="M252 72h330M314 72v176" stroke="var(--scene-line)" /><circle cx="270" cy="61" r="3" fill="var(--scene-muted)" /><circle cx="282" cy="61" r="3" fill="var(--scene-muted)" /><path d="M267 91h31M267 109h24M267 127h31M267 145h20" stroke="var(--scene-muted)" strokeWidth="3" /><path d="M335 177c21-87 63 63 90-9s47 56 75-30 43 10 61-36" stroke="var(--scene-accent)" strokeWidth="3" /><path d="M336 207h89m16 0h120" stroke="var(--scene-line)" strokeWidth="4" /><path d="m476 176 5 27 6-9 11-2-22-16Z" fill="var(--scene-paper)" stroke="var(--scene-muted)" /><path d="m252 249-25 15h381l-26-15" fill="var(--scene-surface)" stroke="var(--scene-edge)" />
  </svg><figcaption>{copy.workshopVisual}</figcaption></figure>
}

export function DemoScene({ lang }: { lang: Lang }) {
  const copy = experienceCopy[lang]
  return <figure className="experience-scene demo-scene"><svg viewBox="0 0 620 290" fill="none" aria-hidden="true">
    <path d="m77 225 50-143h275l48 143H77Z" fill="var(--scene-surface)" stroke="var(--scene-edge)" /><path d="M77 225v19h373v-19" stroke="var(--scene-edge)" fill="var(--scene-deep)" />
    <rect x="156" y="36" width="212" height="143" rx="7" fill="var(--scene-deep)" stroke="var(--scene-edge)" strokeWidth="2" /><rect x="170" y="50" width="184" height="115" rx="3" fill="var(--scene-surface)" /><path d="M188 76h53M188 88h31" stroke="var(--scene-muted)" strokeWidth="3" /><path d="M188 142v-24h25v11h24V98h25v25h24v-16h24v35" stroke="var(--scene-accent)" strokeWidth="3" /><path d="M242 179v15h43v-15" stroke="var(--scene-edge)" /><circle cx="144" cy="211" r="8" stroke="var(--scene-muted)" /><circle cx="181" cy="211" r="8" stroke="var(--scene-muted)" /><circle cx="359" cy="205" r="13" fill="var(--scene-accent)" fillOpacity=".3" stroke="var(--scene-accent)" />
    <g transform="translate(474 81) rotate(7 47 74)"><rect width="93" height="151" rx="9" fill="var(--scene-deep)" stroke="var(--scene-edge)" strokeWidth="2" /><rect x="9" y="13" width="75" height="123" rx="3" fill="var(--scene-paper)" /><path d="M24 36h42M24 48h29M24 101h42M24 113h25" stroke="var(--scene-muted)" strokeWidth="3" /><circle cx="46" cy="76" r="13" stroke="var(--scene-accent)" /><path d="m41 76 4 4 7-9" stroke="var(--scene-accent)" /></g>
  </svg><figcaption>{copy.demoVisual}</figcaption></figure>
}

export function MealScene({ lang }: { lang: Lang }) {
  return <figure className="experience-scene meal-scene"><svg viewBox="0 0 500 215" fill="none" aria-hidden="true">
    <rect x="34" y="52" width="318" height="147" rx="18" fill="var(--scene-surface)" stroke="var(--scene-edge)" /><rect x="45" y="63" width="296" height="125" rx="13" stroke="var(--scene-line)" />
    <ellipse cx="195" cy="123" rx="86" ry="59" fill="var(--scene-paper)" stroke="var(--scene-edge)" /><ellipse cx="195" cy="120" rx="71" ry="45" fill="var(--scene-surface)" stroke="var(--scene-line)" /><path d="M140 116c-11-26 47-38 61-14 15 28-50 48-61 14Z" fill="var(--scene-paper)" stroke="var(--scene-line)" /><path d="m153 111 8-5m-4 12 8-4m-4-10 7-4m-2 19 8-5m-4-9 8-3" stroke="var(--scene-muted)" /><path d="M205 103c-8-10 8-24 21-12 15-12 26 9 17 17 12 15-16 34-25 19-15 10-23-12-13-24Z" fill="var(--scene-accent)" fillOpacity=".4" stroke="var(--scene-accent)" /><path d="M200 142c3-26 42-31 50-6-4 23-35 24-50 6Z" fill="var(--scene-warm)" stroke="var(--scene-muted)" />
    <path d="M75 83v76m11-76v76M302 84v75" stroke="var(--scene-muted)" strokeWidth="3" strokeLinecap="round" /><path d="M301 84c14 8 14 24 0 29" stroke="var(--scene-muted)" strokeWidth="2" />
    <ellipse cx="408" cy="79" rx="33" ry="13" fill="var(--scene-paper)" stroke="var(--scene-edge)" /><path d="m375 79 5 99c1 15 55 15 56 0l5-99" fill="var(--scene-surface)" stroke="var(--scene-edge)" /><ellipse cx="408" cy="82" rx="25" ry="8" fill="var(--scene-warm)" /><path d="M176 58c-14-15 12-18 0-35m22 35c-14-15 12-18 0-35m22 35c-14-15 12-18 0-35" stroke="var(--scene-muted)" strokeWidth="1.5" strokeLinecap="round" />
  </svg><figcaption>{experienceCopy[lang].mealVisual}</figcaption></figure>
}

export function OrganiseScene({ lang }: { lang: Lang }) {
  const copy = experienceCopy[lang]
  return <figure className="experience-scene organise-scene"><div className="organise-desk">
    <div className="planning-sheet"><span>Hackathon polaris 2027</span><strong>5</strong><div>{['01', '02', '03', '04', '05'].map(day => <span key={day}>{day}<i /></span>)}</div><p>{copy.planVisual}</p></div>
    <div className="design-sheet"><span>_entropy</span><div className="design-orbit"><i /><i /><i /></div><p>{copy.designVisual}</p></div>
    <div className="site-sheet"><div className="site-sheet-grid">{Array.from({length:8}, (_, index) => <i key={index} />)}</div><p>{copy.siteVisual}</p></div>
  </div><figcaption>{copy.organiseVisual}</figcaption></figure>
}
