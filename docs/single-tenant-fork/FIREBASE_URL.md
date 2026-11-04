# WISP Management — Firebase URL only (no custom domain)

Use this when you want the **Module_Manager** app on a stable Firebase URL and **not** move `wisptools.io`, `agenticop.io`, or App Hosting domains.

## What is what

| Thing | Repo / deploy | URL |
|-------|----------------|-----|
| **WISP Management app** (demo / single-use) | This repo → `firebase deploy --only hosting:management` | **https://wisptools-management.web.app** |
| wisptools.io **landing** (static marketing) | This repo → `hosting:landing` | https://wisptools-production.web.app |
| **agenticop.io** marketing site | **Separate:** [theorem6/agenticops-web](https://github.com/theorem6/agenticops-web) | agenticop.io (not this deploy) |
| Old App Hosting UI | `lte-pci-mapper` Firebase project | `*.hosted.app` (optional; not required) |

`brand/agenticops-web/` in this monorepo is a **copy** of the marketing site for convenience. **Do not** deploy it when publishing the management app.

## Deploy management app only

```powershell
cd Module_Manager
copy .env.single-use.example .env.single-use   # once
npm run build:single-use
cd ..
firebase deploy --only hosting:management --project wisptools-production
```

Login: **https://wisptools-management.web.app/login**

Firebase project: `wisptools-production`  
Hosting site id: `wisptools-management`

## Demo user (wisptools-production Auth)

```powershell
set FIREBASE_PROJECT_ID=wisptools-production
set GOOGLE_APPLICATION_CREDENTIALS=path\to\wisptools-production-firebase-adminsdk.json
node scripts/create-demo-user.js demo@wisptools.io YourPassword
```

Backend API is on GCE (`https://hss.wisptools.io`). The single-use build sets `VITE_BACKEND_URL` so Plan/Deploy/Monitor modules call the API directly (Firebase Hosting on `wisptools-management` does not ship `apiProxy` functions).

Maps load from **the same Hosting origin** (`/modules/coverage-map` iframe). Do not point the map at `wisptools.io` — that site is landing-only since the Mar 2026 split (`c723626` / `561b874`).

**Canonical demo URL:** https://wisptools-management.web.app/login  
**Custom domain (optional):** https://management.wisptools.io/login — same build, if DNS is wired to the `wisptools-management` site.
