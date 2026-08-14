# LuxLanding

Production landing page and lead-management platform for Luxembourg relocation services. The repository contains the multilingual public site, the authenticated CRM dashboard, Supabase Edge Functions and ordered PostgreSQL migrations.

## Live environments

| Environment | URL | Contents |
| --- | --- | --- |
| Production | <https://luxlanding.eu> | Public landing page and lead form |
| Admin | <https://admin.luxlanding.eu> | Cloudflare Access-protected CRM dashboard |
| Staging | <https://luxlanding-migration-platform-staging.macarthurjeanpierre.workers.dev> | Public site and dashboard for testing |
| WWW | <https://www.luxlanding.eu> | Permanent redirect to the root domain |

Production intentionally uses separate Workers for the public site, admin dashboard and `www` redirect. The production public bundle must never contain `dashboard.html`.

## Main features

- English, French, Spanish and Portuguese landing page.
- Multi-step relocation intake with international phone validation and EUR formatting.
- reCAPTCHA verification, rate limiting and idempotent lead submission.
- Preferred contact channel/time, safe session draft recovery and UTM attribution.
- Resend transactional notifications and client confirmation email.
- Authenticated CRM with lead status, score visualization, partners, per-partner information sharing, referrals, CSV/PDF exports and revenue tools.
- Responsive layouts for public, login and CRM views.
- Supabase RLS, administrator role checks and referral audit records.
- Partner referrals use explicit field scopes so each recipient receives only the client information selected for that referral.

## Requirements

- Node.js 22+
- npm
- Deno 2+
- Supabase CLI (for database/function deployment)
- Wrangler 4+

Install dependencies:

```bash
npm ci
```

## Development and verification

```bash
npm run check          # JS, dashboard, security, SEO, Deno and migrations
npm run ci             # Full check plus public production build validation
npm run check:cloudflare # Dry-run all Cloudflare Workers
npm run preview        # Build and serve the public Worker locally
```

Build targets:

```bash
npm run build          # dist/: public production bundle only
npm run build:admin    # dist-admin/: isolated dashboard
npm run build:staging  # dist/: public site plus staging dashboard
```

After an admin or staging build, run `npm run build` when finished so the local `dist/` returns to the safe public-only state.

## Supabase

Migrations live in `supabase/migrations/` and must remain ordered. Check the remote sequence before applying new migrations:

```bash
supabase migration list --linked
supabase db push --linked
```

Deploy functions after `npm run check`:

```bash
supabase functions deploy submit-lead --project-ref itldyciokbtzwufrrifh
supabase functions deploy send-lead-notifications --project-ref itldyciokbtzwufrrifh
supabase functions deploy send-leads-to-partners --project-ref itldyciokbtzwufrrifh
```

Copy `.env.example` only as a reference for Edge Function secrets. Never commit actual values. Supabase automatically provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to hosted functions.

Required function secrets:

- `reCAPTCHA`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `RATE_LIMIT_SALT`
- `RECAPTCHA_MIN_SCORE`
- `ALLOWED_ORIGINS`
- `ALLOWED_ADMIN_ORIGINS`

`ALLOWED_ADMIN_ORIGINS` must include `https://admin.luxlanding.eu` and the staging domain. After changing an origin secret, redeploy the affected function.

## Authentication and recovery email

The dashboard uses Supabase Auth and requires `app_metadata.role = "admin"` (or an `admin` entry in `app_metadata.roles`). Configure Supabase Authentication URL settings with:

```text
Site URL: https://luxlanding.eu
Redirect URL: https://admin.luxlanding.eu/**
```

Password recovery initiated on the dashboard requests its current origin as the return URL. The public site also forwards legacy recovery fragments to the admin domain.

Supabase Auth uses custom Resend SMTP:

```text
Host: smtp.resend.com
Port: 465
Username: resend
Password: a sending-only Resend API key
```

Use a verified sender domain and restrict the API key to that domain. API keys, recovery URLs, access tokens and refresh tokens must never be pasted into issues, commits or chat.

## Cloudflare deployment

Validate all packages first:

```bash
npm run check:cloudflare
```

Deploy each isolated target:

```bash
npm run build
npx wrangler deploy

npm run build:admin
npx wrangler deploy --config wrangler.admin.jsonc

npm run build:staging
npx wrangler deploy --config wrangler.staging.jsonc

npx wrangler deploy --config wrangler.www.jsonc

npm run build
```

Cloudflare Access must protect `admin.luxlanding.eu`. Do not enable a public `workers.dev` or preview URL for the production admin Worker.

## Repository layout

```text
index.html, style.css, form.css   Public site
script.js, languages.js          Navigation and localization
logic.js, submit.js              Form state and submission
dashboard.html                   Self-contained CRM application
supabase/functions/              Server-side lead and referral workflows
supabase/migrations/             Ordered database changes
scripts/                         Builds and validation checks
workers/                         Small Cloudflare Workers
wrangler*.jsonc                  Per-environment deployment definitions
```

## Release checklist

1. Run `npm ci` and `npm run ci`.
2. Run `npm run check:cloudflare`.
3. Confirm local and remote migration order, then apply pending migrations.
4. Deploy changed Edge Functions.
5. Deploy only the affected Worker targets.
6. Submit a real test lead and confirm the database row and emails.
7. Verify the dashboard at desktop, tablet and mobile widths.
8. Confirm `Send to partners`, password recovery and logout.
9. Restore a public-only `dist/` with `npm run build`.

## Security notes

- The anon key in browser code is public by design; database access is protected by RLS and server-side functions.
- Service-role keys, Resend keys, CAPTCHA secrets and recovery/session tokens are secrets.
- Lead insertion is performed by `submit-lead` after server-side reCAPTCHA and validation.
- Partner dispatch requires a valid Supabase admin session and an allowed admin origin.
- Review `_headers`, `_headers.admin` and `_headers.staging` whenever adding an external asset or API.
