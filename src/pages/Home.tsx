import type { MouseEvent } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { ScrollTop } from '../components/ScrollTop';
import { CookieConsent } from '../components/CookieConsent';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';
import { ChevronRightIcon } from '../components/icons';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { useLenis } from '../hooks/useLenis';
import { useScrollState } from '../hooks/useScrollState';
import { useHomeAnimations } from '../hooks/useRevealAnimations';
import { scrollToTarget } from '../lib/scroll';
import { homeI18n } from '../i18n/home';

const entryAvatars = [
  { src: 'assets/team/kevin.jpg', alt: 'KevinYang' },
  { src: 'assets/team/xubai.JPEG', alt: 'xubai' },
  { src: 'assets/team/zongtianshuo.jpg', alt: 'zongtianshuo' },
  { src: 'assets/team/cherry.jpeg', alt: 'Cherry' }
];

export function Home() {
  const { t, toggleLang, langLabel, lang, getLangSwitchMessage } = useI18n(homeI18n);
  const { isLight, toggleTheme, toggleLabel } = useTheme();
  const { showToast } = useToast();
  useLenis();
  const { scrolled, showScrollTop } = useScrollState(false);
  useHomeAnimations();

  const handleToggleLang = () => {
    toggleLang();
    showToast(getLangSwitchMessage());
  };

  const handleNavClick = (href: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#') && href.length > 1) {
      const target = document.querySelector<HTMLElement>(href);
      if (target) {
        event.preventDefault();
        scrollToTarget(target);
      }
    }
  };

  return (
    <>
      <Nav
        logoHref="#home"
        scrolled={scrolled}
        activeSection="home"
        onLinkClick={handleNavClick}
        links={[
          { href: '#home', label: t('home'), sectionId: 'home' },
          { href: 'team.html', label: t('team') },
          { href: 'polaris.html', label: t('polaris') },
        ]}
        langLabel={langLabel}
        onToggleLang={handleToggleLang}
        themePressed={isLight}
        themeLabel={toggleLabel}
        onToggleTheme={toggleTheme}
      />

      <main>
        <section id="home" className="hero">
          <div className="container">
            <Button asChild className="polaris-banner reveal">
              <a href="polaris.html">
                <img
                  className="polaris-banner-bg"
                  src="https://webp.entropy.asia/public/polaris.png"
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  decoding="async"
                  {...({ fetchpriority: 'high' } as Record<string, string>)}
                />
                <img className="polaris-banner-logo" src="assets/polaris27.svg" alt="polaris.27" />
                <span className="polaris-banner-cta">
                  {t('heroCta')}
                  <ChevronRightIcon />
                </span>
              </a>
            </Button>
            <div className="hero-entropy reveal">
              <img src="assets/entropy_logo.svg" alt="_entropy" />
            </div>
            <div className="hero-intro">
              <p className="eyebrow reveal">{t('entropy')}</p>
              <h1 className="hero-title reveal">{t('entropyBody')}</h1>
            </div>
          </div>
        </section>

        <section id="about" className="section-alt">
          <div className="container">
            <div className="team-section">
              <div className="team-block reveal">
                <p className="eyebrow">{t('tech')}</p>
                <h3 className="team-block-title">
                  <img src="assets/entropy_logo.svg" className="tech-logo" alt="_entropy" />{' '}
                  <span>{t('techTitleText')}</span>
                </h3>
              </div>
              <div className="team-block reveal">
                <p className="eyebrow">{t('art')}</p>
                <p className="team-block-body">
                  <img src="assets/entropy_logo.svg" className="tech-logo art-logo" alt="_entropy" />{' '}
                  <span>{t('artBodyText')}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="welcome" className="welcome-section">
          <div className="container">
            <p className="eyebrow reveal">{t('welcome')}</p>
            <h2 className="welcome-title reveal">{t('welcomeTitle')}</h2>
            <p className="welcome-body reveal">{t('welcomeBody')}</p>
          </div>
        </section>

        <section id="team-entry" className="team-entry-section">
          <div className="container">
            <Button asChild className="team-entry reveal">
              <a href="team.html" aria-label="团队成员">
                <div className="avatar-group">
                  {entryAvatars.map((avatar) => (
                    <img
                      key={avatar.src}
                      src={avatar.src}
                      alt={avatar.alt}
                      className="avatar-group-item"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                  <span className="avatar-group-more" aria-hidden="true">
                    _
                  </span>
                </div>
                <span className="team-entry-text">{t('teamEntryText')}</span>
              </a>
            </Button>
          </div>
        </section>

        <section id="join" className="join-section section-alt">
          <div className="container">
            <Button asChild className="join-card reveal">
              <a href="team.html#become-dreamer" id="joinCard" aria-label="加入我们">
                <img src="https://webp.entropy.asia/public/join_bg.png" alt="" className="join-bg" loading="lazy" decoding="async" />
                <img
                  src="https://webp.entropy.asia/public/rocket.png"
                  alt=""
                  className="join-rocket"
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                />
                <div className="join-overlay">
                  <div>
                    <p className="join-title">JOIN</p>
                    <p className="join-title">US.</p>
                  </div>
                  <p className="join-hint">{t('joinHint')}</p>
                </div>
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer cookieSettingsLabel={t('cookieSettings')} />
      <ScrollTop visible={showScrollTop} />
      <CookieConsent lang={lang} />
    </>
  );
}
