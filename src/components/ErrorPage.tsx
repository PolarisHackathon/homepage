import { Toggle } from 'radix-ui';
import { LangMenu } from './LangMenu';
import { MoonIcon, SunIcon } from './icons';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { errorI18n } from '../i18n/error';
import { themeLabel } from '../i18n/ui';

const SUPPORT_EMAIL = 'support@entropy.asia';

export type ErrorKind = 'error' | 'notfound';

export function ErrorPage({ kind }: { kind: ErrorKind }) {
  const { t, lang, setLang } = useI18n(errorI18n);
  const { isLight, toggleTheme } = useTheme();
  const isError = kind === 'error';

  return (
    <div className="error-page">
      <header className="error-nav">
        <span aria-hidden="true" />
        <a href="/" className="nav-logo error-logo" aria-label={t('homeLogoLabel')}>
          <img src="/assets/entropy_logo.svg" alt="_entropy" />
        </a>
        <div className="error-nav-actions">
          <LangMenu lang={lang} onChange={setLang} />
          <Toggle.Root
            className="theme-toggle"
            pressed={isLight}
            onPressedChange={toggleTheme}
            aria-label={themeLabel(lang, isLight)}
          >
            {isLight ? <SunIcon /> : <MoonIcon />}
          </Toggle.Root>
        </div>
      </header>

      <main className="error-main">
        <p className="error-eyebrow">{isError ? t('errorEyebrow') : t('notfoundEyebrow')}</p>
        <h1 className="error-title">{isError ? t('errorTitle') : t('notfoundTitle')}</h1>
      </main>

      <footer className="error-footer">
        {isError ? (
          <>
            <p>{t('errorMsg1')}</p>
            <p>
              <span>{t('errorMsg2Pre')}</span>
              <a className="error-footer-link" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
            </p>
          </>
        ) : (
          <>
            <p>{t('notfoundMsg1')}</p>
            <p>
              <span>{t('notfoundMsg2Pre')}</span>
              <a className="error-footer-link" href="/">
                {t('backHome')}
              </a>
              <span>{t('notfoundMsg2Post')}</span>
            </p>
          </>
        )}
      </footer>
    </div>
  );
}
