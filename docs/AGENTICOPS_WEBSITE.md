# AgenticOps marketing site location

The **AgenticOps** static website (canonical **`agenticop.io`**, brand AgenticOps) is maintained under:

**`brand/agenticops-web/`**

It is **not** deployed from the monorepo root `firebase.json` anymore. Deploy from that folder:

```powershell
cd brand/agenticops-web
firebase deploy --only hosting:agenticops
```

For **Cursor / AI** work on copy, layout, domains, or Firebase Hosting for this brand, start with:

- `brand/agenticops-web/AGENTS.md`
- `brand/agenticops-web/docs/AI_CONTEXT.md`

To publish the same tree from a **private GitHub repository**, follow `brand/agenticops-web/docs/PRIVATE_REPOSITORY.md`.

The **wisptools.io** landing remains in **`landing/`** and deploys with `hosting:landing` from the repo root.
