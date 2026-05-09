# Agent instructions — AgenticOps marketing site

Use this file when editing **this folder** (`brand/agenticops-web/` in the WISP-Management monorepo, or the **root** of the private `agenticops-web` Git repository after a split).

## What this is

- **Product:** Static multi-page marketing site for **AgenticOps** (commercial / methodology brand). **Positioning:** AgenticOps is **transformative code** (verification-first); **Chrysalis** is the **first flagship** (legacy migration engine). The **long arc** names **macro-scale systemic fragility** (finance, governance, institutional cascades) as intellectual north star — **do not** imply a separate shipped product there unless explicitly directed.
- **Canonical public domain:** `https://agenticop.io` (spelling **AgenticOps**, domain **`agenticop.io`** — note missing “s”).
- **Optional future domain:** `agenticops.io` — only if acquired; see `DOMAIN_DECISION_CHECKLIST.md`. Do **not** assume it is attached to Firebase.
- **Sibling brand:** **wisptools.io** — public MIT WISP stack (**WISP Management** + **Bandwidth Test Manager**). It is the **proof** shipped in production; link to it from this site where appropriate. **Do not** merge wisptools messaging into AgenticOps copy as if they were one product name.

## Hard rules

1. **Chrysalis** — Referenced as **private alpha** / verification migration engine; **primary proving surface on site copy is legacy PHP** (capture → replay → chimera). **No public GitHub URL** on any HTML page or JSON-LD until an explicit human decision says otherwise. Update `index.html`, JSON-LD `sameAs`, and `LINKEDIN_LAUNCH.md` together if that ever changes.
2. **Tone:** Confident, technical, anti-hype. Prefer “shipped,” “verified,” “in production” over vague “AI-powered.”
3. **Hosting:** Firebase Hosting site **`agenticops-production`** (typical), target **`agenticops`** in local `firebase.json`. Deploy from **this directory**: `firebase deploy --only hosting:agenticops`.
4. **URLs:** Multi-page site uses **real `.html` paths** (e.g. `/services.html`). Do **not** add a catch-all rewrite to `index.html` for HTML routes (that broke interior pages historically).
5. **Shared chrome:** `ao-layout.js` injects nav/footer from `data-ao-page` on `<body>`. Edit navigation in **one place** there.
6. **Styles:** `agenticops.css` — dark navy, cyan/violet accents. Keep typography: DM Sans + JetBrains Mono for labels/stages.

## Key files

| File | Role |
|------|------|
| `index.html` | Home, hero, Explore hub |
| `services.html`, `method.html`, `proof.html`, `trust.html`, `about.html`, `contact.html` | Interior chapters |
| `ao-layout.js` | Shared layout + active nav |
| `agenticops.css` | Global styles |
| `logo.svg` | Brand mark |
| `sitemap.xml`, `robots.txt`, `humans.txt` | SEO / discovery |
| `DNS_SETUP.md` | Firebase + DNS + domain removal notes |
| `docs/AI_CONTEXT.md` | Full operator intent for future AI sessions |

## Firebase / domains

- **Custom domain is bound to the Hosting site, not to a single deploy URL.** In production, **`agenticop.io`** (and `www` if configured) is attached to site **`agenticops-production`** alongside the default Firebase URL **`https://agenticops-production.web.app`**. Every `firebase deploy --only hosting:agenticops` releases a new version to **that site**; traffic to **both** the custom domain and `*.web.app` serves the same content—no extra DNS step per deploy.
- Custom domain records live in **Firebase Console → Hosting → agenticops-production → Custom domains**, not in `firebase.json`.
- To remove a mistaken domain (e.g. `agenticops.io`): Console → remove custom domain; or run `scripts/remove-firebase-custom-domain.ps1` with `gcloud auth login`.

## When unsure

Read **`docs/AI_CONTEXT.md`** before large copy or structural changes.
