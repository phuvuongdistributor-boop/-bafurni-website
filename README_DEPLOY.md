# BA_Furniture Homepage - Production Deploy Guide

## Status

Static homepage source is in this `/website` directory.

This guide prepares deployment only. Do not deploy or change DNS until CTO approval.

## Recommended Platform

Recommended: Vercel.

Reason: this is a static marketing homepage with no backend process. Vercel gives fast static hosting, automatic HTTPS, simple custom domain setup, clean static 404 behavior, and no server runtime to maintain.

Render Static Site is also ready as a fallback if the team wants to keep all BA_Furniture services in Render.

## Deploy Files

Required production files:

- `index.html`
- `style.css`
- `script.js`
- `robots.txt`
- `sitemap.xml`
- `schema.json`
- `assets/`
- `vercel.json`
- `render.yaml`

Reports are not required for public hosting, but they can remain in the source repository.

## Vercel Production Deploy

Prerequisites:

- Vercel account access.
- Project connected to this repository or Vercel CLI logged in.
- Domain `bafurni.com` ready to add to the Vercel project.

Command deploy from this directory:

```powershell
cd website
vercel --prod
```

After deploy:

1. Add `bafurni.com` in Vercel project domains.
2. Follow Vercel DNS instructions.
3. Wait for SSL certificate provisioning.
4. Verify:
   - `https://bafurni.com/`
   - `https://bafurni.com/robots.txt`
   - `https://bafurni.com/sitemap.xml`
   - `https://bafurni.com/assets/favicon.svg`

## Render Static Site Deploy

Prerequisites:

- Render account access.
- Repository connected to Render.
- Domain `bafurni.com` ready to add as custom domain.

Render settings:

- Service type: Static Site
- Root directory: `website`
- Build command: `echo static`
- Publish directory: `.`

The included `render.yaml` can be used as a Render Blueprint from the `/website` directory.

After deploy:

1. Add `bafurni.com` as custom domain.
2. Follow Render DNS instructions.
3. Wait for SSL certificate provisioning.
4. Verify the same URLs listed above.

## Required DNS Work

DNS must be changed only after deployment approval.

Expected records depend on the selected platform:

- Vercel: use the exact A/CNAME records shown in Vercel.
- Render: use the exact A/CNAME records shown in Render.

Do not alter `portal.bafurni.com`; it must continue pointing to the existing Portal.

## Rollback

Vercel:

- Promote the previous deployment from Vercel dashboard, or remove the new domain assignment.

Render:

- Roll back to the previous successful deploy from Render dashboard, or repoint DNS to the previous host.

Manual fallback:

- Keep a local zip/copy of the previous website files before replacing production files.

## Post-Deploy Checks

- Homepage loads with HTTP 200.
- Unknown URL returns 404.
- `robots.txt` returns 200.
- `sitemap.xml` returns 200 and references `https://bafurni.com/`.
- Favicon loads.
- Product images load.
- Portal CTA opens `https://portal.bafurni.com`.
- Hotline CTA uses `tel:0929878666`.
- SSL certificate is active.
- No Search Console, GA4, Google Business, Facebook, Zalo publishing in this task.
