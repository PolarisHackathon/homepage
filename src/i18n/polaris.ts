import type { Lang } from '../hooks/useI18n'

type Fact = { title: string; body: string }
type PolarisCopy = { factsLabel: string; facts: Fact[]; factsLink: string; dayLabels: [string, string, string] }

export const polarisCopy: Record<Lang, PolarisCopy> = {
  zh: {
    factsLabel: '参加这五天',
    facts: [
      { title: '免费参赛', body: '不限年龄与学历，第一次参加黑客松也可以申请。' },
      { title: '双人住宿', body: '两位选手共享房间，从锁定起 12 小时轮换。' },
      { title: '免费三餐', body: '现场为正式选手提供三餐与饮品。' },
      { title: '交通补贴', body: '按通常居住地与获批额度申请，包括香港本地交通。' },
    ],
    factsLink: '了解生活支持',
    dayLabels: ['Day 1', 'Day 2–4', 'Day 5'],
  },
  'zh-Hant': {
    factsLabel: '參加這五天',
    facts: [
      { title: '免費參賽', body: '不限年齡與學歷，第一次參加黑客松也可以申請。' },
      { title: '雙人住宿', body: '兩位選手共享房間，從鎖定起 12 小時輪換。' },
      { title: '免費三餐', body: '現場為正式選手提供三餐與飲品。' },
      { title: '交通補貼', body: '按通常居住地與獲批額度申請，包括香港本地交通。' },
    ],
    factsLink: '了解生活支持',
    dayLabels: ['Day 1', 'Day 2–4', 'Day 5'],
  },
  en: {
    factsLabel: 'Your five days',
    facts: [
      { title: 'Free to take part', body: 'Any age or background. First hackathon? You can still apply.' },
      { title: 'Shared rooms', body: 'Two participants share a room in 12-hour turns from the time it is locked.' },
      { title: 'Free meals', body: 'Three meals a day and drinks on site for confirmed participants.' },
      { title: 'Travel support', body: 'Request it based on your usual residence and approved limit, including local travel in Hong Kong.' },
    ],
    factsLink: 'See living support',
    dayLabels: ['Day 1', 'Day 2–4', 'Day 5'],
  },
}
