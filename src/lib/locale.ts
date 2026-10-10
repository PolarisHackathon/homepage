import type { Lang } from '../hooks/useI18n';

export interface LocalizedText {
  zh: string;
  en: string;
  'zh-Hant'?: string;
}

export function localized(text: LocalizedText, lang: Lang): string {
  if (lang === 'zh-Hant') return text['zh-Hant'] || text.zh || text.en;
  if (lang === 'en') return text.en || text.zh;
  return text.zh || text.en;
}
