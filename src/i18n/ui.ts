import type { Lang } from '../hooks/useI18n';

const zh = {
  home: '首页',
  about: '关于熵序',
  polaris: '极星黑客松',
  langMenu: '选择语言',
  langZh: '简体中文',
  langHant: '繁體中文',
  langEn: 'English',
  langShortZh: '简体',
  langShortHant: '繁體',
  langShortEn: 'EN',
  themeToLight: '切换为浅色主题',
  themeToDark: '切换为深色主题',
  openMenu: '打开菜单',
  closeMenu: '关闭菜单',
  mainNav: '主导航',
  mobileNav: '移动端导航',
  scrollTop: '回到顶部',
  switched: '已切换至简体中文',
} as const;

type UiKey = keyof typeof zh;

const hant: Record<UiKey, string> = {
  home: '首頁',
  about: '關於熵序',
  polaris: '極星黑客松',
  langMenu: '選擇語言',
  langZh: '简体中文',
  langHant: '繁體中文',
  langEn: 'English',
  langShortZh: '简体',
  langShortHant: '繁體',
  langShortEn: 'EN',
  themeToLight: '切換為淺色主題',
  themeToDark: '切換為深色主題',
  openMenu: '開啟選單',
  closeMenu: '關閉選單',
  mainNav: '主導航',
  mobileNav: '流動版導航',
  scrollTop: '回到頂部',
  switched: '已切換至繁體中文',
};

const en: Record<UiKey, string> = {
  home: 'Home',
  about: 'About Entropy',
  polaris: 'Polaris',
  langMenu: 'Choose language',
  langZh: '简体中文',
  langHant: '繁體中文',
  langEn: 'English',
  langShortZh: '简体',
  langShortHant: '繁體',
  langShortEn: 'EN',
  themeToLight: 'Switch to light theme',
  themeToDark: 'Switch to dark theme',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mainNav: 'Main',
  mobileNav: 'Mobile',
  scrollTop: 'Back to top',
  switched: 'Switched to English',
};

export const uiI18n: Record<Lang, Record<UiKey, string>> = {
  zh,
  'zh-Hant': hant,
  en,
};

export function themeLabel(lang: Lang, isLight: boolean): string {
  return isLight ? uiI18n[lang].themeToDark : uiI18n[lang].themeToLight;
}

export function langSwitchMessage(lang: Lang): string {
  return uiI18n[lang].switched;
}
