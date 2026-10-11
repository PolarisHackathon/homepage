import { inquiryInterests, type InquiryInput } from '../shared/inquiry.ts'

export interface MailInput {
  from: { email: string; name: string }
  to: string
  replyTo: string
  subject: string
  text: string
  html: string
}

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
  EMAIL?: { send(input: MailInput): Promise<{ messageId: string }> }
  INQUIRY_LIMIT?: { limit(input: { key: string }): Promise<{ success: boolean }> }
  INQUIRY_ENABLED?: string
  INQUIRY_FROM?: string
  INQUIRY_TO?: string
  TURNSTILE_SITE_KEY?: string
  TURNSTILE_SECRET_KEY?: string
  INQUIRY_PREVIEW?: string
}

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
const emailPattern = /^[^\s@<>\u0000-\u001f\u007f]+@[^\s@<>\u0000-\u001f\u007f]+\.[^\s@<>\u0000-\u001f\u007f]+$/
const testKey = (key: string) => /^[123]x0+/.test(key)

function enabled(env: Env) {
  if (env.INQUIRY_ENABLED !== 'true' || !env.EMAIL || !env.INQUIRY_LIMIT || !env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY) return false
  if (!emailPattern.test(env.INQUIRY_FROM || '') || !emailPattern.test(env.INQUIRY_TO || '')) return false
  return !testKey(env.TURNSTILE_SITE_KEY) && !testKey(env.TURNSTILE_SECRET_KEY)
}

function validate(value: unknown): InquiryInput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const input = value as Record<string, unknown>
  if (['name', 'organisation', 'email', 'message', 'token', 'website'].some(key => typeof input[key] !== 'string')) return null
  const name = (input.name as string).trim()
  const organisation = (input.organisation as string).trim()
  const email = (input.email as string).trim()
  const message = (input.message as string).trim()
  const token = input.token as string
  if (!name || name.length > 120 || organisation.length > 160 || !emailPattern.test(email) || email.length > 254 || !message || message.length > 3000 || !token || token.length > 2048 || input.website !== '') return null
  if (/[\u0000-\u001f\u007f]/.test(name + organisation) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)) return null
  if (!Array.isArray(input.interests) || input.interests.length > 4 || input.interests.some(item => !inquiryInterests.includes(item))) return null
  if (!['zh', 'zh-Hant', 'en'].includes(input.lang as string)) return null
  return { name, organisation, email, message, interests: [...new Set(input.interests)], lang: input.lang as InquiryInput['lang'], token, website: '' }
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)

export function inquiryEmail(input: InquiryInput, reference: string, env: Env): MailInput {
  const labels = { challenge: '挑战 / Challenge', programme: '分享与工作坊 / Programme', exhibit: '展示与体验 / Exhibition', support: '活动支持 / Event support' }
  const rows = [
    ['联系编号 / Reference', reference], ['联系人 / Contact', input.name],
    ['机构 / Organisation', input.organisation || '—'], ['邮箱 / Email', input.email],
    ['合作方向 / Interests', input.interests.map(interest => labels[interest]).join('、') || '一起讨论 / Let’s discuss'],
  ]
  const text = `Hackathon polaris 2027 — 合作意向\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${input.message}\n\n来源：entropy 官网合作表单。回复此邮件可直接联系提交人。`
  const html = `<!doctype html><html lang="zh-CN"><body style="margin:0;background:#f4f5f7;color:#182330;font-family:Arial,'Microsoft YaHei',sans-serif"><table role="presentation" style="width:100%;padding:36px 16px"><tr><td><table role="presentation" style="max-width:600px;width:100%;margin:auto;background:#fff;border:1px solid #e1e5ea;border-radius:12px;overflow:hidden"><tr><td style="padding:30px 34px;background:#101925;color:#eef6ff"><div style="font-size:15px;letter-spacing:1px">_entropy</div><h1 style="margin:24px 0 8px;font-size:25px;font-weight:500">新的合作意向</h1><p style="margin:0;font-size:14px;color:#bdcddd">Hackathon polaris 2027</p></td></tr><tr><td style="padding:28px 34px"><table role="presentation" style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><td style="padding:11px 0;border-bottom:1px solid #edf0f3;vertical-align:top;width:38%;font-size:12px;color:#667384">${escapeHtml(label)}</td><td style="padding:11px 0;border-bottom:1px solid #edf0f3;font-size:14px;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join('')}</table><div style="padding:26px 0;font-size:15px;line-height:1.9;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(input.message)}</div><p style="margin:0;padding-top:20px;border-top:1px solid #edf0f3;color:#667384;font-size:12px;line-height:1.8">由官网合作表单提交。回复此邮件可直接联系提交人。<br>From the website partnership form. Reply to contact the sender.</p></td></tr></table></td></tr></table></body></html>`
  return { from: { email: env.INQUIRY_FROM!, name: '_entropy' }, to: env.INQUIRY_TO!, replyTo: input.email, subject: `[Hackathon polaris 2027] 合作意向 · ${reference}`, text, html }
}

