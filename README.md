# LnkShrt frontend

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Redux Toolkit, Axios, and next-themes. The existing links, QR tools, analytics, Google sign-in, donations and settings are preserved.

## Local development

Use Node 24 and npm. In PowerShell:

```powershell
npm ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Open http://localhost:3000. Start the backend separately on port 8080 and apply its latest Prisma migrations. Configure the **backend** with `FRONTEND_URL=http://localhost:3000`, `CORS_ORIGIN=http://localhost:3000`, and the appropriate Google callback URL and credentials. Keep the same hostname (`localhost`) for frontend and backend during cookie-based local testing. The backend currently issues Secure cookies; if your browser rejects them over local HTTP, use local HTTPS rather than weakening production cookie settings.

Frontend variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Browser API base, including `/api/v1`; no secrets |
| `API_BASE_URL` | Optional server-side API base for public bio pages; defaults to the browser base |
| `APP_HOSTS` | Optional comma-separated primary frontend hostnames; enables custom-host root rewrites |
| `NEXT_PUBLIC_SHORT_URL` | Existing primary short-link URL used by analytics |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Existing public Razorpay checkout key |

The older misspelled `NEXT_PUBLIC_BACkEND_URL` remains supported as a fallback. API URLs work with or without a trailing slash. Public variables must be set **before building**. Server-side API requests need network access from the Next.js host to the backend.

## Bio pages

- `/pages`: list, copy/view, publish/unpublish and delete your pages.
- `/pages/new` and `/pages/:id/edit`: profile, avatar URL, up to 50 ordered links, link visibility, light/dark/system appearance, live preview and verified-domain assignment.
- `/b/:slug`: public, server-rendered page. Drafts and deleted pages show an unavailable state; inactive links are excluded by the API. Reads use `no-store` so unpublishing takes effect immediately.
- `/b/domain/:hostname`: public lookup for a verified custom domain.

Save explicitly to apply edits. A link-array save replaces the list in its current order; backend-generated IDs/positions are not sent back as writable fields. Failed saves keep form values. Public pages render plain text and allow only HTTP(S) links without embedded credentials. User images are loaded directly by the browser, not fetched through Next's image optimizer.

## Domains and branded links

`/domain` shows both TXT ownership and CNAME routing records. Verification calls `/domain/:id/verify` and uses the returned `isVerified`/`checks` values; a 200 response does not automatically mean verification succeeded. DNS errors, missing records and domain-in-use deletion conflicts are shown without discarding the current list.

`/links/create` offers verified domains and sends numeric `domainId`. The default domain remains available. The protected-link screen is `/protectedlink?q=<shortCode>`.

## Custom-domain hosting

Set `APP_HOSTS=app.example.com,www.app.example.com` to identify canonical app hosts. Requests to `/` on another Host are internally rewritten to the public domain lookup. The backend must confirm that the domain is verified and its page is published. `X-Forwarded-Host` is not used to select the page.

DNS verification does not configure AWS/other hosting or TLS. The ingress must accept registered hostnames, preserve the original Host, serve Next.js assets, route bio-page roots to this frontend, and route short-code paths to the backend when using the same domain for both. The frontend and backend must be reachable over HTTPS. This PR does not deploy AWS resources or change DNS records.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

Browser regression tests exercise the real production frontend with a deterministic API contract fixture. They do not contact a production API or perform payments, send email, or exercise live Google OAuth/DNS. Backend persistence/DNS logic has its separate suite in the backend repository.

PowerShell browser-test setup:

```powershell
$env:NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:4010/api/v1"
$env:API_BASE_URL="http://127.0.0.1:4010/api/v1"
npm run build
npx playwright install chromium
npm run test:e2e
Remove-Item Env:NEXT_PUBLIC_BACKEND_URL
Remove-Item Env:API_BASE_URL
```

Tests start their own frontend (port 3000) and fixture API (4010); stop other services using these ports first. Rebuild with your normal environment before deployment. GitHub Actions runs lint/type checks/build and Chromium tests, retaining screenshots, traces and reports for 14 days.

## Bio design controls

The bio editor includes six color palettes, four link-button styles, ten link
icons, and up to eight social/email icons, shared by preview and public pages.
Existing pages without design fields render with compatible defaults. Palettes
follow light/dark/system appearance, except Midnight which stays dark.

Deploy the backend bio-design migration/API update before this frontend.
Social changes save explicitly with the rest of the page; profile URLs must be
HTTP(S), and email icons accept a plain email address.

## Custom-domain routing
Domain help now supports proxies: keep the TXT ownership record and the routing
CNAME. If the CNAME is hidden, the updated backend verifies an HTTPS routing proof.
The proof path must reach the backend unchanged without caching, redirects, or
bot/login challenges. A proxy's browser-facing certificate does not configure
origin TLS; use the provider's secure origin settings. DNS-only domains still
need matching origin certificates. DNS verification isn't a claim of TLS readiness.

Link lists display the backend's canonical URL and a Custom domain label for
assigned domains. Analytics prefers the backend canonical URL and retains a
fallback for older backends.
