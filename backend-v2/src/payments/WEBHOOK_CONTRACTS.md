# Webhook Contracts — Premium pipeline

All three purchase paths key premium by the **Google `sub`** (never the email).
The client must set the RevenueCat `app_user_id` to the Google `sub`
(`Purchases.configure(appUserID: googleSub)` on iOS/Android) so a native
purchase maps to the same account as a website purchase. Stripe Checkout
sessions carry the Google `sub` in `client_reference_id` and `metadata`,
and Stripe subscriptions carry it in their `metadata`, so the webhook can
map events back to the same account.

## Common semantics

- **Idempotency:** every event is inserted into `webhook_events` (unique
  `eventId`) *before* processing. A redelivery with a known `eventId`
  returns `200 { status: "duplicate" }` without re-applying. These records
  are never expired — deleting one would re-open the dedup window.
- **Auth failures** return `401` with a coded body, e.g.
  `{ error: { code: "PAYMENTS_BAD_SIGNATURE", message: "Invalid webhook signature." } }`.
- Both routes are exempt from throttling (`@SkipThrottle`) because providers
  deliver in bursts.

---

## RevenueCat — `POST /api/webhooks/revenuecat`

### Dashboard setup

1. RevenueCat dashboard → project → **Integrations → Webhooks → Add webhook**.
2. URL: `https://<api-host>/api/webhooks/revenuecat`.
3. Set the **Authorization header value** to exactly:
   `Bearer <REVENUECAT_WEBHOOK_SECRET>` — the same secret the backend has in
   its environment. The backend compares the header with `timingSafeEqual`
   against `Bearer ${REVENUECAT_WEBHOOK_SECRET}`; the raw secret without the
   `Bearer ` scheme is rejected.
4. Set **App User ID** on the client: `Purchases.configure(appUserID: googleSub)`.
5. Note the entitlement identifier that maps to premium; set
   `REVENUECAT_PREMIUM_ENTITLEMENT` (default `premium`) to match.

### Request shape

The backend reads `body.event`:

```json
{
  "event": {
    "type": "RENEWAL",
    "id": "rc-event-uuid",
    "app_user_id": "<google sub>",
    "entitlement_ids": ["premium"],
    "expiration_at_ms": 1790000000000,
    "purchased_at_ms": 1759000000000
  }
}
```

### Event type mapping

| RevenueCat `type` | Action |
|---|---|
| `INITIAL_PURCHASE` | `grant(sub, "revenuecat", expiration_at_ms ? date : null)` |
| `RENEWAL` | `grant(sub, "revenuecat", expiration_at_ms ? date : null)` |
| `EXPIRATION` | `expire(sub, "revenuecat")` |
| `CANCELLATION` | **No action** — the store keeps access until the paid period ends. Logged. |
| `BILLING_ISSUE` | **No action** — grace period; the user keeps access. Logged. |
| `TRANSFER`, anything else | Logged only. |

If `entitlement_ids` is present and does **not** contain
`REVENUECAT_PREMIUM_ENTITLEMENT`, the event is ignored. If the field is
absent entirely, the event is processed anyway and a warning is logged.

### Retries

The route **always returns 200** once the signature is accepted — even if
processing throws (the error is logged server-side). RevenueCat retries
non-200 responses, so a 500 here would cause a retry storm on an event that
can never be fixed by retrying.

---

## Website checkout — `POST /api/webhooks/web-checkout`

### Signature scheme

- Header: `X-Signature`.
- Value: lowercase hex `HMAC-SHA256(rawRequestBody, WEB_CHECKOUT_SECRET)`.
- The backend signs the **raw request bytes** (`req.rawBody`; `rawBody: true`
  is set in `main.ts`) and compares with `timingSafeEqual`. A parsed-then-
  re-serialized body would not match, so the checkout server must sign the
  exact bytes it sends.
- Missing/invalid signature → `401 { error: { code: "PAYMENTS_BAD_SIGNATURE", ... } }`.

### JSON contract (strict — extra fields are rejected)

```json
{
  "eventId": "123e4567-e89b-12d3-a456-426614174000",
  "googleSub": "114567890123456789012",
  "plan": "yearly",
  "expiresAt": "2027-01-01T00:00:00.000Z"
}
```

- `eventId` — UUID v4, required. Dedup key.
- `googleSub` — string, required. The purchaser's Google `sub`.
- `plan` — required, one of `monthly` | `yearly` | `lifetime`.
- `expiresAt` — ISO-8601 string, or `null` (lifetime). Optional; defaults to `null`.

A successful event runs `grant(googleSub, "web", expiresAt)`. Responses:
`200 { status: "ok" }` or `200 { status: "duplicate" }`.

### curl example (replace the placeholder secret)

```bash
SECRET="replace-me-with-web-checkout-secret"
BODY='{"eventId":"123e4567-e89b-12d3-a456-426614174000","googleSub":"114567890123456789012","plan":"yearly","expiresAt":"2027-01-01T00:00:00.000Z"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')
curl -X POST https://api.example.com/api/webhooks/web-checkout \
  -H 'Content-Type: application/json' \
  -H "X-Signature: $SIG" \
  --data "$BODY"
```

---

## Status endpoint

`GET /api/billing/status` (user access JWT required) returns:

```json
{
  "premium": true,
  "status": "active",
  "source": "revenuecat",
  "expiresAt": "2027-01-01T00:00:00.000Z"
}
```

---

## Stripe — `POST /api/webhooks/stripe`

### Dashboard setup

1. Stripe dashboard → **Developers → Webhooks → Add endpoint**.
2. URL: `https://<api-host>/api/webhooks/stripe`.
3. Select the events to send: `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.payment_failed`.
4. Copy the endpoint's **signing secret** (`whsec_...`) into
   `STRIPE_WEBHOOK_SECRET` on the backend. The backend verifies the
   `stripe-signature` header with `stripe.webhooks.constructEvent`
   against the **raw request body**.

### Checkout session creation

The website creates sessions via `POST /api/billing/checkout`
(user access JWT required). The backend only allows price IDs listed in
`STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_YEARLY` — any other price is
rejected. The session carries the Google `sub` as `client_reference_id`
and in `metadata`, and the subscription inherits it in its `metadata`.
On success the Stripe customer ID is linked to the user for the portal.

### Event type mapping

The Google `sub` is read from `metadata.googleSub`
(falling back to `client_reference_id`). Events without a `sub` are
logged and ignored.

| Stripe `type` | Action |
|---|---|
| `checkout.session.completed` | `grant(sub, "stripe", current_period_end)`; links the Stripe customer and subscription IDs on the user. |
| `customer.subscription.updated` | `active`/`trialing` → `grant(sub, "stripe", current_period_end)`; `canceled`/`unpaid`/`incomplete_expired` → `expire(sub, "stripe")`; other statuses are logged only. |
| `customer.subscription.deleted` | `expire(sub, "stripe")`. |
| `invoice.payment_failed` | **No action** — dunning; Stripe retries and the subscription webhook expires access if payment truly fails. Logged. |
| anything else | Logged only. |

### Retries

The route **always returns 200** once the signature is accepted — even if
processing throws (the error is logged server-side). Stripe retries
non-200 responses, so a 500 here would cause a retry storm on an event that
can never be fixed by retrying. Redeliveries are deduped by the Stripe
event ID via `claimEvent(..., 'stripe', ...)` before processing.

### Customer portal

`POST /api/billing/portal` (user access JWT required) returns a Stripe
Customer Portal URL for the user's linked `stripeCustomerId`, so website
buyers can manage/cancel their subscription without contacting support.
