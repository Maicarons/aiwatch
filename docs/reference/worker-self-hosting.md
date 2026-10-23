---
type: runbook
title: "Worker self-hosting — deploy the backend to your own Cloudflare account"
description: "Step-by-step fork runbook: plan choice, KV, deploy, secrets, Vercel rewrites and CSP, custom-domain options, auto-deploy, rollback, and the remaining upstream-domain gaps."
tags: [worker, deploy, cloudflare, fork, runbook]
---

# Worker self-hosting

The fork currently serves its frontend from Vercel but proxies every API and feed request to the
upstream Worker. This runbook makes the backend independent: deploy `worker/` to your own Cloudflare
account, then repoint the Vercel rewrites and CSP at it.

**Use the Workers Paid plan for a production fork.** The upstream project is built and budgeted for
Workers Paid: its own KV estimate is roughly 845–958 writes/day against the Free cap of 1,000/day,
and Workers Free limits each request and cron invocation to 10 ms of CPU. The bindings themselves
deploy on Free, so a low-traffic trial is possible, but a fork that polls real status pages should
budget the $5/month plan. The optional integrations are individually switchable by secret.

## Fork state this runbook assumes

- `origin` is `https://github.com/Maicarons/aiwatch.git`; `upstream` has push disabled.
- Production frontend is `https://aiwatch.maicarons.cc` (Vercel project `aiwatch`, team
  `maicarons-projects`).
- Vercel Production sets `VITE_API_URL=/api/status`, so the SPA calls its own origin. The rewrites in
  `vercel.json` are what actually reach the Worker — no frontend env change is needed when the Worker
  moves.
- `worker/wrangler.toml` declares KV (`STATUS_CACHE`), Workers AI, Analytics Engine, a five-minute
  cron, and Workers Logs.
- The checked-in KV namespace id belongs to the upstream account. It must be replaced before your
  first deploy.

## Prerequisites

- A Cloudflare account. Workers Paid is recommended; see the plan note above.
- Node.js 20+ and npm.
- Wrangler authentication in the current shell: `npx wrangler login`, or a scoped API token
  exported for CI use.
