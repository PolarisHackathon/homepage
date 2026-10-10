import { useCallback, useEffect, useState } from 'react';

export type Lang = 'zh' | 'zh-Hant' | 'en';

type DictPair<K extends string> = Record<Lang, Record<K, string>>;

function normalizeLang(value: string | null | undefined): Lang | null {
  if (!value) return null;
  const v = value.trim().toLowerCase().replace(/_/g, '-');
  if (v === 'zh' || v === 'zh-cn' || v === 'zh-hans' || v === 'zh-sg') return 'zh';
  if (v === 'zh-hant' || v === 'zh-hk' || v === 'zh-tw' || v === 'zh-mo') return 'zh-Hant';
  if (v === 'en' || v.startsWith('en-')) return 'en';
  return null;
}

export function toHtmlLang(lang: Lang): string {
  if (lang === 'en') return 'en';
  if (lang === 'zh-Hant') return 'zh-HK';
  return 'zh-CN';
}

function readInitialLang(): Lang {
  try {
    const fromUrl = normalizeLang(new URLSearchParams(window.location.search).get('lang'));
    if (fromUrl) return fromUrl;
  } catch {
    // 无效查询串时继续看已保存的偏好
  }
  try {
    const saved = normalizeLang(localStorage.getItem('langPref'));
    if (saved) return saved;
  } catch {
    // 隐私模式读不到存储时改用浏览器语言
  }
  const browserLangs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const candidate of browserLangs) {
    const matched = normalizeLang(candidate);
    if (matched) return matched;
  }
  return 'zh';
}

function writeLangToUrl(lang: Lang) {
  const url = new URL(window.location.href);
  if (url.searchParams.get('lang') === lang) return;
  url.searchParams.set('lang', lang);
  window.history.replaceState(null, '', url);
}

export function useI18n<K extends string>(dict: DictPair<K>) {
  const [lang, setLangState] = useState<Lang>(() => {
    const initial = readInitialLang();
    document.documentElement.lang = toHtmlLang(initial);
    return initial;
  });

  useEffect(() => {
    document.documentElement.lang = toHtmlLang(lang);
    try {
      localStorage.setItem('langPref', lang);
    } catch {
      // 存不下时仍保持当前页面语言
    }
    try {
      const current = new URL(window.location.href).searchParams.get('lang');
      if (current && normalizeLang(current) === lang && current !== lang) writeLangToUrl(lang);
    } catch {
      // 地址不可解析时只保留页面内状态
    }
  }, [lang]);

  const t = useCallback((key: K): string => dict[lang][key], [dict, lang]);

  const setLang = useCallback((next: Lang) => {
    writeLangToUrl(next);
    setLangState(next);
  }, []);

  return { lang, t, setLang };
}
