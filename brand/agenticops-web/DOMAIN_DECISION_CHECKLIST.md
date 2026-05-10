# December domain go/no-go checklist

Decision date target: first week of December 2026.

Current posture:

- Brand stays **AgenticOps**
- Live domain is **agenticop.io**
- Preferred long-term domain is **agenticops.io**

---

## Step 1: Run the go/no-go test

Answer these in order:

1. Can `agenticops.io` be bought/renewed at a sane cost now?
2. Is legal/trademark risk acceptable?
3. Can we schedule one maintenance window for metadata + redirects?

If all three are yes -> **GO (Path A)**.  
If any answer is no -> **NO-GO (Path B)**.

---

## Path A (GO): secure agenticops.io and migrate

### A1) Acquire and wire DNS

- Register/purchase `agenticops.io`.
- Add apex + `www` domains in Firebase Hosting on project **`agenticop-io`** (site **`agenticop-io`**).
- Verify TXT and SSL active.

### A2) Flip canonical metadata

Update these files:

- `index.html` canonical, OG URL/image, Twitter image, JSON-LD URLs
- `sitemap.xml`
- `robots.txt`
- `humans.txt`
- LinkedIn launch links

### A3) Add permanent redirects

- `agenticop.io/*` -> `https://agenticops.io/:path*` (301)
- `www.agenticop.io/*` -> `https://agenticops.io/:path*` (301)

### A4) Validate

```powershell
curl.exe -I https://agenticop.io
curl.exe -I https://www.agenticop.io
curl.exe -I https://agenticops.io
```

Expected:

- old domain = `301`
- new domain = `200`

### A5) Keep both domains

- Renew both for at least 2 years.
- Keep redirects indefinitely.

---

## Path B (NO-GO): keep agenticop.io for another cycle

### B1) Stay consistent

- Keep all metadata canonicalized to `https://agenticop.io`.
- Keep brand spelling as **AgenticOps** in copy.

### B2) Reduce confusion

- Add FAQ line on site or sales deck:  
  "Brand is AgenticOps. Current domain is agenticop.io."

### B3) Reserve alternatives now

- Buy backup domains if available (`.com`, `get-` variants, etc.).
- Set them to redirect to `agenticop.io`.

### B4) Re-evaluate quarterly

- Check `agenticops.io` availability and price every quarter.
- Repeat this checklist in 90 days.

---

## Revenue-first guardrail

Regardless of path:

- Do not pause pipeline or sales messaging for branding perfection.
- Keep offers unchanged: Pilot, Run, Enablement.
- Chrysalis code is public at **https://github.com/4GEngineer/chrysalis** (early); how you pitch pilots and roadmap stays your call.
