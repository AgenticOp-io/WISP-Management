# AgenticOps — marketing site (`agenticop.io`)

**Brand:** AgenticOps · **Canonical domain:** **agenticop.io** (see `DOMAIN_DECISION_CHECKLIST.md` for optional `agenticops.io` migration).

Static multi-page site: verification-backed migrations and agent-led modernization; **Chrysalis** is referenced as **private alpha** (no public repo link on pages).

## Where this folder lives

- **WISP-Management monorepo:** `brand/agenticops-web/` — kept separate from `landing/` (wisptools.io), `Module_Manager/`, and backend code.
- **Private GitHub repo:** Copy this directory to a private repository root when you want billing/access isolation; see **`docs/PRIVATE_REPOSITORY.md`**.

## AI / contributor onboarding

- **`AGENTS.md`** — concise rules and file map for Cursor (and similar).
- **`docs/AI_CONTEXT.md`** — full operator intent, domain strategy, and constraints for future development sessions.

## Layout

Multi-page site (no catch-all rewrite to `index.html` for `.html` routes).

- `index.html` — home, hero, **Explore** hub
- `services.html`, `method.html`, `proof.html`, `trust.html`, `about.html`, `contact.html`
- `ao-layout.js` — shared nav + footer (`data-ao-page` on `<body>`)
- `agenticops.css` — theme
- `logo.svg`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`

## Deploy (Firebase)

From **this directory** (not the monorepo root):

```bash
cd brand/agenticops-web   # from monorepo root
firebase deploy --only hosting:agenticops
```

Requires Firebase CLI and access to the configured project (default in `.firebaserc`: **`wisptools-production`**, Hosting site **`agenticops-production`**). Override by editing `.firebaserc` or using `firebase use`.

**Monorepo root** `firebase.json` no longer includes this site; deploy AgenticOps only from here.

## Brand architecture (short)

- **AgenticOps** — this site.
- **Chrysalis** — private alpha engine; no public GitHub link on site until explicitly approved.
- **wisptools.io** — public MIT WISP stack; proof point; links from this site are intentional.

## SEO

Pages include canonical, Open Graph, Twitter Card, JSON-LD. Prefer a **1200×630** social PNG for `og:image` when available.

## DNS & domains

See **`DNS_SETUP.md`** (Firebase custom domains, GoDaddy-style records, removing mistaken domains).
