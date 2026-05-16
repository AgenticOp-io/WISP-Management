# Agent instructions — AgenticOps marketing site

Use this file when editing **this folder** (`brand/agenticops-web/` in the WISP-Management monorepo, or the **root** of the private `agenticops-web` Git repository after a split).

## What this is

- **Product:** Static multi-page marketing site for **AgenticOp.io** (commercial / methodology brand). **Positioning:** AgenticOp.io is **transformative code** (verification-first); **Chrysalis** is the **first flagship** (legacy migration engine). The **long arc** names **macro-scale systemic fragility** (finance, governance, institutional cascades) as intellectual north star — **do not** imply a separate shipped product there unless explicitly directed.
- **Canonical public domain:** `https://agenticop.io` — brand **AgenticOp.io** (not “AgenticOps”; avoid **`agenticops.*`** in new hostnames).
- **GitHub org (target):** **`AgenticOp-io`** — see **`docs/GITHUB_ORG_MIGRATION.md`**.
- **Optional future domain:** `agenticops.io` — only if acquired; see `DOMAIN_DECISION_CHECKLIST.md`. Do **not** assume it is attached to Firebase.
- **Sibling brand:** **wisptools.io** — public MIT WISP stack (**WISP Management** + **Bandwidth Test Manager**). It is the **proof** shipped in production; link to it from this site where appropriate. **Do not** merge wisptools messaging into AgenticOps copy as if they were one product name.

## Hard rules

1. **Chrysalis** — **Source:** https://github.com/4GEngineer/chrysalis (separate from WISP-Management). **Private alpha** = pilot engagement maturity, not hidden code. **PHP-first** (capture → replay → chimera). Link the repo from `proof.html` and key CTAs; keep license claims aligned with the repo’s **LICENSE** file. **Technical whitepaper (public):** **`/whitepaper.html`** — canonical markdown in **`docs/WHITEPAPER.md`** (git); before **`firebase deploy`**, run **`scripts/sync-whitepaper.ps1`** so root **`WHITEPAPER.md`** matches (Hosting serves it for the page). Do **not** publish Chrysalis **`docs/AGENTICOP.md`** on the marketing site (install / repo-internal).
2. **Tone:** Confident, technical, anti-hype. Prefer “shipped,” “verified,” “in production” over vague “AI-powered.”
3. **Hosting:** Dedicated Firebase project **`agenticop-io`**; default Hosting site **`agenticop-io`** (`https://agenticop-io.web.app`). Deploy from **this directory**: `firebase deploy --only hosting --project agenticop-io` (always include **`--project`** when this folder lives inside the monorepo).
4. **URLs:** Multi-page site uses **real `.html` paths** (e.g. `/services.html`). Do **not** add a catch-all rewrite to `index.html` for HTML routes (that broke interior pages historically).
5. **Shared chrome:** `ao-layout.js` injects nav/footer from `data-ao-page` on `<body>`. Edit navigation in **one place** there.
6. **Styles:** `agenticops.css` — dark navy, cyan/violet accents. Keep typography: DM Sans + JetBrains Mono for labels/stages.

## Key files

| File | Role |
|------|------|
| `index.html` | Home, hero, Explore hub |
| `services.html`, `method.html`, `proof.html`, `trust.html`, `about.html`, `contact.html`, `whitepaper.html` | Interior chapters + whitepaper |
| `ao-layout.js` | Shared layout + active nav |
| `agenticops.css` | Global styles |
| `logo.svg` | Brand mark |
| `docs/WHITEPAPER.md` | Technical whitepaper source (git); sync to `WHITEPAPER.md` via `scripts/sync-whitepaper.ps1` |
| `whitepaper.html` | Public whitepaper page (`/whitepaper.html`) |
| `WHITEPAPER.md` | Deployed markdown copy at site root (fetch target for `whitepaper.html`) |
| `sitemap.xml`, `robots.txt`, `humans.txt` | SEO / discovery |
| `DNS_SETUP.md` | Firebase + DNS + domain removal notes |
| `docs/LINKEDIN_POST_MAINTENANCE.md` | LinkedIn helper (`linkedin-new-project-post.html`): stable DOM ids, CONFIG fields, whitepaper URL sync |
| `docs/AI_CONTEXT.md` | Full operator intent for future AI sessions |

## Firebase / domains

- **Custom domain is bound to the Hosting site, not to a single deploy URL.** In production, **`agenticop.io`** (and `www` if configured) is attached to project **`agenticop-io`** (site **`agenticop-io`**) alongside **`https://agenticop-io.web.app`**. Each deploy updates **that** site; custom domain and `*.web.app` stay in sync—no DNS change per deploy.
- Custom domain records live in **Firebase Console → project `agenticop-io` → Hosting → Custom domains**, not in `firebase.json`.
- To remove a mistaken domain (e.g. `agenticops.io`): Console → remove custom domain; or run `scripts/remove-firebase-custom-domain.ps1` with `gcloud auth login`.

## When unsure

Read **`docs/AI_CONTEXT.md`** before large copy or structural changes.
