# GitHub: move to **AgenticOps** org umbrella

Snapshot from **`theorem6`** account (David Peterson), May 2026. Use this as the runbook; update after each step.

---

## What exists today

| GitHub account / org | Type | Your role | Notes |
|----------------------|------|-----------|--------|
| **[theorem6](https://github.com/theorem6)** | User | Owner | Personal account |
| **[4GEngineer](https://github.com/4GEngineer)** | Organization | **Admin** | Main engineering org today |
| **[AgenticOps](https://github.com/AgenticOps)** | Organization | **Not a member** (API) | Created 2023; **0 public repos**; slug **`AgenticOps`** is **taken** |

**theorem6 is not an organization** — only a user. Repos under `theorem6/...` are personal repos, not “under theorem6 org.”

### Repos you care about (target umbrella)

| Repo | Current location | Visibility |
|------|------------------|------------|
| **WISP-Management** | `4GEngineer/WISP-Management` | Public |
| **chrysalis** | `4GEngineer/chrysalis` | (check in Console) |
| **Bandwidth-Test-Manager** | `4GEngineer/Bandwidth-Test-Manager` | (check in Console) |
| **fragility-discovery-engine** | `theorem6/fragility-discovery-engine` | Private |
| **agenticops-web** | `theorem6/agenticops-web` | Private |

### Other repos on **4GEngineer** (decide keep / archive / leave)

- `ftth_9-25-25`, `ltepci`, `open5gs-distributed` — not in the AgenticOps product list; transfer only if you want one org for everything.

### Stale references (fix after move)

- Local clone **WISP-Management** may still use remote `theorem6/WISP-Management`; canonical remote is **`https://github.com/4GEngineer/WISP-Management.git`** (GitHub redirects old paths in some cases — still update remotes).
- Marketing site **`proof.html`** still links some assets to **`theorem6/...`**; after migration, standardize on **`AgenticOps/...`**.

---

## Recommended strategy (pick one)

### Path A — **Rename org `4GEngineer` → `AgenticOps`** (simplest if you control both slugs)

Best when you own the empty **AgenticOps** org or can free the slug.

1. **Free the slug `AgenticOps`:**
   - If **you** own [github.com/AgenticOps](https://github.com/AgenticOps): Settings → rename org to e.g. `AgenticOps-archive` or delete if unused.
   - If **someone else** owns it: recover access or choose Path B.
2. **4GEngineer** → Settings → Profile → **Change organization name** → **`AgenticOps`**.
   - GitHub sets up redirects from `4GEngineer/repo` → `AgenticOps/repo` for a period.
3. **Transfer personal repos** into the renamed org:
   - `theorem6/agenticops-web` → `AgenticOps/agenticops-web`
   - `theorem6/fragility-discovery-engine` → `AgenticOps/fragility-discovery-engine`
4. Update remotes, CI secrets, Firebase/GitHub deploy keys, and site links (`4GEngineer` → `AgenticOps`).

**Pros:** One org, minimal transfer count for repos already on 4GEngineer.  
**Cons:** Must resolve slug conflict with existing **AgenticOps** org.

### Path B — **Use existing `AgenticOps` org; transfer everything in**

Best when you already control **AgenticOps** (or will get owner invite) and want to keep **4GEngineer** as legacy/archive.

1. **AgenticOps** → Settings → Members → invite **`theorem6`** as **Owner**.
2. Accept invite; confirm: `gh api user/memberships/orgs` includes `AgenticOps`.
3. Run transfers (Console or script below):
   - From **4GEngineer:** `WISP-Management`, `chrysalis`, `Bandwidth-Test-Manager`, (+ optional others).
   - From **theorem6:** `agenticops-web`, `fragility-discovery-engine`.
4. Optional: archive **4GEngineer** org after redirects settle.

**Pros:** Brand name matches product without rename gymnastics if you already own AgenticOps.  
**Cons:** Many transfers; need **admin** on source and **create repo** on target.

### Path C — **New org** (only if `AgenticOps` slug unavailable and rename blocked)

Create e.g. `AgenticOps-io` or `agenticops-engineering`, transfer all repos, update branding. Use only if A and B fail.

---

## Transfer mechanics (Path B)

**Requirements**

- Admin on source repo (you have this on 4GEngineer as org admin; you own personal repos).
- Permission to **create repositories** in target org **AgenticOps**.
- No name collision in target (`AgenticOps/WISP-Management` must not already exist).

**GitHub CLI** (after `gh auth refresh -h github.com -s admin:org`):

```powershell
cd brand/agenticops-web/scripts
.\transfer-to-agenticops-org.ps1 -WhatIf    # dry run
.\transfer-to-agenticops-org.ps1            # execute
```

**Console:** Repo → Settings → General → **Transfer ownership** → organization **AgenticOps**.

**API (single repo):**

```powershell
gh api repos/4GEngineer/chrysalis/transfer -X POST -f new_owner=AgenticOps
```

A trial transfer of `theorem6/agenticops-web` → `AgenticOps` failed with **422** (“Could not resolve…”) because **`theorem6` is not a member of `AgenticOps`** with transfer rights.

---

## After migration checklist

- [ ] `git remote set-url origin https://github.com/AgenticOps/WISP-Management.git` (and each clone)
- [ ] GitHub Actions / deploy keys / Dependabot on new paths
- [ ] Firebase / GCP linked to GitHub (re-authorize if needed)
- [ ] Update **agenticop.io** links: `4GEngineer` → `AgenticOps`, `theorem6` → `AgenticOps` where appropriate
- [ ] Update **README** clone URLs in WISP-Management, Chrysalis, BTM
- [ ] LinkedIn / docs / `docs/CHRYSALIS_SOURCE_OF_TRUTH.md`
- [ ] npm/pnpm lockfiles or submodules that embed old URLs (grep `github.com/4GEngineer` and `theorem6`)

---

## Target layout (end state)

```text
github.com/AgenticOps/
├── WISP-Management          # wisptools.io product monorepo
├── chrysalis                # verification engine
├── Bandwidth-Test-Manager
├── fragility-discovery-engine
└── agenticops-web           # marketing site (or keep only in monorepo brand/)
```

**theorem6** remains your personal account; product repos live under **AgenticOps**.

---

## What this repo cannot do automatically

- Claim or delete the existing **AgenticOps** org without your login to that org’s owner account.
- Rename **4GEngineer** without org-owner confirmation in the browser.
- Transfer private repos without **`repo`** scope and target-org membership.

When **AgenticOps** membership is fixed, re-run `transfer-to-agenticops-org.ps1` and then ask for a follow-up pass to update marketing-site GitHub URLs.
