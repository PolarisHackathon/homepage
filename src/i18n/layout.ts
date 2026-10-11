import type { Lang } from '../hooks/useI18n'

const text = {
  publicRule: ['游客免费登记，夜间也可来访。', '遊客免費登記，夜間也可到訪。', 'Visitors register for free and can visit at night.'],
  buildRule: ['选手在这里构建作品。游客需由选手带领或邀请。', '選手在這裏構建作品。遊客須由選手帶領或邀請。', 'Participants build here. Visitors enter with a participant’s invitation.'],
  restRule: ['仅供选手使用。', '僅供選手使用。', 'For participants only.'],
  followTitle: ['选择你习惯的方式', '選擇你習慣的方式', 'Follow in your own way'],
  followClose: ['关闭关注选项', '關閉關注選項', 'Close follow options'],
  followChannels: ['关注渠道', '關注渠道', 'Follow channels'],
  visitX: ['在 X 查看活动更新', '在 X 查看活動更新', 'See updates on X'],
  visitInstagram: ['在 Instagram 查看活动更新', '在 Instagram 查看活動更新', 'See updates on Instagram'],
  wechat: ['微信', '微信', 'WeChat'],
  wechatHint: ['扫描二维码，关注熵序微信公众号。', '掃描二維碼，關注熵序微信公眾號。', 'Scan the QR code to follow Entropy on WeChat.'],
  wechatLink: ['打开公众号入口', '開啟公眾號入口', 'Open the WeChat page'],
  channelSoon: ['关注入口将另行公布。', '關注入口將另行公布。', 'The follow link will be announced.'],
  newsletterSoon: ['电子邮件更新的订阅安排将另行公布。', '電郵更新的訂閱安排將另行公布。', 'Email update subscriptions will be announced.'],
  newsletterLink: ['订阅电子邮件更新', '訂閱電郵更新', 'Subscribe to email updates'],
  illustration: ['场景示意', '場景示意', 'Scene illustration'],
  modelLabel: ['可旋转的三维场景', '可旋轉的三維場景', 'Rotatable 3D scene'],
  modelHelp: ['左右拖动或使用方向键旋转', '左右拖動或使用方向鍵旋轉', 'Drag sideways or use the arrow keys to rotate'],
  modelLeft: ['向左旋转', '向左旋轉', 'Rotate left'],
  modelRight: ['向右旋转', '向右旋轉', 'Rotate right'],
  modelReset: ['恢复视角', '還原視角', 'Reset view'],
  modelUnavailable: ['已切换为二维场景。', '已切換為二維場景。', 'Showing the 2D illustration.'],
  visualMode: ['选择场景视图', '選擇場景視圖', 'Choose the scene view'],
  modelRoom: ['双人房间场景示意', '雙人房間場景示意', 'Shared room concept'],
  modelWorkbench: ['创作桌面场景示意', '創作桌面場景示意', 'Creative workbench concept'],
  modelMeal: ['餐食与饮品场景示意', '餐食與飲品場景示意', 'Meals and drinks concept'],
  modelDemo: ['作品体验场景示意', '作品體驗場景示意', 'Project experience concept'],
} satisfies Record<string, [string, string, string]>

export const layoutCopy = Object.fromEntries((['zh', 'zh-Hant', 'en'] as Lang[]).map((lang, index) => [lang,
  Object.fromEntries(Object.entries(text).map(([key, values]) => [key, values[index]])),
])) as Record<Lang, Record<keyof typeof text, string>>
