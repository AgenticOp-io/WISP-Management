# AgenticOps.io — landing page

The new parent brand. Static landing page for **agenticop.io** (brand: AgenticOps) — verification-backed
migrations and agent-led modernization for legacy stacks.

## Brand architecture

- **AgenticOps** — the operating model and commercial front. Pilot / Run / Enablement.
- **Chrysalis** — the verification-backed migration engine under the hood (oracle
  corpus, automated replay, chimera cutover). **Private alpha. Not in public git
  yet. Do NOT push it to a public remote without an explicit decision.** An MIT
  open-source release is *planned* — referenced on the site as future tense only.
- **wisptools.io** — public, MIT-licensed sub-brand. Live in production. Featured
  on the page as the proof point that the AgenticOps method works.
- **Bandwidth Test Manager, Module Manager, Voice/SIP & UC, Distributed EPC + HSS,
  Field App (`wisp-field-app/` in repo)** — supporting proofs; Field App source:
  [wisp-field-app on GitHub](https://github.com/theorem6/WISP-Management/tree/main/wisp-field-app).

> **Operational guardrail:** The landing page contains **no public GitHub link
> for Chrysalis**. If/when you flip Chrysalis open, update `index.html`, JSON-LD
> `Organization.sameAs`, and `LINKEDIN_LAUNCH.md` together.

## Layout

Multi-page site (Firebase **no longer** rewrites all URLs to `index.html`).

- `index.html` — home: hero, positioning, **Explore** hub linking to chapters
- `services.html`, `method.html`, `proof.html`, `trust.html`, `about.html`, `contact.html`
- `ao-layout.js` — injects shared nav + footer from `data-ao-page`
- `agenticops.css` — premium **deep** dark theme + hub cards + interior pages
- `logo.svg` — shield + chrysalis wings + AO monogram + verified badge
- `404.html` — themed 404 page
- `robots.txt`, `sitemap.xml`, `humans.txt`

## Hosting

Deployed to Firebase Hosting site **`agenticops-production`** mapped to the
`agenticops` target in `firebase.json`. WISPTools.io continues to deploy from
`landing/` under the `landing` target.

```bash
# Deploy AgenticOps only
firebase deploy --only hosting:agenticops

# Deploy WISPTools only
firebase deploy --only hosting:landing

# Deploy both
firebase deploy --only hosting:agenticops,hosting:landing
```

## Pre-deploy setup (one-time)

You will need to:

1. Create a Firebase Hosting site named `agenticops-production` (or your preferred
   name) in the Firebase console for project `wisptools-production` — or create a
   separate Firebase project if you want billing isolation.
2. Add the custom domain `agenticop.io` to that site and complete DNS verification.
3. Update `.firebaserc` if you used a different site ID.

## SEO

`index.html` ships with canonical URL, full Open Graph + Twitter Card tags,
keyword meta, and JSON-LD (`WebSite`, `Organization`, `Service`). For richer
social previews, add a 1200×630 PNG `og:image` and update the meta tag.

## Brand notes

- **Voice**: confident, technical, anti-hype. We say "shipped," "verified," and
  "in production" more than "AI-powered."
- **Color**: dark navy base, cyan + violet gradient accents. Violet leans into
  Chrysalis's identity (pillar 02 in the differentiator block).
- **Type**: DM Sans for UI, JetBrains Mono for stages / labels.
- **Taglines (A/B)**:
  - "Agentic operations. Verified migrations."
  - "Agents explore. Chrysalis proves."
  - "Legacy change, grounded in production behavior."

## Editorial guardrails

- Chrysalis is referenced as **private alpha**. No public repo link. MIT release
  is **planned** (future tense).
- WISPTools.io and its sub-projects are public — links to GitHub are fine.
- See `LINKEDIN_LAUNCH.md` for ready-to-post copy and a "do NOT post" checklist.
