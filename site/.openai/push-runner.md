# Push delivery

The Site sends browser push notifications to opted-in device subscriptions only.
Data and the durable outbox remain in Site D1. No student accounts are required.

Production secrets: `PUSH_VAPID_PRIVATE_JWK` (P-256 private JWK),
`PUSH_RUNNER_KEY` (independent random runner credential). Public configuration:
`PUSH_VAPID_PUBLIC_KEY`, `PUSH_VAPID_SUBJECT`, `PUSH_TIMER_ENABLED`.
Keep existing VAPID keys on updates: rotating them invalidates browser subscriptions.

An external timer must make an HTTPS POST to `/api/push/run` once per minute,
with the dedicated secret in the `X-Push-Runner` header. Request body `{}`.
No user login, cookies, or Sites service-access token is needed by this timer.
The endpoint returns aggregate delivery counts, never subscriptions or secrets.
Job IDs deduplicate sends; expiring leases permit retries. Revoked endpoints are
removed. Lesson reminders expire at lesson start, so offline devices do not
receive them after a lesson has started.

For cron-job.org: title `Матроська гімназія · сповіщення`, URL is the deployed
Site URL plus `/api/push/run`, execution every 1 minute, method POST, request
body `{}`, header name `X-Push-Runner`. Keep the header value confidential.
The authenticated owner can copy its value from the notification settings.
Do not save response bodies; enable failure alerts if desired. Verify a manual
test returns HTTP 200 and a subsequent scheduled execution succeeds before
setting `PUSH_TIMER_ENABLED=true` in Sites and deploying the same version.
Use a single timer; list any existing jobs before creating another.

The Site Worker also exposes a scheduled handler for hosts that support
native cron provisioning. This handler alone does not register a timer.
ChatGPT hourly task schedules cannot provide 10-minute lesson reminders.

Notifications about timetable changes are enqueued in the same D1 transaction
as the new schedule revision. Delivery starts through Worker waitUntil after a
successful save; an external timer retries pending messages.
Preferences are bound to an anonymous device with a 256-bit management token.
Only its hash is stored in D1. Subscription endpoints are restricted to known
browser push services; fetch redirects are rejected.

Checks: `node scripts/check-push.mjs`, TypeScript, schedule/day-view checks.
Real-device reception still requires the visitor to grant browser permission.
iOS/iPadOS visitors must open the installed Home Screen app.
