import type { Lang } from '../hooks/useI18n'

export const faqs: Record<Lang, { q: string; a: string }[]> = {
  zh: [
    { q: '我需要一直留在会场吗？', a: '不需要。你可以离场休息或探索香港，请与队友保持沟通，并按安排完成作品提交与展示。正常离场不视为退出活动。' },
    { q: '可以一个人申请吗？', a: '可以。你可以提前寻找伙伴，也可以到现场再组队。报名及组队安排将在申请开放时公布。' },
    { q: '未成年人可以申请吗？', a: '可以。具体参与安排及需要提供的材料，将在正式报名规则中说明。' },
    { q: '住宿怎样安排？', a: '主办方安排住宿，面向全体正式选手。两人组成住宿搭档，在有空房时申请房间，每次使用时段为锁定起的 12 小时，采用轮换方式。\n\n活动结束当晚如无法返程，可以联系主办方咨询额外住宿选择，费用与安排另行说明。' },
    { q: '交通补贴怎样计算？', a: '交通补贴需要主动申请，按通常居住地、获批路线及额度计算。香港本地往返会场的交通同样可以申请。粤港澳范围内，符合获批路线的高铁二等座往返费用全额支持；其他地区按获批额度设上限，全额资助也受获批范围约束。路线与金额将在获批时说明。\n\n获批后可以提前预支，活动后需提交购票及支付等凭证核销。' },
    { q: '现场以外的餐饮可以报销吗？', a: '会场内提供选手免费膳食。自行选择在外用餐的费用由个人承担。' },
    { q: '游客怎样参加？', a: '游客免费登记后可进入开放区域，夜间也可以来访。进入选手构建区需要选手带领或邀请，选手专属休息区不向游客开放。\n\n游客可以在餐饮摊位自费消费。登记方式将在开放前公布。' },
    { q: '提交之后，还能修复展示故障吗？', a: '可以，但需要记录修改，并向评审说明。评议将区分截止时提交的成果与之后的变更，具体记录要求将在参赛规则中公布。' },
    { q: '如果临时无法继续参加怎么办？', a: '请及时联系主办方。医疗、家庭紧急情况等会结合实际情况处理；资助核销、退出及相关费用安排将在资助须知中说明。' },
  ],
  'zh-Hant': [
    { q: '我需要一直留在會場嗎？', a: '不需要。你可以離場休息或探索香港，請與隊友保持溝通，並按安排完成作品提交與展示。正常離場不視為退出活動。' },
    { q: '可以一個人申請嗎？', a: '可以。你可以提前尋找伙伴，也可以到現場再組隊。報名及組隊安排將在申請開放時公布。' },
    { q: '未成年人可以申請嗎？', a: '可以。具體參與安排及需要提供的材料，將在正式報名規則中說明。' },
    { q: '住宿怎樣安排？', a: '主辦方安排住宿，面向全體正式選手。兩人組成住宿搭檔，在有空房時申請房間，每次使用時段為鎖定起的 12 小時，採用輪換方式。\n\n活動結束當晚如無法返程，可以聯絡主辦方查詢額外住宿選擇，費用與安排另行說明。' },
    { q: '交通補貼怎樣計算？', a: '交通補貼需要主動申請，按通常居住地、獲批路線及額度計算。香港本地往返會場的交通同樣可以申請。粵港澳範圍內，符合獲批路線的高鐵二等座往返費用全額支持；其他地區按獲批額度設上限，全額資助亦受獲批範圍約束。路線與金額將在獲批時說明。\n\n獲批後可以提前預支，活動後需提交購票及支付等憑證核銷。' },
    { q: '現場以外的餐飲可以報銷嗎？', a: '會場內提供選手免費膳食。自行選擇在外用餐的費用由個人承擔。' },
    { q: '遊客怎樣參加？', a: '遊客免費登記後可進入開放區域，夜間也可以來訪。進入選手構建區需要選手帶領或邀請，選手專屬休息區不向遊客開放。\n\n遊客可以在餐飲攤位自費消費。登記方式將在開放前公布。' },
    { q: '提交之後，還能修復展示故障嗎？', a: '可以，但需要記錄修改，並向評審說明。評議將區分截止時提交的成果與之後的變更，具體記錄要求將在參賽規則中公布。' },
    { q: '如果臨時無法繼續參加怎麼辦？', a: '請及時聯絡主辦方。醫療、家庭緊急情況等會結合實際情況處理；資助核銷、退出及相關費用安排將在資助須知中說明。' },
  ],
  en: [
    { q: 'Do I have to stay at the venue throughout?', a: 'No. You may leave to rest or explore Hong Kong. Stay in touch with your teammates and meet the submission and showcase schedule. Leaving normally does not count as withdrawing from the event.' },
    { q: 'Can I apply on my own?', a: 'Yes. You can find teammates beforehand or form a team at the event. Application and team formation details will be published when applications open.' },
    { q: 'Can minors apply?', a: 'Yes. Participation arrangements and required documents will be specified in the official application rules.' },
    { q: 'How does accommodation work?', a: 'Accommodation is arranged for all confirmed participants. Two participants form a room-sharing pair and request a room when one is available. Each slot lasts 12 hours from the time it is locked in, on a rotating basis.\n\nIf you cannot travel home on the final evening, contact the organisers about additional accommodation options. Costs and arrangements will be explained separately.' },
    { q: 'How are travel subsidies calculated?', a: 'Travel support is available by request, based on your usual residence, approved route and funding limit. Local journeys to and from the venue within Hong Kong are also eligible for consideration. Within Guangdong, Hong Kong and Macao, return second-class high-speed rail fares on approved routes are fully supported. Other regions have approved funding caps, which still apply to full funding. Your route and amount will be specified on approval.\n\nAn advance may be requested after approval. Ticket and payment records must be submitted after the event to reconcile expenses.' },
    { q: 'Can meals outside the venue be reimbursed?', a: 'Participants receive free meals at the venue. If you choose to eat elsewhere, you cover those costs yourself.' },
    { q: 'How can visitors attend?', a: 'Visitors can register free to enter public areas, including at night. A participant must accompany or invite you into the building area. Participant rest areas are not open to visitors.\n\nVisitors may buy food and drink from the stalls at their own expense. Registration details will be announced before opening.' },
    { q: 'Can I fix a demo problem after submission?', a: 'Yes, but changes must be recorded and explained to the judges. Reviews will distinguish the work submitted at the deadline from later changes. The event rules will specify how to record them.' },
    { q: 'What if I unexpectedly cannot continue?', a: 'Contact the organisers promptly. Medical and family emergencies will be considered according to the circumstances. Funding reconciliation, withdrawal and related costs will be explained in the funding guide.' },
  ],
}
