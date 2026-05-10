# DNS setup for agenticop.io (current) + migration to agenticops.io (December)

Current decision:

- **Brand:** AgenticOps
- **Live domain now:** `agenticop.io`
- **Target domain later:** `agenticops.io` (if secured when it expires)

This guide keeps production stable now and makes the December switch fast.

**Firebase Hosting for AgenticOps:** dedicated GCP/Firebase project **`agenticop-io`**, default site **`agenticop-io`** → **`https://agenticop-io.web.app`**. **`agenticop.io`** should be attached here (Console → Hosting → Custom domains).

**If the site looks wrong (white background, `/agenticops.css` 404):** the domain may still point at a **different** Hosting site, or an old deploy. Fix: confirm **`agenticop.io`** is listed on project **`agenticop-io`** / site **`agenticop-io`**. To mirror the same files to **`agenticops-production`** on **`wisptools-production`**, run `scripts/deploy-custom-domain-hosting.ps1`.

---

## Remove `agenticops.io` from Firebase Hosting

Custom domains are **not** stored in `firebase.json`; Firebase keeps them on the Hosting site. To drop `agenticops.io` if it was added by mistake or you no longer control it:

### Option A — Firebase Console

1. Open the Hosting site that wrongly lists the domain — historically **[agenticops-production](https://console.firebase.google.com/project/wisptools-production/hosting/sites/agenticops-production)** under **`wisptools-production`**, or any other site shown in Console for **`agenticop.io`** / **`www.agenticop.io`**.
2. Under **Custom domains**, select those hostnames → menu (**⋮**) → **Remove domain**.
3. Repeat on any other Firebase site until **`agenticop.io`** is free to add under **`agenticop-io`**.

Also remove any leftover Firebase **verification TXT** / **A / CNAME** records for `agenticops.io` at your DNS host so nothing still points at Hosting.

### Option B — Script (gcloud auth)

From **this site directory** (`brand/agenticops-web/` in the monorepo, or repo root after a private split), after `gcloud auth login`:

```powershell
.\scripts\remove-firebase-custom-domain.ps1 -WhatIf
.\scripts\remove-firebase-custom-domain.ps1 -Domain agenticops.io
```

---

## 1) Current production domain (agenticop.io)

Use Firebase project **`agenticop-io`** → Hosting → default site **`agenticop-io`** as the origin.

### Firebase console steps

1. Firebase Console → **`agenticop-io`** → **Hosting** → site **`agenticop-io`** ([direct link](https://console.firebase.google.com/project/agenticop-io/hosting)).
2. Add custom domain:
   - `agenticop.io`
   - `www.agenticop.io`
3. Follow Firebase prompts for TXT verification + A/CNAME records.
4. Set redirect to `www -> apex` so canonical stays `https://agenticop.io/`.

### DNS records to expect

Use the exact values Firebase shows, but these are typical:

```text
agenticop.io      TXT    <firebase verification value>
agenticop.io      A      151.101.1.195
agenticop.io      A      151.101.65.195
www.agenticop.io  CNAME  agenticop-io.web.app
```

### Quick verification

```powershell
nslookup agenticop.io 1.1.1.1
nslookup -type=CNAME www.agenticop.io 1.1.1.1
curl.exe -I https://agenticop.io
curl.exe -I https://www.agenticop.io
```

You want:

- DNS resolves
- HTTPS returns `200`
- `www` redirects to apex

---

## 2) Email setup now (`hello@agenticop.io`)

Pick exactly one provider (do not mix MX providers):

- Cloudflare Email Routing (free forwarding)
- ImprovMX (free forwarding)
- Google Workspace / Fastmail (paid full mailbox)

If you use **Google Workspace** and **GoDaddy** for DNS (multiple domains, primary-domain change, `admin@` → Gmail labels), follow:

[docs/guides/GODADDY_GOOGLE_WORKSPACE_MULTI_DOMAIN.md](../docs/guides/GODADDY_GOOGLE_WORKSPACE_MULTI_DOMAIN.md)

After setup:

```powershell
nslookup -type=MX agenticop.io 1.1.1.1
```

---

## 3) December migration plan (if agenticops.io is acquired)

Goal: keep SEO and links intact while flipping to the stronger spelling.

### Day 0 (acquisition day)

1. Buy/register `agenticops.io`.
2. Add `agenticops.io` and `www.agenticops.io` to the same Firebase Hosting site.
3. Wait for SSL status to become active.

### Cutover

1. Update site metadata to use `https://agenticops.io`:
   - canonical
   - Open Graph URL/image host
   - Twitter image host
   - sitemap and robots
   - JSON-LD `@id` / `url` / logo URL
2. Deploy:

```powershell
cd brand/agenticops-web   # monorepo; omit if this folder is your repo root
firebase deploy --only hosting --project agenticop-io
```

3. Add permanent redirects:
   - `agenticop.io/*` -> `https://agenticops.io/:path*` (301)
   - `www.agenticop.io/*` -> `https://agenticops.io/:path*` (301)

### Post-cutover checks

```powershell
curl.exe -I https://agenticop.io
curl.exe -I https://www.agenticop.io
curl.exe -I https://agenticops.io
```

Expected:

- old domain returns `301` to new domain
- new domain returns `200`

---

## 4) Anti-footgun checklist

- Do not run two different canonical domains at once.
- Do not keep mixed URLs in metadata (`agenticop` + `agenticops`) after cutover.
- Do not leave both domains serving `200` forever; one must be canonical.
- Keep both domains renewed for at least 2 years after migration.
