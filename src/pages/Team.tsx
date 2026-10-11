import { useEffect, useState } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { ScrollTop } from '../components/ScrollTop';
import { CookieConsent } from '../components/CookieConsent';
import { Button } from '../components/Button';
import { ChevronRightIcon } from '../components/icons';
import { useToast } from '../components/Toast';
import { useI18n, type Lang } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { useLenis } from '../hooks/useLenis';
import { useScrollState } from '../hooks/useScrollState';
import { useTeamAnimations } from '../hooks/useRevealAnimations';
import { prefersReducedMotion, scrollToTarget } from '../lib/scroll';
import { localized } from '../lib/locale';
import { teamI18n, type TeamI18nKey } from '../i18n/team';
import { langSwitchMessage, themeLabel, uiI18n } from '../i18n/ui';
import teamJson from '../../public/team.json';

interface LocalizedText {
  zh: string;
  en: string;
  'zh-Hant'?: string;
}

interface TeamMemberData {
  nickname: LocalizedText;
  avatar: string;
  signature: LocalizedText;
}

interface TeamGroupData {
  id: string;
  label: string;
  alt: boolean;
  members: TeamMemberData[];
}

interface TeamData {
  groups: TeamGroupData[];
}

const teamData: TeamData = teamJson;

const PINYIN_INITIAL_BOUNDS: Array<[string, string]> = [
  ['a', '阿'], ['b', '八'], ['c', '嚓'], ['d', '哒'], ['e', '蛾'],
  ['f', '发'], ['g', '噶'], ['h', '哈'], ['j', '击'], ['k', '喀'],
  ['l', '垃'], ['m', '妈'], ['n', '拿'], ['o', '噢'], ['p', '啪'],
  ['q', '期'], ['r', '然'], ['s', '撒'], ['t', '塌'], ['w', '挖'],
  ['x', '昔'], ['y', '压'], ['z', '匝'],
];

function pinyinInitial(char: string): string {
  let initial = '';
  for (const [letter, bound] of PINYIN_INITIAL_BOUNDS) {
    if (char.localeCompare(bound, 'zh-CN') >= 0) initial = letter;
    else break;
  }
  return initial;
}

function memberInitial(member: TeamMemberData): string {
  const first = member.nickname.zh.charAt(0);
  return /[a-zA-Z]/.test(first) ? first.toLowerCase() : pinyinInitial(first);
}

function sortMembers(members: TeamMemberData[]): TeamMemberData[] {
  return members
    .map((member, index) => ({ member, initial: memberInitial(member), index }))
    .sort((a, b) => {
      if (a.initial !== b.initial) return a.initial < b.initial ? -1 : 1;
      const byPinyin = a.member.nickname.zh.localeCompare(b.member.nickname.zh, 'zh-CN');
      return byPinyin !== 0 ? byPinyin : a.index - b.index;
    })
    .map(({ member }) => member);
}

const groupKeyMap: Record<string, { titleKey: TeamI18nKey; descKey: TeamI18nKey }> = {
  core: { titleKey: 'group1Title', descKey: 'group1Desc' },
  'tech-design': { titleKey: 'group2Title', descKey: 'group2Desc' },
  'product-events': { titleKey: 'group4Title', descKey: 'group4Desc' },
  'biz-legal': { titleKey: 'group3Title', descKey: 'group3Desc' },
  consultants: { titleKey: 'group5Title', descKey: 'group5Desc' },
};

function TeamCard({
  member,
  lang,
  active,
  onToggle,
}: {
  member: TeamMemberData;
  lang: Lang;
  active: boolean;
  onToggle: (avatar: string | null) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const nickname = localized(member.nickname, lang);
  const signature = localized(member.signature, lang);
  const interactive = signature !== '';

  return (
    <div
      className={`team-card reveal${active ? ' is-active' : ''}${interactive ? ' has-sign' : ''}`}
      onClick={interactive ? () => { onToggle(active ? null : member.avatar); } : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle(active ? null : member.avatar);
              }
            }
          : undefined
      }
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-expanded={interactive ? active : undefined}
    >
      <div className={`team-card-avatar${imgFailed ? ' avatar-empty' : ''}`}>
        {!imgFailed && (
          <img
            src={member.avatar}
            alt={nickname}
            loading="lazy"
            decoding="async"
            onError={() => { setImgFailed(true); }}
          />
        )}
      </div>
      <div className="team-card-info">
        <h3 className="team-card-name">{nickname}</h3>
      </div>
      {interactive && (
        <div className="team-card-sign" aria-hidden={!active}>
          <p className="team-card-sign-text">{signature}</p>
        </div>
      )}
    </div>
  );
}

