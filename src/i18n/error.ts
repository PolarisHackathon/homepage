import type { Lang } from '../hooks/useI18n';

const zh = {
  homeLogoLabel: '返回首页',
  errorEyebrow: '错误',
  errorTitle: '出了点问题',
  errorMsg1: '发生了一些问题，请稍后重试。',
  errorMsg2Pre: '如果问题依然存在，请联系 ',
  notfoundEyebrow: '404',
  notfoundTitle: '找不到这一页',
  notfoundMsg1: '你访问的页面不存在，或已经移走了。',
  notfoundMsg2Pre: '请检查网址，或',
  notfoundMsg2Post: '。',
  backHome: '返回首页',
} as const;

type ErrorKey = keyof typeof zh;

const hant: Record<ErrorKey, string> = {
  homeLogoLabel: '返回首頁',
  errorEyebrow: '錯誤',
  errorTitle: '出了點問題',
  errorMsg1: '出了些問題，請稍後再試。',
  errorMsg2Pre: '如果問題仍然存在，請聯絡 ',
  notfoundEyebrow: '404',
  notfoundTitle: '找不到這一頁',
  notfoundMsg1: '你開啟的頁面不存在，或已經移走。',
  notfoundMsg2Pre: '請核對網址，或',
  notfoundMsg2Post: '。',
  backHome: '返回首頁',
};

const en: Record<ErrorKey, string> = {
  homeLogoLabel: 'Back to home',
  errorEyebrow: 'Error',
  errorTitle: 'something went wrong',
  errorMsg1: 'Something went wrong. Please try again later.',
  errorMsg2Pre: 'If the problem persists, please contact ',
  notfoundEyebrow: '404',
  notfoundTitle: 'page not found',
  notfoundMsg1: 'The page you are looking for does not exist or has been moved.',
  notfoundMsg2Pre: 'Please check the address, or ',
  notfoundMsg2Post: '.',
  backHome: 'go back home',
};

export const errorI18n: Record<Lang, Record<ErrorKey, string>> = {
  zh,
  'zh-Hant': hant,
  en,
};

export type ErrorI18nKey = ErrorKey;
