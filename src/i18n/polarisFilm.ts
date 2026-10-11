import type { Lang } from '../hooks/useI18n'

type Pair = { big: string; small: string }
type DayPlan = { label: string; title: string; items: string[] }
type Track = { name: string; note: string }
type Side = { title: string; owner: string; status: string }

export type FilmCopy = {
  lead: string
  ctaStart: string
  ctaPartner: string
  status: string
  statusNote: string
  glance: Pair[]
  chapters: string[]
  daysHead: string
  daysSub: string
  hoursLabel: string
  dayPlans: DayPlan[]
  tracksTitle: string
  tracks: Track[]
  daysTagsLabel: string
  daysTags: string[]
  leaveNote: string
  whoHead: string
  whoCards: Pair[]
  teamCaption: string
  applyStepsTitle: string
  applySteps: string
  makeHead: string
  makeSub: string
  theme: Side
  challenge: Side
  merge: string
  challengeNote: string
  siteHead: string
  zonesTitle: string
  zoneStates: string[]
  lifeHead: string
  sleepExtra: string
  foodExtra: string
  travelExtra: string
  applyTitle: string
  applyBody: string
  faqTitle: string
  partnerTitle: string
}

export const filmCopy: Record<Lang, FilmCopy> = {
  zh: {
    lead: '2027 年，我们在香港留出五天，给所有想动手的人。',
    ctaStart: '看看这五天',
    ctaPartner: '参与合作',
    status: '筹备中',
    statusNote: '日期、场地及报名安排将陆续公布。',
    glance: [
      { big: '免费参赛', small: '不收报名费，不限年龄与学历' },
      { big: '两人一间', small: '和住宿搭档共享房间，从锁定起每 12 小时轮换' },
      { big: '三餐与饮品', small: '现场为正式选手免费提供，也在筹备热食' },
      { big: '交通补贴', small: '按通常居住地与获批额度主动申请，含香港本地交通' },
    ],
    chapters: ['五天安排', '谁可以来', '议题与挑战', '现场', '吃住行', '报名'],
    daysHead: '五天怎么过',
    daysSub: 'Day 1 中午签到，Day 5 拟定中午 12:00 提交。构建、现场活动和公众交流贯穿五日。',
    hoursLabel: '五日进度',
    dayPlans: [
      { label: 'Day 1', title: '相遇，开工', items: ['中午开始签到', '认识伙伴，组成队伍', '定下想做的事'] },
      { label: 'Day 2–4', title: '让想法成形', items: ['构建、测试、修改', '按需要参加工作坊、请教导师', '邀请别人体验你的作品', '走进香港，带着新的观察回来'] },
      { label: 'Day 5', title: '作品登场', items: ['中午 12:00 截止提交（拟定）', '下午作品展示与评审', '晚间颁奖、交流后散场'] },
    ],
    tracksTitle: '贯穿五日',
    tracks: [
      { name: '构建', note: '五天都可以做项目' },
      { name: '分享 · 工作坊 · 导师交流 · 作品体验', note: '穿插进行，按兴趣和进度选择' },
      { name: '游客开放', note: '登记后免费进入开放区域，夜间也可来访' },
    ],
    daysTagsLabel: '可以从这些开始',
    daysTags: ['软件', '硬件', '游戏', '艺术', '交互实验'],
    leaveNote: '你不必一直留在会场。可以离场休息或探索香港，正常离场不视为退出活动；请与队友保持沟通，并按安排完成提交与展示。',
    whoHead: '谁可以来，怎么报名',
    whoCards: [
      { big: '不限年龄与学历', small: '没有门槛，看的是你想做什么。' },
      { big: '第一次也欢迎', small: '从没参加过黑客松，也可以申请。' },
      { big: '一个人或一起', small: '可以独自报名到现场组队，也可以和认识的队友一起申请。' },
      { big: '未成年人可申请', small: '具体参与安排及所需材料，将在正式报名规则中说明。' },
    ],
    teamCaption: '一个人来，也能在现场找到队友。',
    applyStepsTitle: '报名开放后',
    applySteps: '填写申请表|面试，聊聊你的想法|成为正式选手',
    makeHead: '做什么：议题与挑战',
    makeSub: '议题由主办方发起，挑战由合作方带来，具体内容都将陆续公布。一个项目可以同时回应多个议题、参加多个挑战。',
    theme: { title: '议题', owner: '由主办方发起', status: '陆续公布' },
    challenge: { title: '挑战', owner: '由合作方带来', status: '陆续公布' },
    merge: '一件作品，可以同时回应多个议题、参加多个挑战。',
    challengeNote: '挑战由参与者自愿选择。具体题目、资源和奖项将随挑战一同公布。',
    siteHead: '现场有什么',
    zonesTitle: '三个区域，谁能进哪里',
    zoneStates: ['游客可进入', '需选手邀请', '仅限选手'],
    lifeHead: '吃、住、行，怎么安排',
    sleepExtra: '活动结束当晚如无法返程，可联系主办方咨询额外住宿选择，费用与安排另行说明。',
    foodExtra: '自行选择在外用餐的费用由个人承担。',
    travelExtra: '粤港澳范围内，获批路线的高铁二等座往返全额支持；其他地区按获批额度设上限。',
    applyTitle: '报名还没开放。\n先把五天留出来。',
    applyBody: '现在可以先注册 _entropy Passport，报名开放后用它提交申请；也可以关注活动进展，第一时间收到消息。',
    faqTitle: '还有疑问？',
    partnerTitle: '想一起让这五天更好？',
  },
  'zh-Hant': {
    lead: '2027 年，我們在香港留出五天，給所有想動手的人。',
    ctaStart: '看看這五天',
    ctaPartner: '參與合作',
    status: '籌備中',
    statusNote: '日期、場地及報名安排將陸續公布。',
    glance: [
      { big: '免費參賽', small: '不收報名費，不限年齡與學歷' },
      { big: '兩人一間', small: '和住宿搭檔共享房間，從鎖定起每 12 小時輪換' },
      { big: '三餐與飲品', small: '現場為正式選手免費提供，也在籌備熱食' },
      { big: '交通補貼', small: '按通常居住地與獲批額度主動申請，包括香港本地交通' },
    ],
    chapters: ['五天安排', '誰可以來', '議題與挑戰', '現場', '吃住行', '報名'],
    daysHead: '五天怎麼過',
    daysSub: 'Day 1 中午報到，Day 5 擬定中午 12:00 提交。構建、現場活動和公眾交流貫穿五日。',
    hoursLabel: '五日進度',
    dayPlans: [
      { label: 'Day 1', title: '相遇，開工', items: ['中午開始報到', '認識伙伴，組成隊伍', '定下想做的事'] },
      { label: 'Day 2–4', title: '讓想法成形', items: ['構建、測試、修改', '按需要參加工作坊、請教導師', '邀請別人體驗你的作品', '走進香港，帶着新的觀察回來'] },
      { label: 'Day 5', title: '作品登場', items: ['中午 12:00 截止提交（擬定）', '下午作品展示與評審', '晚間頒獎、交流後散場'] },
    ],
    tracksTitle: '貫穿五日',
    tracks: [
      { name: '構建', note: '五天都可以做項目' },
      { name: '分享 · 工作坊 · 導師交流 · 作品體驗', note: '穿插進行，按興趣和進度選擇' },
      { name: '遊客開放', note: '登記後免費進入開放區域，夜間也可到訪' },
    ],
    daysTagsLabel: '可以從這些開始',
    daysTags: ['軟件', '硬件', '遊戲', '藝術', '互動實驗'],
    leaveNote: '你不必一直留在會場。可以離場休息或探索香港，正常離場不視為退出活動；請與隊友保持溝通，並按安排完成提交與展示。',
    whoHead: '誰可以來，怎麼報名',
    whoCards: [
      { big: '不限年齡與學歷', small: '沒有門檻，看的是你想做甚麼。' },
      { big: '第一次也歡迎', small: '從沒參加過黑客松，也可以申請。' },
      { big: '一個人或一起', small: '可以獨自報名到現場組隊，也可以和認識的隊友一起申請。' },
      { big: '未成年人可申請', small: '具體參與安排及所需材料，將在正式報名規則中說明。' },
    ],
    teamCaption: '一個人來，也能在現場找到隊友。',
    applyStepsTitle: '報名開放後',
    applySteps: '填寫申請表|面試，聊聊你的想法|成為正式選手',
    makeHead: '做甚麼：議題與挑戰',
    makeSub: '議題由主辦方發起，挑戰由合作方帶來，具體內容都將陸續公布。一個項目可以同時回應多個議題、參加多個挑戰。',
    theme: { title: '議題', owner: '由主辦方發起', status: '陸續公布' },
    challenge: { title: '挑戰', owner: '由合作方帶來', status: '陸續公布' },
    merge: '一件作品，可以同時回應多個議題、參加多個挑戰。',
    challengeNote: '挑戰由參與者自願選擇。具體題目、資源和獎項將隨挑戰一同公布。',
    siteHead: '現場有甚麼',
    zonesTitle: '三個區域，誰能進哪裏',
    zoneStates: ['遊客可進入', '需選手邀請', '僅限選手'],
    lifeHead: '吃、住、行，怎麼安排',
    sleepExtra: '活動結束當晚如無法返程，可聯絡主辦方查詢額外住宿選擇，費用與安排另行說明。',
    foodExtra: '自行選擇在外用餐的費用由個人承擔。',
    travelExtra: '粵港澳範圍內，獲批路線的高鐵二等座往返全額支持；其他地區按獲批額度設上限。',
    applyTitle: '報名還沒開放。\n先把五天留出來。',
    applyBody: '現在可以先註冊 _entropy Passport，報名開放後用它提交申請；也可以關注活動進展，第一時間收到消息。',
    faqTitle: '還有疑問？',
    partnerTitle: '想一起讓這五天更好？',
  },
  en: {
    lead: 'In 2027 we are setting aside five days in Hong Kong for anyone who wants to build.',
    ctaStart: 'See the five days',
    ctaPartner: 'Partner with us',
    status: 'In preparation',
    statusNote: 'Dates, venue and application details will be announced.',
    glance: [
      { big: 'Free to take part', small: 'No entry fee, no age or education requirements' },
      { big: 'Shared rooms', small: 'Share with a partner in 12-hour turns from when the room is locked in' },
      { big: 'Meals and drinks', small: 'Free on site for confirmed participants, hot dishes in the works' },
      { big: 'Travel support', small: 'Request it based on your usual residence and approved limit, local travel included' },
    ],
    chapters: ['Schedule', 'Who can come', 'Themes & challenges', 'On site', 'Food, rooms, travel', 'Apply'],
    daysHead: 'How the five days run',
    daysSub: 'Check-in at midday on day one; proposed submission at 12:00 noon on day five. Building, activities and public exchange run throughout.',
    hoursLabel: 'Five-day progress',
    dayPlans: [
      { label: 'Day 1', title: 'Meet and begin', items: ['Check-in opens at midday', 'Meet people and form teams', 'Decide what to make'] },
      { label: 'Day 2–4', title: 'Give it shape', items: ['Build, test and refine', 'Join workshops, ask mentors when it helps', 'Invite others to try your work', 'Explore Hong Kong and bring back what you notice'] },
      { label: 'Day 5', title: 'Show your work', items: ['Proposed deadline 12:00 noon', 'Afternoon showcase and judging', 'Evening awards and conversations'] },
    ],
    tracksTitle: 'All five days',
    tracks: [
      { name: 'Building', note: 'Work on your project every day' },
      { name: 'Talks · workshops · mentors · demos', note: 'Run throughout; join by interest and progress' },
      { name: 'Open to visitors', note: 'Free registration for public areas, at night too' },
    ],
    daysTagsLabel: 'Places to start',
    daysTags: ['Software', 'Hardware', 'Games', 'Art', 'Interactive experiments'],
    leaveNote: 'You do not have to stay at the venue. Leave to rest or explore Hong Kong; leaving normally does not count as withdrawing. Stay in touch with your team and meet the submission and showcase schedule.',
    whoHead: 'Who can come, and how to apply',
    whoCards: [
      { big: 'Any age, any background', small: 'No entry requirements. What matters is what you want to make.' },
      { big: 'First-timers welcome', small: 'Never been to a hackathon? You can still apply.' },
      { big: 'Alone or together', small: 'Apply on your own and form a team on site, or apply with teammates you know.' },
      { big: 'Minors can apply', small: 'Arrangements and required documents will be set out in the official application rules.' },
    ],
    teamCaption: 'Come alone and find teammates on site.',
    applyStepsTitle: 'Once applications open',
    applySteps: 'Fill in the application form|An interview about your ideas|Become a confirmed participant',
    makeHead: 'What to make: themes and challenges',
    makeSub: 'Themes come from the organisers and challenges from partners; both will be announced. One project can respond to several themes and take on several challenges.',
    theme: { title: 'Themes', owner: 'From the organisers', status: 'Coming soon' },
    challenge: { title: 'Challenges', owner: 'From partners', status: 'Coming soon' },
    merge: 'One project can respond to several themes and take on several challenges.',
    challengeNote: 'Challenges are optional. Briefs, resources and awards will be announced with each challenge.',
    siteHead: 'What happens on site',
    zonesTitle: 'Three areas, and who can enter',
    zoneStates: ['Visitors welcome', 'By invitation', 'Participants only'],
    lifeHead: 'Food, rooms and travel',
    sleepExtra: 'If you cannot travel home on the final evening, contact the organisers about additional accommodation. Costs and arrangements will be explained separately.',
    foodExtra: 'If you choose to eat elsewhere, you cover those costs yourself.',
    travelExtra: 'Within Guangdong, Hong Kong and Macao, return second-class high-speed rail on approved routes is fully supported; other regions have approved caps.',
    applyTitle: 'Applications are not open yet.\nKeep the five days free.',
    applyBody: 'Sign up for _entropy Passport now and use it to apply when applications open, or follow event updates to hear first.',
    faqTitle: 'Still wondering?',
    partnerTitle: 'Help make these five days better.',
  },
}
