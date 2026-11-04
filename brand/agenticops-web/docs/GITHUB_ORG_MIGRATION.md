# GitHub: **AgenticOp.io** umbrella (`AgenticOp-io`)

Snapshot from **`theorem6`**, May 2026.

| Layer | Name |
|-------|------|
| **Public brand / domain** | **AgenticOp.io** → https://agenticop.io |
| **Marketing voice** | **Agentic Ops** (two words) — verification-backed modernization |
| **GitHub org slug** | **`AgenticOp-io`** → https://github.com/AgenticOp-io (no dots in slug) |
| **Legacy GitHub org** | **4GEngineer** — **deleted** May 2026 |
| **Unavailable slug** | **`AgenticOps`** — taken by another org; do **not** use for new repos or links |

---

## What exists today

| Account / org | Role | Notes |
|---------------|------|--------|
| **[theorem6](https://github.com/theorem6)** | User | Personal account |
| **4GEngineer** | — | **Deleted** (repos removed) |
| **[AgenticOps](https://github.com/AgenticOps)** | — | **Not ours** — ignore |
| **[AgenticOp-io](https://github.com/AgenticOp-io)** | Owner | Canonical org for all product repos |

### Repos (on **AgenticOp-io**)

| Repo | Location |
|------|----------|
| WISP-Management | `AgenticOp-io/WISP-Management` |
| chrysalis | `AgenticOp-io/chrysalis` |
| Bandwidth-Test-Manager | `AgenticOp-io/Bandwidth-Test-Manager` |
| fragility-discovery-engine | `AgenticOp-io/fragility-discovery-engine` |
| agenticops-web | `AgenticOp-io/agenticops-web` |

---

## Steps (completed May 2026)

### 1) Create org **AgenticOp-io**

1. [Create organization](https://github.com/organizations/plan) (Free is fine).
2. **Account name:** `AgenticOp-io`
3. **Display name:** `AgenticOp.io`
4. **Website:** https://agenticop.io
5. Add **theorem6** as **Owner**.

### 2) Transfer repositories

```powershell
gh auth refresh -h github.com -s admin:org
cd brand/agenticops-web/scripts
.\transfer-to-agenticop-io-org.ps1 -WhatIf
.\transfer-to-agenticop-io-org.ps1
```

Requires: admin on each **4GEngineer** repo; **create repository** on **AgenticOp-io**.

**May 2026 status:** All five product repos live under **AgenticOp-io** (including **chrysalis**).

### 3) Post-migration

- [x] `git remote set-url origin https://github.com/AgenticOp-io/WISP-Management.git`
- [x] Org profile: display **AgenticOp.io**, link **https://agenticop.io**
- [x] Site links use `github.com/AgenticOp-io/...`
- [x] Retired **4GEngineer** org and remaining telecom repos

---

## Naming cheat sheet

| Use for | Name |
|---------|------|
| Domain, legal-ish brand | **AgenticOp.io** |
| Prose / LinkedIn | **Agentic Ops** |
| GitHub URLs | **AgenticOp-io** |
| Old engineering org | **4GEngineer** (removed) |
| Do not use | **AgenticOps** (GitHub org slug conflict) |

Firebase Hosting stays on GCP project **`agenticop-io`** (separate from GitHub org slug).

## GitHub org branding (live)

- **Profile:** display name **AgenticOp.io**, blog **https://agenticop.io**, contact **hello@agenticop.io**
- **Org README:** [AgenticOp-io/.github/profile/README.md](https://github.com/AgenticOp-io/.github/blob/main/profile/README.md) (shown on https://github.com/AgenticOp-io)
- **Local source copy:** `brand/agenticops-web/.github-profile-README.md` (edit here, then push to `.github` repo)
- **Avatar (400×400):** `brand/agenticops-web/org-avatar-400.png` (from `logo.svg`; matches `?s=400` on avatars CDN). Also in [`.github/profile/avatar.png`](https://github.com/AgenticOp-io/.github/blob/main/profile/avatar.png). Upload: **Org settings → Profile**, or `gh auth refresh -s user` then `node scripts/upload-org-avatar.mjs`.