- Optional: a hostname for the Worker. The production domain currently uses Aliyun DNS; see
  [Custom domain options](#custom-domain-options).

Confirm the account before changing anything:

```bash
npx wrangler whoami
```

## 1. Create your KV namespace

Run from the repository root:

```bash
cd worker && npm install && cd ..
npx wrangler kv namespace create STATUS_CACHE --config worker/wrangler.toml
```

The command prints the new namespace id. Replace the `id` in `worker/wrangler.toml` with it:

```toml
[[kv_namespaces]]
binding = "STATUS_CACHE"
id = "<your-namespace-id>"
```

Verify the namespace is visible to the logged-in account:

```bash
npx wrangler kv namespace list --config worker/wrangler.toml
```

A KV namespace id is an account-scoped identifier. Deploying with the upstream id will fail (or bind
nothing usable), so do not skip this step. `wrangler kv namespace create` also accepts
`--binding STATUS_CACHE --update-config`, but inspect the diff: the safe path is to copy the printed
id and replace the checked-in one by hand.

## 2. Review the bindings

| Binding | Required | Plan note |
| --- | --- | --- |
| `STATUS_CACHE` (KV) | Yes | Free: 100,000 reads/day, 1,000 writes/day, 1 GB. Paid: 1,000,000 writes/month included. The worker's own estimate is ~845–958 writes/day. |
| `[ai]` (Workers AI) | No | Free and Paid include 10,000 Neurons/day. A few models require a paid billing method; AIWatch's configured Gemma model is not on that list. |
| `ANALYTICS` (Analytics Engine) | No | Free: 100,000 data points/day, 10,000 read queries/day, three-month retention. The dataset auto-creates on first write. |
| `[triggers] crons` | No | Free allows five cron triggers per account; the status refresh runs every five minutes (288 invocations/day). |
| `[observability]` | No | Workers Logs is included on Free (200,000 events/day, three-day retention) and Paid. |

If a deployment fails on an optional binding, remove that block and redeploy. Only `STATUS_CACHE` is
load-bearing for status data.

## 3. Set the fork vars

The checked-in vars already point at the fork:

```toml
[vars]
ALLOWED_ORIGIN = "https://aiwatch.maicarons.cc,https://aiwatch-snowy.vercel.app,*-maicarons-projects.vercel.app"
CONFIRM_BASE_URL = "https://aiwatch.maicarons.cc"
```

Change them if your frontend origin differs. The `*` entry is an end-with match for rotating Vercel
preview hosts; never use a bare `*.vercel.app`.

## 4. Dry-run and first deploy

Run the worker gates, then deploy once:

```bash
npm run test:worker
npm run typecheck:worker
npx wrangler deploy --config worker/wrangler.toml --dry-run
npm run deploy:worker
```

The first deploy creates the worker and prints its `workers.dev` origin, of the form
`https://aiwatch-worker.<account-subdomain>.workers.dev`. Worker names are account-scoped: the
checked-in `name = "aiwatch-worker"` does not collide with the upstream worker, but deploying updates
any same-named worker in your own account.

## 5. Set optional secrets

Do this **after** the first deploy. `wrangler secret put` creates and deploys a new Worker version
immediately, so setting ten secrets one at a time means ten deploys and ten isolate resets. Use bulk
upload instead:

```bash
npx wrangler secret bulk /tmp/aiwatch-secrets.json --config worker/wrangler.toml
```

The file is a JSON object of name/value pairs. Keep it outside the repository and delete it after
the upload:

```json
{
  "DISCORD_WEBHOOK_URL": "https://discord.com/api/webhooks/...",
  "ANTHROPIC_API_KEY": "sk-ant-..."
}
```

Set only the secrets for features you intend to use:

| Feature | Secret(s) | Behavior when absent |
| --- | --- | --- |
| Discord operator/subscriber alerts | `DISCORD_WEBHOOK_URL` | Alerts are skipped. |
| Claude Sonnet fallback | `ANTHROPIC_API_KEY` | Workers AI (Gemma) remains the only analysis path. |
| Server-side webhook subscriptions | `WEBHOOK_ENC_KEY` (64 hex chars) | Subscribe endpoint fails closed; no per-user delivery. |
| Operator endpoints | `ADMIN_API_KEY` | Admin routes return 401. |
| Edge fallback alerts | `EDGE_ALERT_TOKEN` | The internal Edge endpoint returns 401; must match the Vercel env value. |
| DeepSeek/Mistral feed Actions | `DEEPSEEK_FEED_TOKEN`, `MISTRAL_FEED_TOKEN` | The internal feed endpoints return 401; mirror values in GitHub Actions secrets. |
| Cron-dispatched feed workflows | `GH_DISPATCH_TOKEN` | The worker skips GitHub dispatches. |
| Badge repository discovery | `GH_CODE_SEARCH_TOKEN` | The weekly discovery section is omitted. |
| Phone push | `NTFY_TOPIC` | Push is skipped; Discord alerts are unaffected. |
| Analytics SQL readback | `CF_ACCOUNT_ID`, `CF_ANALYTICS_TOKEN` | The daily v1-traffic section is skipped. |
| Slack OAuth install | `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_REDIRECT_URI` | The install route reports the app as unavailable. |
| Mistral email forwarding | `MISTRAL_EMAIL_FORWARD_TO` | Inbound mail is not forwarded. |

Generate the encryption key with either command:

```bash
openssl rand -hex 32
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Verify the names (values stay write-only):

```bash
npx wrangler secret list --config worker/wrangler.toml
```

## 6. Verify the worker before touching Vercel

```bash
curl -sS https://<worker-origin>/api/status | head -c 300
curl -sS https://<worker-origin>/api/status/cached | head -c 300
curl -sS https://<worker-origin>/badge/claude
curl -sS https://<worker-origin>/api/statusline/branded
```

- The first status request fetches upstream status pages and writes KV; the five-minute cron keeps it
  warm afterwards.
- A fresh namespace has no incident history or monthly archives. Uptime windows and archives fill as
  the worker runs; do not read the first day as data loss.
- Watch for runtime errors with `npx wrangler tail --config worker/wrangler.toml`.
- Confirm CORS echoes the production origin:

```bash
curl -sI -H "Origin: https://aiwatch.maicarons.cc" https://<worker-origin>/api/status \
  | grep -i access-control
```

## 7. Repoint Vercel

Replace the upstream worker origin in every Vercel surface:

1. `vercel.json` — the `/api/*`, `/api/webhook/*`, and `/feed*` rewrites.
2. `vercel.json` — the SPA `Content-Security-Policy` `connect-src` and `img-src`.
3. `api/_shared/csp-nonce.ts` and `api/_shared/csp-hash.ts` — the Edge-rendered CSP copies.

Then commit and push to `main`; the Vercel Git integration deploys automatically. Or deploy directly:

```bash
npx vercel --prod
```

Verification:

```bash
curl -sS https://aiwatch.maicarons.cc/api/status | head -c 300
curl -sSI https://aiwatch.maicarons.cc/ | grep -i content-security-policy
```

Hard-refresh the dashboard and the `/is-*-down` pages. If the service worker serves stale HTML,
clear the site data once and reload.

## 8. What still points at upstream

Self-hosting the worker does not rebrand every URL it emits. Audit the remaining references:

```bash
grep -rn "aiwatch-worker.p2c2kbf.workers.dev" \
  --include="*.md" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.json" . \
  | grep -v node_modules | grep -v dist/
```

As of this runbook, that finds:

- User-facing frontend URLs: `src/pages/Statusline.jsx`, `src/utils/badge.js`,
  `src/components/ReportModal.jsx`, `src/hooks/useMonthlyArchives.js`, and the fallback in
  `src/pages/ServiceDetails.jsx`.
- README badges, curl examples, and the statusline snippet.
- Edge CSP files and test fixtures.
- `vite.config.js`, whose proxy is local-development-only.

Update the user-facing ones and their pinned tests to your worker origin. The `vite.config.js` proxy
should point at your local worker or be left as-is for development.

The Worker source also hardcodes `https://ai-watch.dev` in more than fifty modules for outbound
links: Discord alerts, X drafts and replies, RSS, IndexNow, Reddit shares, OG image text, report
links, and monitoring user agents. Status data is unaffected, but those links still point at the
upstream site. Rebinding them needs a single site-origin variable threaded through those modules,
with tests; treat it as a separate change rather than a mass replacement.

`worker/src/badge-repo-discovery.ts` searches GitHub for the upstream badge URL. A self-hosted worker
will not discover repositories that embed the fork's badges until that search string is updated.

## Custom domain options

A Worker custom domain requires an active Cloudflare zone owned by the same account. `maicarons.cc`
currently delegates DNS to Aliyun (`dns1.hichina.com`, `dns2.hichina.com`), so the options are:

1. **Keep the `workers.dev` origin** — simplest, and works with the Vercel rewrites. The origin is
   stable for a given worker name and account subdomain.
2. **Move the whole `maicarons.cc` zone to Cloudflare** — the documented Free-plan path. Recreate the
   existing records, including the Vercel records for `aiwatch.maicarons.cc`, then attach the Worker
   custom domain.
3. **Delegate `api.aiwatch.maicarons.cc` as its own zone** — add the child zone in Cloudflare, then
   create NS records for `api` at Aliyun pointing at that child zone's nameservers. Cloudflare's
   documentation says a subdomain setup is possible with the parent at another DNS provider, but
   another page labels subdomain setup as Enterprise-only; confirm the entitlement in the dashboard
   before choosing this path.

A plain CNAME to the `workers.dev` hostname is not a documented Worker custom-domain path: it does
not create a Cloudflare zone or a Cloudflare-issued certificate for the hostname. Do not rely on it.
If you do add a custom domain, use it in the Vercel rewrites and CSP so future worker origin changes
stay in one place.

`workers_dev` and a custom domain can coexist. If you add `routes` and omit `workers_dev`, Wrangler
defaults it to false; disabling `workers_dev` only in the dashboard is undone by the next deploy.

## Auto-deploy the worker

**Cloudflare Workers Builds (recommended).** In the dashboard, open the existing worker, then
Settings → Builds → Connect. Use:

- Root directory: `worker`
- Build command: leave blank — Workers Builds installs dependencies automatically; this Worker has
  no build step.
- Deploy command: `npx wrangler deploy`
- Watch paths: `worker/*` (confirm the base path in the UI)

The dashboard worker name must match `name = "aiwatch-worker"` in `worker/wrangler.toml`, or the
build fails. Free includes 3,000 build minutes/month, one concurrent build, and a 20-minute timeout.

**GitHub Actions (alternative).** If you prefer the deployment to be visible in the repository's
Actions, add a workflow like this and set the two repository secrets:

```yaml
name: Deploy worker
on:
  push:
    branches: [main]
    paths:
      - 'worker/**'
      - '.github/workflows/deploy-worker.yml'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: worker
          command: deploy
```

The token needs Workers Editor for an existing worker; the very first creation needs Workers Admin.
KV Storage edit is only required if CI also manages the namespace, and Workers Routes write is only
required if the deploy manages custom domains. Do not run both Workers Builds and this workflow for
the same worker, or every push deploys twice.

Vercel and the worker deploy independently from the same push. When a change spans both, deploy the
worker first: the frontend rewrites and CSP expect its origin to answer.

## Rollback

- **Worker:** `npx wrangler deployments list --config worker/wrangler.toml`, then
  `npx wrangler rollback <VERSION_ID> --config worker/wrangler.toml` (or use the dashboard). With no
  version id, rollback selects the version uploaded before the latest. It creates a new deployment
  and becomes active immediately. Re-run the `/api/status` check afterwards.
- **Vercel:** revert the `vercel.json` / CSP change and push, or roll back the deployment in the
  Vercel dashboard.
- **KV:** do not delete it as part of a rollback. It holds incident history, archives, and alert
  dedup state; a rolled-back worker reads the same namespace safely.
- **Custom domain:** remove it from the worker in the dashboard if you abandon that origin.

## Cost and operational notes

- Workers Paid includes 1,000,000 KV writes/month and removes the Free 10 ms CPU ceiling. The
  worker's own KV estimate is ~845–958 writes/day plus cron heartbeats, changelog markers, and
  vitals; that is why the project treats Paid as the production baseline.
- Workers AI is the most likely runtime ceiling on either plan: 10,000 Neurons/day, and AI analysis
  is triggered only for new incidents. The Sonnet fallback is billed by Anthropic when configured.
- Analytics Engine data is retained for three months. The daily v1-traffic readback additionally
  needs `CF_ACCOUNT_ID` and `CF_ANALYTICS_TOKEN`; without them the section is skipped.
- A fresh worker starts with an empty KV namespace. Alert dedup, monthly accumulators, and incident
  history rebuild from the cron; they do not migrate from upstream.

## Sources

- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Workers KV limits](https://developers.cloudflare.com/kv/platform/limits/)
- [Workers KV commands](https://developers.cloudflare.com/kv/reference/kv-commands/)
- [Workers Analytics Engine pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/)
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers Builds limits and pricing](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)
- [Workers Builds advanced setups (monorepos)](https://developers.cloudflare.com/workers/ci-cd/builds/advanced-setups/)
- [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/)
