import type { Lang } from '../hooks/useI18n'

type Feature = { title: string; body: string }
type PassportCopy = {
  title: string
  body: string
  go: string
  note: string
  featuresTitle: string
  features: Feature[]
  closingTitle: string
  closingBody: string
  bookHolder: string
  bookHolderValue: string
  bookIssued: string
  bookNext: string
  bookAria: string
}

export const passportCopy: Record<Lang, PassportCopy> = {
  zh: {
    title: '一个账号，\n走过每一场活动。',
    body: 'Passport 是你在熵序活动里的账号和身份页。报名、日程、队伍和你做过的作品，都记在这里。',
    go: '前往 _entropy Passport',
    note: '注册免费。现在可以用它申请 Hackathon polaris 2027。',
    featuresTitle: '现在可以用它做什么',
    features: [
      { title: '申请活动', body: '资料可以随时保存，回来接着填。提交之后，在这里查看申请状态。' },
      { title: '活动信息', body: '日程、场地、交通和公告集中在一处，新的通知会发到你的信箱。' },
      { title: '队伍和项目', body: '邀请队友加入，把你们的作品关联到议题和挑战。' },
      { title: '住宿与交通', body: '找住宿搭档、申请交通补贴，都在同一个账号里完成。' },
      { title: '你的资料由你决定', body: '联系方式逐项授权，随时可以撤回。也可以申请注销账号。' },
    ],
    closingTitle: '以后的活动，\n也用同一个账号。',
    closingBody: '你参加过的活动会留在 Passport 里，不用每次重新注册。',
    bookHolder: '持有人',
    bookHolderValue: '你',
    bookIssued: '签发',
    bookNext: '下一场',
    bookAria: '一本打开的 _entropy Passport，内页盖着 Hackathon polaris 2027 的印章，旁边留有下一场活动的空位。',
  },
  'zh-Hant': {
    title: '一個帳號，\n走過每一場活動。',
    body: 'Passport 是你在熵序活動裏的帳號和身份頁。報名、日程、隊伍和你做過的作品，都記在這裏。',
    go: '前往 _entropy Passport',
    note: '註冊免費。現在可以用它申請 Hackathon polaris 2027。',
    featuresTitle: '現在可以用它做甚麼',
    features: [
      { title: '申請活動', body: '資料可以隨時儲存，回來接着填。提交之後，在這裏查看申請狀態。' },
      { title: '活動資訊', body: '日程、場地、交通和公告集中在一處，新的通知會發到你的信箱。' },
      { title: '隊伍和項目', body: '邀請隊友加入，把你們的作品關聯到議題和挑戰。' },
      { title: '住宿與交通', body: '找住宿搭檔、申請交通補貼，都在同一個帳號裏完成。' },
      { title: '你的資料由你決定', body: '聯絡方式逐項授權，隨時可以撤回。也可以申請註銷帳號。' },
    ],
    closingTitle: '之後的活動，\n也用同一個帳號。',
    closingBody: '你參加過的活動會留在 Passport 裏，不用每次重新註冊。',
    bookHolder: '持有人',
    bookHolderValue: '你',
    bookIssued: '簽發',
    bookNext: '下一場',
    bookAria: '一本打開的 _entropy Passport，內頁蓋着 Hackathon polaris 2027 的印章，旁邊留有下一場活動的空位。',
  },
  en: {
    title: 'One account,\nevery event you go to.',
    body: 'Passport is your account and profile for Entropy events. Your applications, schedule, team and the things you build all live here.',
    go: 'Go to _entropy Passport',
    note: 'Free to sign up. Use it now to apply for Hackathon polaris 2027.',
    featuresTitle: 'What you can do with it now',
    features: [
      { title: 'Apply to events', body: 'Save your answers and come back to finish later. After you submit, check your application status here.' },
      { title: 'Event information', body: 'Schedule, venue, travel and announcements in one place, with new notices sent to your inbox.' },
      { title: 'Teams and projects', body: 'Invite teammates and link your project to themes and challenges.' },
      { title: 'Stay and travel', body: 'Find a room partner and request travel support from the same account.' },
      { title: 'You decide what is shared', body: 'Approve each contact detail one by one and withdraw at any time. You can also ask to delete your account.' },
    ],
    closingTitle: 'Future events,\nthe same account.',
    closingBody: 'The events you join stay in your Passport, so you never sign up from scratch again.',
    bookHolder: 'Holder',
    bookHolderValue: 'You',
    bookIssued: 'Issued',
    bookNext: 'Next',
    bookAria: 'An open _entropy Passport with a Hackathon polaris 2027 stamp on its page and an empty space for the next event.',
  },
}
