# AgenticOp.io — marketing site (`agenticop.io`)

**Brand:** **AgenticOp.io** · **Domain:** **agenticop.io** (see `DOMAIN_DECISION_CHECKLIST.md` for optional `agenticops.io` migration).

Static multi-page site: verification-backed migrations and agent-led modernization; **Chrysalis** source is **https://github.com/4GEngineer/chrysalis** (early); pilots described as private alpha.

## Where this folder lives

- **WISP-Management monorepo:** `brand/agenticops-web/` — kept separate from `landing/` (wisptools.io), `Module_Manager/`, and backend code.
- **Private GitHub repo:** Copy this directory to a private repository root when you want billing/access isolation; see **`docs/PRIVATE_REPOSITORY.md`**.

## AI / contributor onboarding

- **`AGENTS.md`** — concise rules and file map for Cursor (and similar).
- **`docs/AI_CONTEXT.md`** — full operator intent, domain strategy, and constraints for future development sessions.
- **`docs/LINKEDIN_POST_MAINTENANCE.md`** — what must stay stable in `docs/linkedin-new-project-post.html` when editing copy; whitepaper URL checklist.
- **`docs/WHITEPAPER.md`** — technical whitepaper (git). Run **`scripts/sync-whitepaper.ps1`** then deploy; public URL **`/whitepaper.html`**.
- **`docs/GITHUB_ORG_MIGRATION.md`** — consolidate repos under GitHub org **`AgenticOp-io`** (brand **AgenticOp.io**).

## Layout

Multi-page site (no catch-all rewrite to `index.html` for `.html` routes).

- `index.html` — home, hero, **Explore** hub
- `services.html`, `method.html`, `proof.html`, `trust.html`, `about.html`, `contact.html`
- `ao-layout.js` — shared nav + footer (`data-ao-page` on `<body>`)
- `agenticops.css` — theme
- `logo.svg`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`

## Deploy (Firebase)

Dedicated Firebase project: **`agenticop-io`**. Default Hosting site **`agenticop-io`** → **`https://agenticop-io.web.app`** (this is where **`agenticop.io`** should be attached).

From **this directory** (not the monorepo root):

**Dedicated project (default Firebase URL):**

```powershell
cd brand/agenticops-web   # from monorepo root
.\scripts\sync-whitepaper.ps1   # copy docs/WHITEPAPER.md → WHITEPAPER.md for whitepaper.html
firebase deploy --only hosting --project agenticop-io
```

**Also mirror to `wisptools-production` / site `agenticops-production`** (optional; **`*.firebaseapp.com`** / multi-site history): run when that site should stay in sync:

```powershell
.\scripts\deploy-custom-domain-hosting.ps1
```

Always pass **`--project agenticop-io`** for the public domain’s project so the CLI never picks the monorepo root default (**`wisptools-production`**).

**Monorepo root** `firebase.json` does not deploy this site; deploy AgenticOps only from here.

**Custom domain:** **`agenticop.io`** → project **`agenticop-io`**, site **`agenticop-io`** (see **`DNS_SETUP.md`**). **`agenticops-production`** on **`wisptools-production`** is optional mirror / legacy URL.

## Brand architecture (short)

- **AgenticOp.io** — this site.
- **Chrysalis** — https://github.com/4GEngineer/chrysalis
- **wisptools.io** — public MIT WISP stack; proof point; links from this site are intentional.

## SEO

Pages include canonical, Open Graph, Twitter Card, JSON-LD. Prefer a **1200×630** social PNG for `og:image` when available.

## DNS & domains

See **`DNS_SETUP.md`** (Firebase custom domains, GoDaddy-style records, removing mistaken domains).
