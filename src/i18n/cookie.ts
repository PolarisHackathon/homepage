import type { Lang } from '../hooks/useI18n';

const zh = {
  ariaLabel: 'Cookie 与数据使用提示',
  title: 'Cookie 与数据使用',
  message:
    '我们用 Cookie 及类似技术做性能监测、错误收集、使用情况分析和网站优化，用来持续改善你的访问。这些数据只在你同意之后，才由网站脚本收集。你的选择保存在这台浏览器里。',
  accept: '接受',
  decline: '拒绝',
} as const;

type CookieKey = keyof typeof zh;

const hant: Record<CookieKey, string> = {
  ariaLabel: 'Cookie 與資料使用提示',
  title: 'Cookie 與資料使用',
  message:
    '我們使用 Cookie 及類似技術做效能監察、錯誤收集、使用情況分析和網站優化，以便持續改善你的訪問體驗。相關資料只會在你同意後經網站程式收集，你的選擇會保存在這部瀏覽器裡。',
  accept: '接受',
  decline: '拒絕',
};

const en: Record<CookieKey, string> = {
  ariaLabel: 'Cookie and data usage notice',
  title: 'Cookies and data use',
  message:
    'We use cookies and similar technologies for performance monitoring, error collection, usage analysis, and site improvement. Data is collected by site scripts only after you agree. Your choice stays in this browser.',
  accept: 'Accept',
  decline: 'Decline',
};

export const cookieI18n: Record<Lang, Record<CookieKey, string>> = {
  zh,
  'zh-Hant': hant,
  en,
};

export type CookieI18nKey = CookieKey;