async function readLimitedBody(request: Request) {
  if (!request.body) throw new Error('EMPTY_BODY')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    length += value.byteLength
    if (length > 24000) { await reader.cancel(); throw new Error('BODY_TOO_LARGE') }
    chunks.push(value)
  }
  const body = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length }
  return JSON.parse(new TextDecoder().decode(body)) as unknown
}

const digest = async (value: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(byte => byte.toString(16).padStart(2, '0')).join('')

export async function handleInquiry(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  if (url.pathname === '/api/partnership/config') {
    if (request.method !== 'GET') return json({ code: 'METHOD_NOT_ALLOWED' }, 405)
    const available = enabled(env)
    return json({ enabled: available, ...(available ? { siteKey: env.TURNSTILE_SITE_KEY, preview: env.INQUIRY_PREVIEW === 'true' } : {}) })
  }
  if (request.method !== 'POST') return json({ code: 'METHOD_NOT_ALLOWED' }, 405)
  if (request.headers.get('Origin') !== url.origin || (request.headers.get('Sec-Fetch-Site') && request.headers.get('Sec-Fetch-Site') !== 'same-origin')) return json({ code: 'FORBIDDEN' }, 403)
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ code: 'INVALID_INPUT' }, 415)
  if (!enabled(env)) return json({ code: 'UNAVAILABLE' }, 503)
  const ip = request.headers.get('CF-Connecting-IP') || 'local'
  const broadLimit = await env.INQUIRY_LIMIT!.limit({ key: 'inquiry-ip-' + await digest(ip) })
  if (!broadLimit.success) return json({ code: 'RATE_LIMITED' }, 429)
  let input: InquiryInput | null
  try { input = validate(await readLimitedBody(request)) }
  catch { return json({ code: 'INVALID_INPUT' }, 400) }
  if (!input) return json({ code: 'INVALID_INPUT' }, 400)
  const mailboxLimit = await env.INQUIRY_LIMIT!.limit({ key: 'inquiry-email-' + await digest(input.email.toLowerCase()) })
  if (!mailboxLimit.success) return json({ code: 'RATE_LIMITED' }, 429)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: input.token, remoteip: request.headers.get('CF-Connecting-IP') || undefined }), signal: AbortSignal.timeout(10000) })
    if (!response.ok) return json({ code: 'VERIFICATION_FAILED' }, 502)
    const verification: { success?: boolean; hostname?: string; action?: string } = await response.json()
    if (!verification.success || verification.hostname !== url.hostname || verification.action !== 'partnership') return json({ code: 'VERIFICATION_FAILED' }, 400)
  } catch { return json({ code: 'VERIFICATION_FAILED' }, 502) }
  const reference = 'C-' + crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()
  try {
    const result = await env.EMAIL!.send(inquiryEmail(input, reference, env))
    if (!result.messageId) throw new Error('MAIL_NOT_ACCEPTED')
    return json({ reference }, 201)
  } catch { return json({ code: 'DELIVERY_FAILED' }, 502) }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/partnership' || url.pathname === '/api/partnership/config') {
      try { return await handleInquiry(request, env) }
      catch { return json({ code: 'UNAVAILABLE' }, 503) }
    }
    if (url.pathname.startsWith('/api/')) return json({ code: 'NOT_FOUND' }, 404)
    if (['/team', '/team/', '/team.html'].includes(url.pathname)) return Response.redirect(`${url.origin}/about${url.search}`, 301)
    return env.ASSETS.fetch(request)
  },
}
