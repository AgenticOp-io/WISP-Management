# AI development context — AgenticOps web & branding

This document captures **operator intent** and constraints gathered from ongoing work. Use it when continuing development in Cursor or another AI-assisted workflow.

---

## Business & brand map

| Layer | Name | Visibility | Notes |
|-------|------|------------|--------|
| Parent methodology / services brand | **AgenticOps** | Public site `agenticop.io` | **Transformative code** (verification-first). Narrative: Chrysalis as **first flagship**; long arc toward **macro systemic fragility** (finance, governance, cascades) — **no separate named “future project”** on site unless operator adds it. |
| Engine (product name on site) | **Chrysalis** | **GitHub + pilot alpha** | Repo: **https://github.com/4GEngineer/chrysalis** (org **4GEngineer**, not inside theorem6/WISP-Management). PHP-first verification migration; pilots scoped **one system at a time**. |
| Public WISP / ISP proof stack | **wisptools.io** | Public MIT on GitHub | **WISP Management** (operations) + **Bandwidth Test Manager** (throughput proof). Featured as proof the methodology ships real systems. |
| Field tooling | **WISP Field App** | Public repo path under WISP-Management | Cited as shipped proof where relevant. |

**Important:** The operator deliberately **separates** AgenticOps marketing from the wisptools.io product story. Cross-link for credibility; do not blur naming or claim wisptools *is* AgenticOps.

---

## Domain strategy

- **Primary live domain for this site:** `agenticop.io` (apex + `www` as configured in Firebase).
- **`agenticops.io` (with “s”):** Was discussed as a **future** canonical if acquired; may **not** be owned or attached to Firebase. If Firebase lists it incorrectly, remove it (Console or `scripts/remove-firebase-custom-domain.ps1`). DNS registrar context has included **GoDaddy**.
- After any domain migration, keep **one** canonical URL in metadata (Open Graph, canonical link, JSON-LD); avoid mixed `agenticop` / `agenticops` in production metadata.

---

## Technical architecture (this site)

- **Stack:** Static HTML, CSS (`agenticops.css`), minimal vanilla JS (`ao-layout.js`). No Svelte/React build step for the marketing site.
- **Layout:** `ao-layout.js` reads `document.body.dataset.aoPage` and injects shared header/footer. Adding a page means: new `.html` file, set `data-ao-page`, add nav entry in `ao-layout.js`, extend `sitemap.xml` if needed.
- **Firebase Hosting:**
  - **Dedicated project:** **`agenticop-io`**. Default Hosting site **`agenticop-io`** → **`https://agenticop-io.web.app`** (where **`agenticop.io`** should be attached).
  - **Optional mirror:** **`agenticops-production`** on **`wisptools-production`** (`deploy-custom-domain-hosting.ps1`) for legacy **`*.firebaseapp.com`** URLs.
  - **Deploy:** From **`brand/agenticops-web/`** (or private repo root):  
    `firebase deploy --only hosting --project agenticop-io`  
    In the monorepo, **`--project`** avoids the root default **`wisptools-production`**.
  - **Rewrites:** Must **not** blanket-rewrite all routes to `index.html`; interior `.html` files must be served directly.

---

## Repository layout evolution

- **WISP-Management monorepo:** This site lives at **`brand/agenticops-web/`** so product code (`Module_Manager`, `landing/`, backend, etc.) stays separate from AgenticOps branding.
- **Private GitHub repository:** The operator wants the marketing site in its **own private repo**. Practical approach: copy or subtree-split `brand/agenticops-web/` into a new repo whose root contains `firebase.json`, `.firebaserc`, HTML assets, and `docs/`. See **`PRIVATE_REPOSITORY.md`**.

---

## Related operator goals (outside this folder)

- **wisptools.io landing** reframed around **WISP Management + Bandwidth Test Manager** and how they fit together (not generic “AI manifesto” copy).
- **Google Workspace / GoDaddy:** Multi-domain email, primary-domain changes, `admin@` aliases → Gmail labels — documented under monorepo `docs/guides/GODADDY_GOOGLE_WORKSPACE_MULTI_DOMAIN.md` (not deployed with this site).
- **Chrome Enterprise Core API:** OAuth scopes / domain-wide delegation — referenced in that guide if automation touches Admin SDK.

---

## Editorial guardrails (summary)

- Chrysalis: link **https://github.com/4GEngineer/chrysalis** where appropriate; distinguish from theorem6/WISP-Management URLs.
- WISPTools / Bandwidth Test Manager / Field App: public links OK when used as **proof**.
- Voice: anti-hype, engineering credibility, migration verification themes.

---

## Files safe from public Hosting uploads

`firebase.json` **ignore** patterns exclude `*.md`, `docs/**`, `scripts/**`, and `AGENTS.md` so internal runbooks are not served as static files. **Do not** remove those ignores without reviewing whether Git-tracked docs would become world-readable.
