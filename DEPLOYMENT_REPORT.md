# DEPLOYMENT REPORT - SPRINT W05

## Result

Deployment preparation PASS.

The `/website` source is ready for production deployment after CTO approval.

No deployment, DNS change, publishing, or Search Console verification was performed.

## Source Reviewed

- `index.html`
- `style.css`
- `script.js`
- `robots.txt`
- `sitemap.xml`
- `schema.json`
- `assets/`
- `README_DEPLOY.md`
- `render.yaml`
- `vercel.json`

## Platform Recommendation

Recommended platform: Vercel.

Reason:

- The site is a static homepage with no backend runtime.
- Vercel supports static project configuration through `vercel.json`, including clean URLs and headers.
- Vercel is simple for static marketing sites, custom domains, automatic HTTPS, and production rollback.
- Static 404 behavior remains clear because no SPA fallback rewrite is configured.

Render status:

- Render Static Site is also viable.
- Render is a good fallback if BA_Furniture wants to keep production operations in Render.
- `render.yaml` has been prepared without a wildcard rewrite so unknown URLs can return 404 instead of being masked by `index.html`.

Official docs referenced:

- Vercel project configuration and `vercel.json`: https://vercel.com/docs/project-configuration
- Vercel static configuration: https://vercel.com/docs/project-configuration/vercel-json
- Render Static Sites: https://render.com/docs/static-sites
- Render Blueprint YAML reference: https://render.com/docs/blueprint-spec

## Config Prepared

### Vercel

File: `vercel.json`

Prepared:

- `cleanUrls: true`
- `trailingSlash: false`
- Security headers:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Long cache header for `/assets/*`.

### Render

File: `render.yaml`

Prepared:

- Static runtime.
- Build command: `echo static`
- Publish path: `.`
- Pull request previews disabled.
- No `/* -> /index.html` rewrite, preserving 404 checks for static hosting.

## Production Build

Build type: static.

No package install or compile step is required.

Production publish directory:

- If deploying from the repository root: use `website` as root directory.
- If deploying from inside `/website`: publish directory is `.`.

Required production files:

- `index.html`
- `style.css`
- `script.js`
- `robots.txt`
- `sitemap.xml`
- `schema.json`
- `assets/`

Reports may remain in source control, but they are not required for public hosting.

## Verification Performed

Static checks:

- File presence checked.
- Local asset references checked.
- Internal anchors checked.
- Portal link checked.
- Hotline link checked.
- Inline JSON-LD parse checked.
- `schema.json` parse checked.
- `vercel.json` parse checked.
- `render.yaml` checked for 404-masking rewrite.

HTTP local checks:

- `/` -> 200.
- `/not-found-test` -> 404.
- `/robots.txt` -> 200.
- `/sitemap.xml` -> 200.
- `/assets/favicon.svg` -> 200.
- `/assets/products/meeting-table.jpg` -> 200.

SEO checks:

- Title present.
- Meta description present.
- Canonical points to `https://bafurni.com/`.
- Open Graph present.
- Organization schema present.
- `robots.txt` points to `https://bafurni.com/sitemap.xml`.
- `sitemap.xml` includes `https://bafurni.com/`.

## Risks / Pending Items

- `Chat Zalo` remains placeholder: `NEED_ZALO_LINK`.
- OG image is still SVG placeholder; PNG/JPG is preferable before heavy social sharing.
- SSL is not active until deployment platform and DNS are connected.
- Domain DNS is not changed in this task.
- Do not change `portal.bafurni.com`; Portal must remain untouched.

## Deployment Steps After Approval

Recommended Vercel path:

1. Create or select Vercel project.
2. Set project root to `/website`, or deploy from inside `/website`.
3. Deploy production.
4. Add `bafurni.com` to project domains.
5. Apply DNS records exactly as Vercel provides.
6. Wait for SSL active status.
7. Run post-deploy checks from `DEPLOYMENT_CHECKLIST.md`.

Render fallback:

1. Create Render Static Site.
2. Root directory: `website`.
3. Build command: `echo static`.
4. Publish directory: `.`.
5. Add `bafurni.com` as custom domain.
6. Apply DNS records exactly as Render provides.
7. Wait for SSL active status.
8. Run post-deploy checks.

## Stop Confirmation

STOP completed.

No deploy.

No DNS change.

No publish.

No Search Console verification.
