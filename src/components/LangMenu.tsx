import type { Lang } from '../hooks/useI18n';
import { uiI18n } from '../i18n/ui';
import { Button } from './Button';

const options: Lang[] = ['zh', 'zh-Hant', 'en'];

export function LangMenu({
  lang,
  onChange,
  tabIndex = 0,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
  tabIndex?: number;
}) {
  const ui = uiI18n[lang];
  const labels: Record<Lang, string> = {
    zh: ui.langShortZh,
    'zh-Hant': ui.langShortHant,
    en: ui.langShortEn,
  };

  return (
    <div className="lang-menu" role="group" aria-label={ui.langMenu}>
      {options.map((option) => (
        <Button
          key={option}
          className={`lang-toggle${option === lang ? ' is-current' : ''}`}
          aria-pressed={option === lang}
          tabIndex={tabIndex}
          onClick={() => { onChange(option); }}
        >
          {labels[option]}
        </Button>
      ))}
    </div>
  );
}
