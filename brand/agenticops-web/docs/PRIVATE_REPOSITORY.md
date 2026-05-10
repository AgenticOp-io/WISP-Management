# Publishing this site from a private GitHub repository

## Goal

Keep **AgenticOps marketing** (this tree) in a **private** remote while optionally leaving **WISP-Management** public or separately permissioned.

## Existing private repository

A **private** repo was created for this site (sync content from `brand/agenticops-web/` when the monorepo changes):

- **https://github.com/theorem6/agenticops-web** (default branch: `main`)

Local clone used for the first push may live outside the monorepo (e.g. `Downloads/agenticops-web`). Either push updates from that clone or re-copy from `brand/agenticops-web/` and commit.

## Option A — New repo from this folder

1. Create an empty **private** repository on GitHub (no README).
2. Copy or clone WISP-Management and copy **`brand/agenticops-web/`** contents to the new repo root (so `index.html`, `firebase.json`, and `.firebaserc` sit at the repository root).
3. `git init`, commit, add remote, push:
   ```powershell
   git init
   git add .
   git commit -m "Initial AgenticOps marketing site"
   git remote add origin https://github.com/YOUR_ORG/agenticops-web.git
   git branch -M main
   git push -u origin main
   ```
4. Install Firebase CLI if needed; `firebase login`.
5. Confirm `.firebaserc` **`default` project** is **`agenticop-io`** (dedicated Hosting for **`agenticop.io`**). Override only if you intentionally use another GCP project.
6. Deploy:
   ```powershell
   firebase deploy --only hosting --project agenticop-io
   ```

## Option B — Git subtree (stay monorepo, push subtree to private)

From WISP-Management repo root (advanced; preserves history for this subtree only if configured):

```bash
git subtree split --prefix=brand/agenticops-web -b agenticops-web-export
git push https://github.com/YOUR_ORG/agenticops-web.git agenticops-web-export:main
```

(Exact refs depend on your branching strategy.)

## CI

If you add GitHub Actions, use a **`FIREBASE_SERVICE_ACCOUNT`** or **`GCP_SA_KEY`** secret and `firebase deploy --token` / workload identity — mirror patterns from the main repo’s workflows without copying secrets into this doc.

## Keeping monorepo + private repo in sync

Either treat the **private repo as source of truth** for marketing and periodically sync into `brand/agenticops-web/`, or **only** maintain the monorepo path and use subtree split when publishing. Pick one flow to avoid drift.
