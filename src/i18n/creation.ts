import type { Lang } from '../hooks/useI18n'

const text = {
  staticReading: ['切换为静态阅读', '切換為靜態閱讀', 'Read without motion'],
  animatedJourney: ['观看动态长卷', '觀看動態長卷', 'View the animated journey'],
  relationLabel: ['议题、项目与挑战的关系', '議題、項目與挑戰的關係', 'How themes, projects and challenges connect'],
  direction: ['创作方向', '創作方向', 'Creative directions'],
  directionBody: ['从议题中找到想探索的问题，也把自己的兴趣带进来。', '從議題中找到想探索的問題，也把自己的興趣帶進來。', 'Find a question to explore in a theme, and bring your own interests to it.'],
  projectJourney: ['构建 · 测试 · 展示', '構建 · 測試 · 展示', 'Build · Test · Share'],
  concreteProblems: ['具体问题', '具體問題', 'Specific problems'],
  problemsBody: ['按兴趣参与合作方的挑战，让作品回应真实的应用场景。', '按興趣參與合作方的挑戰，讓作品回應真實的應用場景。', 'Choose partner challenges that interest you, and explore real applications through your work.'],
  relationCaption: ['议题提供创作方向，挑战带来具体问题。你可以同时回应多个议题、参与多个挑战，构建自己的作品。', '議題提供創作方向，挑戰帶來具體問題。你可以同時回應多個議題、參與多個挑戰，構建自己的作品。', 'Themes provide creative directions; challenges bring specific problems. Your project can respond to multiple themes and take on multiple challenges.'],
  formatsTitle: ['多项具体挑战，\n两种参与方式。', '多項具體挑戰，\n兩種參與方式。', 'Many individual challenges.\nTwo ways to take part.'],
  formatsBody: ['我们正邀请不同的合作方带来挑战，具体题目将陆续公布。Sailboat 与 Cruise 对应不同的任务特点与参与过程；每项挑战都会说明采用的方式，你可以按兴趣和项目需要选择参加。', '我們正邀請不同的合作方帶來挑戰，具體題目將陸續公布。Sailboat 與 Cruise 對應不同的任務特點與參與過程；每項挑戰都會說明採用的方式，你可以按興趣和項目需要選擇參加。', 'We are inviting different partners to bring challenges, with briefs to be announced. Sailboat and Cruise suit different tasks and ways of taking part. Each challenge will explain its format, so you can choose according to your interests and project.'],
  sailboatName: ['帆船挑战', '帆船挑戰', 'Focused brief'],
  cruiseName: ['游轮挑战', '郵輪挑戰', 'Connected technologies & settings'],
  process: ['你将怎样参与', '你將怎樣參與', 'How you take part'],
  briefToggle: ['参加一项挑战前，先了解这些。', '參加一項挑戰前，先了解這些。', 'What to look for before joining a challenge'],
  briefProblem: ['任务与问题', '任務與問題', 'The problem and brief'],
  briefProblemBody: ['要探索什么，任务有哪些要求，作品怎样回应。', '要探索甚麼，任務有哪些要求，作品怎樣回應。', 'What you will explore, what the task asks for and how your work can respond.'],
  briefResources: ['工具与交流', '工具與交流', 'Tools and conversations'],
  briefResourcesBody: ['有哪些可用资源，怎样联系挑战驻点的工程师。', '有哪些可用資源，怎樣聯絡挑戰駐點的工程師。', 'Which resources are available and how to speak with engineers at the Challenge Station.'],
  briefSubmission: ['提交与评议', '提交與評議', 'Submission and review'],
  briefSubmissionBody: ['需要提交什么，怎样展示，具体评议安排是什么。', '需要提交甚麼，怎樣展示，具體評議安排是甚麼。', 'What to submit, how to demonstrate it and how the work will be reviewed.'],
  briefNote: ['题目、资源、参与安排与奖项将随每项挑战公布。', '題目、資源、參與安排與獎項將隨每項挑戰公布。', 'Each challenge will publish its brief, resources, participation details and awards.'],
} satisfies Record<string, [string, string, string]>

export const creationCopy = Object.fromEntries((['zh', 'zh-Hant', 'en'] as Lang[]).map((lang, index) => [lang,
  Object.fromEntries(Object.entries(text).map(([key, values]) => [key, values[index]])),
])) as Record<Lang, Record<keyof typeof text, string>>