export function Team() {
  const { t, setLang, lang } = useI18n(teamI18n);
  const { isLight, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { ready } = useLenis();
  const { scrolled, showScrollTop } = useScrollState(false);
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const memberCount = teamData.groups.reduce(
    (count, group) => count + group.members.length,
    0
  );
  useTeamAnimations(memberCount);

  useEffect(() => {
    if (!ready && !prefersReducedMotion) return;
    const hash = window.location.hash;
    if (!hash || hash === '#') return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    const timer = setTimeout(() => {
      // Lenis 的 scrollTo 自动应用 scroll-margin-top；refresh=true 确保滚动上限已更新
      scrollToTarget(target, 0, true);
    }, 120);
    return () => { clearTimeout(timer); };
  }, [ready]);

  const handleSelectLang = (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    showToast(langSwitchMessage(next));
  };

  return (
    <>
      <Nav
        logoHref="index.html"
        scrolled={scrolled}
        activeSection="team"
        links={[
          { href: 'index.html#home', label: t('home') },
          { href: 'team.html', label: t('team'), sectionId: 'team' },
          { href: 'polaris.html', label: t('polaris') },
        ]}
        lang={lang}
        onSelectLang={handleSelectLang}
        themePressed={isLight}
        themeLabel={themeLabel(lang, isLight)}
        onToggleTheme={toggleTheme}
      />

      <main>
        <section className="team-hero">
          <div className="container">
            <div className="team-hero-banner reveal">
              <img
                className="team-banner-bg"
                src="https://webp.entropy.asia/public/join_bg.png"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                {...({ fetchpriority: 'high' } as Record<string, string>)}
              />
              <img
                className="team-banner-rocket"
                src="https://webp.entropy.asia/public/rocket.png"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
              />
            </div>
            <p className="eyebrow reveal">{t('teamLabel')}</p>
            <h1 className="team-hero-title reveal">{t('teamTitle')}</h1>
            <p className="team-hero-body reveal">{t('teamBody')}</p>
          </div>
        </section>

        {teamData.groups.map((group) => {
          const keys = groupKeyMap[group.id];
          const members = sortMembers(group.members ?? []);
          return (
            <section key={group.id} className={`team-group${group.alt ? ' section-alt' : ''}`}>
              <div className="container">
                <div className="team-group-header reveal">
                  <p className="team-group-label">{group.label}</p>
                  {keys && (
                    <>
                      <h2 className="team-group-title">{t(keys.titleKey)}</h2>
                      <p className="team-group-desc">{t(keys.descKey)}</p>
                    </>
                  )}
                </div>
                <div className="team-grid">
                  {members.map((member) => (
                    <TeamCard
                      key={member.avatar}
                      member={member}
                      lang={lang}
                      active={activeMember === member.avatar}
                      onToggle={setActiveMember}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section id="become-dreamer" className="team-contact">
          <div className="container">
            <p className="eyebrow reveal">{t('contactEyebrow')}</p>
            <h2 className="team-contact-title reveal">{t('contactTitle')}</h2>
            <p className="team-contact-body reveal">{t('contactBody')}</p>
            <div className="team-contact-grid">
              <Button asChild className="team-contact-card team-contact-email reveal">
                <a href="mailto:hr@entropy.asia" aria-label={t('emailAddress')}>
                  <p className="team-contact-email-label">{t('emailLabel')}</p>
                  <p className="team-contact-email-address">{t('emailAddress')}</p>
                </a>
              </Button>
              <div className="team-contact-card team-contact-qr reveal">
                <img
                  className="team-contact-qr-img"
                  src="assets/wechat-qrcode.png"
                  alt={t('qrCaption')}
                  loading="lazy"
                  decoding="async"
                />
                <p className="team-contact-qr-caption">{t('qrCaption')}</p>
                <a
                  className="team-contact-qr-link"
                  href="http://weixin.qq.com/r/mp/4CACGj7EeWMGrXp593Xy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('wechatFollow')}
                  <ChevronRightIcon />
                </a>
              </div>
              <div className="team-contact-card team-contact-create reveal">
                <img
                  className="team-contact-create-bg"
                  src="https://webp.entropy.asia/public/creating.png"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
                <p className="team-contact-create-text">
                  {t('createLine1')}
                  <br />
                  {t('createLine2')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer cookieSettingsLabel={t('cookieSettings')} />
      <ScrollTop visible={showScrollTop} label={uiI18n[lang].scrollTop} />
      <CookieConsent lang={lang} />
    </>
  );
}
