import assert from 'node:assert/strict'
import { test } from 'node:test'
import { handleInquiry, inquiryEmail } from '../worker/index.ts'

const payload = { name: 'Test partner', organisation: 'Synthetic test team', email: 'partner@example.com', message: 'A synthetic partnership enquiry.', interests: ['challenge'], lang: 'zh', token: 'valid-token', website: '' }
const env = () => ({ ASSETS: { fetch: async () => new Response('asset') }, EMAIL: { send: async () => ({ messageId: 'test-message' }) }, INQUIRY_LIMIT: { limit: async () => ({ success: true }) }, INQUIRY_ENABLED: 'true', INQUIRY_FROM: 'website@example.com', INQUIRY_TO: 'support@entropy.asia', TURNSTILE_SITE_KEY: 'production-public-key', TURNSTILE_SECRET_KEY: 'production-secret-key' })
const request = (value = payload, headers = {}) => new Request('https://entropy.asia/api/partnership', { method: 'POST', headers: { Origin: 'https://entropy.asia', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(value) })
const verified = async (operation, data = { success: true, hostname: 'entropy.asia', action: 'partnership' }) => {
  const original = globalThis.fetch
  globalThis.fetch = async () => Response.json(data)
  try { return await operation() } finally { globalThis.fetch = original }
}

test('valid enquiry reaches the fixed recipient with a reply address and reference', async () => {
  const configuration = env()
  let mail
  configuration.EMAIL.send = async input => { mail = input; return { messageId: 'accepted' } }
  const response = await verified(() => handleInquiry(request(), configuration))
  assert.equal(response.status, 201)
  assert.match((await response.json()).reference, /^C-[A-F0-9]{12}$/)
  assert.equal(mail.to, 'support@entropy.asia')
  assert.equal(mail.replyTo, payload.email)
  assert.ok(mail.subject.includes('Hackathon polaris 2027'))
})

test('mail rejection never produces a success reference', async () => {
  const configuration = env()
  configuration.EMAIL.send = async () => { throw new Error('PRIVATE_SERVICE_DETAILS') }
  const response = await verified(() => handleInquiry(request(), configuration))
  assert.equal(response.status, 502)
  assert.deepEqual(await response.json(), { code: 'DELIVERY_FAILED' })
})

test('missing mail acceptance is a delivery failure', async () => {
  const configuration = env()
  configuration.EMAIL.send = async () => ({ messageId: '' })
  assert.equal((await verified(() => handleInquiry(request(), configuration))).status, 502)
})

test('unconfigured endpoints and test verification keys fail closed', async () => {
  assert.equal((await handleInquiry(request(), { ...env(), EMAIL: undefined })).status, 503)
  assert.equal((await handleInquiry(request(), { ...env(), TURNSTILE_SITE_KEY: '1x00000000000000000000AA' })).status, 503)
  assert.equal((await handleInquiry(request(), { ...env(), TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' })).status, 503)
})

test('foreign origins and incorrect content types cannot send enquiries', async () => {
  assert.equal((await handleInquiry(request(payload, { Origin: 'https://elsewhere.example' }), env())).status, 403)
  assert.equal((await handleInquiry(request(payload, { 'Content-Type': 'text/plain' }), env())).status, 415)
})

test('validation rejects header injection, empty content, unknown directions and honeypots', async () => {
  for (const value of [{ ...payload, name: 'Name\r\nBcc: other@example.com' }, { ...payload, email: 'a@example.com\r\nBcc:b@example.com' }, { ...payload, message: ' ' }, { ...payload, interests: ['tent-pro'] }, { ...payload, website: 'spam' }]) {
    assert.equal((await handleInquiry(request(value), env())).status, 400)
  }
})

test('body limit applies without trusting a content-length header', async () => {
  assert.equal((await handleInquiry(request({ ...payload, message: 'x'.repeat(25000) }), env())).status, 400)
})

test('failed, wrong-host and wrong-action challenges cannot send email', async () => {
  for (const data of [{ success: false }, { success: true, hostname: 'other.example', action: 'partnership' }, { success: true, hostname: 'entropy.asia', action: 'login' }]) {
    assert.equal((await verified(() => handleInquiry(request(), env()), data)).status, 400)
  }
})

test('verification service outages do not send email', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () => { throw new Error('network') }
  try { assert.equal((await handleInquiry(request(), env())).status, 502) } finally { globalThis.fetch = original }
})

test('rate limits reject requests before sending mail', async () => {
  const configuration = env()
  configuration.INQUIRY_LIMIT.limit = async () => ({ success: false })
  assert.equal((await handleInquiry(request(), configuration)).status, 429)
})

test('configuration returns only the public site key', async () => {
  const response = await handleInquiry(new Request('https://entropy.asia/api/partnership/config'), env())
  assert.deepEqual(await response.json(), { enabled: true, siteKey: 'production-public-key', preview: false })
})

test('message HTML is escaped and an attacker cannot override the recipient', () => {
  const mail = inquiryEmail({ ...payload, message: '<script>attack</script>', to: 'attacker@example.com' }, 'C-TEST', env())
  assert.ok(mail.html.includes('&lt;script&gt;attack&lt;/script&gt;'))
  assert.ok(!mail.html.includes('<script>'))
  assert.equal(mail.to, 'support@entropy.asia')
})
