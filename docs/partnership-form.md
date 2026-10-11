# Website partnership enquiries

The public site remains a Vite multi-page application. `worker/index.ts` serves its built assets and a small same-origin partnership endpoint. This does not depend on Passport or Neon and does not create a partnership database.

## Request flow

1. The modal fetches `/api/partnership/config` to discover availability and the public Turnstile key.
2. The visitor selects any combination of challenge, programme, exhibition and event support, then supplies a name, email and short message. Organisation is optional.
3. The Worker validates the JSON payload, rate limits the request and verifies Turnstile's success, hostname and `partnership` action.
4. Cloudflare's `EMAIL` binding sends to the server-configured mailbox. The visitor's email is Reply-To only. The client cannot change the recipient or sender.
5. The page displays a reference only after the mail service returns a message identifier. That receipt means accepted by the sending service; it is not independent confirmation that someone has read the mailbox.

## Production configuration

The tracked `wrangler.jsonc` deliberately has `INQUIRY_ENABLED=false`. Production sending requires all of the following before changing that value to `true`:

| Setting | Purpose |
| --- | --- |
| `INQUIRY_FROM` | A sender address on a verified sending domain |
| `INQUIRY_TO` | The fixed receiving address, `support@entropy.asia` |
| `TURNSTILE_SITE_KEY` | A widget bound to the actual website hostnames |
| `TURNSTILE_SECRET_KEY` | The corresponding Worker secret, never a frontend variable |
| `EMAIL` | A Cloudflare email binding restricted to the agreed sender and recipient |
| `INQUIRY_LIMIT` | The existing rate-limit binding, five requests per minute per IP/email key |

The sender/domain and Turnstile widget must be provisioned for production independently of the review environment. Do not reuse review-only receiving permissions or copy secrets into Git. Turnstile dummy keys are rejected. Missing configuration fails closed and offers the copyable email address.

The review Worker has its own ignored configuration and secrets. It has a test-only sender/receiver restriction and displays a preview notice. Deploying `wrangler.review.jsonc` does not activate the production form.

## Development and verification

Use Node 24. `npm run lint`, `npm run test:inquiry` and `npm run build` are included in CI. `npm run dev:worker` serves the Worker on port 8787; Vite proxies the partnership endpoint to it. The default local configuration does not enable email delivery. Real delivery was manually tested on the separately authorised review Worker, with a real Turnstile token and a synthetic enquiry.

Before a production release, manually verify the production widget, successful delivery to the agreed mailbox, direct replies, failure handling, modal focus, mobile scrolling and both themes. Production activation belongs to the approved release step, not a blind push to an automatically deployed branch.

## Data and operational limits

The website does not store enquiries in a new database, send automatic acknowledgements to visitors, promise a response deadline or implement a CRM. Enquiries live in the receiving mailbox; its access and retention are managed separately. Application status and event content are still maintained in the website dictionaries. A Passport publication feed and admin editor are separate future work.
