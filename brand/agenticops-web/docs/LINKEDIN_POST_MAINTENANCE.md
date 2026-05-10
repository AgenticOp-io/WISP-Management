# LinkedIn post helper — `linkedin-new-project-post.html`

Local-only tool (lives under `docs/`; **Firebase Hosting ignores `docs/**`**, so this file is not part of the public site bundle). Open in a browser from disk to preview copy and use **Copy to clipboard** for LinkedIn.

## What must stay the same (or the page breaks)

These **element `id` values** are wired in the script at the bottom of `linkedin-new-project-post.html`. Do **not** rename or remove them unless you update the script in the same edit:

| `id` | Role |
|------|------|
| `preview-title` | H1 gradient span (title) |
| `preview-open` | Lead paragraph (HTML from `openingLine`) |
| `preview-mid` | Body blocks (HTML from `teaserLine`) |
| `preview-quote` | Pull quote |
| `preview-close` | Closing line before URL |
| `preview-url` | Pill link (`url` / `urlDisplay`) |
| `preview-whitepaper` | Optional whitepaper link row |
| `li-text` | Plain-text `<textarea>` for copy |
| `copy-btn` | Copy button |
| `open-li` | Open LinkedIn button |
| `toast` | Copy confirmation |

The **`CONFIG`** object keys are read by that script only. Safe to edit **values**; if you add new keys, extend the script yourself.

## What you should change for each campaign

- **`CONFIG.projectName`** — short headline fragment inside the H1.
- **`CONFIG.openingLine`**, **`CONFIG.teaserLine`** — use `**bold**` sparingly; script strips to plain text for LinkedIn.
- **`CONFIG.quoteLine`**, **`CONFIG.closingLine`**, **`CONFIG.url`**, **`CONFIG.urlDisplay`**, **`CONFIG.hashtags`**.
- **`CONFIG.whitepaperUrl`** / **`CONFIG.whitepaperLabel`** — public page is **`https://agenticop.io/whitepaper.html`**. Keep in sync with **`docs/WHITEPAPER.md`** + root **`WHITEPAPER.md`** (see below).

## Technical whitepaper (site + git)

- **Public page:** `https://agenticop.io/whitepaper.html` — loads **`/WHITEPAPER.md`** at site root and renders with [marked](https://marked.js.org/) (CDN on that page only).
- **Canonical markdown (edit in git):** `brand/agenticops-web/docs/WHITEPAPER.md` — **not** deployed by Firebase (`docs/**` is ignored). Chrysalis **`docs/AGENTICOP.md`** is **install / internal** documentation only; do **not** link it from the marketing site.
- **Deploy copy:** `brand/agenticops-web/WHITEPAPER.md` (same bytes as `docs/WHITEPAPER.md`) **is** uploaded to Hosting. After editing the doc, sync before deploy:

```powershell
cd brand/agenticops-web
.\scripts\sync-whitepaper.ps1
```

When the **URL or filenames** change, update: `whitepaper.html`, `index.html`, `proof.html`, `docs/linkedin-new-project-post.html` (`CONFIG.whitepaperUrl`), `sitemap.xml`, **`AGENTS.md`**, **`docs/AI_CONTEXT.md`**, and this file.

## Brand row logo

The preview uses **`https://agenticop.io/logo.svg`** so the mark loads when opening the file from `file://`. If the apex domain or asset path changes, update the `<img src>` in the HTML.
