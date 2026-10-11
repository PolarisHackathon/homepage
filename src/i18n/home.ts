import type { Lang } from '../hooks/useI18n'

type HomeCopy = {
  featureStatus: string
  featureNote: string
  passportTitle: string
  passportBody: string
  passportCta: string
  passportDirect: string
  bookHolder: string
  bookHolderValue: string
  bookIssued: string
  bookNext: string
  bookAria: string
  partnerTitle: string
  partnerBody: string
  partnerCta: string
  joinTitle: string
  joinBody: string
  joinCta: string
  whisper: string
}

export const homeCopy: Record<Lang, HomeCopy> = {
  zh: {
    featureStatus: '筹备中',
    featureNote: '日期、场地及报名安排将陆续公布。',
    passportTitle: '一个账号，\n走过每一场活动。',
    passportBody: '报名、日程和你做过的作品，都记在同一本 Passport 里。现在就可以用它申请 Hackathon polaris 2027。',
    passportCta: '了解 Passport',
    passportDirect: '已有账号？前往 _entropy Passport',
    bookHolder: '持有人',
    bookHolderValue: '你',
    bookIssued: '签发',
    bookNext: '下一场',
    bookAria: '一本打开的 _entropy Passport，内页盖着 Hackathon polaris 2027 的印章，旁边留有下一场活动的空位。',
    partnerTitle: '合作',
    partnerBody: '带来一个挑战、一场工作坊，或者一起把现场搭起来。',
    partnerCta: '聊聊合作',
    joinTitle: '加入熵序',
    joinBody: '活动设计、开发、视觉、现场，想参与哪一部分都可以来信。',
    joinCta: '写信给我们',
    whisper: '熵序是一个由青年创作者组成的团队。',
  },
  'zh-Hant': {
    featureStatus: '籌備中',
    featureNote: '日期、場地及報名安排將陸續公布。',
    passportTitle: '一個帳號，\n走過每一場活動。',
    passportBody: '報名、日程和你做過的作品，都記在同一本 Passport 裏。現在就可以用它申請 Hackathon polaris 2027。',
    passportCta: '了解 Passport',
    passportDirect: '已有帳號？前往 _entropy Passport',
    bookHolder: '持有人',
    bookHolderValue: '你',
    bookIssued: '簽發',
    bookNext: '下一場',
    bookAria: '一本打開的 _entropy Passport，內頁蓋着 Hackathon polaris 2027 的印章，旁邊留有下一場活動的空位。',
    partnerTitle: '合作',
    partnerBody: '帶來一個挑戰、一場工作坊，或者一起把現場搭起來。',
    partnerCta: '聊聊合作',
    joinTitle: '加入熵序',
    joinBody: '活動設計、開發、視覺、現場，想參與哪一部分都可以來信。',
    joinCta: '寫信給我們',
    whisper: '熵序是一個由青年創作者組成的團隊。',
  },
  en: {
    featureStatus: 'In preparation',
    featureNote: 'Dates, venue and application details will be announced.',
    passportTitle: 'One account,\nevery event you go to.',
    passportBody: 'Your applications, schedule and the things you build live in one Passport. Use it now to apply for Hackathon polaris 2027.',
    passportCta: 'About Passport',
    passportDirect: 'Have an account? Go to _entropy Passport',
    bookHolder: 'Holder',
    bookHolderValue: 'You',
    bookIssued: 'Issued',
    bookNext: 'Next',
    bookAria: 'An open _entropy Passport with a Hackathon polaris 2027 stamp on its page and an empty space for the next event.',
    partnerTitle: 'Partner with us',
    partnerBody: 'Bring a challenge, run a workshop or help us build the venue experience.',
    partnerCta: 'Talk about a partnership',
    joinTitle: 'Join Entropy',
    joinBody: 'Event design, development, visuals, the venue. Write to us about the part you want to work on.',
    joinCta: 'Write to us',
    whisper: 'Entropy is a team of young creators.',
  },
}
