export const inquiryInterests = ['challenge', 'programme', 'exhibit', 'support'] as const
export type InquiryInterest = typeof inquiryInterests[number]

export interface InquiryInput {
  name: string
  organisation: string
  email: string
  message: string
  interests: InquiryInterest[]
  lang: 'zh' | 'zh-Hant' | 'en'
  token: string
  website: string
}

export interface InquiryConfig {
  enabled: boolean
  siteKey?: string
  preview?: boolean
}
