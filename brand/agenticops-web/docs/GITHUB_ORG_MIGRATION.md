# GitHub: **AgenticOp.io** org umbrella

Snapshot from **`theorem6`** (David Peterson), May 2026.

**Brand:** **AgenticOp.io** (matches **https://agenticop.io**).  
**GitHub org slug (no dots):** **`AgenticOp-io`** → **https://github.com/AgenticOp-io**  
Do **not** use **`agenticops.*`** hostnames or the old **`AgenticOps`** org name for new work unless retiring legacy assets.

---

## What exists today

| GitHub account / org | Type | Your role | Notes |
|----------------------|------|-----------|--------|
| **[theorem6](https://github.com/theorem6)** | User | Owner | Personal account |
| **[4GEngineer](https://github.com/4GEngineer)** | Organization | **Admin** | Main engineering org today |
| **[AgenticOps](https://github.com/AgenticOps)** | Organization | **Not a member** | Legacy slug; **0 public repos** — do **not** use for new branding |
| **AgenticOp-io** | — | **Does not exist yet** | **Create** this org (slug appears available) |

**theorem6** is a **user**, not an organization.

### Repos → move under **AgenticOp-io**

| Repo | Current location |
|------|------------------|
| WISP-Management | `4GEngineer/WISP-Management` |
| chrysalis | `4GEngineer/chrysalis` |
| Bandwidth-Test-Manager | `4GEngineer/Bandwidth-Test-Manager` |
| fragility-discovery-engine | `theorem6/fragility-discovery-engine` (private) |
| agenticops-web | `theorem6/agenticops-web` (private) |

Optional on **4GEngineer:** `ftth_9-25-25`, `ltepci`, `open5gs-distributed`.

---

## Recommended path: **create `AgenticOp-io`, transfer repos**

GitHub organization logins **cannot** be `AgenticOp.io` (no dots). Use **`AgenticOp-io`** and set the org **display name** to **AgenticOp.io** in profile settings.

### 1) Create the org

1. [Create organization](https://github.com/organizations/plan) → choose a plan (Free is fine).
2. **Organization account name:** **`AgenticOp-io`** (verify availability in the form).
3. **Organization display name:** **AgenticOp.io**
4. Add **theorem6** as **Owner**.

### 2) Transfer repositories

**Requirements:** admin on each source repo; **create repository** permission on **AgenticOp-io**.

```powershell
gh auth refresh -h github.com -s admin:org
cd brand/agenticops-web/scripts
.\transfer-to-agenticop-org.ps1 -WhatIf
.\transfer-to-agenticop-org.ps1
```

Or: each repo → **Settings** → **Transfer ownership** → **AgenticOp-io**.

### 3) Retire or archive **4GEngineer**

After transfers and redirect period:

- Archive **4GEngineer**, or leave as telecom/LTE-only repos if you moved only product repos.
- Ignore / rename **AgenticOps** empty org if you control it (legacy slug conflict).

### Alternative: rename **4GEngineer** → **AgenticOp-io**

Only if **`AgenticOp-io` slug is free** and you prefer one rename over many transfers. Same slug rules apply; you still transfer **theorem6** personal repos into the org.

---

## After migration

- [ ] `git remote set-url origin https://github.com/AgenticOp-io/WISP-Management.git` (each clone)
- [ ] Org profile: display name **AgenticOp.io**, link **https://agenticop.io**, logo
- [ ] GitHub Actions, deploy keys, Dependabot on new paths
- [ ] Site + docs: `4GEngineer` / `theorem6` product links → **`AgenticOp-io`**
- [ ] Footer org link: **https://github.com/AgenticOp-io**

---

## Target layout

```text
github.com/AgenticOp-io/     # brand: AgenticOp.io
├── WISP-Management
├── chrysalis
├── Bandwidth-Test-Manager
├── fragility-discovery-engine
└── agenticops-web
```

**theorem6** stays your personal account; product code lives under **AgenticOp-io**.

---

## Naming reference

| Use | Do not use for new work |
|-----|-------------------------|
| **AgenticOp.io** (brand) | AgenticOps (legacy marketing spelling) |
| **agenticop.io** (domain) | agenticops.io (unless you own and redirect) |
| **AgenticOp-io** (GitHub org slug) | 4GEngineer, theorem6/* for product repos |

Repo folder names (`agenticops-web`, etc.) can stay as-is; only the **org owner** and **public URLs** change.
