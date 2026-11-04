# Single-use fork (one org, simple login)

This is the **inverse** of [multitenant-fork](../multitenant-fork/README.md): one deployment serves **one organization**, with **email + password only** (no Google OAuth, demo visitor, or self-service org creation).

The fork lives on branch **`fork/single-use`** in this repo. Production multitenant work stays on `main`; single-use sites build from the fork branch (or from `main` with single-use env — same code, different config).

## Quick start

```bash
cd Module_Manager
cp .env.single-use.example .env.single-use
# Set PUBLIC_SINGLE_TENANT_ID to your Mongo tenant _id (see npm run demo:seed at repo root)

npm run build:single-use
cd ..
firebase deploy --only hosting:management --project wisptools-production
```

Create the login user (Firebase Auth):

```bash
# From repo root, with wisptools-production service account or gcloud ADC:
set FIREBASE_PROJECT_ID=wisptools-production
set GOOGLE_APPLICATION_CREDENTIALS=path\to\wisptools-production-firebase-adminsdk.json
node scripts/create-demo-user.js demo@wisptools.io YourSecurePassword
```

API on GCE should set `SINGLE_TENANT_ID` to the same tenant id as `PUBLIC_SINGLE_TENANT_ID`.

## What the fork changes

| Area | Behavior |
|------|----------|
| Login UI | Email + password only; no Google, “demo visitor”, or feature marketing blocks |
| Tenant flows | `/tenant-setup` and `/tenant-selector` redirect to dashboard |
| Tenant resolution | `PUBLIC_SINGLE_TENANT_MODE` + pinned tenant id (see [SINGLE_TENANT_MODE.md](../guides/SINGLE_TENANT_MODE.md)) |
| Build | `npm run build:single-use` uses Vite mode `single-use` and `.env.single-use` |

## Env reference

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SIMPLE_LOGIN` | `true` — minimal login (also implied by `single-use` Vite mode) |
| `PUBLIC_SINGLE_TENANT_MODE` | `true` |
| `PUBLIC_SINGLE_TENANT_ID` | Mongo / API tenant document id |
| `PUBLIC_SINGLE_TENANT_DISPLAY_NAME` | Label on login and UI |
| `SINGLE_TENANT_ID` | Same id on Node API / GCE `.env` |

## Related docs

- [SINGLE_TENANT_MODE.md](../guides/SINGLE_TENANT_MODE.md)
- [DEMO_SITE.md](../deployment/DEMO_SITE.md) — seeded demo data (optional)
- [MULTITENANT_RESTORATION.md](../multitenant-fork/MULTITENANT_RESTORATION.md) — going back to SaaS multitenant

## Git workflow

```bash
git fetch origin
git checkout fork/single-use
# deploy/build as above; merge fixes from main when needed:
git merge main
```
